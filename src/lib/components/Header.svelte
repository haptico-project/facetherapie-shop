<script lang="ts">
	import { locale, t } from '$lib/i18n';
	import { cart } from '$lib/stores/cart';
	import { agencyCode } from '$lib/agency/agencyCode';
	import { get } from 'svelte/store';

	let currentLocale: 'ja' | 'en' = get(locale);
	$: locale.subscribe(v => currentLocale = v);

	const changeLang = (e: Event) => {
		const selected = (e.target as HTMLSelectElement).value as 'ja' | 'en';
		locale.set(selected);

		const url = new URL(location.href);
		url.searchParams.set('locale', selected);
		url.searchParams.delete('lang'); // 古いキー削除
		location.href = url.toString();
	};

	let cartCount = 0;
	$: cart.subscribe(items => {
		cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
	});
</script>

<svelte:head>
	<link href="https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css" rel="stylesheet">
</svelte:head>

<header
	class="sticky top-0 z-50 bg-backgroundColor/80 backdrop-blur border-b border-color3 text-textColor font-serif text-sm">
	<!-- 上部ナビ -->
	<div class="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
		<a href="/" class="text-xl tracking-widest font-light text-color1">FACETHERAPIE</a>

		<!-- ナビゲーション -->
		<nav class="hidden md:flex gap-8 items-center">
			<a href="/" class="hover:underline">{t('nav.home')}</a>
			<a href="/products" class="hover:underline">{t('nav.products')}</a>
			<a href="{`https://airumx.com/?agencyCode=${$agencyCode}}`}" target="_blank">{t('hero.subscription-link')}<i class="mdi mdi-open-in-new"></i></a>
			<!--			<a href="/about" class="hover:underline">{t('nav.about')}</a>-->
		</nav>

		<!-- 右側：言語切替＋カート -->
		<div class="flex items-center gap-4">

			<a href="/cart" class="relative inline-block">
				<span class="text-xl">🛒</span>
				{#if cartCount > 0}
					<span
						class="absolute -top-2 -right-2 text-xs bg-color1 text-white rounded-full w-5 h-5 flex items-center justify-center">
						{cartCount}
					</span>
				{/if}
			</a>

			<select
				class="border border-color1 rounded px-2 py-1 text-xs bg-transparent text-textColor hover:cursor-pointer"
				on:change={changeLang}
				bind:value={currentLocale}
			>
				<option value="ja">JA</option>
				<option value="en">EN</option>
			</select>

		</div>

	</div>

	<div class="flex mx-6 mb-2 items-center justify-between">
		<!-- ✅ スマホ専用ナビゲーション -->
		<div class="flex gap-4 md:hidden text-xs">
			<a href="/" class="hover:underline hover:text-color1 transition">
				{currentLocale === 'ja' ? 'ホーム' : 'Home'}
			</a>
			<a href="/products" class="hover:underline hover:text-color1 transition">
				{currentLocale === 'ja' ? '商品一覧' : 'Products'}
			</a>
			<a href="{`https://airumx.com/?agencyCode=${$agencyCode}}`}" target="_blank">{t('hero.subscription-link')}<i class="mdi mdi-open-in-new"></i></a>
		</div>
		<!-- ✅ 代理店コード表示 -->
		{#if $agencyCode}
		<span class="text-xs text-gray-500 ml-auto">
			{currentLocale === 'ja' ? 'shop code: ' : 'Shop code: '}
<!--			<span class="font-semibold underline"><a href={`https://liff.line.me/2007233135-vxLAjokB?shopCode=${$agencyCode}`}>{$agencyCode}</a></span>-->
			<span class="font-semibold underline">{$agencyCode}</span>
		</span>
		{/if}
	</div>

</header>
