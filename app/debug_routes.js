const http = require('http');

function testRoutes() {
    console.log('Verificando rutas disponibles...\n');
    
    // Probar la ruta base
    testRoute('GET', '/api', 'Ruta base');
    
    // Probar la ruta de todos los equipos
    testRoute('GET', '/api/equipamiento_equipos/todos', 'Todos los equipos');
    
    // Probar la ruta con parámetro
    testRoute('GET', '/api/equipamiento_equipos/1', 'Equipos por ID');
    
    // Probar una ruta que no existe
    testRoute('GET', '/api/equipamiento_equipos/test', 'Ruta inexistente');
}

function testRoute(method, path, description) {
    console.log(`Probando: ${description}`);
    console.log(`URL: ${method} ${path}`);
    
    const options = {
        hostname: 'localhost',
        port: 3001,
        path: path,
        method: method,
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
                console.log('Respuesta:', JSON.stringify(response, null, 2));
            } catch (e) {
                console.log('Respuesta (texto):', data.substring(0, 100) + '...');
            }
            console.log('---\n');
        });
    });

    req.on('error', (error) => {
        console.log('❌ Error:', error.message);
        console.log('---\n');
    });

    req.end();
}

// Ejecutar las pruebas
testRoutes();
