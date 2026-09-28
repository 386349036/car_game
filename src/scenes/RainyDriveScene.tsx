import { useEffect, useRef, useState } from 'react'
import { CarIllustration, SceneBackdrop } from '../components/SceneArt'
import { TapTarget } from '../game/interaction/TapTarget'
import type { SceneProps } from '../game/sceneTypes'
import './rainy-drive-scene.css'

type RainyDriveSceneProps = Omit<SceneProps, 'sceneId'> & { sceneId: 'rainy-drive' }
type RainPhase = 'raining' | 'wiping' | 'driving'

const WIPE_DURATION_MS = 920
const DRIVE_DURATION_MS = 1_420

/** Tap the oversized wiper target once to clear the view and continue the trip. */
export function RainyDriveScene({
  sceneId,
  onComplete,
  onFeedback,
  onInteractionActivity,
  hintVisible,
}: RainyDriveSceneProps) {
  const timersRef = useRef<number[]>([])
  const finishedRef = useRef(false)
  const phaseRef = useRef<RainPhase>('raining')
  const [phase, setPhase] = useState<RainPhase>('raining')

  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
  }, [])

  function startWipers() {
    if (phaseRef.current !== 'raining') return

    phaseRef.current = 'wiping'
    setPhase('wiping')
    timersRef.current.push(window.setTimeout(() => {
      onFeedback({ cue: 'object-repaired', sceneId })
      phaseRef.current = 'driving'
      setPhase('driving')
      timersRef.current.push(window.setTimeout(() => {
        if (finishedRef.current) return
        finishedRef.current = true
        onComplete()
      }, DRIVE_DURATION_MS))
    }, WIPE_DURATION_MS))
  }

  return (
    <SceneBackdrop
      className={`rainy-drive-scene rainy-drive-scene--${phase}`}
      role="group"
      aria-label="下雨时使用雨刷场景"
    >
      <div className="rainy-drive-scene__prompt" aria-live="polite">
        <h2>{phase === 'raining' ? '下雨啦，看不清前面' : '雨刷擦干净啦！'}</h2>
        <p>{phase === 'raining' ? '点一点雨刷，帮小车看清路。' : '小车继续出发。'}</p>
      </div>

      <span className="rainy-drive-scene__rain" aria-hidden="true" />
      <CarIllustration className="rainy-drive-scene__car" label="雨天路上的小汽车" />

      <TapTarget
        className={[
          'rainy-drive-scene__wiper-target',
          hintVisible && phase === 'raining' ? 'rainy-drive-scene__wiper-target--hint' : '',
        ].filter(Boolean).join(' ')}
        sceneId={sceneId}
        ariaLabel="点一下雨刷，帮小车清理车窗"
        onActivate={startWipers}
        onFeedback={onFeedback}
        onInteractionActivity={onInteractionActivity}
        disabled={phase !== 'raining'}
      >
        <img className="rainy-drive-scene__wiper" src="/images/wiper.png" alt="" draggable={false} />
      </TapTarget>

      <p className="rainy-drive-scene__announcement" aria-live="polite" aria-atomic="true">
        {phase === 'raining'
          ? '点一下雨刷，帮小车看清前面。'
          : phase === 'wiping'
            ? '雨刷正在擦车窗。'
            : '车窗清楚啦，小车继续出发。'}
      </p>
    </SceneBackdrop>
  )
}
