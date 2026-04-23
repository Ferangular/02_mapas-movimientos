# WebSocket Maps Server

Servidor WebSocket para gestionar clientes en tiempo real con coordenadas geográficas. Los clientes pueden registrarse, moverse y ver la posición de otros clientes conectados.

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) runtime

### Installation

1. Clonar el repositorio
2. Instalar dependencias:
```bash
bun install
```

3. Configurar variables de entorno:
```bash
cp .env.template .env
```

4. Iniciar el servidor:
```bash
bun run dev
```

El servidor estará disponible en `http://localhost:3200`

## 🧪 Testing

Abre `http://localhost:3200` en tu navegador y usa la consola para probar la API WebSocket.

### Ejemplo de conexión:

```javascript
// El cliente se registra automáticamente al conectar usando las cookies
// Puedes enviar mensajes manualmente:

// Obtener todos los clientes conectados
const message = {
  type: 'GET_CLIENTS',
  payload: {}
};
socket.send(JSON.stringify(message));

// Mover tu posición
const moveMessage = {
  type: 'CLIENT_MOVE',
  payload: {
    coords: { lat: 40.7128, lng: -74.0060 }
  }
};
socket.send(JSON.stringify(moveMessage));
```

## 📋 API Reference

### Mensajes Entrantes (Incoming)

#### `CLIENT_REGISTER`
Registrado automático al conectar usando cookies.

#### `CLIENT_MOVE`
Actualiza la posición del cliente.

```javascript
{
  type: 'CLIENT_MOVE',
  payload: {
    coords: {
      lat: number,    // Latitud
      lng: number     // Longitud
    }
  }
}
```

#### `GET_CLIENTS`
Obtiene la lista de todos los clientes conectados.

```javascript
{
  type: 'GET_CLIENTS',
  payload: {}
}
```

### Mensajes Salientes (Outgoing)

#### `WELCOME`
Respuesta al registrarse exitosamente.

```javascript
{
  type: 'WELCOME',
  payload: {
    clientId: string,
    name: string,
    color: string,
    coords: { lat: number, lng: number },
    updatedAt: number
  }
}
```

#### `CLIENTS_STATE`
Lista completa de clientes conectados.

```javascript
{
  type: 'CLIENTS_STATE',
  payload: [
    {
      clientId: string,
      name: string,
      color: string,
      coords: { lat: number, lng: number },
      updatedAt: number
    }
  ]
}
```

#### `CLIENT_JOINED`
Nuevo cliente se ha conectado.

```javascript
{
  type: 'CLIENT_JOINED',
  payload: {
    clientId: string,
    name: string,
    color: string,
    coords: { lat: number, lng: number },
    updatedAt: number
  }
}
```

#### `CLIENT_MOVED`
Un cliente ha cambiado su posición.

```javascript
{
  type: 'CLIENT_MOVED',
  payload: {
    clientId: string,
    coords: { lat: number, lng: number },
    updatedAt: number
  }
}
```

#### `CLIENT_LEFT`
Un cliente se ha desconectado.

```javascript
{
  type: 'CLIENT_LEFT',
  payload: {
    clientId: string
  }
}
```

#### `ERROR`
Mensaje de error.

```javascript
{
  type: 'ERROR',
  payload: {
    error: string
  }
}
```

## 🔧 Configuration

Las variables de entorno se configuran en el archivo `.env`:

```env
PORT=3200
```

## 🏗️ Architecture

### Project Structure

```
03-sockets-maps/
├── 📁 src/
│   ├── 📄 index.ts                 # Entry point
│   ├── 📄 server.ts                # WebSocket server configuration
│   ├── 📁 config/
│   │   └── 📄 server-config.ts     # Server configuration constants
│   ├── 📁 handlers/
│   │   └── 📄 message.handler.ts    # Message processing logic
│   ├── 📁 schemas/
│   │   └── 📄 websocket-message.schema.ts  # Zod validation schemas
│   ├── 📁 services/
│   │   ├── 📄 clients.service.ts   # Client management service
│   │   └── 📄 my-service.service.ts # Legacy service (deprecated)
│   ├── 📁 store/
│   │   ├── 📄 clients.store.ts     # Client state management
│   │   └── 📄 my-store.store.ts    # Legacy store (deprecated)
│   ├── 📁 types/
│   │   └── 📄 index.ts             # TypeScript type definitions
│   └── 📁 utils/
│       └── 📄 generate-uuid.ts     # UUID generation utility
├── 📁 public/
│   ├── 📄 index.html               # Test client HTML
│   ├── 📄 styles.css               # Basic styling
│   └── 📄 favicon.ico              # Favicon
├── 📄 package.json                 # Dependencies and scripts
├── 📄 tsconfig.json               # TypeScript configuration
├── 📄 bun.lock                     # Bun lock file
├── 📄 .env                         # Environment variables
├── 📄 .env.template                # Environment variables template
└── 📄 README.md                    # Documentation
```

### Component Overview

- **Server**: Manejo de conexiones WebSocket con Bun
- **Handlers**: Lógica de procesamiento de mensajes
- **Services**: Gestión de clientes y estado
- **Schemas**: Validación con Zod
- **Types**: Definiciones TypeScript

## 📝 Flow

1. **Conexión**: Cliente se conecta vía WebSocket
2. **Registro**: Automático usando cookies (name, color, coords)
3. **Broadcast**: Los cambios se propagan a todos los clientes
4. **Desconexión**: Limpieza automática del estado

## 🛠️ Development

```bash
# Development
bun run dev

# Build (si aplica)
bun run build

# Type checking
bun run type-check
```
