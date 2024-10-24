import { useContext } from "react"
import { TimerContext } from "../context/TimerContext"


export const Progressbar = () => {
  const { progress } = useContext(TimerContext);
  return (
    <section className="w-full h-0.5 mt-2 bg-gray-700/20 max-w-[620px] rounded">
      <section className='h-full bg-white rounded w-[]' style={{ width: `${progress}%` }}></section>
    </section>
  )
}
