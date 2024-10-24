import { createContext, useContext, useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';
import buttonSound from '../assets/sounds/button/zapsplat_multimedia_button_click_001_68773.mp3';
import clock from '../assets/sounds/session/clock-alarm-8761.mp3';
import dreamMemory from '../assets/sounds/break/dream-memory-alarm-clock-109567.mp3';
import dreamscape from '../assets/sounds/break/dreamscape-alarm-clock-117680.mp3';
import lofi from '../assets/sounds/break/lofi-alarm-clock-243766.mp3';
import morningJoy from '../assets/sounds/break/morning-joy-alarm-clock-20961.mp3';
import oversimplified from '../assets/sounds/break/oversimplified-alarm-clock-113180.mp3';
import softPlucks from '../assets/sounds/break/soft-plucks-alarm-clock-120696.mp3';
import starDust from '../assets/sounds/break/star-dust-alarm-clock-114194.mp3';
import superMario from '../assets/sounds/break/super-mario-64-alarm-clock-110801.mp3';
import tropical from '../assets/sounds/break/tropical-alarm-clock-168821.mp3';
import vintage from '../assets/sounds/break/vintage-alarm-clock-146234.mp3';
import { TimerContext } from "./TimerContext";

export const SoundsContext = createContext();

export const SoundsProvider = ({ children }) => {
    const { activeButton, isActive } = useContext(TimerContext);
    const breakMusicRef = useRef(new Audio());
    const [music, setMusic] = useState({
        alarm: { file: clock, label: 'Clock', volume: 50 },
        break: { file: undefined, label: 'None', volume: 50 }
    })

    const breakAudioFiles = [
        { value: dreamMemory, label: 'Dream' },
        { value: dreamscape, label: 'Escape' },
        { value: lofi, label: 'Lofi' },
        { value: morningJoy, label: 'Joy' },
        { value: oversimplified, label: 'Over' },
        { value: softPlucks, label: 'Plucks' },
        { value: starDust, label: 'Star' },
        { value: superMario, label: 'Mario' },
        { value: tropical, label: 'Tropical' },
        { value: vintage, label: 'Vintage' },
    ];

    const alarmAudioFiles = [
        { value: clock, label: 'Clock' }
    ]
    // @func that returns volume in the range of 0 to 1
    const convertVolume = volume => (volume > 0 ? volume / 100 : volume);
    // @func to play sound when a session ends and on start/pause
    const playButtonSound = async (type) => {
        let soundToPlay = type === 'BUTTON_CLICK' ? buttonSound : music.alarm.file;
        const buttonClickSound = new Audio(soundToPlay);
        buttonClickSound.volume = type === 'SESSION_END' ? convertVolume(music.alarm.volume) : 1;
        if (type === 'SESSION_END') {
            setTimeout(() => {
                buttonClickSound.pause();
                buttonClickSound.currentTime = 0;
            }, 3000);
        }
        try {
            await buttonClickSound.play();
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    };
    
    // * Set the audio src based on music.break.file
    // * Seperating this from the other effect so that the music doesn't
    // * restart from 0 after pausing
    useEffect(() => {
        const breakMusic = breakMusicRef.current;
        if (music.break.file) {
            breakMusic.src = music.break.file;
            breakMusic.loop = true;
        }
        // * Pause the timer when user selects 'None' as break sound after playing a music
        return () => {
            breakMusic.pause();
        }
    }, [music.break.file]);
    /* 
        * Handle volume change while the music is playing
        * Play music only when the timer is active and break session is on
        * Only play music if the user selects valid music 
    */
    useEffect(() => {
        const breakMusic = breakMusicRef.current;
        breakMusic.volume = convertVolume(music.break.volume);
        const handlePlayback = async () => {
            try {
                if (isActive && activeButton !== 1) {
                    await breakMusic.play();
                } else {
                    breakMusic.pause();
                }
            } catch (error) {
                console.error('Error playing audio:', error);
            }
        };
        // * Don't play the audio if user selects None as break sound
        if (music.break.file) {
            handlePlayback();
        }
        // * 
    }, [activeButton, isActive, music.break.file, music.break.volume]);
    /* 
        * Set the playback duration back to 0 when you change session,
        * It will allow the music to start from the beginning rather than 
        * From the last time it was paused after the break session ended
    */
    useEffect(() => {
        const breakMusic = breakMusicRef.current;
        breakMusic.currentTime = 0;
    }, [activeButton])

    return (
        <SoundsContext.Provider value={{ playButtonSound, breakAudioFiles, alarmAudioFiles, music, setMusic }}>
            {children}
        </SoundsContext.Provider>
    )
}

SoundsProvider.propTypes = {
    children: PropTypes.node.isRequired
}

