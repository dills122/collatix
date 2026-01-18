import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

type SlotType = 'base' | 'insert' | 'hit';
type PrintStrategy = 'print-run' | 'odds-first';
type ReadinessStatus = 'ok' | 'warn' | 'info';
interface FormPreset {
  name: string;
  summary: string;
  payload: {
    productName: string;
    randomSeed: string;
    boxesPerCase: number;
    packsPerBox: number;
    cardsPerPack: number;
    checklistSize: number;
    printStrategy: PrintStrategy;
    slotTypes?: SlotType[];
    packSlots: PackSlotInit[];
    guarantees: {
      autosPerBox: number;
      caseHitsPerCase: number;
      lowSerialCapPerBox: number;
    };
    simulation: {
      casesToSimulate: number;
      reseedEachCase: boolean;
      varianceControl: boolean;
    };
  };
}

type PackSlotFormGroup = FormGroup<{
  label: FormControl<string>;
  type: FormControl<SlotType>;
  odds: FormControl<string>;
  replaces: FormControl<SlotType>;
  notes: FormControl<string>;
}>;

interface PackSlotInit {
  label?: string;
  type: SlotType;
  odds?: string;
  replaces?: SlotType;
  notes?: string;
}

interface ReadinessCheck {
  title: string;
  detail: string;
  status: ReadinessStatus;
}

@Component({
  selector: 'app-simulation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './simulation-form.html',
  styleUrl: './simulation-form.scss',
})
export class SimulationForm {
  private readonly fb = inject(FormBuilder);

  protected readonly slotOptions: SlotType[] = ['base', 'insert', 'hit'];
  protected readonly presets: FormPreset[] = [
    {
      name: 'Hobby balanced',
      summary: 'Classic 12-box case with seeded autos and a modest hit slot.',
      payload: {
        productName: '2025 Apex Baseball — Hobby',
        randomSeed: 'seed-2025',
        boxesPerCase: 12,
        packsPerBox: 24,
        cardsPerPack: 8,
        checklistSize: 200,
        printStrategy: 'print-run',
        slotTypes: ['base', 'insert', 'hit'],
        packSlots: [
          {
            label: 'Base commons',
            type: 'base',
            odds: 'every pack',
            replaces: 'base',
            notes: 'Even checklist spread across the case.',
          },
          {
            label: 'Insert slot',
            type: 'insert',
            odds: '1:6 packs',
            replaces: 'base',
            notes: 'Rotate by theme; avoid dupes in a pack.',
          },
          {
            label: 'Hit / auto',
            type: 'hit',
            odds: '1:12 packs',
            replaces: 'insert',
            notes: 'Respect box guarantees before shuffling.',
          },
        ],
        guarantees: {
          autosPerBox: 1,
          caseHitsPerCase: 1,
          lowSerialCapPerBox: 2,
        },
        simulation: {
          casesToSimulate: 25,
          reseedEachCase: false,
          varianceControl: true,
        },
      },
    },
    {
      name: 'Retail light',
      summary: 'Lower box count, gentler odds, no box autos guaranteed.',
      payload: {
        productName: '2025 Apex Baseball — Retail',
        randomSeed: 'seed-retail',
        boxesPerCase: 10,
        packsPerBox: 20,
        cardsPerPack: 10,
        checklistSize: 180,
        printStrategy: 'odds-first',
        slotTypes: ['base', 'insert'],
        packSlots: [
          {
            label: 'Base commons',
            type: 'base',
            odds: 'every pack',
            replaces: 'base',
            notes: 'Even checklist spread across the case.',
          },
          {
            label: 'Themed insert',
            type: 'insert',
            odds: '1:8 packs',
            replaces: 'base',
            notes: 'One insert replaces a base card occasionally.',
          },
        ],
        guarantees: {
          autosPerBox: 0,
          caseHitsPerCase: 1,
          lowSerialCapPerBox: 1,
        },
        simulation: {
          casesToSimulate: 50,
          reseedEachCase: true,
          varianceControl: true,
        },
      },
    },
    {
      name: 'Hit chase',
      summary: 'Aggressive hit slot with tighter low-serial cap.',
      payload: {
        productName: '2025 Apex Black Label — Hobby',
        randomSeed: 'seed-black-label',
        boxesPerCase: 8,
        packsPerBox: 18,
        cardsPerPack: 6,
        checklistSize: 120,
        printStrategy: 'print-run',
        slotTypes: ['base', 'insert', 'hit'],
        packSlots: [
          {
            label: 'Base tier',
            type: 'base',
            odds: 'every pack',
            replaces: 'base',
            notes: 'Weighted toward top rookies.',
          },
          {
            label: 'Foil insert',
            type: 'insert',
            odds: '1:4 packs',
            replaces: 'base',
            notes: 'Rotates across themes; avoid duplicate players in a pack.',
          },
          {
            label: 'Hit / auto',
            type: 'hit',
            odds: '1:6 packs',
            replaces: 'insert',
            notes: 'Guarantee one auto per box before shuffle.',
          },
        ],
        guarantees: {
          autosPerBox: 1,
          caseHitsPerCase: 2,
          lowSerialCapPerBox: 1,
        },
        simulation: {
          casesToSimulate: 10,
          reseedEachCase: false,
          varianceControl: true,
        },
      },
    },
  ];

