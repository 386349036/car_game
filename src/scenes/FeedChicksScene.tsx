import { useEffect, useRef, useState } from 'react'
import { CarIllustration, SceneBackdrop } from '../components/SceneArt'
import { TapTarget } from '../game/interaction/TapTarget'
import type { SceneProps } from '../game/sceneTypes'
import './feed-chicks-scene.css'

type FeedingPhase = 'waiting' | 'feeding' | 'driving'

/** One large tap brings the chicks to their grain bowl. */
export function FeedChicksScene({
  sceneId,
  onComplete,
  onFeedback,
  onInteractionActivity,
  hintVisible,
}: SceneProps) {
  const phaseRef = useRef<FeedingPhase>('waiting')
  const completedRef = useRef(false)
  const timersRef = useRef<number[]>([])
  const [phase, setPhase] = useState<FeedingPhase>('waiting')

  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
  }, [])

  function schedule(callback: () => void, delay: number) {
    timersRef.current.push(window.setTimeout(callback, delay))
  }

  function feedChicks() {
    if (phaseRef.current !== 'waiting') return
    phaseRef.current = 'feeding'
    setPhase('feeding')
    schedule(() => {
      onFeedback({ cue: 'object-repaired', sceneId })
      phaseRef.current = 'driving'
      setPhase('driving')
      schedule(() => {
        if (completedRef.current) return
        completedRef.current = true
        onComplete()
      }, 1_250)
    }, 1_350)
  }

  const prompt = phase === 'waiting'
    ? ['小鸡饿了', '点一点谷粒，喂给小鸡吃吧。']
    : phase === 'feeding'
      ? ['小鸡吃得真香！', '每一只都吃到谷粒啦。']
      : ['谢谢你照顾小鸡！', '小车继续出发。']

  return (
    <SceneBackdrop
      className={'feed-chicks-scene feed-chicks-scene--' + phase}
      role="group"
      aria-label="喂小鸡吃谷粒场景"
    >
      <div className="feed-chicks-scene__prompt" aria-live="polite">
        <h2>{prompt[0]}</h2>
        <p>{prompt[1]}</p>
      </div>

      <CarIllustration className="feed-chicks-scene__car" label="停在农场边的小汽车" />

      <img
        className="feed-chicks-scene__chicks"
        src="/images/feeding-chicks.png"
        alt=""
        aria-hidden="true"
        draggable={false}
      />

      <TapTarget
        className={[
          'feed-chicks-scene__bowl-target',
          hintVisible && phase === 'waiting' ? 'feed-chicks-scene__bowl-target--hinted' : '',
        ].filter(Boolean).join(' ')}
        sceneId={sceneId}
        ariaLabel="点一下谷粒碗，让小鸡吃东西"
        disabled={phase !== 'waiting'}
        onActivate={feedChicks}
        onFeedback={onFeedback}
        onInteractionActivity={onInteractionActivity}
      >
        <img src="/images/grain-bowl.png" alt="" aria-hidden="true" draggable={false} />
      </TapTarget>

      <p className="feed-chicks-scene__announcement" aria-live="polite" aria-atomic="true">
        {phase === 'waiting'
          ? '小鸡和谷粒碗在画面中间。'
          : phase === 'feeding'
            ? '小鸡正在开心地啄谷粒。'
            : '小鸡吃饱了，小车继续前进。'}
      </p>
    </SceneBackdrop>
  )
}
