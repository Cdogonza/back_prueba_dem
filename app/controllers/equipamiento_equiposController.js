const db = require('../db.js'); // Asegúrate de crear un archivo db.js para manejar la conexión
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const url_base = process.env.NODE_ENV === 'development' ? "u154726602_equipos_test" : "u154726602_equipos";

// Configuración de multer para el almacenamiento de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = './uploads/equipamiento/';
        // Crear directorio si no existe
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generar nombre único para el archivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // Límite de 10MB
    },
    fileFilter: function (req, file, cb) {
        // Permitir solo ciertos tipos de archivos
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|txt/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
      
        if (mimetype && extname) {

            return cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen, PDF, documentos y hojas de cálculo'));
        }
    }
});

const equipamiento_equiposController = {
    getAllEquipamiento_equipos: async (req, res) => {
        try {
            const [results] = await db.query(`SELECT * FROM ${url_base}.equipamiento_equipos`);
            res.json(results);
        } catch (err) {
            console.error('Error en getAllEquipamiento_equipos:', err);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    },
    
    getEquipamiento_equiposById: async (req, res) => {
        try {
            const { id_equipamiento } = req.params;
            
            // Validar que el id_equipamiento esté presente
            if (!id_equipamiento) {
                return res.status(400).json({ 
                    error: 'El parámetro id_equipamiento es requerido' 
                });
            }
            
            const [results] = await db.query(
                `SELECT * FROM ${url_base}.equipamiento_equipos WHERE id_equipamiento = ?`,
                [id_equipamiento]
            );
            
            if (results.length === 0) {
                return res.status(404).json({ 
                    message: 'No se encontraron equipos para el equipamiento especificado',
                    id_equipamiento: id_equipamiento
                });
            }
            
            console.log(`Equipos encontrados para equipamiento ${id_equipamiento}:`, results.length);
            res.json({
                id_equipamiento: id_equipamiento,
                total_equipos: results.length,
                equipos: results
            });
            
        } catch (err) {
            console.error('Error en getEquipamiento_equiposById:', err);
            res.status(500).json({ 
                error: 'Error en el servidor al obtener equipos por equipamiento',
                details: err.message 
            });
        }
    },
    
    createEquipamiento_equipos: async (req, res) => {
        try {
            const { id_equipamiento, nro_item, nombre, cantidad, servicio } = req.body.equipo;
            console.log(req.body.equipo);
            // Validar que todos los campos requeridos estén presentes
   
            
            const [results] = await db.query(
                `INSERT INTO ${url_base}.equipamiento_equipos (id_equipamiento, nro_item, nombre, cantidad, servicio) VALUES (?, ?, ?, ?, ?)`, 
                [id_equipamiento, nro_item, nombre, cantidad, servicio]
            );
            
            console.log('Equipamiento_equipos creado exitosamente:', results);
            res.status(201).json({ 
                message: 'Equipamiento_equipos creado exitosamente',
                id: results.insertId,
                data: { id_equipamiento, nro_item, nombre, cantidad, servicio }
            });
        } catch (err) {
            console.error('Error en createEquipamiento_equipos:', err);
            res.status(500).json({ 
                error: 'Error en el servidor al crear equipamiento_equipos',
                details: err.message 
            });
        }
    },
    
    updateEquipamiento_equipos: async (req, res) => {
        try {
            const {id, nro_item, nombre, cantidad, servicio } = req.body.equipo;


            const [results] = await db.query(
                `UPDATE ${url_base}.equipamiento_equipos SET nro_item = ?, nombre = ?, cantidad = ?, servicio = ? WHERE id = ?`,
                [nro_item, nombre, cantidad, servicio, id]
            );

            console.log('Equipamiento_equipos actualizado exitosamente:', results);
            res.status(200).json({ 
                message: 'Equipamiento_equipos actualizado exitosamente',
                id: id,
                data: { nro_item, nombre, cantidad, servicio }
            });
        } catch (err) {
            console.error('Error en updateEquipamiento_equipos:', err);
            res.status(500).json({ 
                error: 'Error en el servidor al actualizar equipamiento_equipos',
                details: err.message 
            });
        }
    },

    // Método para eliminar un equipo de equipamiento
    deleteEquipamiento_equipos: async (req, res) => {
        try {
            const { id } = req.params;
            
            // Validar que el id esté presente
            if (!id) {
                return res.status(400).json({ 
                    error: 'El parámetro id es requerido' 
                });
            }
            
            // Obtener información del equipo antes de eliminarlo
            const [equipoResults] = await db.query(
                `SELECT * FROM ${url_base}.equipamiento_equipos WHERE id = ?`,
                [id]
            );
            
            if (equipoResults.length === 0) {
                return res.status(404).json({ 
                    error: 'Equipo no encontrado' 
                });
            }
            
            const equipo = equipoResults[0];
            
            // Eliminar registro de la base de datos
            const [deleteResults] = await db.query(
                `DELETE FROM ${url_base}.equipamiento_equipos WHERE id = ?`,
                [id]
            );
            
            if (deleteResults.affectedRows === 0) {
                return res.status(404).json({ 
                    error: 'No se pudo eliminar el equipo de la base de datos' 
                });
            }
            
            console.log('Equipo eliminado exitosamente:', equipo.nombre);
            res.json({ 
                success: true,
                message: 'Equipo eliminado exitosamente',
                equipo_eliminado: {
                    id: equipo.id,
                    id_equipamiento: equipo.id_equipamiento,
                    nro_item: equipo.nro_item,
                    nombre: equipo.nombre,
                    cantidad: equipo.cantidad,
                    servicio: equipo.servicio
                }
            });
            
        } catch (err) {
            console.error('Error en deleteEquipamiento_equipos:', err);
            res.status(500).json({ 
                error: 'Error en el servidor al eliminar el equipo',
                details: err.message 
            });
        }
    },

    // Método para subir anexos de equipamiento
    uploadAnexo: async (req, res) => {
        try {
            // Usar multer para manejar la subida del archivo
            upload.single('archivo')(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    console.error('Error de Multer:', err);
                    return res.status(400).json({ 
                        error: 'Error al subir el archivo',
                        details: err.message 
                    });
                } else if (err) {
                    console.error('Error al subir archivo:', err);
                    return res.status(400).json({ 
                        error: 'Tipo de archivo no permitido',
                        details: err.message 
                    });
                }

                // Verificar que se haya subido un archivo
                if (!req.file) {
                    return res.status(400).json({ 
                        error: 'No se ha proporcionado ningún archivo' 
                    });
                }

                const { id_compra } = req.body;
                
                // Validar que el id_compra esté presente
                if (!id_compra) {
                    return res.status(400).json({ 
                        error: 'El parámetro id_compra es requerido' 
                    });
                }

                // Información del archivo subido
                const fileInfo = {
                    originalName: req.file.originalname,
                    filename: req.file.filename,
                    path: req.file.path,
                    size: req.file.size,
                    mimetype: req.file.mimetype
                };

                // Guardar información del archivo en la base de datos
                const [results] = await db.query(
                    `INSERT INTO ${url_base}.equipamiento_anexos (id_compra, nombre_original, nombre_archivo, ruta_archivo, tamano, tipo_mime, fecha_subida) VALUES (?, ?, ?, ?, ?, ?, NOW())`,
                    [id_compra, fileInfo.originalName, fileInfo.filename, fileInfo.path, fileInfo.size, fileInfo.mimetype]
                );

                console.log('Anexo subido exitosamente:', fileInfo);
                res.status(201).json({ 
                    message: 'Anexo subido exitosamente',
                    id: results.insertId,
                    file: {
                        id: results.insertId,
                        id_compra: id_compra,
                        nombre_original: fileInfo.originalName,
                        nombre_archivo: fileInfo.filename,
                        ruta_archivo: fileInfo.path,
                        tamano: fileInfo.size,
                        tipo_mime: fileInfo.mimetype
                    }
                });
            });
        } catch (err) {
            console.error('Error en uploadAnexo:', err);
            res.status(500).json({ 
                error: 'Error en el servidor al subir el anexo',
                details: err.message 
            });
        }
    },

    // Método para obtener anexos por id_compra
    getAnexosByCompra: async (req, res) => {
        try {
            const { id_compra } = req.params;
            
            // Validar que el id_compra esté presente
            if (!id_compra) {
                return res.status(400).json({ 
                    error: 'El parámetro id_compra es requerido' 
                });
            }
            
            const [results] = await db.query(
                `SELECT * FROM ${url_base}.equipamiento_anexos WHERE id_compra = ? ORDER BY fecha_subida DESC`,
                [id_compra]
            );
            
            console.log(`Anexos encontrados para compra ${id_compra}:`, results.length);
            res.json({
                id_compra: id_compra,
                total_anexos: results.length,
                anexos: results
            });
            
        } catch (err) {
            console.error('Error en getAnexosByCompra:', err);
            res.status(500).json({ 
                error: 'Error en el servidor al obtener anexos por compra',
                details: err.message 
            });
        }
    },

    abrirAnexo: async (req, res) => {
        try {
            const { id_anexo } = req.params;
            
            // Validar que el id_anexo esté presente
            if (!id_anexo) {
                return res.status(400).json({ 
                    error: 'El parámetro id_anexo es requerido' 
                });
            }
            
            // Obtener información del anexo
            const [results] = await db.query(
                `SELECT * FROM ${url_base}.equipamiento_anexos WHERE id = ?`,
                [id_anexo]
            );
            
            if (results.length === 0) {
                return res.status(404).json({ 
                    error: 'Anexo no encontrado' 
                });
            }
            
            const anexo = results[0];
            
            // Verificar que el archivo existe
            if (!fs.existsSync(anexo.ruta_archivo)) {
                return res.status(404).json({ 
                    error: 'Archivo no encontrado en el servidor' 
                });
            }
            
            // Obtener la ruta absoluta del archivo y su directorio
            const rutaAbsoluta = path.resolve(anexo.ruta_archivo);
            const directorioArchivo = path.dirname(rutaAbsoluta);
            
            // Usar child_process para abrir la carpeta en el explorador de Windows
            const { exec } = require('child_process');
            
            // Comando para abrir la carpeta en Windows
            const comando = `explorer "${directorioArchivo}"`;
            
            exec(comando, (error, stdout, stderr) => {
                if (error) {
                    console.error('Error al abrir la carpeta:', error);
                    return res.status(500).json({ 
                        error: 'Error al abrir la carpeta del archivo',
                        details: error.message 
                    });
                }
                
                console.log('Carpeta abierta exitosamente:', directorioArchivo);
                res.json({
                    success: true,
                    message: 'Carpeta del archivo abierta exitosamente',
                    archivo: {
                        id: anexo.id,
                        nombre_original: anexo.nombre_original,
                        ruta_archivo: anexo.ruta_archivo,
                        ruta_absoluta: rutaAbsoluta,
                        directorio: directorioArchivo,
                        tipo_mime: anexo.tipo_mime,
                        tamano: anexo.tamano,
                        fecha_subida: anexo.fecha_subida
                    }
                });
            });
            
        } catch (err) {
            console.error('Error en abrirAnexo:', err);
            res.status(500).json({ 
                error: 'Error en el servidor al abrir la carpeta del archivo',
                details: err.message 
            });
        }
    },

    // Método para servir archivos de imagen directamente
    servirImagen: async (req, res) => {
        try {
            const { id_anexo } = req.params;
            
            // Validar que el id_anexo esté presente
            if (!id_anexo) {
                return res.status(400).json({ 
                    error: 'El parámetro id_anexo es requerido' 
                });
            }
            
            // Obtener información del anexo
            const [results] = await db.query(
                `SELECT * FROM ${url_base}.equipamiento_anexos WHERE id = ?`,
                [id_anexo]
            );
            
            if (results.length === 0) {
                return res.status(404).json({ 
                    error: 'Anexo no encontrado' 
                });
            }
            
            const anexo = results[0];
            
            // Verificar que el archivo existe
            if (!fs.existsSync(anexo.ruta_archivo)) {
                return res.status(404).json({ 
                    error: 'Archivo no encontrado en el servidor' 
                });
            }
            
            // Verificar que es una imagen
            const extension = path.extname(anexo.nombre_original).toLowerCase();
            const esImagen = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(extension);
            
            if (!esImagen) {
                return res.status(400).json({ 
                    error: 'El archivo no es una imagen válida' 
                });
            }
            
            // Servir la imagen directamente
            res.setHeader('Content-Type', anexo.tipo_mime);
            res.setHeader('Content-Disposition', `inline; filename="${anexo.nombre_original}"`);
            res.sendFile(path.resolve(anexo.ruta_archivo));
            
        } catch (err) {
            console.error('Error en servirImagen:', err);
            res.status(500).json({ 
                error: 'Error en el servidor al servir la imagen',
                details: err.message 
            });
        }
    },

    // Método para servir cualquier archivo directamente
    servirArchivo: async (req, res) => {
        try {
            const { id_anexo } = req.params;
            
            // Validar que el id_anexo esté presente
            if (!id_anexo) {
                return res.status(400).json({ 
                    error: 'El parámetro id_anexo es requerido' 
                });
            }
            
            // Obtener información del anexo
            const [results] = await db.query(
                `SELECT * FROM ${url_base}.equipamiento_anexos WHERE id = ?`,
                [id_anexo]
            );
            
            if (results.length === 0) {
                return res.status(404).json({ 
                    error: 'Anexo no encontrado' 
                });
            }
            
            const anexo = results[0];
            
            // Verificar que el archivo existe
            if (!fs.existsSync(anexo.ruta_archivo)) {
                return res.status(404).json({ 
                    error: 'Archivo no encontrado en el servidor' 
                });
            }
            
            // Servir el archivo directamente
            res.setHeader('Content-Type', anexo.tipo_mime);
            res.setHeader('Content-Disposition', `inline; filename="${anexo.nombre_original}"`);
            res.sendFile(path.resolve(anexo.ruta_archivo));
            
        } catch (err) {
            console.error('Error en servirArchivo:', err);
            res.status(500).json({ 
                error: 'Error en el servidor al servir el archivo',
                details: err.message 
            });
        }
    },

    // Método para descargar un anexo
    downloadAnexo: async (req, res) => {
        try {
            const { id_anexo } = req.params;
            
            // Validar que el id_anexo esté presente
            if (!id_anexo) {
                return res.status(400).json({ 
                    error: 'El parámetro id_anexo es requerido' 
                });
            }
            
            // Obtener información del anexo
            const [results] = await db.query(
                `SELECT * FROM ${url_base}.equipamiento_anexos WHERE id = ?`,
                [id_anexo]
            );
            
            if (results.length === 0) {
                return res.status(404).json({ 
                    error: 'Anexo no encontrado' 
                });
            }
            
            const anexo = results[0];
            
            // Verificar que el archivo existe
            if (!fs.existsSync(anexo.ruta_archivo)) {
                return res.status(404).json({ 
                    error: 'Archivo no encontrado en el servidor' 
                });
            }
            
            // Enviar el archivo
            res.download(anexo.ruta_archivo, anexo.nombre_original);
            
        } catch (err) {
            console.error('Error en downloadAnexo:', err);
            res.status(500).json({ 
                error: 'Error en el servidor al descargar el anexo',
                details: err.message 
            });
        }
    },

    // Método para ejecutar comandos específicos con anexos
    ejecutarComando: async (req, res) => {
        try {
            const { id_anexo, comando } = req.body;
            
            // Validar que el id_anexo esté presente
            if (!id_anexo) {
                return res.status(400).json({ 
                    error: 'El parámetro id_anexo es requerido' 
                });
            }
            
            // Obtener información del anexo
            const [results] = await db.query(
                `SELECT * FROM ${url_base}.equipamiento_anexos WHERE id = ?`,
                [id_anexo]
            );
            
            if (results.length === 0) {
                return res.status(404).json({ 
                    error: 'Anexo no encontrado' 
                });
            }
            
            const anexo = results[0];
            
            // Verificar que el archivo existe
            if (!fs.existsSync(anexo.ruta_archivo)) {
                return res.status(404).json({ 
                    error: 'Archivo no encontrado en el servidor' 
                });
            }
            
            // Obtener la ruta absoluta del archivo
            const rutaAbsoluta = path.resolve(anexo.ruta_archivo);
            
            // Determinar qué acción realizar basado en el comando
            switch (comando) {
                case 'servir_archivo':
                    // Servir el archivo directamente al navegador
                    res.setHeader('Content-Type', anexo.tipo_mime);
                    res.setHeader('Content-Disposition', `inline; filename="${anexo.nombre_original}"`);
                    res.sendFile(rutaAbsoluta);
                    break;
                    
                case 'descargar_archivo':
                    // Descargar el archivo
                    res.download(rutaAbsoluta, anexo.nombre_original);
                    break;
                    
                case 'obtener_info':
                    // Devolver información del archivo
                    res.json({
                        success: true,
                        message: 'Información del archivo obtenida exitosamente',
                        archivo: {
                            id: anexo.id,
                            nombre_original: anexo.nombre_original,
                            ruta_archivo: anexo.ruta_archivo,
                            ruta_absoluta: rutaAbsoluta,
                            tipo_mime: anexo.tipo_mime,
                            tamano: anexo.tamano,
                            fecha_subida: anexo.fecha_subida,
                            url_descarga: `/api/equipamiento_equipos/anexo/download/${anexo.id}`,
                            url_visualizacion: `/api/equipamiento_equipos/anexo/servir/${anexo.id}`
                        }
                    });
                    break;
                    
                default:
                    return res.status(400).json({ 
                        error: 'Comando no válido. Comandos disponibles: servir_archivo, descargar_archivo, obtener_info' 
                    });
            }
            
        } catch (err) {
            console.error('Error en ejecutarComando:', err);
            res.status(500).json({ 
                error: 'Error en el servidor al ejecutar el comando',
                details: err.message 
            });
        }
    },

    // Método para eliminar un anexo
    deleteAnexo: async (req, res) => {
        try {
            const { id_anexo } = req.params;
            
            // Validar que el id_anexo esté presente
            if (!id_anexo) {
                return res.status(400).json({ 
                    error: 'El parámetro id_anexo es requerido' 
                });
            }
            
            // Obtener información del anexo antes de eliminarlo
            const [anexoResults] = await db.query(
                `SELECT * FROM ${url_base}.equipamiento_anexos WHERE id = ?`,
                [id_anexo]
            );
            
            if (anexoResults.length === 0) {
                return res.status(404).json({ 
                    error: 'Anexo no encontrado' 
                });
            }
            
            const anexo = anexoResults[0];
            
            // Eliminar el archivo físico si existe
            try {
                if (fs.existsSync(anexo.ruta_archivo)) {
                    fs.unlinkSync(anexo.ruta_archivo);
                    console.log('Archivo físico eliminado:', anexo.ruta_archivo);
                } else {
                    console.log('Archivo físico no encontrado, continuando con eliminación de BD:', anexo.ruta_archivo);
                }
            } catch (fileError) {
                console.warn('Error al eliminar archivo físico (continuando):', fileError.message);
                // Continuar con la eliminación de la BD aunque falle la eliminación del archivo
            }
            
            // Eliminar registro de la base de datos
            const [deleteResults] = await db.query(
                `DELETE FROM ${url_base}.equipamiento_anexos WHERE id = ?`,
                [id_anexo]
            );
            
            if (deleteResults.affectedRows === 0) {
                return res.status(404).json({ 
                    error: 'No se pudo eliminar el anexo de la base de datos' 
                });
            }
            
            console.log('Anexo eliminado exitosamente:', anexo.nombre_original);
            res.json({ 
                success: true,
                message: 'Anexo eliminado exitosamente',
                anexo_eliminado: {
                    id: anexo.id,
                    nombre_original: anexo.nombre_original,
                    ruta_archivo: anexo.ruta_archivo
                }
            });
            
        } catch (err) {
            console.error('Error en deleteAnexo:', err);
            res.status(500).json({ 
                error: 'Error en el servidor al eliminar el anexo',
                details: err.message 
            });
        }
    }
}

module.exports = equipamiento_equiposController;
