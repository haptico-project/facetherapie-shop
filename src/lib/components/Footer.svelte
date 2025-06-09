<script>
	import { t } from '$lib/i18n';
	import { page } from '$app/stores';

	$: path = $page.url.pathname;

	// ✅ 非表示にしたい条件：/cart や /products/（ただし /products 単体はOK）
	$: shouldHideFooter = path === '/cart' || path.startsWith('/products/') ;
</script>

<footer class={`text-sm text-center py-8 sm:py-12 ${path === '/cart' ? 'pb-24' : 'pb-12'} mt-12`}>
	{#if !shouldHideFooter}
		<div class="max-w-4xl mx-auto">
			<p class="mb-2">{t('footer.copy')}</p>
			<nav class="space-x-4">
<!--				TODO-->
<!--				<a href="/privacy" class="hover:underline">{t('footer.privacy')}</a>-->
<!--				<a href="/terms" class="hover:underline">{t('footer.terms')}</a>-->
			</nav>
		</div>
	{/if}
</footer>
