# Endpoints de Anexos para Equipamiento

Este documento describe los endpoints disponibles para manejar anexos (archivos) de equipamiento.

## Configuración Requerida

### 1. Instalar dependencias
```bash
npm install multer
```

### 2. Crear tabla en la base de datos
Ejecutar el script `create_anexos_table.sql` en tu base de datos MySQL.

### 3. Crear directorio de uploads
El sistema creará automáticamente el directorio `./uploads/equipamiento/` cuando sea necesario.

## Endpoints Disponibles

### 1. Subir Anexo
**POST** `/api/equipamiento_equipos/anexo/:id_compra`

Sube un archivo asociado a una compra/equipamiento específico.

**Parámetros de URL:**
- `id_compra` (number): ID de la compra/equipamiento

**Body (multipart/form-data):**
- `archivo` (file): Archivo a subir
- `id_compra` (number): ID de la compra (también en body)

**Tipos de archivo permitidos:**
- Imágenes: jpeg, jpg, png, gif
- Documentos: pdf, doc, docx
- Hojas de cálculo: xls, xlsx
- Texto: txt

**Límite de tamaño:** 10MB

**Ejemplo de respuesta exitosa:**
```json
{
  "message": "Anexo subido exitosamente",
  "id": 1,
  "file": {
    "id": 1,
    "id_compra": 1,
    "nombre_original": "documento.pdf",
    "nombre_archivo": "archivo-1234567890-123456789.pdf",
    "ruta_archivo": "./uploads/equipamiento/archivo-1234567890-123456789.pdf",
    "tamano": 1024000,
    "tipo_mime": "application/pdf"
  }
}
```

### 2. Obtener Anexos por Compra
**GET** `/api/equipamiento_equipos/anexo/:id_compra`

Obtiene todos los anexos asociados a una compra específica.

**Parámetros de URL:**
- `id_compra` (number): ID de la compra/equipamiento

**Ejemplo de respuesta:**
```json
{
  "id_compra": 1,
  "total_anexos": 2,
  "anexos": [
    {
      "id": 1,
      "id_compra": 1,
      "nombre_original": "documento1.pdf",
      "nombre_archivo": "archivo-1234567890-123456789.pdf",
      "ruta_archivo": "./uploads/equipamiento/archivo-1234567890-123456789.pdf",
      "tamano": 1024000,
      "tipo_mime": "application/pdf",
      "fecha_subida": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "id_compra": 1,
      "nombre_original": "imagen.jpg",
      "nombre_archivo": "archivo-1234567891-123456789.jpg",
      "ruta_archivo": "./uploads/equipamiento/archivo-1234567891-123456789.jpg",
      "tamano": 512000,
      "tipo_mime": "image/jpeg",
      "fecha_subida": "2024-01-15T11:00:00.000Z"
    }
  ]
}
```

### 3. Abrir Carpeta del Anexo
**GET** `/api/equipamiento_equipos/anexo/abrir/:id_anexo`

Abre la carpeta donde se encuentra el archivo en el explorador de Windows.

**Parámetros de URL:**
- `id_anexo` (number): ID del anexo

**Funcionalidad:**
- Abre automáticamente el explorador de Windows en la carpeta donde se encuentra el archivo
- El archivo quedará visible y seleccionado en el explorador
- Útil para acceder rápidamente a la ubicación del archivo en el sistema

**Ejemplo de respuesta:**
```json
{
  "success": true,
  "message": "Carpeta del archivo abierta exitosamente",
  "archivo": {
    "id": 1,
    "nombre_original": "documento.pdf",
    "ruta_archivo": "./uploads/equipamiento/archivo-1234567890-123456789.pdf",
    "ruta_absoluta": "C:\\Users\\...\\uploads\\equipamiento\\archivo-1234567890-123456789.pdf",
    "directorio": "C:\\Users\\...\\uploads\\equipamiento",
    "tipo_mime": "application/pdf",
    "tamano": 1024000,
    "fecha_subida": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. Servir Imagen
**GET** `/api/equipamiento_equipos/anexo/imagen/:id_anexo`

Sirve una imagen directamente en el navegador (solo para archivos de imagen).

**Parámetros de URL:**
- `id_anexo` (number): ID del anexo de imagen

**Respuesta:** La imagen se muestra directamente en el navegador.

### 5. Descargar Anexo
**GET** `/api/equipamiento_equipos/anexo/download/:id_anexo`

Descarga un anexo específico por su ID.

**Parámetros de URL:**
- `id_anexo` (number): ID del anexo a descargar

**Respuesta:** El archivo se descarga directamente con su nombre original.

### 6. Servir Archivo
**GET** `/api/equipamiento_equipos/anexo/servir/:id_anexo`

Sirve cualquier archivo directamente en el navegador.

**Parámetros de URL:**
- `id_anexo` (number): ID del anexo a servir

**Respuesta:** El archivo se muestra directamente en el navegador o se descarga según el tipo de archivo.

### 7. Ejecutar Comando con Anexo
**POST** `/api/equipamiento_equipos/anexo/ejecutar-comando`

Ejecuta comandos específicos relacionados con un anexo.

**Body (JSON):**
```json
{
  "id_anexo": 1,
  "comando": "obtener_info"
}
```

**Comandos disponibles:**
- `servir_archivo`: Sirve el archivo directamente al navegador
- `descargar_archivo`: Descarga el archivo
- `obtener_info`: Obtiene información del archivo con URLs de acceso

**Ejemplo de respuesta (obtener_info):**
```json
{
  "success": true,
  "message": "Información del archivo obtenida exitosamente",
  "archivo": {
    "id": 1,
    "nombre_original": "documento.pdf",
    "ruta_archivo": "./uploads/equipamiento/archivo-1234567890-123456789.pdf",
    "ruta_absoluta": "C:\\Users\\...\\uploads\\equipamiento\\archivo-1234567890-123456789.pdf",
    "tipo_mime": "application/pdf",
    "tamano": 1024000,
    "fecha_subida": "2024-01-15T10:30:00.000Z",
    "url_descarga": "/api/equipamiento_equipos/anexo/download/1",
    "url_visualizacion": "/api/equipamiento_equipos/anexo/servir/1"
  }
}
```

### 8. Eliminar Anexo
**DELETE** `/api/equipamiento_equipos/anexo/:id_anexo`

Elimina un anexo específico por su ID.

**Parámetros de URL:**
- `id_anexo` (number): ID del anexo a eliminar

**Ejemplo de respuesta:**
```json
{
  "message": "Anexo eliminado exitosamente",
  "anexo_eliminado": "documento.pdf"
}
```

## Códigos de Estado HTTP

- **200**: Operación exitosa
- **201**: Recurso creado exitosamente
- **400**: Error en la solicitud (datos faltantes, tipo de archivo no permitido)
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

## Ejemplo de Uso desde Frontend (Angular)

```typescript
// Servicio en Angular
uploadAnexo(idCompra: number, archivo: File): Observable<any> {
  const url = `${this.baseUrl}/equipamiento_equipos/anexo/${idCompra}`;
  
  const formData = new FormData();
  formData.append('archivo', archivo);
  formData.append('id_compra', idCompra.toString());
  
  return this.http.post(url, formData);
}