  protected readonly form = this.fb.nonNullable.group({
    productName: this.fb.nonNullable.control('2025 Apex Baseball — Hobby', [
      Validators.required,
      Validators.maxLength(120),
    ]),
    randomSeed: this.fb.nonNullable.control('seed-2025', [Validators.required]),
    boxesPerCase: this.fb.nonNullable.control(12, {
      validators: [Validators.required, Validators.min(1)],
    }),
    packsPerBox: this.fb.nonNullable.control(24, {
      validators: [Validators.required, Validators.min(1)],
    }),
    cardsPerPack: this.fb.nonNullable.control(8, {
      validators: [Validators.required, Validators.min(1)],
    }),
    checklistSize: this.fb.nonNullable.control(200, {
      validators: [Validators.required, Validators.min(1)],
    }),
    printStrategy: this.fb.nonNullable.control<PrintStrategy>('print-run'),
    slotTypes: this.fb.nonNullable.control<SlotType[]>(['base', 'insert', 'hit']),
    packSlots: this.fb.array<PackSlotFormGroup>([
      this.createPackSlotGroup({
        label: 'Base commons',
        type: 'base',
        odds: 'every pack',
        replaces: 'base',
        notes: 'Even checklist spread across the case.',
      }),
      this.createPackSlotGroup({
        label: 'Insert slot',
        type: 'insert',
        odds: '1:6 packs',
        replaces: 'base',
        notes: 'Rotate by theme; avoid dupes in a pack.',
      }),
      this.createPackSlotGroup({
        label: 'Hit / auto',
        type: 'hit',
        odds: '1:12 packs',
        replaces: 'insert',
        notes: 'Respect box guarantees before shuffling.',
      }),
    ]),
    guarantees: this.fb.nonNullable.group({
      autosPerBox: this.fb.nonNullable.control(1, { validators: [Validators.min(0)] }),
      caseHitsPerCase: this.fb.nonNullable.control(1, { validators: [Validators.min(0)] }),
      lowSerialCapPerBox: this.fb.nonNullable.control(2, { validators: [Validators.min(0)] }),
    }),
    simulation: this.fb.nonNullable.group({
      casesToSimulate: this.fb.nonNullable.control(25, { validators: [Validators.min(1)] }),
      reseedEachCase: this.fb.nonNullable.control(false),
      varianceControl: this.fb.nonNullable.control(true),
    }),
  });

  protected get packSlots(): FormArray<PackSlotFormGroup> {
    return this.form.controls.packSlots;
  }

