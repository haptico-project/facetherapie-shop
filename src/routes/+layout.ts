// src/routes/+layout.ts
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ url }) => {
	const localeParam = url.searchParams.get('locale');

	// 明示的に locale が指定されている場合
	if (localeParam === 'ja' || localeParam === 'en') {
		return {
			locale: localeParam,
		};
	}

	// 指定がない → クライアントで自動判定する指示を返す
	return {
		locale: null,
	};
};
