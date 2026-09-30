import { useEffect, useRef, useState, type AnimationEvent } from 'react'
import { CarIllustration, SceneBackdrop } from '../components/SceneArt'
import { TapTarget } from '../game/interaction/TapTarget'
import type { SceneId, SceneProps } from '../game/sceneTypes'
import './home-garage-scene.css'

type HomeGaragePhase = 'waiting' | 'opening' | 'driving' | 'finished'
type HomeGarageSceneProps = Omit<SceneProps, 'sceneId'> & { sceneId: string }

const GARAGE_OPEN_MS = 850
const DRIVE_COMPLETION_FALLBACK_MS = 2_400

/** Tap the broad garage door to open it and drive the car into its garage. */
export function HomeGarageScene({
  sceneId,
  onComplete,
  onFeedback,
  onInteractionActivity,
  hintVisible,
}: HomeGarageSceneProps) {
  const [phase, setPhase] = useState<HomeGaragePhase>('waiting')
  const phaseRef = useRef<HomeGaragePhase>('waiting')
  const driveTimerRef = useRef<number | null>(null)
  const completionTimerRef = useRef<number | null>(null)
  const completedRef = useRef(false)

  useEffect(() => () => {
    if (driveTimerRef.current !== null) window.clearTimeout(driveTimerRef.current)
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

  function openGarage() {
    if (phaseRef.current !== 'waiting') return

    phaseRef.current = 'opening'
    setPhase('opening')
    driveTimerRef.current = window.setTimeout(() => {
      driveTimerRef.current = null
      phaseRef.current = 'driving'
      setPhase('driving')
      completionTimerRef.current = window.setTimeout(() => {
        completionTimerRef.current = null
        finishDriving()
      }, DRIVE_COMPLETION_FALLBACK_MS)
    }, GARAGE_OPEN_MS)
  }

  function handleCarAnimationEnd(event: AnimationEvent<HTMLImageElement>) {
    if (
      event.target !== event.currentTarget ||
      event.animationName !== 'home-garage-car-drive' ||
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
      className={`home-garage-scene home-garage-scene--${phase}`}
      role="group"
      aria-label="回家停车场景"
    >
      <img
        className="home-garage-scene__background home-garage-scene__background--closed"
        src="/images/home-garage-closed.webp"
        alt=""
        aria-hidden="true"
        draggable={false}
      />
      <img
        className="home-garage-scene__background home-garage-scene__background--open"
        src="/images/home-garage-open.webp"
        alt=""
        aria-hidden="true"
        draggable={false}
      />

      <div className="home-garage-scene__prompt" aria-live="polite">
        <h2>{phase === 'waiting' ? '到家啦' : phase === 'opening' ? '车库门打开啦！' : '小车慢慢开回家。'}</h2>
        <p>{phase === 'waiting' ? '点一下大大的车库门，送小车回家。' : '这趟旅程真开心。'}</p>
      </div>

      <CarIllustration
        className="home-garage-scene__car"
        label="正开向家中车库的小汽车"
        onAnimationEnd={handleCarAnimationEnd}
      />

      <TapTarget
        className={[
          'home-garage-scene__door-target',
          showHint ? 'home-garage-scene__door-target--hinted' : '',
        ].filter(Boolean).join(' ')}
        sceneId={sceneId as SceneId}
        ariaLabel="点一下车库门，让小车回家"
        disabled={phase !== 'waiting'}
        onActivate={openGarage}
        onFeedback={onFeedback}
        onInteractionActivity={onInteractionActivity}
      >
        <span className="home-garage-scene__door-glow" aria-hidden="true" />
      </TapTarget>

      <p className="home-garage-scene__announcement" aria-live="polite" aria-atomic="true">
        {phase === 'waiting'
          ? '小车到家啦。点一下大车库门，小车就能开回家。'
          : phase === 'opening'
            ? '车库门慢慢打开。'
            : '小车正在慢慢开进家。'}
      </p>
    </SceneBackdrop>
  )
}
