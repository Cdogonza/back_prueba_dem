const http = require('http');

function testAbrirAnexo() {
    console.log('Probando endpoint abrirAnexo (abrir carpeta)...');
    
    // Primero necesitamos un ID de anexo válido
    // Vamos a probar con el ID 1 (asumiendo que existe)
    const idAnexo = 1;
    
    const options = {
        hostname: 'localhost',
        port: 3001,
        path: `/api/equipamiento_equipos/anexo/abrir/${idAnexo}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const req = http.request(options, (res) => {
        console.log(`Status: ${res.statusCode}`);
        
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                console.log('✅ Respuesta exitosa:');
                console.log(JSON.stringify(response, null, 2));
                
                if (response.success) {
                    console.log('\n📁 Información de la carpeta abierta:');
                    console.log(`- Nombre del archivo: ${response.archivo.nombre_original}`);
                    console.log(`- Directorio: ${response.archivo.directorio}`);
                    console.log(`- Ruta completa: ${response.archivo.ruta_absoluta}`);
                    console.log(`- Tipo: ${response.archivo.tipo_mime}`);
                    console.log(`- Tamaño: ${response.archivo.tamano} bytes`);
                    
                    console.log('\n✅ El explorador de Windows debería haberse abierto automáticamente');
                    console.log('📍 Ubicación de la carpeta:', response.archivo.directorio);
                }
            } catch (e) {
                console.log('Respuesta (texto):', data);
            }
        });
    });

    req.on('error', (error) => {
        console.log('❌ Error al hacer la petición:', error.message);
    });

    req.end();
}

// Ejecutar la prueba
testAbrirAnexo();
