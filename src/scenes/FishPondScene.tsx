import { useEffect, useRef, useState } from 'react'
import { CarIllustration, SceneBackdrop } from '../components/SceneArt'
import { TapTarget } from '../game/interaction/TapTarget'
import type { SceneProps } from '../game/sceneTypes'
import './fish-pond-scene.css'

type FishPhase = 'waiting' | 'swimming' | 'driving'

/** Tap the broad pond to help the little fish swim into the water. */
export function FishPondScene({
  sceneId,
  onComplete,
  onFeedback,
  onInteractionActivity,
  hintVisible,
}: SceneProps) {
  const phaseRef = useRef<FishPhase>('waiting')
  const completedRef = useRef(false)
  const timersRef = useRef<number[]>([])
  const [phase, setPhase] = useState<FishPhase>('waiting')

  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
  }, [])

  function schedule(callback: () => void, delay: number) {
    timersRef.current.push(window.setTimeout(callback, delay))
  }

  function helpFish() {
    if (phaseRef.current !== 'waiting') return
    phaseRef.current = 'swimming'
    setPhase('swimming')
    schedule(() => {
      onFeedback({ cue: 'object-repaired', sceneId })
      phaseRef.current = 'driving'
      setPhase('driving')
      schedule(() => {
        if (completedRef.current) return
        completedRef.current = true
        onComplete()
      }, 1_250)
    }, 1_250)
  }

  const prompt = phase === 'waiting'
    ? ['小鱼想回池塘', '点一点大池塘，帮它游回家。']
    : phase === 'swimming'
      ? ['小鱼回到水里啦！', '它在池塘里快乐地游泳。']
      : ['谢谢你帮助小鱼！', '小车继续回家。']

  return (
    <SceneBackdrop
      className={'fish-pond-scene fish-pond-scene--' + phase}
      role="group"
      aria-label="帮助小鱼回池塘场景"
    >
      <div className="fish-pond-scene__prompt" aria-live="polite">
        <h2>{prompt[0]}</h2>
        <p>{prompt[1]}</p>
      </div>

      <CarIllustration className="fish-pond-scene__car" label="停在池塘边的小汽车" />

      <img className="fish-pond-scene__fish" src="/images/scenes/fish.webp" alt="" aria-hidden="true" draggable={false} />

      <TapTarget
        className={[
          'fish-pond-scene__pond-target',
          hintVisible && phase === 'waiting' ? 'fish-pond-scene__pond-target--hinted' : '',
        ].filter(Boolean).join(' ')}
        sceneId={sceneId}
        ariaLabel="点一下大池塘，帮助小鱼回家"
        disabled={phase !== 'waiting'}
        onActivate={helpFish}
        onFeedback={onFeedback}
        onInteractionActivity={onInteractionActivity}
      >
        <span className="fish-pond-scene__ripple" aria-hidden="true" />
      </TapTarget>

      <p className="fish-pond-scene__announcement" aria-live="polite" aria-atomic="true">
        {phase === 'waiting'
          ? '小鱼在池塘旁边等着回家。'
          : phase === 'swimming'
            ? '小鱼正游进池塘。'
            : '小鱼已经回到池塘啦。'}
      </p>
    </SceneBackdrop>
  )
}
