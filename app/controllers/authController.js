const db = require('../db');
const bcrypt = require('bcryptjs');
const e = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const SALT_ROUNDS = 10; // Seguridad en bcrypt
const TOKEN_EXPIRATION = '24h'; // Tiempo de expiración del token
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';

const authController = {
    login: async (req, res) => {
        try {
          const { username, password } = req.body;
      
          // Validación de entrada
          if (!username?.trim() || !password?.trim()) {
            return res.status(400).json({
              success: false,
              message: "Usuario y contraseña son requeridos."
            });
          }
      
          // Consulta a la base de datos
          let results;
          try {
            [results] = await db.query(
              'SELECT id, username, email, password FROM u154726602_equipos.users WHERE username = ?',
              [username.trim()]
            );
          } catch (dbError) {
            console.error('Error en consulta DB:', dbError);
            return res.status(500).json({
              success: false,
              message: "Error al autenticar usuario."
            });
          }
      
          if (!results || results.length === 0) {
            return res.status(404).json({
              success: false,
              message: "Usuario no encontrado."
            });
          }
      
          const user = results[0];
      
          // Verificación de contraseña
          let passwordIsValid;
          try {
            passwordIsValid = await bcrypt.compare(password, user.password);
          } catch (bcryptError) {
            console.error('Error en bcrypt:', bcryptError);
            return res.status(500).json({
              success: false,
              message: "Error al verificar la contraseña."
            });
          }
      
          if (!passwordIsValid) {
            return res.status(401).json({
              success: false,
              message: "Credenciales inválidas."
            });
          }
      
          // Verificación de JWT_SECRET
          const jwtSecret = process.env.JWT_SECRET;
          if (!jwtSecret) {
            console.error('JWT_SECRET no configurado en variables de entorno.');
            return res.status(500).json({
              success: false,
              message: "Error de configuración del servidor."
            });
          }
      
          const token = jwt.sign(
            {
              id: user.id,
              username: user.username,
              email: user.email
            },
            jwtSecret,
            { expiresIn: process.env.TOKEN_EXPIRATION || process.env.TOKEN_EXPIRATION || '1h' }
          );
      
          // Éxito
          return res.status(200).json({
            success: true,
            token,
            user: {
              id: user.id,
              username: user.username,
              email: user.email
            }
          });
      
        } catch (err) {
          console.error('Error en authController.login:', err);
          return res.status(500).json({
            success: false,
            message: "Error interno del servidor.",
            ...(process.env.NODE_ENV === 'development' && { error: err.message })
          });
        }
        },

    // **Registro de usuario**
    register: async (req, res) => {
        try {
            const { username, password, email } = req.body.user;

            // if (!username || !password || !email) {
            //     return res.status(400).json({ message: "Todos los campos son obligatorios." });
            // }

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
            const { email } = req.body.email;
    console.log(email)
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
                text: `Para restablecer su contraseña, haga clic en el siguiente enlace: ${process.env.FRONTEND_URL}/new-password/${token}`
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
    changePassword: async (req, res) => {
        try {
            const { oldPassword, newPassword } = req.body;
    
            // Validación de entrada
            if (!oldPassword?.trim() || !newPassword?.trim()) {
                return res.status(400).json({ message: "Ambas contraseñas son requeridas." });
            }
    
            // Verificar que el token exista
            const token = req.headers['authorization']?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: "No se proporcionó token." });
            }
    
            // Verificar existencia de JWT_SECRET
            if (!process.env.JWT_SECRET) {
                return res.status(500).json({ message: "JWT_SECRET no está configurado." });
            }
    
            // Decodificar token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;
    
            // Buscar usuario
            const [results] = await db.query('SELECT * FROM u154726602_equipos.users WHERE id = ?', [userId]);
            if (results.length === 0) {
                return res.status(404).json({ message: "Usuario no encontrado." });
            }
    
            const user = results[0];
    
            // Verificar contraseña anterior
            const passwordIsValid = await bcrypt.compare(oldPassword, user.password);
            if (!passwordIsValid) {
                return res.status(401).json({ message: "La contraseña antigua es incorrecta." });
            }
    
            // Hashear nueva contraseña
            const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10');
            const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    
            // Actualizar en base de datos
            await db.query('UPDATE u154726602_equipos.users SET password = ? WHERE id = ?', [hashedNewPassword, userId]);
    
            return res.status(200).json({ message: "Contraseña cambiada correctamente." });
    
        } catch (err) {
            console.error('Error en changePassword:', err);
            return res.status(500).json({ error: "Error en el servidor", details: err.message });
        }
    },
    getUsers : async (req, res) => {
        try {
            const [results] = await db.query('SELECT id, username, email FROM u154726602_equipos.users');
            if (results.length === 0) {
                return res.status(404).json({ message: 'No se encontraron usuarios.' });
            }
            res.json(results);
        } catch (err) {
            console.error('Error en getUsers:', err);
            res.status(500).json({
                error: 'Error en el servidor',
                details: process.env.NODE_ENV === 'development' ? err.stack : 'Internal Server Error'
            });
        }
    },
    newPassword: async (req, res) => {
        try {
            const  token= req.body.token;
            const newPassword = req.body.password;

            // Validación de entrada
            if (!token || !newPassword) {
                return res.status(400).json({ message: "Token y nueva contraseña son requeridos." });
            }
    
            // Verificar existencia de JWT_SECRET
            if (!process.env.JWT_SECRET) {
                return res.status(500).json({ message: "JWT_SECRET no está configurado." });
            }
    
            // Decodificar token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;
    
            // Hashear nueva contraseña
            const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    
            // Actualizar en base de datos
            await db.query('UPDATE u154726602_equipos.users SET password = ? WHERE id = ?', [hashedNewPassword, userId]);
    
            return res.status(200).json({ message: "Contraseña actualizada correctamente." });
    
        } catch (err) {
            console.error('Error en newPassword:', err);
            return res.status(500).json({ error: "Error en el servidor", details: err.message });
        }
    },
    deleteUser: async (req, res) => {
        try {
            const { id } = req.body;
            console.log(id)
            await db.query('DELETE FROM u154726602_equipos.users WHERE id = ?', [id]);
            res.status(200).json({ message: "Usuario eliminado correctamente." });
        } catch (err) {
            console.error('Error en deleteUser:', err);
            res.status(500).json({ error: "Error en el servidor", details: err.message });
        }
    },
    updateUser: async (req, res) => {
        try {
            const { username, email } = req.body.user;
            const {id} = req.params;

            await db.query('UPDATE u154726602_equipos.users SET username = ?, email = ? WHERE id = ?', [username, email, id]);
            res.status(200).json({ message: "Usuario actualizado correctamente." });
        } catch (err) {
            console.error('Error en updateUser:', err);
            res.status(500).json({ error: "Error en el servidor", details: err.message });
        }
    }
};
module.exports = authController;
