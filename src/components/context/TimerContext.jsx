import { createContext, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
    /*  
        * Store the active button as number
        * 1 would be 'focus button'
        * 2 would be 'short break button'
        * 3 would be 'long break button'
    */
    const [activeButton, setActiveButton] = useState(1);
    // * Define the amount of hrs in minutes for focus and breaks 
    const [minutes, setMinutes] = useState({
        focus: 25,
        short: 5,
        long: 15
    });
    // * Storing the initial values of minutes in ref to compare later
    const initialMinutesStateRef = useRef(minutes);
    // * Track changes in user preferences settings(minutes) for specific session
    const [changesIn, setChangesIn] = useState({
        focus: false,
        short: false,
        long: false
    });
    // * Set changesIn as per the changes in the input field by comparing it with it's initial state
    // * Return true if they do not match, false otherwise
    useEffect(() => {
        // * Creating a new object to avoid repeatation of logic for each property
        // * and updating the state all at once rather than multiple calls within if statements 
        const newChanges = {
            focus: initialMinutesStateRef.current.focus !== minutes.focus,
            short: initialMinutesStateRef.current.short !== minutes.short,
            long: initialMinutesStateRef.current.long !== minutes.long
        };
        setChangesIn(newChanges);
    }, [minutes]);
    // * Set the count for completed focus sessions
    const [sessionCount, changeSessionCount] = useState({
        focus: Number.parseInt(localStorage.getItem("Sessions Completed")) || 1,
        break: Number.parseInt(localStorage.getItem("Sessions Completed")) || 1
    });
    // * Keep track of timer if it has ran before automatically starting breaks and focus sessions
    const [tracker, setTracker] = useState({ didTimerRun: false, isPaused: false });

    return (
        <TimerContext.Provider value={{
            activeButton, setActiveButton, sessionCount, changeSessionCount, minutes, setMinutes, tracker, setTracker, initialMinutesStateRef, changesIn, setChangesIn
        }}>
            {children}
        </TimerContext.Provider>
    );
};

TimerProvider.propTypes = {
    children: PropTypes.node.isRequired
};