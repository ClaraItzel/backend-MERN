import express from 'express';
import conectarDB from './config/db.js';
import cors from 'cors';
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js';


const app = express();

app.use(express.json());

conectarDB();

const dominiosPermitidos=[process.env.FRONTEND_URL];

const configCors = {
    origin: function (origin, callback) {
        if(dominiosPermitidos.indexOf(origin) !== -1){
            callback(null, true);
        } else {
            callback(new Error('Dominio no permitido por CORS'));
        }
    },
};

app.use(cors(configCors));

app.use('/api/pacientes', pacienteRoutes);
app.use('/api/veterinarios', veterinarioRoutes);

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

