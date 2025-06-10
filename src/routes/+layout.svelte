<script lang="ts">
	import { page } from '$app/stores';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import CartPreview from '$lib/components/CartPreview.svelte';
	import { locale } from '$lib/i18n';
	import { onMount } from 'svelte';
	import '../app.css';

	import { initAgencyCode, agencyCode, setAgencyCode } from '$lib/agency/agencyCode';

	let tempInput = '';
	let currentLocale: 'ja' | 'en' = 'ja';
	$: locale.subscribe((v) => (currentLocale = v));

	$: currentPath = $page.url.pathname;

	onMount(() => {
		initAgencyCode();

		const urlParams = new URLSearchParams(window.location.search);
		const param = urlParams.get('locale');

		if (param === 'ja' || param === 'en') {
			locale.set(param);
		} else {
			const fallback = navigator.language.startsWith('ja') ? 'ja' : 'en';
			locale.set(fallback);
		}
	});
</script>

<div class="min-h-screen flex flex-col font-serif text-gray-900">
	<Header />

	<main class="flex-1">
		{#if $agencyCode === null}
			<div class="border-orange-300 p-4 max-w-lg mx-auto text-sm mt-6">
				<p class="mb-2">
					<b>
						{currentLocale === 'ja'
							? '代理店コードを入力してください。'
							: 'Please enter your agency code.'}
					</b><br />
					<span class="text-xs text-gray-600">
						{currentLocale === 'ja'
							? '※現在、代理店からの紹介のみに制限しております。'
							: 'Currently, access is limited to agency referrals only.'}
					</span>
				</p>
				<input
					bind:value={tempInput}
					placeholder={currentLocale === 'ja' ? '例: 0123' : 'e.g., 0123'}
					class="border px-2 py-1 rounded w-full mb-2"
				/>
				<button
					class="bg-color1 text-white px-4 py-2 rounded text-sm"
					on:click={() => setAgencyCode(tempInput.trim())}
				>
					{currentLocale === 'ja' ? '確定' : 'Confirm'}
				</button>
			</div>
		{:else}
			<CartPreview />

			{#if currentPath !== '/' && currentPath !== '/thanks'}
				<div class="max-w-7xl mx-auto w-full px-4 py-2 mt-4 text-sm text-textColor/70">
					<button
						on:click={() => window.history.back()}
						class="inline-block hover:underline hover:text-color1 transition"
					>
						{currentLocale === 'ja' ? '前の画面に戻る' : 'Back to Previous Page'}
					</button>
				</div>
			{/if}

			<slot />
		{/if}
	</main>

	<Footer />
</div>
