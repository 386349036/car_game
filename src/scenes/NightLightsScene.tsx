import { useEffect, useRef, useState, type AnimationEvent } from 'react'
import { CarIllustration, SceneBackdrop } from '../components/SceneArt'
import { TapTarget } from '../game/interaction/TapTarget'
import type { SceneId, SceneProps } from '../game/sceneTypes'
import './night-lights-scene.css'

type NightLightsPhase = 'waiting' | 'lighting' | 'driving' | 'finished'
type NightLightsSceneProps = Omit<SceneProps, 'sceneId'> & { sceneId: string }

const LIGHTING_MS = 820
const DRIVE_COMPLETION_FALLBACK_MS = 1_800

/** Turn on the headlights once, then let the shared car continue along the road. */
export function NightLightsScene({
  sceneId,
  onComplete,
  onFeedback,
  onInteractionActivity,
  hintVisible,
}: NightLightsSceneProps) {
  const [phase, setPhase] = useState<NightLightsPhase>('waiting')
  const phaseRef = useRef<NightLightsPhase>('waiting')
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

  function turnOnLights() {
    if (phaseRef.current !== 'waiting') return

    phaseRef.current = 'lighting'
    setPhase('lighting')
    onFeedback({ cue: 'object-repaired', sceneId: sceneId as SceneId })
    driveTimerRef.current = window.setTimeout(() => {
      driveTimerRef.current = null
      phaseRef.current = 'driving'
      setPhase('driving')
      completionTimerRef.current = window.setTimeout(() => {
        completionTimerRef.current = null
        finishDriving()
      }, DRIVE_COMPLETION_FALLBACK_MS)
    }, LIGHTING_MS)
  }

  function handleCarAnimationEnd(event: AnimationEvent<HTMLImageElement>) {
    if (
      event.target !== event.currentTarget ||
      event.animationName !== 'night-lights-car-drive' ||
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
      className={`night-lights-scene night-lights-scene--${phase}`}
      role="group"
      aria-label="夜间打开车灯场景"
    >
      <div className="night-lights-scene__prompt" aria-live="polite">
        <h2>{phase === 'waiting' ? '天黑啦，打开车灯吧' : '车灯亮起来啦！'}</h2>
        <p>{phase === 'waiting' ? '点一点小车的车灯，照亮前面的路。' : '小车看清道路，继续出发。'}</p>
      </div>

      <span className="night-lights-scene__twinkle night-lights-scene__twinkle--one" aria-hidden="true">✦</span>
      <span className="night-lights-scene__twinkle night-lights-scene__twinkle--two" aria-hidden="true">✦</span>
      <span className="night-lights-scene__twinkle night-lights-scene__twinkle--three" aria-hidden="true">✦</span>
      <span className="night-lights-scene__beams" aria-hidden="true" />

      <div className="night-lights-scene__vehicle">
        <CarIllustration
          className="night-lights-scene__car"
          label="夜路上等候开灯的小汽车"
          onAnimationEnd={handleCarAnimationEnd}
        />

        <TapTarget
          className={[
            'night-lights-scene__headlight-target',
            showHint ? 'night-lights-scene__headlight-target--hinted' : '',
          ].filter(Boolean).join(' ')}
          sceneId={sceneId as SceneId}
          ariaLabel="点一下小车前方的车灯"
          disabled={phase !== 'waiting'}
          onActivate={turnOnLights}
          onFeedback={onFeedback}
          onInteractionActivity={onInteractionActivity}
        >
          <span className="night-lights-scene__lamp-halo" aria-hidden="true" />
        </TapTarget>
      </div>

      <p className="night-lights-scene__announcement" aria-live="polite" aria-atomic="true">
        {phase === 'waiting'
          ? '小车在夜路边等候。点一下车灯，照亮前面的路。'
          : phase === 'lighting'
            ? '车灯亮了，星星闪闪，小车准备出发。'
            : '小车正沿着亮起来的道路继续前进。'}
      </p>
    </SceneBackdrop>
  )
}
