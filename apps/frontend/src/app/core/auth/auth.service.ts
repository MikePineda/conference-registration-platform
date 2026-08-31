import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { API, TOKEN_KEY } from '../api';
import type { Data } from '@api-starter-kit/backend/data';

export interface SignupPayload {
  fullName: string | null;
  email: string;
  password: string;
  passwordConfirmation: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(API);
  private router = inject(Router);

  currentUser = signal<Data.User | null>(null);
  isAuthenticated = computed(() => this.currentUser() !== null);

  async restoreSession(): Promise<void> {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    try {
      const { data } = await this.api.api.profile.profile.show({});
      this.currentUser.set(data);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  async signup(payload: SignupPayload): Promise<Data.User> {
    const { data } = await this.api.api.auth.newAccount.store({ body: payload });

    localStorage.setItem(TOKEN_KEY, data.token);
    this.currentUser.set(data.user);
    return data.user;
  }

  async login(email: string, password: string): Promise<Data.User> {
    const { data } = await this.api.api.auth.accessTokens.store({
      body: { email, password },
    });

    localStorage.setItem(TOKEN_KEY, data.token);
    this.currentUser.set(data.user);
    return data.user;
  }

  async logout(): Promise<void> {
    try {
      await this.api.api.profile.accessTokens.destroy({});
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      this.currentUser.set(null);
      this.router.navigate(['/login']);
    }
  }
}
