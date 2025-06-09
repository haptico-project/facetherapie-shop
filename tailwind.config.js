/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				color1: '#C97D7D',        // 主役ピンク
				color2: '#F3E8E7',        // 背景ピンク
				color3: '#B79C6B',        // ゴールドアクセント
				textColor: '#3D2E2E',     // 本文ブラウン
				linkColor: '#3D2E2E',     // 控えめピンク（リンク）
				backgroundColor: '#FFFFFF' // 全体背景白
			},
			fontFamily: {
				en: ['Spartan', 'sans-serif'],
				jp: ['Noto Sans JP', 'sans-serif']
			},
			fontSize: {
				xs: '.75rem',
				sm: '.875rem',
				base: '1rem',
				lg: '1.125rem',
				xl: '1.25rem',
				'2xl': '1.5rem',
				'3xl': '1.875rem',
				'4xl': '2.25rem',
				'5xl': '3rem',
				'6xl': '4rem'
			}
		}
	},
	plugins: []
};
