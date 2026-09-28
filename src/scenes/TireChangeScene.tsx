import { useEffect, useRef, useState, type AnimationEvent } from 'react'
import { CarIllustration, SceneBackdrop } from '../components/SceneArt'
import { ForgivingDrag } from '../game/interaction/ForgivingDrag'
import type { SceneProps } from '../game/sceneTypes'
import './tire-change-scene.css'

type TireChangeSceneProps = Omit<SceneProps, 'sceneId'> & { sceneId: 'tire-change' }
type TirePhase = 'waiting' | 'repaired' | 'driving'

/** Replace the visible flat wheel by dropping one large spare tire onto it. */
export function TireChangeScene({
  sceneId,
  onComplete,
  onFeedback,
  onInteractionActivity,
  hintVisible,
}: TireChangeSceneProps) {
  const wheelTargetRef = useRef<HTMLDivElement>(null)
  const completedRef = useRef(false)
  const driveTimerRef = useRef<number | null>(null)
  const [phase, setPhase] = useState<TirePhase>('waiting')
  const [tirePlaced, setTirePlaced] = useState(false)

  useEffect(() => () => {
    completedRef.current = true
    if (driveTimerRef.current !== null) window.clearTimeout(driveTimerRef.current)
  }, [])

  function handleTireDrop() {
    if (phase !== 'waiting') return
    setTirePlaced(true)
    setPhase('repaired')
    onFeedback({ cue: 'object-repaired', sceneId })
    driveTimerRef.current = window.setTimeout(() => {
      driveTimerRef.current = null
      setPhase('driving')
    }, 420)
  }

  function handleCarAnimationEnd(event: AnimationEvent<HTMLImageElement>) {
    if (
      event.target !== event.currentTarget ||
      event.animationName !== 'tire-change-car-drive' ||
      completedRef.current
    ) return

    completedRef.current = true
    onComplete()
  }

  return (
    <SceneBackdrop
      className={`tire-change-scene tire-change-scene--${phase}`}
      role="group"
      aria-label="更换汽车轮胎场景"
    >
      <div className="tire-change-scene__prompt" aria-live="polite">
        <h2>{phase === 'waiting' ? '轮胎需要换新啦' : '新轮胎装好了！'}</h2>
        <p>{phase === 'waiting' ? '把备用轮胎拖到车轮上。' : '小车又可以继续开啦。'}</p>
      </div>

      <CarIllustration
        className="tire-change-scene__car"
        label="停在路边的小汽车"
        onAnimationEnd={handleCarAnimationEnd}
      />

      <div
        ref={wheelTargetRef}
        className={[
          'tire-change-scene__wheel-target',
          hintVisible && !tirePlaced ? 'tire-change-scene__wheel-target--hint' : '',
          tirePlaced ? 'tire-change-scene__wheel-target--repaired' : '',
        ].filter(Boolean).join(' ')}
        aria-hidden="true"
      >
        <img
          className={tirePlaced ? 'tire-change-scene__fitted-tire' : 'tire-change-scene__flat-tire'}
          src="/images/tire.png"
          alt=""
          draggable={false}
        />
      </div>

      {!tirePlaced && (
        <ForgivingDrag
          className="tire-change-scene__spare-drag"
          sceneId={sceneId}
          ariaLabel="备用轮胎，拖到小车的车轮上"
          targetRef={wheelTargetRef}
          onDrop={handleTireDrop}
          onFeedback={onFeedback}
          onInteractionActivity={onInteractionActivity}
        >
          <img className="tire-change-scene__spare" src="/images/tire.png" alt="" draggable={false} />
        </ForgivingDrag>
      )}

      {hintVisible && !tirePlaced && <span className="tire-change-scene__hint" aria-hidden="true">✨</span>}
    </SceneBackdrop>
  )
}
