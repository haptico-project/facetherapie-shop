<script lang="ts">
	import { cart } from '$lib/stores/cart';
	export let product;
	export let locale: 'ja' | 'en' = 'ja';

	let isLoading = false;

	const addToCart = async () => {
		isLoading = true;
		await new Promise((res) => setTimeout(res, 500)); // 疑似遅延（APIなど実装時は削除）
		cart.add(product);
		isLoading = false;
	};
</script>

<div class="group border rounded overflow-hidden hover:shadow-md transition bg-white flex flex-col">
	<a href={`/products/${product.id}`} class="block">
		<img
			src={product.image}
			alt={product.name?.[locale] ?? ''}
			class="w-full h-64 object-cover"
		/>
	</a>

	<div class="p-4 flex flex-col gap-2 flex-1">
		<h3 class="text-lg font-light group-hover:underline">
			{product.name?.[locale] ?? '―'}
		</h3>
		<p class="text-sm text-gray-500">
			{product.category?.[locale] ?? '―'}
		</p>
		<p class="mt-1 text-color1 font-medium">
			¥{product.price.toLocaleString()}
		</p>

		<!-- カートに追加ボタン -->
		<button
			class="mt-auto text-sm text-white bg-color1 hover:opacity-90 rounded py-2 px-4 transition flex items-center justify-center gap-2 disabled:opacity-50"
			on:click={addToCart}
			disabled={isLoading}
		>
			{#if isLoading}
				<svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor"
								d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"></path>
				</svg>
			{:else}
				{locale === 'ja' ? 'カートに追加' : 'Add to Cart'}
			{/if}
		</button>
	</div>
</div>
