import Paciente from '../models/Paciente.js';


const agregarPaciente = async (req, res) => {
   let paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id;

    try {

         await paciente.save();
       return  res.status(201).json({ mensaje: 'Paciente agregado correctamente', paciente });
    } catch (error) {
         console.log(error);
       return  res.status(500).json({ mensaje: 'Hubo un error' });
    }


};

const obtenerPacientes = async (req, res) => {
    try {
        const pacientes = await Paciente.find({ veterinario: req.veterinario._id }).sort({ fecha: -1 });
        return res.json(pacientes);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensaje: 'Hubo un error' });
    }


};

const obtenerPaciente = async (req, res) => {
    const { id } = req.params;
    try {
        const paciente = await Paciente.findById(id);


        if(paciente.veterinario._id.toString()!==req.veterinario._id.toString()){
            return res.status(401).json({ mensaje: 'No tienes permiso para ver este paciente' });
        }

        if(paciente)
            return res.json(paciente);
        else 
            return res.status(404).json({ mensaje: 'No existe el paciente o esta dado de baja' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensaje: 'No existe el paciente intenlo de nuevo' });
    }
};

const actualizarPaciente = async (req, res) => {
    const { id } = req.params;
    try {
        const paciente = await Paciente.findById(id);


        if(paciente.veterinario._id.toString()!==req.veterinario._id.toString()){
            return res.status(401).json({ mensaje: 'No tienes permiso para ver este paciente' });
        }

        //actualizar paciente
        paciente.nombre = req.body.nombre || paciente.nombre;
        paciente.propietario = req.body.propietario || paciente.propietario;
        paciente.email = req.body.email || paciente.email;
        paciente.fecha = req.body.fecha || paciente.fecha;
        paciente.sintomas = req.body.sintomas || paciente.sintomas;

        const pacienteActualizado = await paciente.save();
        return res.json(pacienteActualizado);


    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensaje: 'No existe el paciente intenlo de nuevo' });
    }
};

const eliminarPaciente = async (req, res) => {
    const { id } = req.params;
    try {
        const paciente = await Paciente.findById(id);


        if(paciente.veterinario._id.toString()!==req.veterinario._id.toString()){
            return res.status(401).json({ mensaje: 'No tienes permiso para ver este paciente' });
        }

        //eliminar paciente
        await paciente.deleteOne();
        return res.json({ mensaje: 'Paciente eliminado' });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensaje: 'No existe el paciente intenlo de nuevo' });
    }
}


export {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
};