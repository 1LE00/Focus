import { useContext, useEffect, useState } from "react";
import { TimerContext } from "./context/TimerContext";
import { SettingsContext } from "./context/SettingsContext";


export const Timer = () => {
    const {
        minutes, activeButton, setActiveButton, sessionCount, changeSessionCount, tracker, setTracker, initialMinutesStateRef, changesIn, setChangesIn
    } = useContext(TimerContext);

    const {
        autoStart, notificationOptions, toggle, longBreakInterval
    } = useContext(SettingsContext);

    const [isActive, setIsActive] = useState(false);     // track if the timer is active or not 
    const [intervalId, setIntervalId] = useState(null);  // store the interval id
    const [timer, setTimer] = useState({                 // keep track of timer 
        minutes: minutes.focus,
        seconds: 0
    });
    // * Switch between focus and break sessions using sessionID to keep track of them
    const [session, changeSession] = useState({
        sessionID: null
    });
    /*
        @func Select the correct session based on buttonId
            ? If buttonId === 1 session should be 'focus'
            ? If buttonId === 2 session should be 'short break'
            ? If buttonId === 3 session should be 'long break'
    */
    const chooseCorrectSession = (buttonId) => {
        if (buttonId === 1) {
            return {
                seconds: 0,
                minutes: minutes.focus
            }
        } else if (buttonId === 2) {
            return {
                seconds: 0,
                minutes: minutes.short
            }
        } else {
            return {
                seconds: 0,
                minutes: minutes.long
            }
        }
    };
    // @func to switch between focus and break sessions
    const handleButtonCLick = (buttonId) => {
        // * Set it to false so that focus or break session doesn't start after 
        // * they are automated
        setTracker({ didTimerRun: false, isPaused: false });
        setActiveButton(buttonId);
        if (isActive) {
            setIsActive(false);
            clearInterval(intervalId);
        }
        setIntervalId(null);
        setTimer(() => {
            return chooseCorrectSession(buttonId);
        });
    };
    // @func to start the timer
    const startTimer = () => {
        if (!isActive && intervalId == null) {
            setIsActive(true);
            const id = setInterval(() => {
                setTimer(prevTimer => {
                    if (prevTimer.seconds > 0) {
                        return {
                            ...prevTimer,
                            seconds: prevTimer.seconds - 1
                        };
                    } else if (prevTimer.minutes > 0) {
                        return {
                            minutes: prevTimer.minutes - 1,
                            seconds: 59
                        };
                    } else {
                        clearInterval(id);
                        setIsActive(false);
                        updateSession();
                        return { minutes: 0, seconds: 0 }
                    }
                });
            }, 1000);
            setIntervalId(id);
        }
    };
    // @func to pause the timer
    const pauseTimer = () => {
        clearInterval(intervalId);
        setIntervalId(null);
        setIsActive(false);
        setTracker(previous => ({ ...previous, isPaused: true }));
    };
    // @func to start or resume the timer
    const resumeTimer = () => {
        setTracker(previous => ({ ...previous, isPaused: false }));
        startTimer();
    };
    // @func to abstract the logic of switching states and avoid overlapping functionality   
    const toggleTimer = () => {
        /* 
            * Having this logic inside of if block prevented the functionality of spacebar and mouse click 
        */
        if (isActive) {
            pauseTimer();
        } else {
            resumeTimer();
        }
    };
    // @func to update the sessions after the timer reaches 00:00 and display notifications
    const updateSession = (skipped) => {
        let sessionID;
        if (activeButton === 1) {
            sessionID = (sessionCount.focus % longBreakInterval === 0) ? 3 : 2;
        } else {
            sessionID = 1;
        }
        // * Don't show notifications when user skips sessions
        if (!skipped) {
            showNotifications(sessionID);
        }
        changeSession({ sessionID: sessionID });
    };
    // @func to skip sessions in between focus and break
    const skip = () => {
        clearInterval(intervalId);
        setIsActive(false);
        updateSession(true);
    };
    // @func to show notifications
    const showNotifications = (session) => {
        if (notificationOptions.enabled) {
            const title = session === 1 ? 'Time to Focus!' : session === 2 ? 'Time for a Short Break!' : 'Time for a Long Break!';
            const icon = session === 1 ? '/favicon.svg' : session === 2 ? '/favicon-short.svg' : '/favicon-long.svg';
            const notification = new Notification(title, { silent: notificationOptions.silent, icon: icon });
            document.addEventListener("visibilitychange", () => {
                if (document.visibilityState === "visible") {
                    // * The tab has become visible so clear the now-stale Notification.
                    notification.close();
                }
            });
        }
    };
    // * Runs only when user changes their minutes preferences for focus or break 
    useEffect(() => {
        if (!toggle.settings) {
            // * Creating a new object to map activeButton with corresponding property of minutes
            // * Adding a new property change so that logic is consolidated into a single if statement
            const buttonMap = {
                1: { change: changesIn.focus, value: minutes.focus },
                2: { change: changesIn.short, value: minutes.short },
                3: { change: changesIn.long, value: minutes.long }
            }
            if (buttonMap[activeButton].change) {
                // * set it back to defaults and only change it if user changes their preferences 
                setChangesIn({
                    focus: false,
                    short: false,
                    long: false
                });
                setTimer({
                    seconds: 0,
                    minutes: buttonMap[activeButton].value
                })
            }
            // * Change the initial state after the user has changed their preferences 
            initialMinutesStateRef.current = minutes;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [toggle.settings]);
    // * Auto start focus and break sessions if it is turned on
    useEffect(() => {
        // * Auto start break session after the focus session ends
        if (activeButton !== 1 && autoStart.break && tracker.didTimerRun) {
            setTracker(previous => ({ ...previous, didTimerRun: false }));
            setTimeout(() => {
                startTimer();
            }, 1000);
        }
        // * Auto start focus session after the break session ends
        if (activeButton === 1 && autoStart.focus && tracker.didTimerRun) {
            setTracker(previous => ({ ...previous, didTimerRun: false }));
            setTimeout(() => {
                startTimer();
            }, 1000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeButton, tracker.didTimerRun])
    /* 
        * Switch to focus or break session depending upon the sessionID
        * Keeps track of completed focus sessions and stores them in local storage
    */
    useEffect(() => {
        if (session.sessionID) {
            handleButtonCLick(session.sessionID);
            setTracker(previous => ({ ...previous, didTimerRun: true }));
        }
        if (session.sessionID === 2 || session.sessionID === 3) {
            changeSessionCount(previousCount => ({
                focus: previousCount.focus + 1,
                break: previousCount.focus
            }));
            localStorage.setItem("Sessions Completed", sessionCount.focus);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);
    // * Cleanup interval on unmount
    useEffect(() => {
        return () => clearInterval(intervalId);
    }, [intervalId]);
    // * Space bar functionality
    useEffect(() => {
        const spacebarFunction = (event) => {
            if ((event.key === ' ' || event.code === 'space') && !event.repeat) {
                // * To stop from switching between sessions and the default behaviour  
                event.preventDefault();
                /*     
                    * Seperated the logic that is now inside of 
                      @func toogleTimer() 
                    * To abstract the logic of switching states and avoid overlapping functionality
                    * Now you can resume/pause using spacebar and mouse click alternately 
                */
                toggleTimer();
            }
        };

        window.addEventListener('keydown', spacebarFunction);
        return () => {
            window.removeEventListener('keydown', spacebarFunction);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive]);
    //  * Change background colors with button click, make sure the values are same with :root in index.css
    useEffect(() => {
        const backgroundColors = {
            1: "hsl(0, 45%, 51%)",
            2: "hsl(206, 53%, 51%)",
            3: "hsl(140, 42%, 38%)",
        };
        document.body.style.backgroundColor = backgroundColors[activeButton];
        return () => {
            document.body.style.backgroundColor = backgroundColors[1];
        }
    }, [activeButton]);
    //  * Change the title of the document
    useEffect(() => {
        const favicon = document.querySelector("link[rel*='icon']");
        let message = '';
        // * Change the icon into pause only when intervalId is NULL and timer is NOT ACTIVE
        if (activeButton === 1) {
            favicon.href = tracker.isPaused ? '/favicon-pause.svg' : '/favicon.svg';
            message = 'Time to Focus!';
        } else if (activeButton === 2) {
            favicon.href = tracker.isPaused ? '/favicon-pause.svg' : '/favicon-short.svg';
            message = 'Time for a Break!';
        } else {
            favicon.href = tracker.isPaused ? '/favicon-pause.svg' : '/favicon-long.svg';
            message = 'Time for a Break!'
        }
        document.title = `${timer.minutes.toString().padStart(2, 0)}:${timer.seconds.toString().padStart(2, 0)} - ${message}`;
    }, [timer, activeButton, tracker.isPaused]);

    return (
        <main className="flex flex-col justify-center items-center mt-10 mb-8 w-full bg-white/10 p-4 rounded-lg max-w-[480px] min-[500px]:mt-12 min-[500px]:p-6">
            <header className="timer-header flex justify-center items-center gap-4">
                <button type="button" className={`text-xs ${activeButton === 1 ? 'bg-focus font-semibold' : 'bg-transparent font-medium'} p-2 rounded min-[500px]:text-sm min-[500px]:py-2 min-[500px]:px-4`} onClick={() => handleButtonCLick(1)}>Focus</button>
                <button type="button" className={`text-xs ${activeButton === 2 ? 'bg-short font-semibold' : 'bg-transparent font-medium'} p-2 rounded min-[500px]:text-sm min-[500px]:py-2 min-[500px]:px-4`} onClick={() => handleButtonCLick(2)}>Short Break</button>
                <button type="button" className={`text-xs ${activeButton === 3 ? 'bg-long font-semibold' : 'bg-transparent font-medium'} p-2 rounded min-[500px]:text-sm min-[500px]:py-2 min-[500px]:px-4`} onClick={() => handleButtonCLick(3)}>Long Break</button>
            </header>
            <section className="timer text-7xl my-8 min-[500px]:text-9xl min-[500px]:font-medium">{timer.minutes.toString().padStart(2, 0)}:{timer.seconds.toString().padStart(2, 0)}</section>
            <footer className="flex justify-center items-center w-full relative max-w-xs mb-4">
                <button type="button" title='Press Spacebar to start/pause' id='start' className={`${activeButton === 1 ? 'text-focus' : activeButton === 2 ? 'text-short' : 'text-long'} px-12 py-4 font-semibold uppercase rounded bg-white w-full max-w-[65%] min-[500px]:text-xl ${isActive ? ' translate-y-1 shadow-none' : 'shadow-start'}`} onClick={isActive ? pauseTimer : resumeTimer} >
                    {isActive ? 'Pause' : 'Start'}</button>
                <button type="button" title={`Skip ${activeButton === 1 ? 'Focus' : 'Break'} Session`} className={`ml-8 absolute right-2 top-5 ${isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} duration-200 ease-in`}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="15" viewBox="0 0 320 512"><path fill="#fff" d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416L0 96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4l192 160L256 241l0-145c0-17.7 14.3-32 32-32s32 14.3 32 32l0 320c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-145-11.5 9.6-192 160z" onClick={() => skip()} /></svg>
                </button>
            </footer>
        </main>
    )
}
