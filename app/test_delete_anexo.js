const http = require('http');

function testDeleteAnexo() {
    console.log('Probando endpoint deleteAnexo...');
    
    // ID del anexo a eliminar
    const idAnexo = 1; // Cambia este ID por uno que exista en tu base de datos
    
    const options = {
        hostname: 'localhost',
        port: 3001,
        path: `/api/equipamiento_equipos/anexo/${idAnexo}`,
        method: 'DELETE',
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
                    console.log('\n🗑️ Anexo eliminado exitosamente:');
                    console.log(`- ID: ${response.anexo_eliminado.id}`);
                    console.log(`- Nombre: ${response.anexo_eliminado.nombre_original}`);
                    console.log(`- Ruta: ${response.anexo_eliminado.ruta_archivo}`);
                    console.log(`- Mensaje: ${response.message}`);
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
testDeleteAnexo();
