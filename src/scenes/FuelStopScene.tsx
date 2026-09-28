import { useEffect, useRef, useState, type AnimationEvent } from 'react'
import { CarIllustration, SceneBackdrop } from '../components/SceneArt'
import { TapTarget } from '../game/interaction/TapTarget'
import type { SceneId, SceneProps } from '../game/sceneTypes'
import './fuel-stop-scene.css'

type FuelStopPhase = 'waiting' | 'filling' | 'driving' | 'finished'
type FuelStopSceneProps = Omit<SceneProps, 'sceneId'> & { sceneId: string }

const FILL_DURATION_MS = 1_200
const DRIVE_COMPLETION_FALLBACK_MS = 1_800

/** Tap the oversized pump once to fill up and continue the journey. */
export function FuelStopScene({
  sceneId,
  onComplete,
  onFeedback,
  onInteractionActivity,
  hintVisible,
}: FuelStopSceneProps) {
  const [phase, setPhase] = useState<FuelStopPhase>('waiting')
  const phaseRef = useRef<FuelStopPhase>('waiting')
  const departureTimerRef = useRef<number | null>(null)
  const completionTimerRef = useRef<number | null>(null)
  const completedRef = useRef(false)

  useEffect(() => () => {
    if (departureTimerRef.current !== null) window.clearTimeout(departureTimerRef.current)
    if (completionTimerRef.current !== null) window.clearTimeout(completionTimerRef.current)
  }, [])

  function finishDriving() {
    if (phaseRef.current !== 'driving' || completedRef.current) return

    if (completionTimerRef.current !== null) {
      window.clearTimeout(completionTimerRef.current)
      completionTimerRef.current = null
    }
    phaseRef.current = 'finished'
    completedRef.current = true
    setPhase('finished')
    onComplete()
  }

  function startFilling() {
    if (phaseRef.current !== 'waiting') return

    phaseRef.current = 'filling'
    setPhase('filling')
    departureTimerRef.current = window.setTimeout(() => {
      departureTimerRef.current = null
      onFeedback({ cue: 'object-repaired', sceneId: sceneId as SceneId })
      phaseRef.current = 'driving'
      setPhase('driving')
      completionTimerRef.current = window.setTimeout(() => {
        completionTimerRef.current = null
        finishDriving()
      }, DRIVE_COMPLETION_FALLBACK_MS)
    }, FILL_DURATION_MS)
  }

  function handleCarAnimationEnd(event: AnimationEvent<HTMLImageElement>) {
    if (
      event.target !== event.currentTarget ||
      event.animationName !== 'fuel-stop-car-drive' ||
      phaseRef.current !== 'driving' ||
      completedRef.current
    ) {
      return
    }

    finishDriving()
  }

  const showHint = hintVisible && phase === 'waiting'

  return (
    <SceneBackdrop
      className={`fuel-stop-scene fuel-stop-scene--${phase}`}
      role="group"
      aria-label="路边加油场景"
    >
      <div className="fuel-stop-scene__prompt" aria-live="polite">
        <h2>{phase === 'waiting' ? '给小车加满油' : phase === 'filling' ? '油量慢慢升起来啦' : '加满油，继续出发！'}</h2>
        <p>{phase === 'waiting' ? '点一下加油机，陪小车补充能量。' : '小车准备继续旅程。'}</p>
      </div>

      <CarIllustration
        className="fuel-stop-scene__car"
        label="停在加油站的小汽车"
        onAnimationEnd={handleCarAnimationEnd}
      />

      <TapTarget
        className={[
          'fuel-stop-scene__pump-target',
          showHint ? 'fuel-stop-scene__pump-target--hinted' : '',
        ].filter(Boolean).join(' ')}
        sceneId={sceneId as SceneId}
        ariaLabel="点一下红色加油机，给小车加油"
        disabled={phase !== 'waiting'}
        onActivate={startFilling}
        onFeedback={onFeedback}
        onInteractionActivity={onInteractionActivity}
      >
        <span className="fuel-stop-scene__gauge" aria-hidden="true">
          <span className="fuel-stop-scene__gauge-fill" />
        </span>
      </TapTarget>

      <p className="fuel-stop-scene__announcement" aria-live="polite" aria-atomic="true">
        {phase === 'waiting'
          ? '小车停在加油机旁。点一下加油机，油量就会慢慢升满。'
          : phase === 'filling'
            ? '油量正在慢慢升满。'
            : '加满油啦，小车开心出发。'}
      </p>
    </SceneBackdrop>
  )
}
