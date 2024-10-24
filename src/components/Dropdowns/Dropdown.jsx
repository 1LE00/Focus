import { useContext, useEffect, useRef, useState } from "react"
import PropTypes from 'prop-types'
import { SoundsContext } from "../../context/SoundsContext";

export const Dropdown = ({ audioArray, isBreakAudio }) => {
    const [toggleDropDown, setToggleDropDown] = useState(false);
    const { music, setMusic } = useContext(SoundsContext);
    const dropDownRef = useRef(null);
    
    const currentMusic = isBreakAudio ? music.break : music.alarm;

    // @func -toogle dropdown and select the correct music for alarm and break 
    const handleSelect = (label, value) => {
        setToggleDropDown(!toggleDropDown);
        setMusic(prev => ({
            ...prev,
            [isBreakAudio ? 'break' : 'alarm']:
            {
                file: value,
                label: label,
                volume: prev[isBreakAudio ? 'break' : 'alarm'].volume
            }
        }))
    };
    // * Make the dropdown be visible as whole when clicked on
    useEffect(() => {
        if (toggleDropDown) {
            dropDownRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [toggleDropDown]);
    // @func handle volume change based on user input for alarm and break sound
    const handleVolumeChange = (event) => {
        const volume = event.target.value;
        setMusic(prev => {
            return {
                ...prev, [isBreakAudio ? 'break' : 'alarm']:
                {
                    ...prev[isBreakAudio ? 'break' : 'alarm'],
                    volume: volume
                }
            }
        })
    };

    // @func to close the dropdown if user clicks outside of the dropdown or selected option
    const handleClickOutside = (event) => {
        if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
            setToggleDropDown(false);
        }
    };
    // * Add a eventlistener to handle click outside of the dropdown and selected option
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, []);

    return (
        <section className="flex flex-col items-end gap-4">
            <section className="relative cursor-pointer" ref={dropDownRef}>
                <section className="selected relative text-sm bg-gray-500/10 py-2 px-3 rounded shadow-number min-w-28" onClick={() => setToggleDropDown(prev => !prev)}>
                    {currentMusic.label}
                    <span className="arrow absolute top-[50%] right-3 border-l-[7px] border-r-[7px] border-t-[7px] border-transparent border-t-black/50 translate-y-[-50%]"></span>
                </section>
                {toggleDropDown &&
                    <ul className={`audio-list text-sm bg-white w-full rounded shadow-dropdown absolute mt-1 z-10 ${isBreakAudio && 'h-64 overflow-auto'}`}>
                        {isBreakAudio && <li className="text-sm hover:bg-gray-500/10 py-3 px-4 border-b" onClick={() => handleSelect("None")}>None</li>}
                        {audioArray.map(({ value, label }) => {
                            return <li key={label} className="text-sm hover:bg-gray-500/10 py-3 px-4 border-b" onClick={() => handleSelect(label, value)}>{label}</li>
                        })}
                    </ul>
                }
            </section>
            <section className="flex items-center gap-4">
                <label htmlFor="volume" className="text-sm">{currentMusic.volume}</label>
                <input type="range" name="volume" id="volume" min={0} max={100} value={currentMusic.volume} onChange={(e) => handleVolumeChange(e)} className="custom-range" />
            </section>
        </section>
    )
}

Dropdown.propTypes = {
    audioArray: PropTypes.array.isRequired,
    isBreakAudio: PropTypes.bool
}
