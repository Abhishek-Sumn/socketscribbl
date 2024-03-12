'use client'
import { useEffect, useRef, useState } from "react"

export const useDraw = (onDraw: ({ ctx, currentPoint, prevPoint }: Draw) => void) => {
    const [mouseDown, setMouseDown] = useState(false);

    const canvasref = useRef<HTMLCanvasElement>(null)
    const prevPoint = useRef<null | Point>(null)

    const onMouseDown = () => setMouseDown(true)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const currentPoint = computepointcanvas(e)

            const ctx = canvasref.current?.getContext('2d')
            if (!ctx || !currentPoint) return

            onDraw({ ctx, currentPoint, prevPoint: prevPoint.current })
            prevPoint.current = currentPoint
        }

        const computepointcanvas = (e: MouseEvent) => {
            const canvas = canvasref.current
            if (!canvas) return

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            return { x, y }
        }

        const mouseUpHandler = () =>{
            setMouseDown(false)
            prevPoint.current = null
        }

        canvasref.current?.addEventListener('mousemove', handler);
        window.addEventListener('mouseup', mouseUpHandler)

        return () => {
            canvasref.current?.removeEventListener('mousemove', handler)
            window.removeEventListener('mouseup', mouseUpHandler)
        }
    }, [onDraw])
    return { canvasref, onMouseDown }
}