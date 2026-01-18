import type { Routes } from '@angular/router';
import { Simulation } from './pages/simulation/simulation';

export const routes: Routes = [
  { path: 'simulation', component: Simulation },
  { path: '', redirectTo: '/simulation', pathMatch: 'full' },
  { path: '**', redirectTo: '/simulation' },
];
