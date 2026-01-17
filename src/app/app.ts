import { Component, signal } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterOutlet } from '@angular/router';
import { ExampleComponent } from './components/example/example.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSlideToggleModule, ExampleComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('angular-mat-tailwind-starter');
}
