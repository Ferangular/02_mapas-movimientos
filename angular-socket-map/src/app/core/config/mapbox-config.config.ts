import { InjectionToken } from '@angular/core';

export interface MapboxConfig {
  accessToken: string;
}

export const MAPBOX_CONFIG = new InjectionToken<MapboxConfig>('MAPBOX_CONFIG');
