import { useEffect, useRef, useState } from 'react'
import { CarIllustration, SceneBackdrop } from '../components/SceneArt'
import { TapTarget } from '../game/interaction/TapTarget'
import type { SceneProps } from '../game/sceneTypes'
import './puppy-frisbee-scene.css'

type FrisbeePhase = 'waiting' | 'fetching' | 'returning'

/** Tap the frisbee to invite a friendly game of fetch. */
export function PuppyFrisbeeScene({
  sceneId,
  onComplete,
  onFeedback,
  onInteractionActivity,
  hintVisible,
}: SceneProps) {
  const phaseRef = useRef<FrisbeePhase>('waiting')
  const completedRef = useRef(false)
  const timersRef = useRef<number[]>([])
  const [phase, setPhase] = useState<FrisbeePhase>('waiting')

  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
  }, [])

  function schedule(callback: () => void, delay: number) {
    timersRef.current.push(window.setTimeout(callback, delay))
  }

  function throwFrisbee() {
    if (phaseRef.current !== 'waiting') return
    phaseRef.current = 'fetching'
    setPhase('fetching')
    schedule(() => {
      onFeedback({ cue: 'object-repaired', sceneId })
      phaseRef.current = 'returning'
      setPhase('returning')
      schedule(() => {
        if (completedRef.current) return
        completedRef.current = true
        onComplete()
      }, 900)
    }, 1_200)
  }

  const prompt = phase === 'waiting'
    ? ['小狗想玩飞盘', '点一下飞盘，陪它玩一玩。']
    : phase === 'fetching'
      ? ['飞盘飞出去啦！', '小狗跑去把它叼回来。']
      : ['小狗玩得真开心！', '小车继续出发。']

  return (
    <SceneBackdrop
      className={'puppy-frisbee-scene puppy-frisbee-scene--' + phase}
      role="group"
      aria-label="陪小狗玩飞盘场景"
    >
      <div className="puppy-frisbee-scene__prompt" aria-live="polite">
        <h2>{prompt[0]}</h2>
        <p>{prompt[1]}</p>
      </div>

      <CarIllustration className="puppy-frisbee-scene__car" label="停在草地边的小汽车" />
      <img className="puppy-frisbee-scene__puppy" src="/images/scenes/puppy.png" alt="" aria-hidden="true" draggable={false} />

      <TapTarget
        className={[
          'puppy-frisbee-scene__target',
          hintVisible && phase === 'waiting' ? 'puppy-frisbee-scene__target--hinted' : '',
        ].filter(Boolean).join(' ')}
        sceneId={sceneId}
        ariaLabel="点一下飞盘，和小狗玩接飞盘"
        disabled={phase !== 'waiting'}
        onActivate={throwFrisbee}
        onFeedback={onFeedback}
        onInteractionActivity={onInteractionActivity}
      >
        <img src="/images/scenes/frisbee.png" alt="" aria-hidden="true" draggable={false} />
      </TapTarget>

      <p className="puppy-frisbee-scene__announcement" aria-live="polite" aria-atomic="true">
        {phase === 'waiting'
          ? '小狗在草地上等着玩飞盘。'
          : phase === 'fetching'
            ? '小狗正在跑去接飞盘。'
            : '小狗把飞盘叼回来啦。'}
      </p>
    </SceneBackdrop>
  )
}
