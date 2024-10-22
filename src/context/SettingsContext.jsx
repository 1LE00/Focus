import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    // * Set if the timer should start automatically for break and consecutive focus sessions
    const [autoStart, setAutoStart] = useState({
        focus: false,
        break: false
    });
    // * Set state for dark mode
    const [darkTheme, setDarkTheme] = useState(false);
    // * Set state for toggle options
    const [toggle, setToggle] = useState({
        reports: false,
        settings: false,
        options: false
    });
    // * Set notifications options
    const [notificationOptions, setNotificationOptions] = useState({
        enabled: false,
        silent: false
    });
    // * Define the long break interval duration between sessions
    const [longBreakInterval, setLongBreakInterval] = useState(4);
    return (
        <SettingsContext.Provider value={{
            autoStart, setAutoStart, darkTheme, setDarkTheme, toggle, setToggle, notificationOptions, setNotificationOptions,
            longBreakInterval, setLongBreakInterval
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

SettingsProvider.propTypes = {
    children: PropTypes.node.isRequired
};