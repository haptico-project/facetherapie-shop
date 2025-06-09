import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { page } from '$app/stores';
import { get } from 'svelte/store';
import { locale } from '$lib/i18n';
import { backendAccessor } from '$lib/backendAccessor';

export const agencyCode = writable<string | null>(null);

/**
 * 多言語メッセージ取得
 */
function getMessage(lang: string): string {
	if (lang === 'ja') {
		return '代理店コードが不正です。正しいコードを入力してください。';
	}
	return 'Agency code is irregular. Please enter a valid code.';
}

/**
 * クエリストリング優先、なければ sessionStorage
 */
export function initAgencyCode(): void {
	if (!browser) return;

	const lang = get(locale) ?? 'ja';
	const url = get(page).url;
	const queryCode = url.searchParams.get('agencyCode');
	const sessionCode = sessionStorage.getItem('agencyCode');

	if (queryCode) {
		if (queryCode.trim() === '') {
			alert(getMessage(lang));
			return;
		}

		// チェック
		backendAccessor(`/api/v1/shop/agency?code=${queryCode}`, {
			method: 'GET'
		})
			.then(() => {
				sessionStorage.setItem('agencyCode', queryCode);
				agencyCode.set(queryCode);
			})
			.catch(() => {
				alert(getMessage(lang));
			});
	} else if (sessionCode) {
		agencyCode.set(sessionCode);
	}
}

/**
 * 任意の場所から設定する場合
 */
export function setAgencyCode(code: string): void {
	if (!browser) return;

	const lang = get(locale) ?? 'ja';

	if (code.trim() === '') {
		alert(getMessage(lang));
		return;
	}

	// チェック
	backendAccessor(`/api/v1/shop/agency?code=${code}`, {
		method: 'GET'
	})
		.then(() => {
			sessionStorage.setItem('agencyCode', code);
			agencyCode.set(code);
		})
		.catch(() => {
			alert(getMessage(lang));
		});
}
