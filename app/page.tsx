'use client'
import { useState } from 'react';
import { useDraw } from './useDraw'
import { ChromePicker } from 'react-color'


export default function Home() {
  const { canvasref, onMouseDown, clear } = useDraw(drawLine);
  const error = console.error;
  console.error = (...args: any) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
  };

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint;
    const lineColor = color
    const lineWidth = 5

    let startPoint = prevPoint ?? currentPoint
    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = lineColor
    ctx.moveTo(startPoint.x, startPoint.y)
    ctx.lineTo(currX, currY)
    ctx.stroke()

    ctx.fillStyle = lineColor
    ctx.beginPath()
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI)
    ctx.fill()
  }

  const [color, setColor] = useState<string>('#000')

  return (
    <div className="w-screen h-screen bg-white flex justify-center items-center flex-wrap">
      <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />
      <canvas
        onMouseDown={onMouseDown}
        width={650}
        height={650}
        ref={canvasref}
        className="m-5 border border-black rounded-md" />

      <a href="#_" className=" relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-800 rounded-lg group">
        <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-green-500 rounded-full group-hover:w-56 group-hover:h-56"></span>
        <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
        <span className="relative" onClick={clear} >Clear Board</span>
      </a>
    </div>
  )
}
