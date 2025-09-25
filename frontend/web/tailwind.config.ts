import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/globals.css", // assuming this is where your scrollbar classes are defined
		"./src/**/*.{js,ts,jsx,tsx,mdx}", // add this line to include all files
		"./src/**/*.{js,ts,jsx,tsx}"
	],

	darkMode: "class",

	// safelist: 'greedy', // or 'full' depending on your needs

	// safelist: [
	// 	"scrollbar-thin",
	// 	"scrollbar-thumb-muted",
	// 	"scrollbar-track-transparent",
	// ],

	plugins: [
		require("tailwindcss-animate"),
		// require("tailwind-scrollbar"),
		require("@tailwindcss/typography"),
	],
};

export default config;