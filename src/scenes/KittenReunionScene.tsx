import { useEffect, useRef, useState } from 'react'
import { CarIllustration, SceneBackdrop } from '../components/SceneArt'
import { TapTarget } from '../game/interaction/TapTarget'
import type { SceneId, SceneProps } from '../game/sceneTypes'
import './kitten-reunion-scene.css'

type Props = Omit<SceneProps, 'sceneId'> & { sceneId: string }
type ReunionPhase = 'waiting' | 'reuniting' | 'together'

const REUNION_DURATION_MS = 1_720
const SETTLE_DURATION_MS = 420
const REDUCED_MOTION_DURATION_MS = 320

/** A single gentle tap brings a kitten and its mother together. */
export function KittenReunionScene({
  sceneId,
  onComplete,
  onFeedback,
  onInteractionActivity,
  hintVisible,
}: Props) {
  const timersRef = useRef<number[]>([])
  const phaseRef = useRef<ReunionPhase>('waiting')
  const completionSentRef = useRef(false)
  const [phase, setPhase] = useState<ReunionPhase>('waiting')

  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
  }, [])

  function schedule(callback: () => void, delay: number) {
    timersRef.current.push(window.setTimeout(callback, delay))
  }

  function reuniteCats() {
    if (phaseRef.current !== 'waiting') return

    phaseRef.current = 'reuniting'
    setPhase('reuniting')

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    schedule(() => {
      phaseRef.current = 'together'
      setPhase('together')
      schedule(() => {
        if (completionSentRef.current) return
        completionSentRef.current = true
        onComplete()
      }, reducedMotion ? 100 : SETTLE_DURATION_MS)
    }, reducedMotion ? REDUCED_MOTION_DURATION_MS : REUNION_DURATION_MS)
  }

  const prompt = phase === 'waiting'
    ? ['小猫找到妈妈', '点一点小猫，帮它和妈妈团聚。']
    : phase === 'reuniting'
      ? ['找到妈妈啦！', '小猫正轻轻靠近妈妈。']
      : ['团聚啦！', '小猫和妈妈开心地蹭蹭脸。']

  return (
    <SceneBackdrop
      className={`kitten-reunion-scene kitten-reunion-scene--${phase}`}
      role="group"
      aria-label="小猫找到妈妈场景"
    >
      <div className="kitten-reunion-scene__prompt" aria-live="polite" aria-atomic="true">
        <h2>{prompt[0]}</h2>
        <p>{prompt[1]}</p>
      </div>

      <CarIllustration
        className="kitten-reunion-scene__car"
        label="停在草地边的小汽车"
      />

      <TapTarget
        className={[
          'kitten-reunion-scene__target',
          hintVisible && phase === 'waiting' ? 'kitten-reunion-scene__target--hinted' : '',
        ].filter(Boolean).join(' ')}
        sceneId={sceneId as SceneId}
        ariaLabel="点一下小猫，帮它和妈妈团聚"
        disabled={phase !== 'waiting'}
        onActivate={reuniteCats}
        onFeedback={onFeedback}
        onInteractionActivity={onInteractionActivity}
      >
        <span className="kitten-reunion-scene__sprite kitten-reunion-scene__sprite--kitten" aria-hidden="true">
          <span className="kitten-reunion-scene__crop">
            <img src="/images/scenes/kitten-reunion.webp" alt="" draggable={false} />
          </span>
        </span>
        <span className="kitten-reunion-scene__sprite kitten-reunion-scene__sprite--mother" aria-hidden="true">
          <span className="kitten-reunion-scene__crop">
            <img src="/images/scenes/kitten-reunion.webp" alt="" draggable={false} />
          </span>
        </span>
      </TapTarget>
    </SceneBackdrop>
  )
}
