import { Routes } from '@angular/router';
import { MapPage } from './maps/pages/map-page/map-page';

export const routes: Routes = [
  {
    path: '',
    component: MapPage,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
