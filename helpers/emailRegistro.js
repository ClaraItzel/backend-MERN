import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // send mail with defined transport object
      const {nombre, token, email}=datos;

      //enviar correo de confirmacion

      const info=await transport.sendMail({
        from: "APV administrador de pacientes de veterinaria",
        to: email,
        subject: "Confirma tu cuenta de APV",
        text: `Hola ${nombre}, confirma tu cuenta de APV haciendo click en el siguiente enlace: ${process.env.FRONTEND_URL}/confirmar/${token}`,
        html: `<p>Hola 
                    <strong>${nombre}</strong>, confirma tu cuenta de APV haciendo click en el siguiente enlace: 
                    <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar cuenta</a>

                    <p>Si no creaste la cuenta ignora el mensaje</p>
                </p>`
      });

        console.log("Message sent: %s", info);
      
};

export default emailRegistro;
