import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

import Cookies from 'js-cookie';
import type { Client, LatLng } from '../../../types';
import { WebSocketService } from '../../../web-sockets/services/websocket.service';
import { MapboxService } from '../../../core/services/mapbox.service';

@Component({
  selector: 'custom-map',
  imports: [],
  templateUrl: './custom-map.html',
  styles: `
    .map {
      width: calc(100vw - 320px);
      height: calc(100vh - 60px);
      margin-left: 320px;
      margin-top: 60px;
    }

    @media (max-width: 768px) {
      .map {
        width: calc(100vw - 280px);
        margin-left: 280px;
      }
    }

    @media (max-width: 480px) {
      .map {
        width: 100vw;
        margin-left: 0;
      }
    }
  `,
})
export class CustomMap implements AfterViewInit {
  private readonly websocketService = inject(WebSocketService);
  private readonly mapboxService = inject(MapboxService);
  private readonly destroyRef = inject(DestroyRef);

  public sidebarCollapsed = input(false);
  private readonly mapElement = viewChild<ElementRef<HTMLDivElement>>('map');

  private map: mapboxgl.Map | null = null;
  private readonly markers = new Map<string, mapboxgl.Marker>(); //Mapa de marcadores
  private currentUser: Client | null = null; // Datos del usuario actual

