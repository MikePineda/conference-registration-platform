import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Conferences } from '../../../core/conferences/conferences';
import type { Data } from '@api-starter-kit/backend/data';

@Component({
  selector: 'app-conference-page',
  imports: [DatePipe, MatButtonModule, MatIconModule],
  templateUrl: './conference-page.html',
  styleUrl: './conference-page.css',
})
export class ConferencePage implements OnInit {
  private conferences = inject(Conferences);

  /** Route param from /c/:publicId */
  publicId = input.required<string>();

  conference = signal<Data.Conference | null>(null);
  loading = signal(true);
  notFound = signal(false);

  spotsRemaining = computed(() => {
    const conference = this.conference();
    return conference ? Math.max(conference.capacity - conference.reservationsCount, 0) : 0;
  });

  async ngOnInit() {
    try {
      this.conference.set(await this.conferences.getPublic(this.publicId()));
    } catch {
      this.notFound.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  register() {
    // wired up in the next iteration (reservation form)
  }
}
