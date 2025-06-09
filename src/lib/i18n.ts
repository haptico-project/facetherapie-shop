import { writable } from 'svelte/store';
import ja from './locale/ja.json';
import en from './locale/en.json';

export const locale = writable<'ja' | 'en'>('ja');

const dictionaries = {
	ja,
	en,
};

export const t = (key: string): string => {
	let current = 'ja';
	locale.subscribe(value => current = value)();
	return dictionaries[current][key] ?? key;
};
