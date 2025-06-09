<script lang="ts">
	import { fade } from 'svelte/transition';
	import { locale } from '$lib/i18n';
	import type { Product } from '$lib/product/Product';
	import { cart } from '$lib/stores/cart';
	import type { CartItem } from '$lib/stores/cart';

	export let product: Product;

	let currentLocale: 'ja' | 'en' = 'ja';
	$: locale.subscribe(v => currentLocale = v);

	let quantity = 1;
	let cartItems: CartItem[] = [];
	$: cart.subscribe(items => cartItems = items);
	$: alreadyInCart = cartItems.some(item => item.id === product.id);

	let isLoading = false;

	async function handleAddToCart() {
		isLoading = true;
		await new Promise((res) => setTimeout(res, 300));
		for (let i = 0; i < quantity; i++) {
			cart.add(product);
		}
		isLoading = false;
	}

	const images = [product.image, ...(product.images ?? [])];
	let selectedImageIndex = 0;
</script>

<!-- ✅ フェードイン適用 -->
<div class="bg-backgroundColor text-textColor font-serif" transition:fade={{ duration: 400 }}>
	<div class="max-w-7xl mx-auto px-4 md:py-12 sm:py-4 grid grid-cols-1 md:grid-cols-2 gap-12">
		<!-- 左カラム：画像ギャラリー -->
		<div class="space-y-6 mt-4">
			<img
				src={images[selectedImageIndex]}
				alt={product.name[currentLocale]}
				class="w-full rounded border object-cover"
			/>

			{#if images.length > 1}
				<div class="flex gap-3 overflow-x-auto">
					{#each images as img, i}
						<img
							src={img}
							alt="thumb"
							class="w-20 h-20 object-cover rounded border cursor-pointer transition-all {selectedImageIndex === i ? 'border-color1' : 'border-gray-200'}"
							on:click={() => selectedImageIndex = i}
						/>
					{/each}
				</div>
			{/if}
		</div>

		<!-- 右カラム：商品情報 -->
		<div class="flex flex-col gap-6">
			<div>
				<h1 class="text-2xl md:text-3xl font-light tracking-wide">{product.name[currentLocale]}</h1>
				<p class="mt-2 text-lg font-semibold text-color1">¥{product.price.toLocaleString()}</p>
			</div>

			<p class="text-sm text-textColor/80 leading-relaxed whitespace-pre-wrap">
				{product.description[currentLocale]}
			</p>

			{#if product.contents?.[currentLocale]?.length}
				<div>
					<h2 class="text-sm font-semibold mb-1">
						{currentLocale === 'ja' ? 'セット内容' : 'Included Items'}
					</h2>
					<ul class="list-disc list-inside text-sm text-textColor/90">
						{#each product.contents[currentLocale] as item}
							<li>{item}</li>
						{/each}
					</ul>
				</div>
			{/if}

			<!-- 数量選択 -->
			<div class="flex items-center gap-3">
				<label for="qty" class="text-sm">{currentLocale === 'ja' ? '数量' : 'Quantity'}</label>
				<select id="qty" bind:value={quantity} class="border rounded px-2 py-1 text-sm">
					{#each Array(10).fill(0).map((_, i) => i + 1) as q}
						<option value={q}>{q}</option>
					{/each}
				</select>
			</div>

			<!-- 警告 -->
			{#if alreadyInCart}
				<p class="text-xs text-orange-600">
					{currentLocale === 'ja'
						? 'この商品はすでにカートに追加されています。'
						: 'This item is already in your cart.'}
				</p>
			{/if}

			<!-- スマホ：下部固定 -->
			<div class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-4 sm:hidden">
				<button
					on:click={handleAddToCart}
					class="w-full bg-color1 text-white py-3 px-6 rounded hover:opacity-90 transition text-sm tracking-wide flex items-center justify-center gap-2"
					disabled={isLoading}
				>
					{#if isLoading}
						<span class="animate-spin rounded-full border-2 border-white border-t-transparent w-4 h-4"></span>
					{:else}
						{currentLocale === 'ja' ? 'カートに追加' : 'Add to Cart'}
					{/if}
				</button>
			</div>

			<!-- PC：通常ボタン -->
			<div class="pt-6 mt-auto hidden sm:block">
				<button
					on:click={handleAddToCart}
					class="w-full bg-color1 text-white py-3 px-6 rounded hover:opacity-90 transition text-sm tracking-wide flex items-center justify-center gap-2"
					disabled={isLoading}
				>
					{#if isLoading}
						<span class="animate-spin rounded-full border-2 border-white border-t-transparent w-4 h-4"></span>
					{:else}
						{currentLocale === 'ja' ? 'カートに追加' : 'Add to Cart'}
					{/if}
				</button>
			</div>
		</div>
	</div>
</div>

<style>
    .animate-spin {
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
</style>
