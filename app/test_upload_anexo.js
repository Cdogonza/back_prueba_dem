const http = require('http');
const fs = require('fs');
const path = require('path');

function testUploadAnexo() {
    console.log('Probando endpoint uploadAnexo...');
    
    // Crear un archivo de prueba
    const testFilePath = './test_file.txt';
    const testContent = 'Este es un archivo de prueba para el endpoint de anexos.';
    fs.writeFileSync(testFilePath, testContent);
    
    // Leer el archivo
    const fileBuffer = fs.readFileSync(testFilePath);
    
    // Crear el boundary para multipart/form-data
    const boundary = '----WebKitFormBoundary' + Math.random().toString(16).substr(2);
    
    // Construir el body del request
    let body = '';
    
    // Agregar el campo id_compra
    body += `--${boundary}\r\n`;
    body += 'Content-Disposition: form-data; name="id_compra"\r\n\r\n';
    body += '1\r\n';
    
    // Agregar el archivo
    body += `--${boundary}\r\n`;
    body += 'Content-Disposition: form-data; name="archivo"; filename="test_file.txt"\r\n';
    body += 'Content-Type: text/plain\r\n\r\n';
    
    const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/equipamiento_equipos/anexo/1',
        method: 'POST',
        headers: {
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Content-Length': Buffer.byteLength(body) + fileBuffer.length + boundary.length + 8
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
            } catch (e) {
                console.log('Respuesta (texto):', data);
            }
            
            // Limpiar archivo de prueba
            if (fs.existsSync(testFilePath)) {
                fs.unlinkSync(testFilePath);
            }
        });
    });

    req.on('error', (error) => {
        console.log('❌ Error al hacer la petición:', error.message);
        
        // Limpiar archivo de prueba
        if (fs.existsSync(testFilePath)) {
            fs.unlinkSync(testFilePath);
        }
    });

    // Escribir el body
    req.write(body);
    req.write(fileBuffer);
    req.write(`\r\n--${boundary}--\r\n`);
    req.end();
}

// Ejecutar la prueba
testUploadAnexo();
