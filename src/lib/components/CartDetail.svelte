<script lang="ts">
	import { cart } from '$lib/stores/cart';
	import { locale } from '$lib/i18n';
	import type { CartItem } from '$lib/stores/cart';
	import { get } from 'svelte/store';
	import { agencyCode } from '$lib/agency/agencyCode';
	import { page } from '$app/stores';
	import { postCheckout } from '$lib/checkoutAccessor';

	let currentLocale: 'ja' | 'en' = 'ja';
	$: locale.subscribe(v => currentLocale = v);

	let items: CartItem[] = [];
	$: cart.subscribe(value => items = value);

	$: total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

	let isProcessing = false;

	const updateQuantity = (id: string, quantity: number) => {
		cart.updateQuantity(id, quantity);
	};

	const removeItem = (id: string) => {
		cart.remove(id);
	};

	const clearCart = () => {
		cart.clear();
	};

	const goToCheckout = async () => {
		isProcessing = true;

		const code = get(agencyCode);
		const orderProducts = items.map(item => ({
			productId: item.id,
			quantity: item.quantity
		}));

		if (!code || orderProducts.length === 0) {
			alert(currentLocale === 'ja'
				? 'カートまたは代理店コードが未設定です。'
				: 'Cart or agency code is not set.');
			isProcessing = false;
			return;
		}

		const currentUrl = get(page).url;
		const baseUrl = `${window.location.origin}${currentUrl.pathname}${currentUrl.search}`;

		try {
			const res = await postCheckout('/api/v1/checkout/payment-url', {
				checkoutSuccessUrl: baseUrl,
				checkoutCancelUrl: baseUrl,
				agencyCode: code,
				orderProducts
			});

			// ✅ window.location.hrefで外部リダイレクト
			if (res) {
				window.location.href = res as string;
			} else {
				alert(currentLocale === 'ja'
					? 'リダイレクト先が取得できませんでした。'
					: 'Redirect URL not available.');
			}
		} catch (err) {
			console.error(err);
			alert(currentLocale === 'ja'
				? '決済処理中にエラーが発生しました。'
				: 'Checkout error occurred.');
		} finally {
			isProcessing = false;
		}
	};
</script>


<div class="max-w-4xl mx-auto px-4 py-8 font-serif text-textColor pb-32 md:pb-12">
	<div class="flex justify-between items-center mb-8">
		<h1 class="text-2xl font-light">
			{currentLocale === 'ja' ? 'カートの中身' : 'Your Cart'}
		</h1>
		{#if items.length > 0}
			<button
				on:click={clearCart}
				class="text-sm text-red-500 hover:underline"
			>
				{currentLocale === 'ja' ? 'カートを空にする' : 'Clear Cart'}
			</button>
		{/if}
	</div>

	{#if items.length === 0}
		<p class="text-gray-500 text-sm">
			{currentLocale === 'ja' ? 'カートは空です。' : 'Your cart is empty.'}
		</p>
	{:else}
		<ul class="space-y-8">
			{#each items as item (item.id)}
				<li class="flex flex-col sm:flex-row gap-4 items-start border-b border-gray-100 pb-6">
					<img
						src={item.image}
						alt={item.name[currentLocale]}
						class="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded border flex-shrink-0"
					/>

					<!-- ✅ 商品情報 -->
					<div class="flex-1 text-sm space-y-2 w-[100%] ">
						<h2 class="font-medium text-base">{item.name[currentLocale]}</h2>
						<p class="text-gray-500">{item.category?.[currentLocale]}</p>

						<div class="flex items-center gap-3 flex-wrap">
							<p class="text-color1">¥{item.price.toLocaleString()}</p>
							<select
								bind:value={item.quantity}
								on:change={(e) => updateQuantity(item.id, +e.target.value)}
								class="border rounded px-2 py-1 text-sm"
							>
								{#each Array(99).fill(0).map((_, i) => i + 1) as q}
									<option value={q}>{q}</option>
								{/each}
							</select>
						</div>

						<!-- ✅ 小計と削除：右寄せ -->
						<div class="flex justify-between items-center mt-1">
							<p class="text-gray-600">
								{currentLocale === 'ja' ? '小計' : 'Subtotal'}: ¥{(item.price * item.quantity).toLocaleString()}
							</p>
							<div class="ml-auto">
								<button
									on:click={() => removeItem(item.id)}
									class="text-xs text-red-500 hover:underline"
								>
									{currentLocale === 'ja' ? '削除' : 'Remove'}
								</button>
							</div>
						</div>
					</div>

				</li>
			{/each}
		</ul>

		<!-- ✅ 合計と決済ボタン -->
		<div class="hidden md:block mt-12 border-t pt-6">
			<p class="text-lg font-medium mb-4">
				{currentLocale === 'ja' ? '小計' : 'Subtotal'}: ¥{total.toLocaleString()}
			</p>
			<button
				on:click={goToCheckout}
				class="w-full bg-color1 text-white py-3 rounded hover:opacity-90 transition text-sm flex justify-center items-center"
				disabled={isProcessing}
			>
				{#if isProcessing}
					<svg class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
							 viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"></path>
					</svg>
					{currentLocale === 'ja' ? '処理中...' : 'Processing...'}
				{:else}
					{currentLocale === 'ja' ? '決済に進む' : 'Proceed to Checkout'}
				{/if}
			</button>
		</div>
	{/if}
</div>

<!-- ✅ フッター固定ボタン（モバイル時のみ） -->
{#if items.length > 0}
	<div class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-4 shadow-md md:hidden">
		<div class="max-w-4xl mx-auto flex flex-col gap-3">
			<p class="text-base font-medium text-textColor">
				{currentLocale === 'ja' ? '小計' : 'Subtotal'}: ¥{total.toLocaleString()}
			</p>
			<button
				on:click={goToCheckout}
				class="w-full bg-color1 text-white py-3 rounded hover:opacity-90 transition text-sm flex justify-center items-center"
				disabled={isProcessing}
			>
				{#if isProcessing}
					<svg class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
							 viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"></path>
					</svg>
					{currentLocale === 'ja' ? '処理中...' : 'Processing...'}
				{:else}
					{currentLocale === 'ja' ? '決済に進む' : 'Proceed to Checkout'}
				{/if}
			</button>

		</div>
	</div>
{/if}

