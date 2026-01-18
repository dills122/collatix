import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationForm } from './simulation-form';

describe('SimulationForm', () => {
  let component: SimulationForm;
  let fixture: ComponentFixture<SimulationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulationForm],
    }).compileComponents();

    fixture = TestBed.createComponent(SimulationForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
