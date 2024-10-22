import { createContext, useState } from 'react'
import PropTypes from 'prop-types'

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // * Color name should be the same as in tailwind.config.js colors object
    const colors = [
        { colorName: "focus", value: "#ba4a4a" },
        { colorName: "short", value: "#408bc4" },
        { colorName: "long", value: "#388a53" },
        { colorName: "purple", value: "#a147f05e" },
        { colorName: "gold", value: "#f2af4a99" },
        { colorName: "yellow", value: "#ffd50099" },
        { colorName: "red", value: "#ff634799" },
        { colorName: "blue", value: "#89cfeb99" },
        { colorName: "greens", value: "#80ff8099" },
        { colorName: "pink", value: "#ae66c799" },
        { colorName: "graye", value: "#d4d4d499" },
        { colorName: "peach", value: "#ffdbb899" },
        { colorName: "orange", value: "#ffa77a99" },
        { colorName: "ocean", value: "#4378ad99" },
        { colorName: "teal", value: "#00999999" },
        { colorName: "blackjet", value: "#00999999" },
        { colorName: "charcoal", value: "#00999999" },
        { colorName: "dark", value: "#000000" }
    ];    
    // * Set theme for the app
    const [theme, setTheme] = useState({
        focus: 'focus',
        short: 'short',
        long: 'long',
        dark: 'dark'
    });
    return (
        <ThemeContext.Provider value={{ theme, setTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    )
}

ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired
}


