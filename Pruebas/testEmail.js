require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: 'linamunoz438@gmail.com', // Reemplaza con el correo electrónico de destino
  subject: 'Prueba de Nodemailer',
  html: `
    <div style="text-align: center;">
      <img src="https://res.cloudinary.com/deucbjygt/image/upload/v1742666709/Invent_vgeqm2.gif" alt="Logo" style="width: 200px; height: auto;">
      <h1>Prueba de Nodemailer</h1>
      <p>Este es un correo de prueba para verificar que Nodemailer está funcionando correctamente.</p>
    </div>
  `
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log('Correo enviado: ' + info.response);
});