# Angular Socket Maps

![Angular Socket Maps](img.png)

Una aplicación interactiva de mapas en tiempo real construida con Angular 21 y Mapbox GL JS que permite a múltiples usuarios conectarse mediante WebSockets y compartir su posición en un mapa.

## 🚀 Características Principales

- **Mapas Interactivos**: Integración con Mapbox GL JS para visualización de mapas de alta calidad
- **Tiempo Real**: Conexión WebSocket para sincronización instantánea de posiciones entre múltiples usuarios
- **Marcadores Personalizables**: Cada usuario puede elegir su color y arrastrar su marcador
- **Persistencia de Datos**: Almacenamiento local con cookies para mantener la sesión del usuario
- **Diseño Responsivo**: Interfaz adaptable que funciona en desktop y dispositivos móviles
- **Capas de Recorte**: Soporte para técnicas avanzadas de Mapbox como clip layers para modificar elementos del mapa

## 🛠️ Stack Tecnológico

- **Frontend**: Angular 21.2.0 con TypeScript
- **Mapas**: Mapbox GL JS v3.22.0
- **Comunicación**: WebSockets nativos
- **Almacenamiento**: js-cookie para persistencia local
- **Testing**: Vitest para pruebas unitarias
- **Build**: Angular CLI 21.2.5

## 📁 Estructura del Proyecto

```
src/app/
├── core/
│   ├── config/
│   │   └── mapbox-config.config.ts    # Configuración de Mapbox
│   └── services/
│       └── mapbox.service.ts           # Servicio de Mapbox
├── maps/
│   ├── components/
│   │   └── custom-map/
│   │       ├── custom-map.ts           # Componente principal del mapa
│   │       └── custom-map.html         # Template del mapa
│   └── services/                       # Servicios relacionados con mapas
├── web-sockets/
│   └── services/
│       └── websocket.service.ts        # Servicio WebSocket
├── shared/                             # Componentes compartidos
└── types/
    └── index.ts                        # Tipos TypeScript
```

## 🗺️ Funcionalidades del Mapa

### Integración con Mapbox GL JS

El proyecto utiliza Mapbox GL JS con las siguientes características:

- **Estilo Base**: `mapbox://styles/mapbox/streets-v12`
- **Marcadores Draggables**: Los usuarios pueden arrastrar sus marcadores
- **Popups**: Información del usuario al hacer clic en marcadores
- **Eventos en Tiempo Real**: Movimiento sincronizado entre usuarios

### Capas de Recorte (Clip Layers)

Basado en la [documentación de Mapbox](https://docs.mapbox.com/mapbox-gl-js/example/clip-layer-building/), el proyecto soporta:

```javascript
// Ejemplo de implementación de clip layer
map.addLayer({
  'id': 'eraser',
  'type': 'clip',
  'source': 'eraser',
  'layout': {
    'clip-layer-types': ['symbol', 'model'],
    'clip-layer-scope': ['basemap']
  }
});
```

Esta característica experimental permite:
- Remover edificios 3D específicos del mapa
- Reemplazar landmarks con modelos personalizados
- Controlar qué elementos del mapa son afectados por el recorte

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- Angular CLI 21.2.5
- Cuenta de Mapbox con Access Token

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd angular-socket-map
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Mapbox**
   - Crear cuenta en [Mapbox](https://www.mapbox.com/)
   - Obtener Access Token desde el dashboard
   - Configurar el token en `src/app/core/config/mapbox-config.config.ts`

4. **Configurar WebSocket**
   - Actualizar la URL del servidor WebSocket en `src/environments/environment.ts`

## 🏃‍♂️ Desarrollo

### Servidor de Desarrollo

```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200/`

### Build de Producción

```bash
ng build
```

Los archivos de producción se generarán en `dist/`

### Testing

```bash
# Pruebas unitarias
ng test

# Pruebas end-to-end
ng e2e
```

## 📡 Protocolo WebSocket

### Mensajes del Servidor

- **WELCOME**: Bienvenida al usuario con sus datos
- **CLIENTS_STATE**: Estado actual de todos los clientes conectados
- **CLIENT_JOINED**: Notificación de nuevo cliente
- **CLIENT_MOVED**: Actualización de posición de un cliente
- **CLIENT_LEFT**: Notificación de cliente desconectado

### Mensajes del Cliente

- **CLIENT_MOVE**: Actualización de posición propia

## 🎨 Personalización

### Colores de Marcadores

Los usuarios pueden personalizar su color mediante:
- Formulario en la interfaz
- Persistencia en cookies
- Actualización en tiempo real

### Estilos del Mapa

Modificar el estilo base en `custom-map.ts`:

```typescript
this.map = new mapboxgl.Map({
  container: this.mapElement()!.nativeElement,
  style: 'mapbox://styles/mapbox/streets-v12', // Cambiar aquí
  center: [-122.473043, 37.80333],
  zoom: 16,
});
```

## 🔧 Configuración Avanzada

### Variables de Entorno

Crear `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  websocketUrl: 'ws://localhost:8080'
};
```

### Configuración de Mapbox

`src/app/core/config/mapbox-config.config.ts`:

```typescript
export const MAPBOX_CONFIG = {
  accessToken: 'YOUR_MAPBOX_ACCESS_TOKEN',
  defaultStyle: 'mapbox://styles/mapbox/streets-v12'
};
```

## 📚 Referencias

- [Documentación Angular](https://angular.dev/)
- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/guides/)
- [Clip Layers Example](https://docs.mapbox.com/mapbox-gl-js/example/clip-layer-building/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

## 🤝 Contribución

1. Fork del proyecto
2. Crear feature branch (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push al branch (`git push origin feature/amazing-feature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo licencia MIT.