  // Método para actualizar el color del usuario actual desde el formulario
  public updateUserColor(color: string) {
    if (this.currentUser) {
      this.currentUser.color = color;
      console.log('🎨 Color del usuario actualizado a:', color);
      
      // Si ya existe un marker, actualizar su color
      const userMarker = this.markers.get(this.currentUser.clientId);
      if (userMarker) {
        userMarker.remove(); // Eliminar el marker actual
        
        // Crear nuevo marker con el color actualizado
        const currentCoords = userMarker.getLngLat();
        const newMarker = new mapboxgl.Marker({
          color: color,
          draggable: true,
        })
          .setLngLat(currentCoords)
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${this.currentUser.name}</h3>`))
          .on('dragend', () => {
            Cookies.set('coords', JSON.stringify(newMarker.getLngLat()));
          })
          .on('drag', () => {
            const markerCoords = newMarker.getLngLat();
            this.websocketService.sendMessage({
              type: 'CLIENT_MOVE',
              payload: {
                clientId: this.currentUser!.clientId,
                coords: { lng: markerCoords.lng, lat: markerCoords.lat },
              },
            });
          })
          .addTo(this.map!);
        
        this.markers.set(this.currentUser.clientId, newMarker);
        console.log('✅ Marker actualizado con nuevo color:', color);
      }
    }
  }

  // ✅ eventos separados
  public readonly centerChanged = output<LatLng>();
  public readonly coordsSelected = output<LatLng>();
  public readonly colorChanged = output<string>();
  public readonly markerMoved = output<LatLng>();
  // public center = output<LatLng>();

  private  onMessage$ = this.websocketService.onMessage.subscribe((message) => {
    switch (message.type) {
      case 'WELCOME':
        // Guardar los datos del usuario pero no crear el marker todavía
        // El marker se creará cuando el usuario haga clic en el mapa por primera vez
        console.log('👋 Usuario conectado, esperando primera posición:', message.payload);
        console.log('🗺️ Haz clic en el mapa para crear tu marker');
        this.currentUser = message.payload;
        break;

      case 'CLIENTS_STATE':
        // Solo crear markers para otros usuarios, no para el actual
        const otherClients = message.payload.filter(client => 
          client.clientId !== this.currentUser?.clientId
        );
        if (otherClients.length > 0) {
          this.createMarkers(otherClients);
        }
        break;

      case 'CLIENT_JOINED':
        // Solo crear marker si no es el usuario actual
        if (message.payload.clientId !== this.currentUser?.clientId) {
          this.createMarkers([message.payload]);
        }
        break;

      case 'CLIENT_MOVED':
        this.updateMarkerCoords(message.payload.clientId, message.payload.coords);
        break;

      case 'CLIENT_LEFT':
        this.removeMarker(message.payload.clientId);
        break;
    }
  });


  constructor() {

    // Escuchar cambios en el estado del sidebar
    effect(() => {
      this.updateMapStyles();
    });

    this.destroyRef.onDestroy(() => {
      // onMessage$.unsubscribe();
      this.map?.remove();
      this.markers.clear();
    });
  }

  ngAfterViewInit(): void {
    if (!this.mapElement()) throw new Error('Map element not found');

    this.map = new mapboxgl.Map({
      container: this.mapElement()!.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-122.473043, 37.80333], // starting position [lng, lat]
      zoom: 16,
    });

    this.centerChanged.emit({ lat: 37.80333, lng: -122.473043 });
    this.map.on('moveend', () => {
      const currentCenter = this.map!.getCenter();
      this.centerChanged.emit({ lat: currentCenter.lat, lng: currentCenter.lng });
    });

    // 🔁 mover mapa
    this.map.on('moveend', () => {
      if (!this.map) return;

      const currentCenter = this.map.getCenter();

      this.centerChanged.emit({
        lat: currentCenter.lat,
        lng: currentCenter.lng,
      });
    });

    // 🖱️ click en mapa
    this.map.on('click', (event) => {
      const { lng, lat } = event.lngLat;

      console.log('Click en mapa →', { lng, lat });

      // Actualizar la posición del marker del usuario actual
      this.updateCurrentUserMarker({ lng, lat });

      this.coordsSelected.emit({
        lat,
        lng,
      });
    });
  }

  private updateMapStyles() {
    const mapElement = this.mapElement()?.nativeElement;
    if (!mapElement) return;

    const isCollapsed = this.sidebarCollapsed();
    const sidebarWidth = isCollapsed ? 0 : 320;

    mapElement.style.marginLeft = `${sidebarWidth}px`;
    mapElement.style.width = `calc(100vw - ${sidebarWidth}px)`;

    // Redimensionar el mapa si existe
    if (this.map) {
      this.map.resize();
    }
  }

  private createMarkers(clients: Client[], isDraggable = false) {
    console.log('CustomMap - createMarkers called with clients:', clients);
    if (!this.map) {
      console.log('CustomMap - Map is not initialized');
      return;
    }

    for (const client of clients) {
      console.log('CustomMap - Creating marker for client:', client);

      // Usar coordenadas del cliente si no son (0,0), si no usar centro del mapa
      let coords = client.coords;
      if (client.coords.lat === 0 && client.coords.lng === 0) {
        coords = this.map.getCenter();
        console.log('CustomMap - Using map center coordinates instead of (0,0):', coords);
      }

      const marker = new mapboxgl.Marker({
        color: client.color,
        draggable: isDraggable,
      })
        .setLngLat({ lng: coords.lng, lat: coords.lat })
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${client.name}</h3>`))
        .on('dragend', () => {
          Cookies.set('coords', JSON.stringify(marker.getLngLat()));
        })
        .on('drag', () => {
          const markerCoords = marker.getLngLat();
          this.websocketService.sendMessage({
            type: 'CLIENT_MOVE',
            payload: {
              clientId: client.clientId,
              coords: { lng: markerCoords.lng, lat: markerCoords.lat },
            },
          });
        })
        .addTo(this.map);

      this.markers.set(client.clientId, marker);
      console.log('CustomMap - Marker created and added to map at coords:', coords);
    }
  }

  private updateCurrentUserMarker(coords: { lng: number; lat: number }) {
    if (!this.currentUser) {
      console.log('❌ No hay usuario actual conectado');
      return;
    }

    if (!this.map) {
      console.log('❌ Mapa no disponible');
      return;
    }

    // Buscar si ya existe un marker para el usuario actual
    const userMarker = this.markers.get(this.currentUser.clientId);
    
    if (!userMarker) {
      // Es el primer clic - crear el marker del usuario actual
      console.log('🎯 Creando marker del usuario actual en primera posición:', coords);
      
      // Obtener el color actual del formulario desde las cookies o usar el del currentUser como fallback
      const currentColor = Cookies.get('color') || this.currentUser.color;
      console.log('🎨 Color a usar para el marker:', currentColor);
      
      const marker = new mapboxgl.Marker({
        color: currentColor, // Usar el color del formulario actual
        draggable: true,
      })
        .setLngLat(coords)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${this.currentUser.name}</h3>`))
        .on('dragend', () => {
          Cookies.set('coords', JSON.stringify(marker.getLngLat()));
        })
        .on('drag', () => {
          const markerCoords = marker.getLngLat();
          console.log('🎯 Marker movido a coordenadas:', {
            lng: markerCoords.lng.toFixed(6),
            lat: markerCoords.lat.toFixed(6)
          });
          
          // Emitir coordenadas para que otros componentes puedan mostrarlas
          this.markerMoved.emit({
            lng: markerCoords.lng,
            lat: markerCoords.lat
          });
          
          this.websocketService.sendMessage({
            type: 'CLIENT_MOVE',
            payload: {
              clientId: this.currentUser!.clientId,
              coords: { lng: markerCoords.lng, lat: markerCoords.lat },
            },
          });
        })
        .addTo(this.map);

      this.markers.set(this.currentUser.clientId, marker);
      console.log('✅ Marker del usuario creado con color:', currentColor);
    } else {
      // El marker ya existe - solo actualizar posición
      userMarker.setLngLat(coords);
      console.log('✅ Marker del usuario actualizado a:', coords);
    }

    // Enviar las nuevas coordenadas al servidor
    this.websocketService.sendMessage({
      type: 'CLIENT_MOVE',
      payload: {
        clientId: this.currentUser.clientId,
        coords: coords,
      },
    });
  }

  private updateMarkerCoords(clientId: string, latLng: LatLng) {
    if (!this.map) return;

    const marker = this.markers.get(clientId);
    if (!marker) return;

    marker.setLngLat(latLng);
  }

  private removeMarker(clientId: string) {
    if (!this.map) return;

    const marker = this.markers.get(clientId);
    if (!marker) return;
    marker.remove();
    this.markers.delete(clientId);
  }
}
