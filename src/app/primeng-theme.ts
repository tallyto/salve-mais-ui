import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const SalveMaisTheme = definePreset(Aura, {
  semantic: {
    primary: {
      50:  '#e0f2f1',
      100: '#b2dfdb',
      200: '#80cbc4',
      300: '#4db6ac',
      400: '#26a69a',
      500: '#009688',
      600: '#00897b',
      700: '#00796b',
      800: '#00695c',
      900: '#004d40',
      950: '#003d33'
    },

    colorScheme: {
      light: {
        surface: {
          0:   '#ffffff',
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        }
      },
      dark: {
        surface: {
          0:   '#ffffff',
          50:  '#f8fafc',
          100: '#e2e8f0',
          200: '#94a3b8',
          300: '#64748b',
          400: '#475569',
          500: '#334155',
          600: '#1e2d40',
          700: '#172236',
          800: '#111827',
          900: '#0d1520',
          950: '#07101a'
        }
      }
    }
  },

  components: {
    button: {
      borderRadius: '8px',
      sm: { fontSize: '0.8125rem' },
      lg: { fontSize: '1rem' }
    },
    card: {
      borderRadius: '12px',
      shadow: '0 1px 3px 0 rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)'
    },
    inputtext: {
      borderRadius: '8px'
    },
    select: {
      borderRadius: '8px'
    },
    datepicker: {
      borderRadius: '8px'
    },
    dialog: {
      borderRadius: '14px'
    },
    tag: {
      borderRadius: '6px'
    }
  }
});
