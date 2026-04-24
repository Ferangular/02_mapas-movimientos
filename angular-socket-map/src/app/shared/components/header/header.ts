import { Component, inject } from '@angular/core';
import { WebSocketService } from '../../../web-sockets/services/websocket.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styles: `
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 1000;
    }

    .logo {
      color: white;
      font-size: 20px;
      font-weight: bold;
    }

    .connection-indicator {
      display: flex;
      align-items: center;
      gap: 10px;
      color: white;
      font-size: 14px;
    }

    .status-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    .status-dot.offline {
      background-color: #ef4444;
    }

    .status-dot.connecting {
      background-color: #f59e0b;
    }

    .status-dot.connected {
      background-color: #10b981;
    }

    .status-dot.disconnected {
      background-color: #ef4444;
    }

    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
      }
    }
  `
})
export class HeaderComponent {
  public websocketService = inject(WebSocketService);

  getStatusText(): string {
    const status = this.websocketService.connectionStatus();
    switch (status) {
      case 'offline': return 'Desconectado';
      case 'connecting': return 'Conectando...';
      case 'connected': return 'Conectado';
      case 'disconnected': return 'Desconectado';
      default: return 'Desconocido';
    }
  }

  getStatusClass(): string {
    const status = this.websocketService.connectionStatus();
    return `status-dot ${status}`;
  }
}
