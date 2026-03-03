import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  darkMode: ['class'],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      xxxs: '290px',
      xxs: '375px',
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1270px',
      '2xl': '1436px',
      '3xl': '1636px',
      '4xl': '1750px',
      'landscape-xxxs': {
        raw: '(min-width: 290px) and (orientation: landscape)',
      },
      'landscape-xxs': {
        raw: '(min-width: 375px) and (orientation: landscape)',
      },
      'landscape-xs': {
        raw: '(min-width: 480px) and (orientation: landscape)',
      },
      'landscape-sm': {
        raw: '(min-width: 640px) and (orientation: landscape)',
      },
      'landscape-md': {
        raw: '(min-width: 768px) and (orientation: landscape)',
      },
      'landscape-lg': {
        raw: '(min-width: 1024px) and (orientation: landscape)',
      },
      'landscape-xl': {
        raw: '(min-width: 1270px) and (orientation: landscape)',
      },
      'landscape-2xl': {
        raw: '(min-width: 1436px) and (orientation: landscape)',
      },
      'landscape-3xl': {
        raw: '(min-width: 1636px) and (orientation: landscape)',
      },
      'landscape-4xl': {
        raw: '(min-width: 1750px) and (orientation: landscape)',
      },
    },
    extend: {
      fontFamily: {
        primary: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          '50': 'rgb(var(--tw-color-primary-50) / <alpha-value>)',
          '100': 'rgb(var(--tw-color-primary-100) / <alpha-value>)',
          '200': 'rgb(var(--tw-color-primary-200) / <alpha-value>)',
          '300': 'rgb(var(--tw-color-primary-300) / <alpha-value>)',
          '400': 'rgb(var(--tw-color-primary-400) / <alpha-value>)',
          '500': 'rgb(var(--tw-color-primary-500) / <alpha-value>)',
          '600': 'rgb(var(--tw-color-primary-600) / <alpha-value>)',
          '700': 'rgb(var(--tw-color-primary-700) / <alpha-value>)',
          '800': 'rgb(var(--tw-color-primary-800) / <alpha-value>)',
          '900': 'rgb(var(--tw-color-primary-900) / <alpha-value>)',
          '950': 'rgb(var(--tw-color-primary-950) / <alpha-value>)',
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        dark: '#222222',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        'shadcn-primary': {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            opacity: '0.99',
            filter:
              'drop-shadow(0 0 1px rgba(252, 211, 77)) drop-shadow(0 0 15px rgba(245, 158, 11)) drop-shadow(0 0 1px rgba(252, 211, 77))',
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
            opacity: '0.4',
            filter: 'none',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-700px 0',
          },
          '100%': {
            backgroundPosition: '700px 0',
          },
        },
        scale: {
          '0%': {
            transform: 'scale(1)',
          },
          '100%': {
            transform: 'scale(1.1)',
          },
        },
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        flicker: 'flicker 3s linear infinite',
        shimmer: 'shimmer 1.3s linear infinite',
        scale: 'scale 1s ease-out',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
    require('tailwindcss-animated'),
    function ({ addVariant }: any) {
      addVariant('portrait', '@media (orientation: portrait)');
      addVariant('landscape', '@media (orientation: landscape)');
    },
  ],
} satisfies Config;
