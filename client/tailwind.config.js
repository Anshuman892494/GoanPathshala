/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Backgrounds
                gray: {
                    900: '#f5f5f5', // Main BG (was dark gray) -> Light Gray
                    800: '#ffffff', // Card/Sidebar BG (was slightly lighter dark gray) -> White
                    700: '#a7b1ac', // Borders (was medium gray) -> Light Gray from palette

                    // Text
                    100: '#132d1f', // Primary Text (was white/light gray) -> Dark Green/Black
                    200: '#132d1f', // Secondary Text -> Same Dark Green
                    300: '#69706c', // Muted Text -> Gray from palette
                    400: '#69706c', // More muted text -> Gray from palette
                    500: '#69706c', // Secondary text -> Gray from palette

                    // Inputs/Forms
                    600: '#a7b1ac', // Input Borders
                },
                // Brand Colors (Red replacements)
                red: {
                    50: '#f7fee7', // Tint
                    100: '#ecfccb', // Tint
                    200: '#d9f99d', // Tint
                    300: '#bef264', // Tint
                    400: '#a3e635', // Tint
                    500: '#84cc16', // Base Green
                    600: '#4e7729', // Primary Action (was Red 600) -> Forest Green
                    700: '#3f6212', // Hover
                    800: '#365314', // Active
                    900: '#1a2e05', // Deep
                },
                // Custom Palette Integration
                primary: '#4e7729',
                secondary: '#69706c',
                accent: '#bbf818', // Lime
                highlight: '#b7e83d', // Lime Green
            }
        },
    },
    plugins: [],
}
