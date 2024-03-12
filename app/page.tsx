'use client'
import { useDraw } from './useDraw'

export default function Home() {
  const { canvasref,onMouseDown} = useDraw();


  function drawLine({prevPoint,currentPoint,ctx}:Draw){
    const {x:currX,y:currY} = currentPoint;
    const lineColor = '#000'
    const lineWidth = 5

    let startPoint = prevPoint ?? currentPoint
    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = lineColor
    ctx.moveTo(startPoint.x,startPoint.y)
    ctx.lineTo(currX,currY)
    ctx.stroke()

    ctx.fillStyle = lineColor
    ctx.beginPath()
    ctx.arc(startPoint.x,startPoint.y,2,0,2*Math.PI)
    ctx.fill()
  }


  return (
    <div className="w-screen h-screen bg-white flex justify-center items-center">
      <canvas
      onMouseDown={onMouseDown}
        width={650}
        height={650}
        ref={canvasref}
        className="border border-black rounded-md" />
    </div>
  )
}
