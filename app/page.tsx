'use client'
import { useEffect, useState } from 'react';
import { useDraw } from './useDraw'
import { ChromePicker } from 'react-color'
import { io } from 'socket.io-client';
import { drawLine } from '@/utils/drawLine';
const socket = io('http://localhost:3001')


type DrawLineprops = {
  prevPoint: Point | null
  currentPoint: Point
  color: string
}



export default function Home() {
  const { canvasref, onMouseDown, clear } = useDraw(createLine);
  const error = console.error;
  console.error = (...args: any) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
  };

  useEffect(() => {

    const ctx = canvasref.current?.getContext('2d')

    socket.emit('client-ready')

    socket.on('get-canvas-state',()=>{
      if(!canvasref.current?.toDataURL()) return
      socket.emit('canvas-state',canvasref.current.toDataURL())
    })

    socket.on('canvas-state-from-server',(state:string)=>{
      console.log("i re")
      const img = new Image()
      img.src = state
      img.onload = () => {
        ctx?.drawImage(img,0,0)
      }
    })

    socket.on('draw-line', ({ prevPoint, currentPoint, color }: DrawLineprops) => {
      if(!ctx) return
      drawLine({ prevPoint, currentPoint, ctx, color })
    })
    socket.on('clear',clear)


    return () =>{
      socket.off('get-canvas-state')
      socket.off('canvas-state-from-server')
      socket.off('draw-line')
      socket.off('clear')

    }
  }, [canvasref])

  function createLine({ prevPoint, currentPoint, ctx }: Draw) {
    socket.emit('draw-line', { prevPoint, currentPoint, color })
    drawLine({ prevPoint, currentPoint, ctx, color })
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
        <span className="relative" onClick={() => socket.emit('clear')} >Clear Board</span>
      </a>
    </div>
  )
}
