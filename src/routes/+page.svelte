<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { locale, t } from '$lib/i18n';
	import { fetchNewProducts } from '$lib/product/ProductFetcher';
	import type { Product } from '$lib/product/Product';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import { get } from 'svelte/store';

	let currentLocale: 'ja' | 'en' = 'ja';
	let newProducts: Product[] = [];
	let ready = false;

	onMount(async () => {
		currentLocale = get(locale);
		newProducts = await fetchNewProducts();
		ready = true;
	});
</script>

{#if ready}
	<div class="bg-backgroundColor text-textColor font-serif" transition:fade>
		<!-- Hero Section -->
		<section class="max-w-7xl mx-auto md:px-6 md:pt-8 pb-12">
			<div class="w-full aspect-[3/2] overflow-hidden shadow-sm">
				<img src="/images/top.jpg"
						 alt="facetherapie Hero"
						 class="w-full h-full object-cover object-center" />
			</div>
			<div class="mt-12 text-center">
				<p class="mt-4 text-base md:text-lg text-textColor opacity-80">{t('hero.subtitle')}</p>
				<h1 class="text-3xl md:text-4xl font-light tracking-wide text-textColor">{t('hero.title')}</h1>
				<a href="/products"
					 class="inline-block mt-6 text-sm text-linkColor border-b border-color3 hover:opacity-70 transition">
					{t('hero.link')}
				</a>
			</div>
		</section>

		<!-- 新商品セクション -->
		<section class="max-w-6xl mx-auto px-6 pb-24">
			<h2 class="text-xl md:text-2xl font-light tracking-wide border-b border-color3 pb-4 mb-10 text-textColor">
				{t('section.new')}
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-12">
				{#each newProducts as product}
					<ProductCard {product} locale={currentLocale} />
				{/each}
			</div>
		</section>
	</div>
{/if}
