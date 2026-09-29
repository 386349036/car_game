import { useEffect, useRef, useState } from 'react'
import { CarIllustration, SceneBackdrop } from '../components/SceneArt'
import { TapTarget } from '../game/interaction/TapTarget'
import type { SceneId, SceneProps } from '../game/sceneTypes'
import './bird-nest-scene.css'

type Props = Omit<SceneProps, 'sceneId'> & { sceneId: string }
type NestPhase = 'waiting' | 'returning' | 'settled'

const RETURN_DURATION_MS = 1_520
const SETTLE_DURATION_MS = 380
const REDUCED_MOTION_DURATION_MS = 320

/** One gentle tap helps a happy little bird fly safely back to its nest. */
export function BirdNestScene({
  sceneId,
  onComplete,
  onFeedback,
  onInteractionActivity,
  hintVisible,
}: Props) {
  const timersRef = useRef<number[]>([])
  const phaseRef = useRef<NestPhase>('waiting')
  const completionSentRef = useRef(false)
  const [phase, setPhase] = useState<NestPhase>('waiting')

  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
  }, [])

  function schedule(callback: () => void, delay: number) {
    timersRef.current.push(window.setTimeout(callback, delay))
  }

  function returnToNest() {
    if (phaseRef.current !== 'waiting') return

    phaseRef.current = 'returning'
    setPhase('returning')

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    schedule(() => {
      phaseRef.current = 'settled'
      setPhase('settled')
      schedule(() => {
        if (completionSentRef.current) return
        completionSentRef.current = true
        onComplete()
      }, reducedMotion ? 100 : SETTLE_DURATION_MS)
    }, reducedMotion ? REDUCED_MOTION_DURATION_MS : RETURN_DURATION_MS)
  }

  const prompt = phase === 'waiting'
    ? ['小鸟回鸟窝', '点一点小鸟，陪它飞回温暖的鸟窝。']
    : phase === 'returning'
      ? ['小鸟出发啦！', '它正轻轻扑着翅膀飞回鸟窝。']
      : ['安全到家啦！', '小鸟舒舒服服地回到鸟窝里。']

  return (
    <SceneBackdrop
      className={`bird-nest-scene bird-nest-scene--${phase}`}
      role="group"
      aria-label="小鸟回鸟窝场景"
    >
      <div className="bird-nest-scene__prompt" aria-live="polite" aria-atomic="true">
        <h2>{prompt[0]}</h2>
        <p>{prompt[1]}</p>
      </div>

      <CarIllustration
        className="bird-nest-scene__car"
        label="停在草地边的小汽车"
      />

      <div className="bird-nest-scene__branch" aria-hidden="true" />
      <div className="bird-nest-scene__nest" aria-hidden="true">
        <span className="bird-nest-scene__nest-bowl" />
        <span className="bird-nest-scene__nest-rim" />
        <span className="bird-nest-scene__nest-weave bird-nest-scene__nest-weave--one" />
        <span className="bird-nest-scene__nest-weave bird-nest-scene__nest-weave--two" />
      </div>

      <TapTarget
        className={[
          'bird-nest-scene__target',
          hintVisible && phase === 'waiting' ? 'bird-nest-scene__target--hinted' : '',
        ].filter(Boolean).join(' ')}
        sceneId={sceneId as SceneId}
        ariaLabel="点一下小鸟，陪它安全地飞回鸟窝"
        disabled={phase !== 'waiting'}
        onActivate={returnToNest}
        onFeedback={onFeedback}
        onInteractionActivity={onInteractionActivity}
      >
        <img
          className="bird-nest-scene__bird"
          src="/images/scenes/bird-nest.png"
          alt=""
          aria-hidden="true"
          draggable={false}
        />
      </TapTarget>
    </SceneBackdrop>
  )
}
