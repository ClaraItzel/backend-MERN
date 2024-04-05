import Veterinario from '../models/Veterinario.js';
import generarJWT from '../helpers/generarJWT.js';
import generarId from '../helpers/generarId.js';
import emailRegistro from '../helpers/emailRegistro.js';
import emailOlvidePSW from '../helpers/emailOlvidePSW.js';

const registrar=async (req, res) => {
    //prevenir que el usuario se registre mas de una vez
     let {email}=req.body;

     const emailExiste=await Veterinario.findOne({email});

        if(emailExiste){
            const error = new Error('Este correo ya esta registrado');
            return res.status(400).json({msj:error.message});
        }

    try{
    //guardar veterinario en BD

    const veterinario=new Veterinario(req.body);

    const resultado=await veterinario.save();

    let {nombre, token, email}=veterinario;
    //enviar correo de confirmacion
    emailRegistro({
                    nombre, 
                    token: resultado.token, 
                    email});


    res.json({resultado});
   }
    catch(error){
         console.log(error);
         res.status(500).json({mensaje:'Hubo un error'});
    }
}

const perfil=(req, res) => {

    const {veterinario}= req;
    res.json(veterinario);
}

const confirmar=async (req, res) => {
    const {token}=req.params;
    const usuarioConfirmado=await Veterinario.findOne({token}).limit(1);

    if(!usuarioConfirmado){
        let error = new Error('Usuario no encontrado');
        return res.status(400).json({msj:error.message});
    }

    try {
        usuarioConfirmado.confirmado=true;
        usuarioConfirmado.token=null;
        await usuarioConfirmado.save();

        res.json({msj:'Confirmar veterinario :D'});
    } catch (error) {

        res.status(500).json({msj:'Hubo un error'});
    }

};

const autenticar=async (req, res) => {

    const {email, password}=req.body;

    //comprobar que el usuario existe
    const usuario=await Veterinario.findOne({email});

    if(!usuario){
        let error = new Error('El usuario no existe o la contraseña es incorrecta');
        return res.status(401).json({msj:error.message});
    }

    //comprobar que el usuario esta confirmado
    if(!usuario.confirmado){
        let error = new Error('El usuario no esta confirmado');
        return res.status(404).json({msj:error.message});
    }

    try{
        //comprobar la contraseña
        if(!(await usuario.compararPassword(password))){
            let error = new Error('El usuario no existe o la contraseña es incorrecta');
            return res.status(401).json({msj:error.message});

        }
    } catch (error) {
        res.status(500).json({msj:'Hubo un error en el servidor'});
    }

    usuario.token= generarJWT(usuario._id, usuario.nombre);
    //autenticar usuario
    res.json({
        _id:usuario._id,
        nombre:usuario.nombre,
        email:usuario.email,
        token:usuario.token
    });
}

const olvidePassword=async (req, res) => {

    const {email}=req.body;

    const existeUsuario=await Veterinario.findOne({email});

    if(!existeUsuario){
        return res.status(400).json({msj:'El usuario no existe'});
    }

    try {
        //generar token
         existeUsuario.token=generarId();
        await existeUsuario.save();

        //enviar correo de confirmacion
        emailOlvidePSW({
            nombre:existeUsuario.nombre, 
            token: existeUsuario.token, 
            email:existeUsuario.email
        });

        return res.json({msj:'Se envio un correo para restablecer la contraseña con un token valido por 1 hora'});
    } catch (error) {
       return res.status(500).json({msj:'Hubo un error en el servidor'});
    }

}
const comprobarToken= async(req, res) => {
    const {token}=req.params;

    const usuario=await Veterinario.findOne({token});

    if(!usuario){
        const error = new Error('Token no valido o ha expirado');
        return res.status(400).json({msj:error.message});
    }
    res.json({msj:'TOKEN VALIDO'});
}
const nuevoPassword=async (req, res) => {
    const {token}=req.params;
    const {password}=req.body;

    const usuario=await Veterinario.findOne({token});

    if(!usuario){
        const error = new Error('Token no valido o ha expirado');
        return res.status(400).json({msj:error.message});
    }

    try{
        usuario.password=password;
        usuario.token=1;
        await usuario.save();
        res.json({msj:'Contraseña actualizada'});
    }
    catch(e){
        const error = new Error('Hubo un error en el servidor');
        res.status(500).json({msj:error.message});
    }

}

const actualizarVeterinario=async (req, res) => {
    const {id}=req.params;
    const {nombre, email, web, telefono}=req.body;

    const veterinario=await Veterinario.findById(id);

    if(!veterinario){
        const error = new Error('Veterinario no encontrado');
        return res.status(404).json({msj:error.message});
    }

    if(email !== veterinario.email){
        const emailExiste=await Veterinario.findOne ({email});
        if(emailExiste){
            const error = new Error('Este correo ya esta registrado');
            return res.status(400).json({msj:error.message});
        }
    }

    try {
        veterinario.nombre=nombre || veterinario.nombre;
        veterinario.web=web || veterinario.web;
        veterinario.telefono=telefono || veterinario.telefono;
        veterinario.email=email || veterinario.email;

        await veterinario.save();

        res.json(
            {
                msj:'Veterinario actualizado',
                veterinario
            });
    } catch (error) {
        res.status(500).json({msj:'Hubo un error en el servidor'});
    }

}
const actualizarPassword=async (req, res) => {
    //Leer el datos
    const {password_actual, new_password}=req.body;
    const {id}=req.veterinario;

    const veterinario=await Veterinario.findById(id);
    if(!veterinario){
        const error = new Error('Veterinario no encontrado');
        return res.status(404).json({msj:error.message});
    }

    try {
        if(!(await veterinario.compararPassword(password_actual))){
            const error = new Error('Password actual incorrecto');
            return res.status(401).json({msj:error.message});
        }

        veterinario.password=new_password;
        await veterinario.save();

        res.json({msj:'Password actualizado correctamente'});
        
    } catch (error) {
        res.status(500).json({msj:'Hubo un error en el servidor, contacte al administrador'});
    }
}


export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarVeterinario,
    actualizarPassword
};