  protected readonly readinessChecks = computed<ReadinessCheck[]>(() => {
    const value = this.form.getRawValue();
    const cardsPerCase = value.boxesPerCase * value.packsPerBox * value.cardsPerPack;
    const guaranteedHits =
      value.guarantees.autosPerBox * value.boxesPerCase + value.guarantees.caseHitsPerCase;

    return [
      {
        title: 'Print runs cover guarantees',
        detail:
          guaranteedHits <= cardsPerCase
            ? `Pools can fund ${guaranteedHits || 'all'} guaranteed hits across ${value.boxesPerCase} boxes.`
            : 'Guarantees exceed the available cards; trim guarantees or increase the print run.',
        status: guaranteedHits <= cardsPerCase ? 'ok' : 'warn',
      },
      {
        title: 'Slot odds add up',
        detail: `${this.packSlots.length} slot${this.packSlots.length === 1 ? '' : 's'} defined; replace base slots instead of stacking odds.`,
        status: this.packSlots.length >= value.slotTypes.length ? 'ok' : 'warn',
      },
      {
        title: 'Variants replace base',
        detail:
          'Slots marked insert / hit should replace the base slot rather than stack more cards per pack.',
        status: value.printStrategy === 'print-run' ? 'ok' : 'info',
      },
    ];
  });

  protected readonly caseFootprint = computed(() => {
    const value = this.form.getRawValue();
    const packsPerCase = value.boxesPerCase * value.packsPerBox;
    const cardsPerCase = packsPerCase * value.cardsPerPack;

    return {
      packsPerCase,
      cardsPerCase,
      checklistCoverage: value.checklistSize
        ? Math.min(100, Math.round((cardsPerCase / value.checklistSize) * 100))
        : 0,
    };
  });

  protected toggleSlotType(type: SlotType): void {
    const current = this.form.controls.slotTypes.value;
    const hasType = current.includes(type);
    const next = hasType ? current.filter((slot) => slot !== type) : [...current, type];

    if (!next.length) {
      return;
    }

    this.form.controls.slotTypes.setValue(next);
  }

  protected addPackSlot(type: SlotType = 'base'): void {
    this.packSlots.push(
      this.createPackSlotGroup({
        label: 'New slot',
        type,
        odds: '1:?? packs',
        replaces: type,
        notes: 'Describe when this slot fires and what it replaces.',
      })
    );
  }

  protected removePackSlot(index: number): void {
    if (this.packSlots.length <= 1) {
      return;
    }

    this.packSlots.removeAt(index);
  }

  protected trackSlot = (index: number): number => index;

  protected loadPreset(preset: FormPreset): void {
    const payload = preset.payload;

    this.form.patchValue({
      productName: payload.productName,
      randomSeed: payload.randomSeed,
      boxesPerCase: payload.boxesPerCase,
      packsPerBox: payload.packsPerBox,
      cardsPerPack: payload.cardsPerPack,
      checklistSize: payload.checklistSize,
      printStrategy: payload.printStrategy,
      slotTypes: payload.slotTypes ?? this.slotOptions,
      guarantees: payload.guarantees,
      simulation: payload.simulation,
    });

    this.syncPackSlots(payload.packSlots);
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();
    // For now we just log the submission payload.

    console.log('Simulation request payload', payload);
  }

  private createPackSlotGroup(slot: PackSlotInit): PackSlotFormGroup {
    return this.fb.nonNullable.group({
      label: this.fb.nonNullable.control(slot.label ?? '', [
        Validators.required,
        Validators.maxLength(80),
      ]),
      type: this.fb.nonNullable.control<SlotType>(slot.type, { validators: [Validators.required] }),
      odds: this.fb.nonNullable.control(slot.odds ?? '', [Validators.required]),
      replaces: this.fb.nonNullable.control<SlotType>(slot.replaces ?? 'base', {
        validators: [Validators.required],
      }),
      notes: this.fb.nonNullable.control(slot.notes ?? ''),
    });
  }

  private syncPackSlots(slots: PackSlotInit[]): void {
    this.packSlots.clear();
    slots.forEach((slot) => this.packSlots.push(this.createPackSlotGroup(slot)));
  }
}
