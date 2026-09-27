import { useEffect, useRef, useState, type ReactNode } from 'react'
import type {
  GameFeedbackHandler,
  InteractionPhase,
  SceneId,
} from '../sceneTypes'

interface TapTargetProps {
  sceneId: SceneId
  ariaLabel: string
  children: ReactNode
  onActivate: () => void
  onFeedback: GameFeedbackHandler
  onInteractionActivity?: (phase?: InteractionPhase) => void
  isCorrect?: boolean
  disabled?: boolean
  className?: string
}

export function TapTarget({
  sceneId,
  ariaLabel,
  children,
  onActivate,
  onFeedback,
  onInteractionActivity,
  isCorrect = true,
  disabled = false,
  className = '',
}: TapTargetProps) {
  const [isNudging, setIsNudging] = useState(false)
  const nudgeTimerRef = useRef<number | null>(null)

  useEffect(() => () => {
    if (nudgeTimerRef.current !== null) window.clearTimeout(nudgeTimerRef.current)
  }, [])

  function handleClick() {
    if (disabled) return

    onInteractionActivity?.('start')
    try {
      if (isCorrect) {
        onFeedback({ cue: 'target-tap', sceneId })
        onActivate()
      } else {
        onFeedback({ cue: 'gentle-nudge', sceneId })
        setIsNudging(false)
        window.requestAnimationFrame(() => setIsNudging(true))
        if (nudgeTimerRef.current !== null) window.clearTimeout(nudgeTimerRef.current)
        nudgeTimerRef.current = window.setTimeout(() => setIsNudging(false), 380)
      }
    } finally {
      onInteractionActivity?.('end')
    }
  }

  const classes = ['gentle-tap-target', className, isNudging ? 'gentle-tap-target--nudge' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={classes}
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}