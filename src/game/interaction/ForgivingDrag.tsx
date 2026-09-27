import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode, type RefObject } from 'react'
import type {
  GameFeedbackHandler,
  InteractionPhase,
  SceneId,
} from '../sceneTypes'

type DragPhase = 'idle' | 'dragging' | 'returning' | 'placed'
type Point = { x: number; y: number }
type RectSnapshot = { left: number; top: number; width: number; height: number }

interface PointerOrigin {
  pointerId: number
  clientX: number
  clientY: number
  itemRect: RectSnapshot
  startOffset: Point
}

interface ForgivingDragProps {
  sceneId: SceneId
  ariaLabel: string
  children: ReactNode
  targetRef: RefObject<HTMLElement | null>
  onDrop: () => void
  onFeedback: GameFeedbackHandler
  onInteractionActivity?: (phase?: InteractionPhase) => void
  hitSlop?: number
  disabled?: boolean
  className?: string
}

const RETURN_DURATION_MS = 320
const SNAP_DURATION_MS = 280

export function ForgivingDrag({
  sceneId,
  ariaLabel,
  children,
  targetRef,
  onDrop,
  onFeedback,
  onInteractionActivity,
  hitSlop = 72,
  disabled = false,
  className = '',
}: ForgivingDragProps) {
  const [phase, setPhase] = useState<DragPhase>('idle')
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 })
  const offsetRef = useRef<Point>({ x: 0, y: 0 })
  const pointerOriginRef = useRef<PointerOrigin | null>(null)
  const returnTimerRef = useRef<number | null>(null)
  const snapTimerRef = useRef<number | null>(null)

  useEffect(() => () => {
    if (returnTimerRef.current !== null) window.clearTimeout(returnTimerRef.current)
    if (snapTimerRef.current !== null) window.clearTimeout(snapTimerRef.current)
  }, [])

  function updateOffset(nextOffset: Point) {
    offsetRef.current = nextOffset
    setOffset(nextOffset)
  }

  function releasePointer(element: HTMLDivElement, pointerId: number) {
    if (element.hasPointerCapture(pointerId)) element.releasePointerCapture(pointerId)
  }

  function beginReturn() {
    updateOffset({ x: 0, y: 0 })
    setPhase('returning')
    onFeedback({ cue: 'drag-return', sceneId })
    if (returnTimerRef.current !== null) window.clearTimeout(returnTimerRef.current)
    returnTimerRef.current = window.setTimeout(() => {
      returnTimerRef.current = null
      setPhase('idle')
    }, RETURN_DURATION_MS)
  }

  function placeAtTarget(nextOffset: Point) {
    updateOffset(nextOffset)
    setPhase('placed')
    onFeedback({ cue: 'drag-snap', sceneId })
    if (snapTimerRef.current !== null) window.clearTimeout(snapTimerRef.current)
    snapTimerRef.current = window.setTimeout(() => {
      snapTimerRef.current = null
      onDrop()
    }, SNAP_DURATION_MS)
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (disabled || phase === 'placed' || phase === 'returning') return
    if (event.pointerType === 'mouse' && event.button !== 0) return

    const bounds = event.currentTarget.getBoundingClientRect()
    pointerOriginRef.current = {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      itemRect: {
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
      },
      startOffset: offsetRef.current,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    event.preventDefault()
    onInteractionActivity?.('start')
    onFeedback({ cue: 'drag-start', sceneId })
    setPhase('dragging')
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const origin = pointerOriginRef.current
    if (!origin || origin.pointerId !== event.pointerId) return

    onInteractionActivity?.('activity')
    updateOffset({
      x: origin.startOffset.x + event.clientX - origin.clientX,
      y: origin.startOffset.y + event.clientY - origin.clientY,
    })
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    const origin = pointerOriginRef.current
    if (!origin || origin.pointerId !== event.pointerId) return

    pointerOriginRef.current = null
    releasePointer(event.currentTarget, event.pointerId)
    event.preventDefault()
    onInteractionActivity?.('end')

    if (cancelled) {
      beginReturn()
      return
    }

    const deltaX = event.clientX - origin.clientX
    const deltaY = event.clientY - origin.clientY
    const currentOffset = {
      x: origin.startOffset.x + deltaX,
      y: origin.startOffset.y + deltaY,
    }
    const currentCenterX = origin.itemRect.left + deltaX + origin.itemRect.width / 2
    const currentCenterY = origin.itemRect.top + deltaY + origin.itemRect.height / 2
    const target = targetRef.current?.getBoundingClientRect()

    if (!target) {
      beginReturn()
      return
    }

    const withinForgivingTarget =
      currentCenterX >= target.left - hitSlop &&
      currentCenterX <= target.right + hitSlop &&
      currentCenterY >= target.top - hitSlop &&
      currentCenterY <= target.bottom + hitSlop

    if (!withinForgivingTarget) {
      beginReturn()
      return
    }

    placeAtTarget({
      x: currentOffset.x + target.left + target.width / 2 - currentCenterX,
      y: currentOffset.y + target.top + target.height / 2 - currentCenterY,
    })
  }

  function handleKeyboardPlace() {
    if (disabled || phase === 'placed' || phase === 'returning') return
    const item = document.activeElement
    const target = targetRef.current?.getBoundingClientRect()
    if (!(item instanceof HTMLElement) || !target) return

    const bounds = item.getBoundingClientRect()
    onInteractionActivity?.('start')
    onFeedback({ cue: 'drag-start', sceneId })
    placeAtTarget({
      x: offsetRef.current.x + target.left + target.width / 2 - (bounds.left + bounds.width / 2),
      y: offsetRef.current.y + target.top + target.height / 2 - (bounds.top + bounds.height / 2),
    })
    onInteractionActivity?.('end')
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Enter' && event.key !== ' ') return
    if (event.repeat) return
    event.preventDefault()
    handleKeyboardPlace()
  }

  const classes = ['gentle-drag-item', className].filter(Boolean).join(' ')

  return (
    <div
      className={classes}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      data-drag-state={phase}
      style={{
        transform: 'translate3d(' + offset.x + 'px, ' + offset.y + 'px, 0)',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={(event) => handlePointerUp(event, true)}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  )
}