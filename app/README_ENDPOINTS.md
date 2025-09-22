# Documentación de Endpoints - Equipamiento Equipos

## Base URL
```
http://localhost:3001/api/equipamiento_equipos
```

## Endpoints Disponibles

### 1. Obtener Todos los Equipos
**GET** `/api/equipamiento_equipos/todos`

Obtiene todos los equipos de equipamiento.

**Respuesta:**
```json
[
  {
    "id": 1,
    "id_equipamiento": 123,
    "nro_item": "001",
    "nombre": "Equipo Médico",
    "cantidad": 5,
    "servicio": "Cardiología"
  }
]
```

### 2. Obtener Equipos por ID de Equipamiento
**GET** `/api/equipamiento_equipos/:id_equipamiento`

Obtiene todos los equipos asociados a un equipamiento específico.

**Parámetros de URL:**
- `id_equipamiento` (number): ID del equipamiento

**Respuesta:**
```json
{
  "id_equipamiento": 123,
  "total_equipos": 3,
  "equipos": [
    {
      "id": 1,
      "id_equipamiento": 123,
      "nro_item": "001",
      "nombre": "Equipo Médico",
      "cantidad": 5,
      "servicio": "Cardiología"
    }
  ]
}
```

### 3. Crear Nuevo Equipo
**POST** `/api/equipamiento_equipos`

Crea un nuevo equipo de equipamiento.

**Body (JSON):**
```json
{
  "equipo": {
    "id_equipamiento": 123,
    "nro_item": "001",
    "nombre": "Equipo Médico",
    "cantidad": 5,
    "servicio": "Cardiología"
  }
}
```

**Respuesta:**
```json
{
  "message": "Equipamiento_equipos creado exitosamente",
  "id": 1,
  "data": {
    "id_equipamiento": 123,
    "nro_item": "001",
    "nombre": "Equipo Médico",
    "cantidad": 5,
    "servicio": "Cardiología"
  }
}
```

### 4. Actualizar Equipo
**PUT** `/api/equipamiento_equipos/:id_equipamiento`

Actualiza un equipo existente.

**Body (JSON):**
```json
{
  "equipo": {
    "id": 1,
    "nro_item": "002",
    "nombre": "Equipo Médico Actualizado",
    "cantidad": 10,
    "servicio": "Neurología"
  }
}
```

**Respuesta:**
```json
{
  "message": "Equipamiento_equipos actualizado exitosamente",
  "id": 1,
  "data": {
    "nro_item": "002",
    "nombre": "Equipo Médico Actualizado",
    "cantidad": 10,
    "servicio": "Neurología"
  }
}
```

### 5. Eliminar Equipo
**DELETE** `/api/equipamiento_equipos/:id`

Elimina un equipo específico por su ID.

**Parámetros de URL:**
- `id` (number): ID del equipo a eliminar

**Respuesta:**
```json
{
  "success": true,
  "message": "Equipo eliminado exitosamente",
  "equipo_eliminado": {
    "id": 1,
    "id_equipamiento": 123,
    "nro_item": "001",
    "nombre": "Equipo Médico",
    "cantidad": 5,
    "servicio": "Cardiología"
  }
}
```

## Ejemplos de Uso en Angular

### Servicio Angular
```typescript
export class EquipamientoEquiposService {
  private baseUrl = 'http://localhost:3001/api/equipamiento_equipos';

  constructor(private http: HttpClient) { }

  // Obtener todos los equipos
  getAllEquipos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/todos`);
  }

  // Obtener equipos por ID de equipamiento
  getEquiposById(idEquipamiento: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${idEquipamiento}`);
  }

  // Crear nuevo equipo
  createEquipo(equipo: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, { equipo });
  }

  // Actualizar equipo
  updateEquipo(equipo: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${equipo.id_equipamiento}`, { equipo });
  }

  // Eliminar equipo
  deleteEquipo(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
```

### Componente Angular
```typescript
export class EquiposComponent {
  constructor(private equiposService: EquipamientoEquiposService) { }

  // Eliminar equipo
  eliminarEquipo(id: string) {
    this.equiposService.deleteEquipo(id).subscribe({
      next: (response) => {
        console.log('Equipo eliminado exitosamente:', response.equipo_eliminado.nombre);
        // Actualizar la lista de equipos
        this.cargarEquipos();
      },
      error: (error) => {
        console.error('Error al eliminar el equipo:', error);
      }
    });
  }
}
```

## Códigos de Estado HTTP

- **200**: Operación exitosa
- **201**: Recurso creado exitosamente
- **400**: Error en los datos de entrada
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

## Notas Importantes

1. Todos los endpoints devuelven respuestas en formato JSON
2. Los errores incluyen un campo `details` con información adicional
3. El campo `success` indica si la operación fue exitosa (true/false)
4. Los logs del servidor muestran información detallada de cada operación
