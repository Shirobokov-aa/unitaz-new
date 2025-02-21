import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontSize: {
  			header: [
  				'20px',
  				{
  					fontWeight: '400',
  					lineHeight: '150%',
  					letterSpacing: '0.6px'
  				}
  			],
  			headerBurger: [
  				'36px',
  				{
  					fontWeight: '400',
  					letterSpacing: '-1.08px'
  				}
  			],
  			h2: [
  				'64px',
  				{
  					lineHeight: '110%',
  					fontWeight: '400',
  					letterSpacing: '0px'
  				}
  			],
  			h2Lg: [
  				'36px',
  				{
  					lineHeight: '120%',
  					fontWeight: '400',
  					letterSpacing: '0px'
  				}
  			],
  			desc: [
  				'20px',
  				{
  					lineHeight: '130%',
  					fontWeight: '300',
  					letterSpacing: '0px'
  				}
  			],
  			colH2: [
  				'36px',
  				{
  					lineHeight: '150%',
  					fontWeight: '600',
  					letterSpacing: '0px'
  				}
  			],
  			colH2Lg: [
  				'36px',
  				{
  					lineHeight: '120%',
  					fontWeight: '400',
  					letterSpacing: '0px'
  				}
  			]
  		},
  		maxWidth: {
  			'1440': '1440px'
  		},
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
