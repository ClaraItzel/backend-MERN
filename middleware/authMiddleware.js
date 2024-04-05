import jwt from 'jsonwebtoken';
import Veterinario from '../models/Veterinario.js';


const checkAuth = async (req, res, next) => {
    let token;
    if(req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer'))
    {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.veterinario= await Veterinario.findById(decoded.id).select('-password -token -confirmado');
            
            return next();
        } catch (error) {
            const e = new Error('Error interno del servidor, por favor intente más tarde');
            return res.status(403).json({msg : e.message});
        }
    }
    if(!token){
       const error = new Error('No autenticado, el token no fue encontrado o no es válido');
       return  res.status(403).json({msg : error.message});
    }

};

export default checkAuth;