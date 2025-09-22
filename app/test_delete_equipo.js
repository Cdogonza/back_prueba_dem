const http = require('http');

function testDeleteEquipo() {
    console.log('Probando endpoint deleteEquipamiento_equipos...');
    
    // ID del equipo a eliminar
    const idEquipo = 1; // Cambia este ID por uno que exista en tu base de datos
    
    const options = {
        hostname: 'localhost',
        port: 3001,
        path: `/api/equipamiento_equipos/${idEquipo}`,
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
                    console.log('\n🗑️ Equipo eliminado exitosamente:');
                    console.log(`- ID: ${response.equipo_eliminado.id}`);
                    console.log(`- ID Equipamiento: ${response.equipo_eliminado.id_equipamiento}`);
                    console.log(`- Nro Item: ${response.equipo_eliminado.nro_item}`);
                    console.log(`- Nombre: ${response.equipo_eliminado.nombre}`);
                    console.log(`- Cantidad: ${response.equipo_eliminado.cantidad}`);
                    console.log(`- Servicio: ${response.equipo_eliminado.servicio}`);
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
testDeleteEquipo();
