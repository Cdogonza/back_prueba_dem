const http = require('http');

function testEjecutarComando() {
    console.log('Probando endpoint ejecutarComando...');
    
    // Datos de prueba
    const testData = {
        id_anexo: 1,
        comando: 'obtener_info' // Puedes cambiar por: 'servir_archivo', 'descargar_archivo', 'obtener_info'
    };
    
    const postData = JSON.stringify(testData);
    
    const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/equipamiento_equipos/anexo/ejecutar-comando',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
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
                     console.log('\n📋 Información del archivo:');
                     console.log(`- Nombre: ${response.archivo.nombre_original}`);
                     console.log(`- Tipo: ${response.archivo.tipo_mime}`);
                     console.log(`- Tamaño: ${response.archivo.tamano} bytes`);
                     console.log(`- URL de descarga: ${response.archivo.url_descarga}`);
                     console.log(`- URL de visualización: ${response.archivo.url_visualizacion}`);
                     
                     console.log('\n✅ Información del archivo obtenida exitosamente');
                 }
            } catch (e) {
                console.log('Respuesta (texto):', data);
            }
        });
    });

    req.on('error', (error) => {
        console.log('❌ Error al hacer la petición:', error.message);
    });

    req.write(postData);
    req.end();
}

// Ejecutar la prueba
testEjecutarComando();
