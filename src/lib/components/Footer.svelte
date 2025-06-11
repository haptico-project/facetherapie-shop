<script>
	import { t } from '$lib/i18n';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { agencyCode } from '$lib/agency/agencyCode';

	$: path = $page.url.pathname;

	// ✅ 非表示にしたい条件：/cart や /products/（ただし /products 単体はOK）
	$: shouldHideFooter = path === '/cart' || path.startsWith('/products/') ;

	$: shopCode = get(agencyCode);
</script>

<footer class={`text-sm text-center py-8 sm:py-12 ${path === '/cart' ? 'pb-24' : 'pb-12'} mt-12`}>
	{#if !shouldHideFooter}
		<div class="max-w-4xl mx-auto">
			<p class="mb-2">{t('footer.copy')}</p>
			<nav class="space-x-4">
<!--				TODO-->
<!--				<a href="/privacy" class="hover:underline">{t('footer.privacy')}</a>-->
<!--				<a href="/terms" class="hover:underline">{t('footer.terms')}</a>-->
				{#if shopCode}
					<a href={`https://liff.line.me/2007233135-vxLAjokB?shopCode=${shopCode}`}>お問い合わせ</a>
				{/if}
			</nav>
		</div>
	{/if}
</footer>
