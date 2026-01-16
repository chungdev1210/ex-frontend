import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

// Diamond theme preset - inspired by PrimeNG Diamond template
const DiamondPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#eef2ff',
            100: '#e0e7ff',
            200: '#c7d2fe',
            300: '#a5b4fc',
            400: '#818cf8',
            500: '#6366f1',
            600: '#4f46e5',
            700: '#4338ca',
            800: '#3730a3',
            900: '#312e81',
            950: '#1e1b4b'
        },
        colorScheme: {
            light: {
                primary: {
                    color: '#4f46e5',
                    contrastColor: '#ffffff',
                    hoverColor: '#4338ca',
                    activeColor: '#3730a3'
                },
                highlight: {
                    background: '#4f46e5',
                    focusBackground: '#4338ca',
                    color: '#ffffff',
                    focusColor: '#ffffff'
                },
                surface: {
                    0: '#ffffff',
                    50: '#f8fafc',
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
                primary: {
                    color: '#818cf8',
                    contrastColor: '#1e293b',
                    hoverColor: '#a5b4fc',
                    activeColor: '#c7d2fe'
                },
                highlight: {
                    background: '#818cf8',
                    focusBackground: '#a5b4fc',
                    color: '#1e293b',
                    focusColor: '#1e293b'
                },
                surface: {
                    0: '#ffffff',
                    50: '#fafafa',
                    100: '#f4f4f5',
                    200: '#e4e4e7',
                    300: '#d4d4d8',
                    400: '#a1a1aa',
                    500: '#71717a',
                    600: '#52525b',
                    700: '#3f3f46',
                    800: '#27272a',
                    900: '#18181b',
                    950: '#09090b'
                }
            }
        }
    }
});

export default DiamondPreset;
