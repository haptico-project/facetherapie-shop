<script lang="ts">
	import { page } from '$app/stores';
	import { locale, t } from '$lib/i18n';

	let currentLocale: 'ja' | 'en' = 'ja';
	$: locale.subscribe((v) => (currentLocale = v));

	// ✅ リアクティブにURLを監視
	$: segments = $page.url.pathname.split('/').filter(Boolean);
</script>

{#if segments.length > 0}
	<nav class="text-xs px-6 pb-2 mt-4 max-w-7xl mx-auto w-full font-serif">
		<ol class="flex gap-2 items-center text-textColor">
			<li><a href="/" class="hover:underline">{t('nav.home')}</a></li>

			{#if segments[0] === 'products'}
				<li>›</li>
				<li><a href="/products" class="hover:underline">{t('nav.products')}</a></li>
			{:else if segments[0] === 'about'}
				<li>›</li>
				<li><a href="/about" class="hover:underline">{t('nav.about')}</a></li>
			{/if}
		</ol>
	</nav>
{/if}
