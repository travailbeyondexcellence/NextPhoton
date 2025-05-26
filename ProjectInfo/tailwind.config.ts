import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
//   darkMode: 'class', // Enable class-based dark mode
  theme: {
  	extend: {
  		
  	}
  },
	plugins: [
		require("tailwindcss-animate"),
		require('tailwind-scrollbar'),
		require('@tailwindcss/typography')
	],
	
	  
};
export default config;
