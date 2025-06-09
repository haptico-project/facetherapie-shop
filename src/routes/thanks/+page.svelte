<script lang="ts">
	import { locale } from '$lib/i18n';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import { cart } from '$lib/stores/cart';

	const currentLocale = get(locale);

	onMount(() => {
		cart.clear()
	})
</script>

<div class="max-w-2xl mx-auto px-6 py-16 text-textColor font-serif text-center">
	<h1 class="text-2xl md:text-3xl font-light mb-6">
		{currentLocale === 'ja' ? 'お買い上げありがとうございます。' : 'Thank you for your purchase!'}
	</h1>
	<p class="text-sm md:text-base text-textColor/80 mb-10 leading-relaxed">
		{currentLocale === 'ja'
			? 'ご注文が完了しました。'
			: 'Your order has been completed.'}
	</p>

	<a
		href="/"
		class="inline-block text-sm text-white bg-color1 hover:opacity-90 transition px-6 py-3 rounded"
	>
		{currentLocale === 'ja' ? 'トップページへ戻る' : 'Return to Home'}
	</a>
</div>
