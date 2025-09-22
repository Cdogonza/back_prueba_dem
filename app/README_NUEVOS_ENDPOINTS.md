# Nuevos Endpoints - Equipamiento, Motores y Mantenimiento

## Endpoints de Equipamiento

### Base URL: `/api/equipamiento`

#### GET `/api/equipamiento`
Obtiene todo el equipamiento disponible.
- **Respuesta**: Array de objetos con todos los equipamientos

#### POST `/api/equipamiento`
Crea un nuevo equipamiento.
- **Body**: Objeto con los datos del equipamiento
- **Respuesta**: Objeto creado con ID

#### GET `/api/equipamiento/search`
Busca equipamiento por criterios específicos.
- **Query Parameters**:
  - `tipo`: Tipo de equipamiento
  - `estado`: Estado del equipamiento
  - `ubicacion`: Ubicación del equipamiento
  - `trimestre`: Trimestre del equipamiento (primero, segundo, tercer, cuarto)
- **Respuesta**: Array de equipamientos que coinciden con los criterios

#### GET `/api/equipamiento/trimestre/:trimestre`
Obtiene equipamiento por trimestre específico.
- **Parámetros**: `trimestre` (primero, segundo, tercer, cuarto)
- **Respuesta**: Objeto con información del trimestre y array de equipamientos
- **Ejemplo**: `/api/equipamiento/trimestre/primero`

#### GET `/api/equipamiento/:id`
Obtiene un equipamiento específico por ID.
- **Parámetros**: `id` (número)
- **Respuesta**: Objeto del equipamiento

#### PUT `/api/equipamiento/:id`
Actualiza un equipamiento existente.
- **Parámetros**: `id` (número)
- **Body**: Objeto con los datos a actualizar
- **Respuesta**: Mensaje de confirmación

#### DELETE `/api/equipamiento/:id`
Elimina un equipamiento.
- **Parámetros**: `id` (número)
- **Respuesta**: Mensaje de confirmación

---

## Endpoints de Motores

### Base URL: `/api/motores`

#### GET `/api/motores`
Obtiene todos los motores disponibles.
- **Respuesta**: Array de objetos con todos los motores

#### POST `/api/motores`
Crea un nuevo motor.
- **Body**: Objeto con los datos del motor
- **Respuesta**: Objeto creado con ID

#### GET `/api/motores/search`
Busca motores por criterios específicos.
- **Query Parameters**:
  - `tipo`: Tipo de motor
  - `potencia`: Potencia del motor
  - `estado`: Estado del motor
  - `fabricante`: Fabricante del motor
- **Respuesta**: Array de motores que coinciden con los criterios

#### GET `/api/motores/potencia`
Obtiene motores por rango de potencia.
- **Query Parameters**:
  - `min`: Potencia mínima
  - `max`: Potencia máxima
- **Respuesta**: Array de motores en el rango especificado

#### GET `/api/motores/:id`
Obtiene un motor específico por ID.
- **Parámetros**: `id` (número)
- **Respuesta**: Objeto del motor

#### PUT `/api/motores/:id`
Actualiza un motor existente.
- **Parámetros**: `id` (número)
- **Body**: Objeto con los datos a actualizar
- **Respuesta**: Mensaje de confirmación

#### DELETE `/api/motores/:id`
Elimina un motor.
- **Parámetros**: `id` (número)
- **Respuesta**: Mensaje de confirmación

---

## Endpoints de Mantenimiento

### Base URL: `/api/mantenimiento`

#### GET `/api/mantenimiento`
Obtiene todos los mantenimientos.
- **Respuesta**: Array de objetos con todos los mantenimientos

#### POST `/api/mantenimiento`
Crea un nuevo mantenimiento.
- **Body**: Objeto con los datos del mantenimiento
- **Respuesta**: Objeto creado con ID

#### GET `/api/mantenimiento/search`
Busca mantenimientos por criterios específicos.
- **Query Parameters**:
  - `tipo`: Tipo de mantenimiento
  - `estado`: Estado del mantenimiento
  - `equipo_id`: ID del equipo asociado
  - `fecha_inicio`: Fecha de inicio del rango
  - `fecha_fin`: Fecha de fin del rango
- **Respuesta**: Array de mantenimientos que coinciden con los criterios

#### GET `/api/mantenimiento/fechas`
Obtiene mantenimientos por rango de fechas.
- **Query Parameters**:
  - `fecha_inicio`: Fecha de inicio
  - `fecha_fin`: Fecha de fin
- **Respuesta**: Array de mantenimientos en el rango de fechas

#### GET `/api/mantenimiento/pendientes`
Obtiene todos los mantenimientos pendientes.
- **Respuesta**: Array de mantenimientos con estado "pendiente"

#### GET `/api/mantenimiento/equipo/:equipo_id`
Obtiene mantenimientos de un equipo específico.
- **Parámetros**: `equipo_id` (número)
- **Respuesta**: Array de mantenimientos del equipo

#### GET `/api/mantenimiento/:id`
Obtiene un mantenimiento específico por ID.
- **Parámetros**: `id` (número)
- **Respuesta**: Objeto del mantenimiento

#### PUT `/api/mantenimiento/:id`
Actualiza un mantenimiento existente.
- **Parámetros**: `id` (número)
- **Body**: Objeto con los datos a actualizar
- **Respuesta**: Mensaje de confirmación

#### DELETE `/api/mantenimiento/:id`
Elimina un mantenimiento.
- **Parámetros**: `id` (número)
- **Respuesta**: Mensaje de confirmación

---

## Códigos de Respuesta

- **200**: Operación exitosa
- **201**: Recurso creado exitosamente
- **400**: Error en los datos enviados
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

## Ejemplos de Uso

### Crear un nuevo equipamiento
```bash
POST /api/equipamiento
Content-Type: application/json

{
  "nombre": "Bomba Centrífuga",
  "tipo": "Bomba",
  "estado": "Activo",
  "ubicacion": "Sala de Máquinas"
}
```

### Obtener equipamiento por trimestre
```bash
GET /api/equipamiento/trimestre/primero
```

### Buscar motores por potencia
```bash
GET /api/motores/potencia?min=100&max=500
```

### Obtener mantenimientos pendientes
```bash
GET /api/mantenimiento/pendientes
```

### Actualizar un mantenimiento
```bash
PUT /api/mantenimiento/1
Content-Type: application/json

{
  "estado": "Completado",
  "fecha_completado": "2024-01-15"
}
``` 