import mongoose from "mongoose";
import generarId from '../helpers/generarId.js';
import bcrypt from 'bcrypt';

const VeterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null,
        trim: true
    },
    token: {
        type: String,
        default: null
    },
    confirmado: {
        type: Boolean,
        default: false
    },
});

VeterinarioSchema.pre('save', async function(next){
    const veterinario = this;

    if(!veterinario.isModified('password')) return next();;
    if(veterinario.token==1) 
        veterinario.token = null;
    else
        veterinario.token = generarId();

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(veterinario.password, salt);
    veterinario.password = hash;

});

VeterinarioSchema.methods.compararPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

const Veterinario = mongoose.model("Veterinario", VeterinarioSchema);

export default Veterinario;