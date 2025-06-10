// src/lib/stores/locale.ts
import { writable } from 'svelte/store';

export const locale = writable<'ja' | 'en' | null>(null);
