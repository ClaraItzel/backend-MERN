import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

const emailOlvidePSW = async (datos) => {
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
        subject: "Reestablece tu password de APV",
        text: `Hola ${nombre}, crear un nuevo password siguiendo el enlace: ${process.env.FRONTEND_URL}/confirmar/${token}`,
        html: `<p>Hola 
                    <strong>${nombre}</strong>, crear un nuevo password siguiendo el enlace: 
                    <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer</a>

                    <p>Si solicitaste reestabler el password ignora el mensaje</p>
                </p>`
      });

        console.log("Message sent: %s", info);
      
};

export default emailOlvidePSW;
