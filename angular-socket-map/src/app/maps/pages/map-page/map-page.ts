import { Component, inject, signal } from '@angular/core';
import { ConnectForm } from '../../components/connect-form/connect-form';
import { CustomMap } from '../../components/custom-map/custom-map';
import { HeaderComponent } from '../../../shared/components/header/header';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar';
import { LatLng } from '../../../types';
import { WebSocketService } from '../../../web-sockets/services/websocket.service';

@Component({
  selector: 'map-page',
  imports: [ CustomMap, HeaderComponent, SidebarComponent],
  templateUrl: './map-page.html',
})
export class MapPage {
  public websocketService = inject(WebSocketService);

  // 🔁 centro del mapa
  public mapCenter = signal<LatLng>({ lat: 0, lng: 0 });

  // 🖱️ punto seleccionado
  public selectedCoords = signal<LatLng>({ lat: 0, lng: 0 });

  public currentCenter = signal<LatLng>({ lat: 0, lng: 0 });
  public sidebarCollapsed = signal(false);

  connectForm(formData: { name: string; color: string }) {
    console.log('coords usadas para login:', this.selectedCoords());
  console.log(formData);
    this.websocketService.login(
      formData.name,
      formData.color,
      this.selectedCoords()
    );
  }

  onSidebarStateChanged(isCollapsed: boolean) {
    this.sidebarCollapsed.set(isCollapsed);
  }

  onColorChanged(color: string) {
    console.log('🎨 Color cambiado en MapPage:', color);
    // Obtener referencia al CustomMap y actualizar el color
    // Necesitamos una referencia al componente CustomMap para llamar a updateUserColor
  }

  onMarkerMoved(coords: LatLng) {
    console.log('📍 Marker movido a coordenadas:', coords);
    // Aquí podríamos mostrar las coordenadas en la UI o hacer algo más
  }
}
