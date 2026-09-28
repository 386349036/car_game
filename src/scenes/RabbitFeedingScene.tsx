import { useEffect, useRef, useState } from 'react'
import { CarIllustration, SceneBackdrop } from '../components/SceneArt'
import { TapTarget } from '../game/interaction/TapTarget'
import type { SceneId, SceneProps } from '../game/sceneTypes'
import './rabbit-feeding-scene.css'

type Props = Omit<SceneProps, 'sceneId'> & { sceneId: string }
type FeedingPhase = 'waiting' | 'feeding' | 'driving'

const FEEDING_DURATION_MS = 1_180
const DRIVE_DURATION_MS = 1_420

/** One gentle tap delivers a carrot to the rabbit, then sends the car along. */
export function RabbitFeedingScene({
  sceneId,
  onComplete,
  onFeedback,
  onInteractionActivity,
  hintVisible,
}: Props) {
  const timersRef = useRef<number[]>([])
  const phaseRef = useRef<FeedingPhase>('waiting')
  const completedRef = useRef(false)
  const [phase, setPhase] = useState<FeedingPhase>('waiting')

  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
  }, [])

  function schedule(callback: () => void, delay: number) {
    timersRef.current.push(window.setTimeout(callback, delay))
  }

  function feedRabbit() {
    if (phaseRef.current !== 'waiting') return

    phaseRef.current = 'feeding'
    setPhase('feeding')
    schedule(() => {
      onFeedback({ cue: 'object-repaired', sceneId: sceneId as SceneId })
      phaseRef.current = 'driving'
      setPhase('driving')
      schedule(() => {
        if (completedRef.current) return
        completedRef.current = true
        onComplete()
      }, DRIVE_DURATION_MS)
    }, FEEDING_DURATION_MS)
  }

  const prompt = phase === 'waiting'
    ? ['小兔子饿了', '点一下胡萝卜，送给小兔子吃。']
    : phase === 'feeding'
      ? ['胡萝卜送到啦！', '小兔子吃得真开心。']
      : ['谢谢你喂饱小兔子！', '小车继续出发。']

  return (
    <SceneBackdrop
      className={'rabbit-feeding-scene rabbit-feeding-scene--' + phase}
      role="group"
      aria-label="给小兔子喂胡萝卜场景"
    >
      <div className="rabbit-feeding-scene__prompt" aria-live="polite">
        <h2>{prompt[0]}</h2>
        <p>{prompt[1]}</p>
      </div>

      <CarIllustration className="rabbit-feeding-scene__car" label="陪着小兔子的小汽车" />

      <TapTarget
        className={[
          'rabbit-feeding-scene__carrot-target',
          hintVisible && phase === 'waiting' ? 'rabbit-feeding-scene__carrot-target--hinted' : '',
        ].filter(Boolean).join(' ')}
        sceneId={sceneId as SceneId}
        ariaLabel="点一下胡萝卜，送给小兔子吃"
        disabled={phase !== 'waiting'}
        onActivate={feedRabbit}
        onFeedback={onFeedback}
        onInteractionActivity={onInteractionActivity}
      >
        <img className="rabbit-feeding-scene__carrot" src="/images/feeding-carrot.png" alt="" aria-hidden="true" draggable={false} />
      </TapTarget>

      <p className="rabbit-feeding-scene__announcement" aria-live="polite" aria-atomic="true">
        {phase === 'waiting'
          ? '小兔子在菜园边等着吃胡萝卜。'
          : phase === 'feeding'
            ? '胡萝卜送到小兔子嘴边啦。'
            : '小兔子吃饱了，小车继续前进。'}
      </p>
    </SceneBackdrop>
  )
}
