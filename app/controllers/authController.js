const db = require('../db');
const bcrypt = require('bcryptjs');
const e = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const SALT_ROUNDS = 10; // Seguridad en bcrypt
const TOKEN_EXPIRATION = '24h'; // Tiempo de expiración del token
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';

const authController = {
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            // Validación de entrada
            if (!username || !password) {
                return res.status(400).json({ message: "Usuario y contraseña son requeridos." });
            }

            // Consulta a la base de datos
            const [results] = await db.query(
                'SELECT id, username, email, password FROM u154726602_equipos.users WHERE username = ?',
                [username]
            );

            if (results.length === 0) {
                return res.status(404).json({ message: "Usuario no encontrado." });
            }

            const user = results[0];

            // Verificar contraseña
            const passwordIsValid = await bcrypt.compare(password, user.password);
            if (!passwordIsValid) {
                return res.status(401).json({ auth: false, token: null, message: "Contraseña incorrecta." });
            }

            // Generar token JWT
            const token = jwt.sign(
                { id: user.id, username: user.username, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: TOKEN_EXPIRATION }
            );

            // Respuesta exitosa
            res.status(200).json({ auth: true, token });
        } catch (err) {
            // Log del error en producción
            console.error('Error en authController.login:', err);

            // Respuesta de error
            res.status(500).json({
                error: "Error en el servidor",
                details: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
              
            });
        }
       
    },

    // **Registro de usuario**
    register: async (req, res) => {
        try {
            const { username, password, email } = req.body;

            if (!username || !password || !email) {
                return res.status(400).json({ message: "Todos los campos son obligatorios." });
            }

            // Verificar si el usuario ya existe
            const [existingUser] = await db.query(
                'SELECT id FROM u154726602_equipos.users WHERE username = ? OR email = ?',
                [username, email]
            );

            if (existingUser.length > 0) {
                return res.status(409).json({ message: "El nombre de usuario o el correo ya están en uso." });
            }

            // Hashear la contraseña
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

            // Insertar usuario en la base de datos
            await db.query(
                'INSERT INTO u154726602_equipos.users (username, password, email) VALUES (?, ?, ?)',
                [username, hashedPassword, email]
            );

            res.status(201).json({ message: "Usuario registrado correctamente." });
        } catch (err) {
            res.status(500).json({ error: "Error en el servidor", details: err.message });
        }
    },
    resetPassword : async (req, res) => {
        try {
            const { email } = req.body;
    
            // Validación básica del formato del correo electrónico
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                return res.status(400).json({ message: "El correo electrónico es obligatorio y debe ser válido." });
            }
    
            const [results] = await db.query('SELECT * FROM u154726602_equipos.users WHERE email = ?', [email]);
    
            if (results.length === 0) {
                return res.status(404).json({ message: "Usuario no encontrado." });
            }
    
            const user = results[0];
            const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
            // Configurar el transportador de nodemailer
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
    
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Restablecimiento de contraseña',
                text: `Para restablecer su contraseña, haga clic en el siguiente enlace: ${process.env.FRONTEND_URL}/reset-password/${token}`
            };
    
            // Enviar el correo electrónico y manejar errores
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: "Correo de restablecimiento enviado." });
        } catch (err) {
            console.error(err); // Log del error para depuración
            res.status(500).json({ error: "Error en el servidor", details: err.message });
        }
    },
    //Cambio password
    changePassword : async (req, res) => {
            try {
                const { oldPassword, newPassword } = req.body;
        
                // Verificar que se proporcionen las contraseñas
                if (!oldPassword || !newPassword) {
                    return res.status(400).json({ message: "Ambas contraseñas son requeridas." });
                }
        
                // Obtener el usuario del token
                const token = req.headers['authorization']?.split(' ')[1]; // Asumiendo que el token se envía en el encabezado Authorization
                if (!token) {
                    return res.status(401).json({ message: "No se proporcionó token." });
                }
        
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const userId = decoded.id;
        
                // Obtener el usuario de la base de datos
                const [results] = await db.query('SELECT * FROM u154726602_equipos.users WHERE id = ?', [userId]);
                if (results.length === 0) {
                    return res.status(404).json({ message: "Usuario no encontrado." });
                }
        
                const user = results[0];
        
                // Verificar la contraseña antigua
                const passwordIsValid = await bcrypt.compare(oldPassword, user.password);
                if (!passwordIsValid) {
                    return res.status(401).json({ message: "La contraseña antigua es incorrecta." });
                }
        
                // Hashear la nueva contraseña
                const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
        
                // Actualizar la contraseña en la base de datos
                await db.query('UPDATE u154726602_equipos.users SET password = ? WHERE id = ?', [hashedNewPassword, userId]);
        
                res.status(200).json({ message: "Contraseña cambiada correctamente." });
            } catch (err) {
                res.status(500).json({ error: "Error en el servidor", details: err.message });
            }
        }
};
module.exports = authController;
