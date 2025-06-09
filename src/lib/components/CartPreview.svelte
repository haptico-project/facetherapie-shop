<script lang="ts">
	import { cart } from '$lib/stores/cart';
	import { page } from '$app/stores';
	import { locale } from '$lib/i18n';
	import type { CartItem } from '$lib/stores/cart';

	let currentLocale: 'ja' | 'en' = 'ja';
	$: locale.subscribe((v) => (currentLocale = v));

	let items: CartItem[] = [];
	$: cart.subscribe(value => items = value);

	$: total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
	$: isCartPage = $page.url.pathname.startsWith('/cart');

	let isOpen = false;

	const toggle = () => {
		isOpen = !isOpen;
	};

	const removeItem = (id: string) => {
		cart.remove(id);
	};
</script>

{#if items.length > 0 && !isCartPage}
	<section class="bg-white border-b border-color2 px-4 pt-4 pb-4 shadow-sm font-serif text-sm text-textColor transition-all duration-300">
		<!-- ✅ トップバー（小計と矢印） -->
		<div class="flex justify-between items-center">
			<p class="text-base font-medium">
				{currentLocale === 'ja' ? 'カート内小計' : 'Subtotal in cart'} ¥{total.toLocaleString()}
			</p>
			<!-- 鈍角トグル矢印（SVG版） -->
			<button
				on:click={toggle}
				class="w-6 h-6 rounded-full border border-color1 flex items-center justify-center text-color1 hover:bg-color2 transition"
				aria-label="Toggle Cart"
			>
				{#if isOpen}
					<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
						<path d="M7 14l5-5 5 5H7z" />
					</svg> <!-- ▲ -->
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
						<path d="M7 10l5 5 5-5H7z" />
					</svg> <!-- ▼ -->
				{/if}
			</button>

		</div>

		<!-- ✅ 開閉エリア（商品一覧＋リンク） -->
		<div class={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[1000px] mt-4' : 'max-h-0'}`}>
			<ul class="space-y-2">
				{#each items as item (item.id)}
					<li class="flex justify-between items-center border-b border-gray-100 pb-1">
						<div>
							{item.name[currentLocale]}
							<span class="ml-1 text-xs text-gray-500">x{item.quantity}</span>
						</div>
						<div class="flex gap-3 items-center">
							<p class="text-sm">¥{(item.price * item.quantity).toLocaleString()}</p>
							<button
								class="text-xs text-red-500 hover:underline"
								on:click={() => removeItem(item.id)}
							>
								{currentLocale === 'ja' ? '削除' : 'Remove'}
							</button>
						</div>
					</li>
				{/each}
			</ul>

			<div class="mt-4 text-right">
				<a href="/cart" class="text-sm text-linkColor underline hover:opacity-80 transition">
					{currentLocale === 'ja' ? 'カートの中を見る' : 'View Cart'}
				</a>
			</div>
		</div>
	</section>
{/if}
