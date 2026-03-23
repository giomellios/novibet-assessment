import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BrowserStorageService {
  getItem(key: string): string | null {
    return this.withStorage(() => localStorage.getItem(key), null);
  }

  setItem(key: string, value: string): void {
    this.withStorage(() => {
      localStorage.setItem(key, value);
      return undefined;
    }, undefined);
  }

  removeItem(key: string): void {
    this.withStorage(() => {
      localStorage.removeItem(key);
      return undefined;
    }, undefined);
  }

  getJson<T>(key: string): T | null {
    const raw = this.getItem(key);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  setJson(key: string, value: unknown): void {
    try {
      this.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Failed to serialize value for key "${key}"`, e);
    }
  }

  private withStorage<T>(action: () => T, fallback: T): T {
    try {
      return action();
    } catch {
      return fallback;
    }
  }
}
