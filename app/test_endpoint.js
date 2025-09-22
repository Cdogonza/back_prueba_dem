const axios = require('axios');

async function testEndpoint() {
    try {
        console.log('Probando endpoint createEquipamiento_equipos...');
        
        const testData = {
            id_equipamiento: 1,
            nro_item: 2,
            nombre: "Equipo de prueba",
            cantidad: 5,
            servicio: "Servicio de prueba"
        };
        
        const response = await axios.post('http://localhost:3001/api/equipamiento_equipos/', testData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Endpoint funcionando correctamente');
        console.log('Respuesta:', response.data);
        
    } catch (error) {
        console.log('❌ Error al probar el endpoint:');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
        } else {
            console.log('Error:', error.message);
        }
    }
}

// Esperar un poco para que el servidor se inicie
setTimeout(testEndpoint, 2000);
