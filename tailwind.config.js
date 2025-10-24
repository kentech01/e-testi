import { defineConfig } from '@tailwindcss/node';

export default defineConfig({
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--color-background))',
        foreground: 'hsl(var(--color-foreground))',
        card: {
          DEFAULT: 'hsl(var(--color-card))',
          foreground: 'hsl(var(--color-card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--color-popover))',
          foreground: 'hsl(var(--color-popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--color-primary))',
          foreground: 'hsl(var(--color-primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--color-secondary))',
          foreground: 'hsl(var(--color-secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--color-muted))',
          foreground: 'hsl(var(--color-muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--color-accent))',
          foreground: 'hsl(var(--color-accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--color-destructive))',
          foreground: 'hsl(var(--color-destructive-foreground))',
        },
        border: 'hsl(var(--color-border))',
        input: 'hsl(var(--color-input))',
        ring: 'hsl(var(--color-ring))',
        // Custom brand colors
        'blue-500': 'hsl(var(--color-blue-500))',
        'blue-600': 'hsl(var(--color-blue-600))',
        'green-500': 'hsl(var(--color-green-500))',
        'purple-500': 'hsl(var(--color-purple-500))',
        'purple-600': 'hsl(var(--color-purple-600))',
        'orange-500': 'hsl(var(--color-orange-500))',
        'yellow-500': 'hsl(var(--color-yellow-500))',
        'gray-100': 'hsl(var(--color-gray-100))',
        'gray-200': 'hsl(var(--color-gray-200))',
        'gray-300': 'hsl(var(--color-gray-300))',
        'gray-400': 'hsl(var(--color-gray-400))',
        'gray-500': 'hsl(var(--color-gray-500))',
        'gray-600': 'hsl(var(--color-gray-600))',
        'gray-700': 'hsl(var(--color-gray-700))',
        'gray-800': 'hsl(var(--color-gray-800))',
        'gray-900': 'hsl(var(--color-gray-900))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
});
