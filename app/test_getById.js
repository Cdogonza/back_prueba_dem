const http = require('http');

function testGetById() {
    console.log('Probando endpoint getEquipamiento_equiposById...');
    
    const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/equipamiento_equipos/1',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const req = http.request(options, (res) => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Headers: ${JSON.stringify(res.headers)}`);
        
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                console.log('✅ Respuesta exitosa:');
                console.log(JSON.stringify(response, null, 2));
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
testGetById();
