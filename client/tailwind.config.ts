import type { Config } from "tailwindcss";

const config: Config = {
	content: {
		files: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		],
		
		safelist: [
			"scrollbar-thin",
			"scrollbar-thumb-muted",
			"scrollbar-track-transparent"
		],


	},

	darkMode: "class",

	plugins: [
		require("tailwindcss-animate"),
		require('tailwind-scrollbar'),
		require('@tailwindcss/typography')
	],


};
export default config;