// Obtener anexos
getAnexosByCompra(idCompra: number): Observable<any> {
  const url = `${this.baseUrl}/equipamiento_equipos/anexo/${idCompra}`;
  return this.http.get(url);
}

// Abrir carpeta del anexo
abrirCarpetaAnexo(idAnexo: number): Observable<any> {
  const url = `${this.baseUrl}/equipamiento_equipos/anexo/abrir/${idAnexo}`;
  return this.http.get(url);
}

// Servir imagen (para mostrar en el navegador)
servirImagen(idAnexo: number): Observable<Blob> {
  const url = `${this.baseUrl}/equipamiento_equipos/anexo/imagen/${idAnexo}`;
  return this.http.get(url, { responseType: 'blob' });
}

// Servir archivo (para mostrar en el navegador)
servirArchivo(idAnexo: number): Observable<Blob> {
  const url = `${this.baseUrl}/equipamiento_equipos/anexo/servir/${idAnexo}`;
  return this.http.get(url, { responseType: 'blob' });
}

// Descargar anexo
downloadAnexo(idAnexo: number): Observable<Blob> {
  const url = `${this.baseUrl}/equipamiento_equipos/anexo/download/${idAnexo}`;
  return this.http.get(url, { responseType: 'blob' });
}

// Ejecutar comando con anexo
ejecutarComando(idAnexo: number, comando: string): Observable<any> {
  const url = `${this.baseUrl}/equipamiento_equipos/anexo/ejecutar-comando`;
  return this.http.post(url, { id_anexo, comando });
}

// Eliminar anexo
deleteAnexo(idAnexo: number): Observable<any> {
  const url = `${this.baseUrl}/equipamiento_equipos/anexo/${idAnexo}`;
  return this.http.delete(url);
}

// Ejemplo de uso en componente
abrirCarpetaAnexo(idAnexo: number) {
  this.anexoService.abrirCarpetaAnexo(idAnexo).subscribe({
    next: (response) => {
      console.log('Carpeta abierta exitosamente:', response.archivo.directorio);
      // El explorador de Windows se abrirá automáticamente
    },
    error: (error) => {
      console.error('Error al abrir la carpeta del anexo:', error);
    }
  });
}

// Ejemplo de uso del método ejecutarComando
ejecutarComandoAnexo(idAnexo: number, comando: string) {
  this.anexoService.ejecutarComando(idAnexo, comando).subscribe({
    next: (response) => {
      console.log('Comando ejecutado exitosamente');
      console.log('Archivo:', response.archivo.nombre_original);
      console.log('URL de descarga:', response.archivo.url_descarga);
      console.log('URL de visualización:', response.archivo.url_visualizacion);
    },
    error: (error) => {
      console.error('Error al ejecutar comando:', error);
    }
  });
}

// Ejemplo de uso para visualizar archivo
visualizarArchivo(idAnexo: number) {
  // Opción 1: Usar el endpoint directo
  window.open(`${this.baseUrl}/equipamiento_equipos/anexo/servir/${idAnexo}`, '_blank');
  
  // Opción 2: Usar el servicio
  this.anexoService.servirArchivo(idAnexo).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    },
    error: (error) => {
      console.error('Error al visualizar archivo:', error);
    }
  });
}

// Ejemplos de uso:
// this.ejecutarComandoAnexo(1, 'obtener_info');      // Obtener información
// this.ejecutarComandoAnexo(1, 'servir_archivo');    // Servir archivo
// this.ejecutarComandoAnexo(1, 'descargar_archivo'); // Descargar archivo
// this.visualizarArchivo(1);                         // Visualizar archivo
```

## Estructura de Archivos

```
uploads/
└── equipamiento/
    ├── archivo-1234567890-123456789.pdf
    ├── archivo-1234567891-123456789.jpg
    └── ...
```

## Notas Importantes

1. **Seguridad**: Los archivos se guardan con nombres únicos para evitar conflictos.
2. **Validación**: Se valida el tipo de archivo y el tamaño antes de guardar.
3. **Limpieza**: Al eliminar un anexo, se elimina tanto el registro de la BD como el archivo físico.
4. **Backup**: Considera hacer backup regular del directorio `uploads/`.
5. **Permisos**: Asegúrate de que el servidor tenga permisos de escritura en el directorio `uploads/`.
