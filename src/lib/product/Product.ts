export interface Product {
	id: string;
	name: {
		ja: string;
		en: string;
	};
	description: {
		ja: string;
		en: string;
	};
	price: number;
	image: string;
	category: {
		ja: string;
		en: string;
	};
	contents?: {
		ja: string[];
		en: string[];
	};
	new: boolean;
	disabled: boolean;
}
