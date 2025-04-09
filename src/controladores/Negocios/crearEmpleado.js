const {Pool} = require('pg');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({service: 'gmail', auth: {user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS}});

const pool = new Pool({connectionString: process.env.DATABASE_URL});

const registroEmpleado = async (req, res) => {
    const{
        nombre,
        cedula,
        telefono,
        correo,
        rol,
        pertenece_negocio
    } = req.body; // Asegúrate de recibir todos los campos necesarios

    try {
        //Generar la contraseña temporal
        const contraseñaTemporal = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(contraseñaTemporal, 10);

        // Insertar empleado en la base de datos
        const empleadoResult = await pool.query(
            `INSERT INTO Usuarios (
                nombre, cedula, telefono, correo, rol, contrasena, debe_cambiar_contrasena,pertenece_negocio
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_usuario`,
            [
                nombre,
                cedula,
                telefono,
                correo,
                rol,
                hashedPassword,
                true, // debe_cambiar_contrasena
                pertenece_negocio
            ]
        );
        const id_usuario = empleadoResult.rows[0].id_usuario;

        // Enviar correo electrónico con la contraseña temporal
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: correo,
            subject: 'Registro de Empleado',
            text: `Hola ${nombre},\n\nTu cuenta ha sido creada con éxito. Tu contraseña temporal es: ${contraseñaTemporal}\n\nPor favor, cambia tu contraseña al iniciar sesión.`
        };

        await transporter.sendMail(mailOptions);
        res.status(201).json({message: 'Empleado registrado exitosamente', id_usuario});
    }
    catch (error) {
        console.error('Error al registrar el empleado:', error);
        res.status(500).json({error: 'Error al registrar el empleado'});
    }
};

module.exports = registroEmpleado;