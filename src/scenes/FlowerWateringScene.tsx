import { useEffect, useRef, useState } from 'react'
import { CarIllustration, SceneBackdrop } from '../components/SceneArt'
import { TapTarget } from '../game/interaction/TapTarget'
import type { SceneId, SceneProps } from '../game/sceneTypes'
import './flower-watering-scene.css'

type Props = Omit<SceneProps, 'sceneId'> & { sceneId: string }
type WateringPhase = 'waiting' | 'watering' | 'blooming' | 'driving'

const WATERING_DURATION_MS = 820
const BLOOM_DURATION_MS = 760
const DRIVE_DURATION_MS = 1_420

/** One gentle tap waters the waiting bud; the flower blooms and the car moves on. */
export function FlowerWateringScene({
  sceneId,
  onComplete,
  onFeedback,
  onInteractionActivity,
  hintVisible,
}: Props) {
  const timersRef = useRef<number[]>([])
  const phaseRef = useRef<WateringPhase>('waiting')
  const completedRef = useRef(false)
  const [phase, setPhase] = useState<WateringPhase>('waiting')

  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
  }, [])

  function schedule(callback: () => void, delay: number) {
    timersRef.current.push(window.setTimeout(callback, delay))
  }

  function waterFlower() {
    if (phaseRef.current !== 'waiting') return

    phaseRef.current = 'watering'
    setPhase('watering')
    schedule(() => {
      phaseRef.current = 'blooming'
      setPhase('blooming')
      onFeedback({ cue: 'object-repaired', sceneId: sceneId as SceneId })
      schedule(() => {
        phaseRef.current = 'driving'
        setPhase('driving')
        schedule(() => {
          if (completedRef.current) return
          completedRef.current = true
          onComplete()
        }, DRIVE_DURATION_MS)
      }, BLOOM_DURATION_MS)
    }, WATERING_DURATION_MS)
  }

  const prompt = phase === 'waiting'
    ? ['花朵渴了', '点一下浇水壶，给花朵浇浇水。']
    : phase === 'watering'
      ? ['小水滴来啦！', '花朵喝到水啦。']
      : phase === 'blooming'
        ? ['花儿开啦！', '真漂亮，小车继续出发。']
        : ['花儿开得真漂亮！', '小车继续前进。']

  return (
    <SceneBackdrop
      className={'flower-watering-scene flower-watering-scene--' + phase}
      role="group"
      aria-label="给花朵浇水场景"
    >
      <div className="flower-watering-scene__prompt" aria-live="polite">
        <h2>{prompt[0]}</h2>
        <p>{prompt[1]}</p>
      </div>

      <CarIllustration className="flower-watering-scene__car" label="花园小路上的小汽车" />

      <img
        className="flower-watering-scene__bloom"
        src="/images/flower-open.webp"
        alt=""
        aria-hidden="true"
        draggable={false}
      />

      <TapTarget
        className={[
          'flower-watering-scene__water-target',
          hintVisible && phase === 'waiting' ? 'flower-watering-scene__water-target--hinted' : '',
        ].filter(Boolean).join(' ')}
        sceneId={sceneId as SceneId}
        ariaLabel="点一下浇水壶，给花朵浇水"
        disabled={phase !== 'waiting'}
        onActivate={waterFlower}
        onFeedback={onFeedback}
        onInteractionActivity={onInteractionActivity}
      >
        <img className="flower-watering-scene__can" src="/images/watering-can.webp" alt="" aria-hidden="true" draggable={false} />
        <span className="flower-watering-scene__water-drops" aria-hidden="true" />
      </TapTarget>

      <p className="flower-watering-scene__announcement" aria-live="polite" aria-atomic="true">
        {phase === 'waiting'
          ? '一朵花苞正在等水喝。'
          : phase === 'watering'
            ? '小水滴落在花朵上。'
            : phase === 'blooming'
              ? '花朵慢慢开放啦。'
              : '花儿开了，小车继续前进。'}
      </p>
    </SceneBackdrop>
  )
}
