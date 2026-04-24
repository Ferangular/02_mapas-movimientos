import {inject, Injectable} from '@angular/core';
import {MAPBOX_CONFIG} from '../config/mapbox-config.config';
import mapboxgl from 'mapbox-gl';

@Injectable({ providedIn: 'root' })
export class MapboxService {
  private readonly config = inject(MAPBOX_CONFIG);

  constructor() {
    mapboxgl.accessToken = this.config.accessToken;
  }

  createMap(options: mapboxgl.MapboxOptions) {
    return new mapboxgl.Map(options);
  }
}
