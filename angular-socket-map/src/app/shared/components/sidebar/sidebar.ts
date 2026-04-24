import { Component, effect, inject, output, signal } from '@angular/core';
import { WebSocketService } from '../../../web-sockets/services/websocket.service';
import {ConnectForm} from '../../../maps/components/connect-form/connect-form';
import {LatLng} from '../../../types';

interface ConnectFormData {
  name: string;
  color: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  imports: [
    ConnectForm

  ],
  styleUrl: './sidebar.css'

})
export class SidebarComponent {
  public websocketService = inject(WebSocketService);

  public currentCenter = signal<LatLng>({ lat: 0, lng: 0 });
  public markerPosition = signal<LatLng>({ lat: 0, lng: 0 });
  public isCollapsed = signal(false);
  public formSubmitted = output<ConnectFormData>();
  public sidebarStateChanged = output<boolean>();
  public colorChanged = output<string>();

  public connectFormModel = signal<ConnectFormData>({
    name: '',
    color: '#000000',
  });

  connectForm(formData: { name: string; color: string }) {
    console.log({ formData });
    console.log({ currentCenter: this.currentCenter() });

    this.websocketService.login(formData.name, formData.color, this.currentCenter());
  }

  toggleSidebar() {
    const newState = !this.isCollapsed();
    this.isCollapsed.set(newState);
    this.sidebarStateChanged.emit(newState);
  }

  constructor() {
    // Escuchar cambios en el color del formulario
    effect(() => {
      const currentColor = this.connectFormModel().color;
      this.colorChanged.emit(currentColor);
    });
  }

  shouldShowForm(): boolean {
    return this.websocketService.connectionStatus() !== 'connected';
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.formSubmitted.emit(this.connectFormModel());
  }
}
