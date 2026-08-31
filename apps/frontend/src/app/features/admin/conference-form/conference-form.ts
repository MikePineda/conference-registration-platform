import { Component, computed, inject, input, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { TuyauHTTPError } from '@tuyau/core/client';
import { Conferences } from '../../../core/conferences/conferences';
import {
  ConfirmDialog,
  ConfirmDialogData,
} from '../../../shared/components/confirm-dialog/confirm-dialog';

function combineDateTime(date: Date, time: Date | null): Date {
  const combined = new Date(date);
  combined.setHours(time?.getHours() ?? 0, time?.getMinutes() ?? 0, 0, 0);
  return combined;
}

@Component({
  selector: 'app-conference-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatTimepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './conference-form.html',
  styleUrl: './conference-form.css',
})
export class ConferenceForm implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private conferences = inject(Conferences);
  private router = inject(Router);

  /** Route param: present in /conferences/:id/edit, absent in /conferences/new */
  id = input<string>();
  isEdit = computed(() => this.id() !== undefined);

  private dialog = inject(MatDialog);

  submitting = signal(false);
  errorMessage = signal<string | null>(null);
  deleting = signal(false);
  imageError = signal(false);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
    startDate: [null as Date | null, [Validators.required]],
    startTime: [null as Date | null, [Validators.required]],
    endDate: [null as Date | null],
    endTime: [null as Date | null],
    capacity: [null as number | null, [Validators.required, Validators.min(1)]],
    location: [''],
    imageUrl: [''],
    description: [''],
  });

  ngOnInit(): void {
    const id = this.id();
    if (id !== undefined) {
      this.loadConference(Number(id));
    }
  }

  private async loadConference(id: number) {
    try {
      const conference = await this.conferences.get(id);
      const start = conference.startDate ? new Date(conference.startDate) : null;
      const end = conference.endDate ? new Date(conference.endDate) : null;
      this.form.patchValue({
        name: conference.name,
        startDate: start,
        startTime: start,
        endDate: end,
        endTime: end,
        capacity: conference.capacity,
        location: conference.location ?? '',
        imageUrl: conference.imageUrl ?? '',
        description: conference.description ?? '',
      });
    } catch {
      this.errorMessage.set('Could not load the conference.');
      this.form.disable();
    }
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    const { name, startDate, startTime, endDate, endTime, capacity, location, imageUrl, description } =
      this.form.getRawValue();
    const payload = {
      name,
      startDate: combineDateTime(startDate!, startTime).toISOString(),
      endDate: endDate ? combineDateTime(endDate, endTime).toISOString() : null,
      capacity: capacity!,
      location: location || null,
      imageUrl: imageUrl || null,
      description: description || null,
    };

    try {
      const id = this.id();
      if (id !== undefined) {
        await this.conferences.update(Number(id), payload);
      } else {
        await this.conferences.create(payload);
      }
      this.router.navigateByUrl('/dashboard');
    } catch (error) {
      if (error instanceof TuyauHTTPError && error.status === 422) {
        const { errors = [] } = error.response as {
          errors?: { field: string; message: string }[];
        };
        for (const { field, message } of errors) {
          this.form.get(field)?.setErrors({ server: message });
        }
      } else {
        this.errorMessage.set('Something went wrong. Please try again.');
      }
    } finally {
      this.submitting.set(false);
    }
  }

  async deleteConference() {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Delete conference?',
        message: `"${this.form.controls.name.value}" and all of its reservations will be permanently deleted. This cannot be undone.`,
        confirmLabel: 'Delete',
        destructive: true,
      } satisfies ConfirmDialogData,
    });

    const confirmed = await firstValueFrom(dialogRef.afterClosed());
    if (!confirmed) return;

    this.deleting.set(true);
    this.errorMessage.set(null);

    try {
      await this.conferences.delete(Number(this.id()));
      this.router.navigateByUrl('/dashboard');
    } catch {
      this.errorMessage.set('Could not delete the conference. Please try again.');
    } finally {
      this.deleting.set(false);
    }
  }
}
