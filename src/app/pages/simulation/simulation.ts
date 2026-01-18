import { Component } from '@angular/core';
import { SimulationForm } from '../../components/simulation-form/simulation-form';

@Component({
  selector: 'app-simulation',
  standalone: true,
  imports: [SimulationForm],
  templateUrl: './simulation.html',
  styleUrl: './simulation.scss',
})
export class Simulation {
}
