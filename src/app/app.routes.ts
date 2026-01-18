import type { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Simulation } from './pages/simulation/simulation';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'simulation', component: Simulation },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];
