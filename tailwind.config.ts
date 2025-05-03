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
  		colors: {
        // Dark Theme Colors based on the image
        background: 'hsl(240 10% 3.9%)', // Dark Navy/Almost Black
        foreground: 'hsl(0 0% 98%)',     // White/Very Light Gray
        card: {
          DEFAULT: 'hsl(240 6% 10%)',      // Slightly Lighter Dark
          foreground: 'hsl(0 0% 98%)',   // White/Very Light Gray
        },
        popover: {
          DEFAULT: 'hsl(240 10% 3.9%)', // Dark Navy/Almost Black
          foreground: 'hsl(0 0% 98%)',   // White/Very Light Gray
        },
        primary: {
          DEFAULT: 'hsl(262 83% 58%)', // Bright Purple
          foreground: 'hsl(0 0% 100%)', // White
        },
        secondary: {
          DEFAULT: 'hsl(240 4% 12%)',      // Dark Gray/Purple Tint
          foreground: 'hsl(0 0% 90%)',   // Light Gray
        },
        muted: {
          DEFAULT: 'hsl(240 4% 12%)',      // Dark Gray/Purple Tint
          foreground: 'hsl(0 0% 63.9%)',  // Medium Gray
        },
        accent: {
          DEFAULT: 'hsl(262 83% 65%)', // Lighter Purple for Hover/Accent
          foreground: 'hsl(0 0% 100%)', // White
        },
        destructive: {
          DEFAULT: 'hsl(0 72% 51%)',      // Red
          foreground: 'hsl(0 0% 98%)',   // White
        },
        border: 'hsl(240 4% 18%)',        // Subtle Dark Border
        input: 'hsl(240 4% 18%)',          // Subtle Dark Input Background
        ring: 'hsl(262 83% 62%)',        // Slightly lighter Purple for ring
        'cta-purple': 'hsl(262 83% 58%)', // Explicitly define CTA purple if needed outside primary context

        // Chart colors (can keep or adjust)
        chart: {
          '1': 'hsl(262 70% 50%)',
          '2': 'hsl(160 60% 45%)',
          '3': 'hsl(30 80% 55%)',
          '4': 'hsl(280 65% 60%)',
          '5': 'hsl(340 75% 55%)'
        },
        // Sidebar colors (adjust for dark theme)
        sidebar: {
          DEFAULT: 'hsl(240 6% 10%)',
          foreground: 'hsl(0 0% 98%)',
          primary: 'hsl(262 83% 58%)',
          'primary-foreground': 'hsl(0 0% 100%)',
          accent: 'hsl(240 4% 15%)',
          'accent-foreground': 'hsl(0 0% 98%)',
          border: 'hsl(240 4% 18%)',
          ring: 'hsl(262 83% 62%)'
        }
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
  		},
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'], // Add Inter font
      },
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
