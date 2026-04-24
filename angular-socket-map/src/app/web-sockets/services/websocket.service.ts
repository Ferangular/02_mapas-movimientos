import { effect, Injectable, signal } from '@angular/core';
import { ClientMessage, ServerMessage } from '../types';
import { Subject } from 'rxjs';
import Cookies from 'js-cookie';
import { environment } from '../../../environments/environment';

import { Client, LatLng } from '../../types';

type ConnectionStatus = 'offline' | 'connecting' | 'connected' | 'disconnected';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  public client = signal<Client | null>(null);

  private socket: WebSocket | null = null;
  public connectionStatus = signal<ConnectionStatus>('offline');
  public onMessage = new Subject<ServerMessage>();

  constructor() {
    if (Cookies.get('name') && Cookies.get('color') && Cookies.get('coords')) {
      this.connectWebSocket();
    }
  }

  // Mecanismo de re-conexión
  private reconnectInterval: number | null = null;
  private reconnectEffect = effect(() => {
    if (this.connectionStatus() === 'disconnected') {
      if (this.reconnectInterval) return;

      this.reconnectInterval = setInterval(() => {
        console.log('Reconnecting...');
        this.connectWebSocket();
      }, 1000); // crear un valor random...
    }

    if (this.connectionStatus() === 'connected') {
      clearInterval(this.reconnectInterval || 0);
      this.reconnectInterval = null;
    }
  });

  public login(name: string, color: string, latLng: LatLng) {
    if (this.connectionStatus() === 'connecting' || this.connectionStatus() === 'connected') return;

    Cookies.set('name', name);
    Cookies.set('color', color);
    Cookies.set('coords', JSON.stringify(latLng));

    this.connectWebSocket();
  }

  private connectWebSocket() {
    this.socket = new WebSocket(environment.websocketUrl);
    if (!this.socket) {
      throw new Error('Failed to connect to the server');
    }

    this.socket.addEventListener('open', () => {
      console.log('Connected');
      this.connectionStatus.set('connected');
    });

    this.socket.addEventListener('close', () => {
      console.log('Disconnected');
      this.connectionStatus.set('disconnected');
    });

    this.socket.addEventListener('error', (event) => {
      console.log('Error: ', event);
    });

    // ! On Message
    this.socket.addEventListener('message', (event) => {
      const data: ServerMessage = JSON.parse(event.data);
      console.log(data);

      if (data.type === 'WELCOME') {
        this.client.set(data.payload);
      }

      this.onMessage.next(data);
    });
  }

  public sendMessage(message: ClientMessage) {
    if (!this.socket) throw new Error('Socket not connected');

    this.socket.send(JSON.stringify(message));
  }
}
