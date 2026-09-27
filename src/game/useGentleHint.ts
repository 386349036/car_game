import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  GameFeedbackHandler,
  InteractionPhase,
  SceneId,
} from './sceneTypes'

interface UseGentleHintOptions {
  sceneId: SceneId | null
  delayMs?: number
  onFeedback?: GameFeedbackHandler
}

export function useGentleHint({
  sceneId,
  delayMs = 15_000,
  onFeedback,
}: UseGentleHintOptions) {
  const [hintVisible, setHintVisible] = useState(false)
  const timerRef = useRef<number | null>(null)
  const activeInteractionsRef = useRef(0)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const scheduleHint = useCallback(() => {
    clearTimer()
    if (sceneId === null || activeInteractionsRef.current > 0) return

    timerRef.current = window.setTimeout(() => {
      timerRef.current = null
      setHintVisible(true)
      onFeedback?.({ cue: 'scene-hint', sceneId })
    }, delayMs)
  }, [clearTimer, delayMs, onFeedback, sceneId])

  const onInteractionActivity = useCallback((phase: InteractionPhase = 'activity') => {
    if (phase === 'start') {
      activeInteractionsRef.current += 1
      clearTimer()
      setHintVisible(false)
      return
    }

    if (phase === 'end') {
      activeInteractionsRef.current = Math.max(0, activeInteractionsRef.current - 1)
      if (activeInteractionsRef.current === 0) {
        setHintVisible(false)
        scheduleHint()
      }
      return
    }

    if (activeInteractionsRef.current === 0) {
      setHintVisible(false)
      scheduleHint()
    }
  }, [clearTimer, scheduleHint])

  useEffect(() => {
    activeInteractionsRef.current = 0
    setHintVisible(false)
    scheduleHint()
    return clearTimer
  }, [clearTimer, scheduleHint])

  return {
    hintVisible: sceneId !== null && hintVisible,
    onInteractionActivity,
  }
}