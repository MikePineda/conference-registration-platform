import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Conferences } from '../../../core/conferences/conferences';
import type { Data } from '@api-starter-kit/backend/data';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, RouterLink, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private conferencesService = inject(Conferences);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  conferences = signal<Data.Conference[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadConferences();
  }

  private async loadConferences() {
    try {
      this.conferences.set(await this.conferencesService.list());
    } catch {
      this.errorMessage.set('Could not load your conferences. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }

  openConference(conference: Data.Conference) {
    this.router.navigate(['/conferences', conference.id, 'edit']);
  }

  async copyLink(conference: Data.Conference, event: Event) {
    // the button lives inside a clickable card: don't navigate to edit
    event.stopPropagation();
    const link = `${location.origin}/c/${conference.publicId}`;
    try {
      await navigator.clipboard.writeText(link);
      this.snackBar.open('Link copied to clipboard', undefined, { duration: 2500 });
    } catch {
      this.snackBar.open(`Copy failed — link: ${link}`, 'OK');
    }
  }
}
