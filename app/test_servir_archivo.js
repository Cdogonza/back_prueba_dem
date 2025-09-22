const http = require('http');

function testServirArchivo() {
    console.log('Probando endpoint servirArchivo...');
    
    // ID del anexo a probar
    const idAnexo = 1;
    
    const options = {
        hostname: 'localhost',
        port: 3001,
        path: `/api/equipamiento_equipos/anexo/servir/${idAnexo}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const req = http.request(options, (res) => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Content-Type: ${res.headers['content-type']}`);
        console.log(`Content-Disposition: ${res.headers['content-disposition']}`);
        
        if (res.statusCode === 200) {
            console.log('✅ Archivo servido exitosamente');
            console.log('📄 El archivo se está mostrando en el navegador');
            
            // Para archivos de texto, podemos mostrar el contenido
            if (res.headers['content-type'] && res.headers['content-type'].includes('text/')) {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    console.log('\n📝 Contenido del archivo:');
                    console.log(data.substring(0, 500) + '...'); // Mostrar solo los primeros 500 caracteres
                });
            } else {
                console.log('📁 Archivo binario - se descargará o abrirá en el navegador');
            }
        } else {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    console.log('❌ Error:', response.error);
                } catch (e) {
                    console.log('❌ Error:', data);
                }
            });
        }
    });

    req.on('error', (error) => {
        console.log('❌ Error al hacer la petición:', error.message);
    });

    req.end();
}

// Ejecutar la prueba
testServirArchivo();
