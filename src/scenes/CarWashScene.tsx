import { useEffect, useRef, useState } from 'react'
import { CarIllustration, SceneBackdrop } from '../components/SceneArt'
import { TapTarget } from '../game/interaction/TapTarget'
import type { SceneId, SceneProps } from '../game/sceneTypes'
import './car-wash-scene.css'

type Props = Omit<SceneProps, 'sceneId'> & { sceneId: string }
type WashPhase = 'waiting' | 'washing' | 'driving'

const WASH_DURATION_MS = 1_220
const DRIVE_DURATION_MS = 1_420

/** One gentle tap washes the car before it continues the journey. */
export function CarWashScene({
  sceneId,
  onComplete,
  onFeedback,
  onInteractionActivity,
  hintVisible,
}: Props) {
  const timersRef = useRef<number[]>([])
  const phaseRef = useRef<WashPhase>('waiting')
  const completedRef = useRef(false)
  const [phase, setPhase] = useState<WashPhase>('waiting')

  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
  }, [])

  function schedule(callback: () => void, delay: number) {
    timersRef.current.push(window.setTimeout(callback, delay))
  }

  function startWashing() {
    if (phaseRef.current !== 'waiting') return

    phaseRef.current = 'washing'
    setPhase('washing')
    schedule(() => {
      onFeedback({ cue: 'object-repaired', sceneId: sceneId as SceneId })
      phaseRef.current = 'driving'
      setPhase('driving')
      schedule(() => {
        if (completedRef.current) return
        completedRef.current = true
        onComplete()
      }, DRIVE_DURATION_MS)
    }, WASH_DURATION_MS)
  }

  const prompt = phase === 'waiting'
    ? ['小车要洗澡啦', '点一下大海绵，给小车洗干净。']
    : phase === 'washing'
      ? ['泡泡洗车开始啦！', '小车洗得干干净净。']
      : ['洗干净啦！', '小车继续出发。']

  return (
    <SceneBackdrop
      className={'car-wash-scene car-wash-scene--' + phase}
      role="group"
      aria-label="泡泡洗车场景"
    >
      <div className="car-wash-scene__prompt" aria-live="polite">
        <h2>{prompt[0]}</h2>
        <p>{prompt[1]}</p>
      </div>

      <CarIllustration className="car-wash-scene__car" label="正在洗车的小汽车" />

      <TapTarget
        className={[
          'car-wash-scene__sponge-target',
          hintVisible && phase === 'waiting' ? 'car-wash-scene__sponge-target--hinted' : '',
        ].filter(Boolean).join(' ')}
        sceneId={sceneId as SceneId}
        ariaLabel="点一下大海绵，给小车洗澡"
        disabled={phase !== 'waiting'}
        onActivate={startWashing}
        onFeedback={onFeedback}
        onInteractionActivity={onInteractionActivity}
      >
        <img className="car-wash-scene__sponge" src="/images/wash-sponge.png" alt="" aria-hidden="true" draggable={false} />
      </TapTarget>

      <p className="car-wash-scene__announcement" aria-live="polite" aria-atomic="true">
        {phase === 'waiting'
          ? '小车停在洗车房里。'
          : phase === 'washing'
            ? '泡泡正在轻轻洗小车。'
            : '小车洗干净了，继续出发。'}
      </p>
    </SceneBackdrop>
  )
}
