tailwind.config = {
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#f2fcf5',
                    100: '#e1f8e8',
                    200: '#c3f0d0', // Added missing shade for smooth gradients
                    300: '#95e2b0', // Added missing shade
                    500: '#10b981', /* Emerald 500 */
                    600: '#059669', /* Emerald 600 */
                    700: '#047857', /* Emerald 700 */
                    800: '#065f46', /* Emerald 800 */
                    900: '#064e3b', /* Emerald 900 */
                },
                gold: {
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                }
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                arabic: ['Amiri', 'serif'],
            },
            backgroundImage: {
                'islamic-pattern': "radial-gradient(#10b981 0.5px, transparent 0.5px), radial-gradient(#10b981 0.5px, #f2fcf5 0.5px)",
            },
            backgroundSize: {
                'islamic-size': '20px 20px',
            },
            backgroundPosition: {
                'islamic-pos': '0 0, 10px 10px',
            }
        }
    }
}   