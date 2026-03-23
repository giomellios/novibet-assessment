import { inject, Injectable } from '@angular/core';
import { STORAGE_KEYS } from '../constants/app.constants';
import { BrowserStorageService } from './browser-storage.service';

interface CachedGuestSession {
  id: string;
  expiresAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class GuestSessionStorageService {
  private readonly storageKey = STORAGE_KEYS.tmdbGuestSession;

  private readonly browserStorageService = inject(BrowserStorageService);

  getValidSessionId(now = Date.now()): string | null {
    const cachedSession = this.getCachedSession();
    if (!cachedSession) {
      return null;
    }

    const expiresAtMs = new Date(cachedSession.expiresAt).getTime();
    if (!Number.isFinite(expiresAtMs) || expiresAtMs <= now) {
      this.clear();
      return null;
    }

    return cachedSession.id;
  }

  save(sessionId: string, expiresAt: string): void {
    const payload: CachedGuestSession = { id: sessionId, expiresAt };
    this.browserStorageService.setJson(this.storageKey, payload);
  }

  clear(): void {
    this.browserStorageService.removeItem(this.storageKey);
  }

  private getCachedSession(): CachedGuestSession | null {
    const parsed = this.browserStorageService.getJson<Partial<CachedGuestSession>>(this.storageKey);
    if (!parsed) {
      return null;
    }

    if (typeof parsed.id !== 'string' || typeof parsed.expiresAt !== 'string') {
      this.clear();
      return null;
    }

    return { id: parsed.id, expiresAt: parsed.expiresAt };
  }
}