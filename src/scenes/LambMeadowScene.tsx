import { useEffect, useRef, useState } from 'react'
import { CarIllustration, SceneBackdrop } from '../components/SceneArt'
import { TapTarget } from '../game/interaction/TapTarget'
import type { SceneId, SceneProps } from '../game/sceneTypes'
import './lamb-meadow-scene.css'

type LambMeadowSceneProps = Omit<SceneProps, 'sceneId'> & { sceneId: string }
type LambPhase = 'waiting' | 'eating' | 'happy' | 'finished'

const GRAZE_DURATION_MS = 1_400
const HAPPY_DURATION_MS = 850

/** One gentle tap lets a happy lamb nibble grass and finish the scene. */
export function LambMeadowScene({
  sceneId,
  onComplete,
  onFeedback,
  onInteractionActivity,
  hintVisible,
}: LambMeadowSceneProps) {
  const timersRef = useRef<number[]>([])
  const phaseRef = useRef<LambPhase>('waiting')
  const completionSentRef = useRef(false)
  const [phase, setPhase] = useState<LambPhase>('waiting')

  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
  }, [])

  function schedule(callback: () => void, delay: number) {
    timersRef.current.push(window.setTimeout(callback, delay))
  }

  function feedLamb() {
    if (phaseRef.current !== 'waiting') return

    const reduceMotion = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    phaseRef.current = 'eating'
    setPhase('eating')

    schedule(() => {
      if (completionSentRef.current) return
      phaseRef.current = 'happy'
      setPhase('happy')
      onFeedback({ cue: 'object-repaired', sceneId: sceneId as SceneId })

      schedule(() => {
        if (completionSentRef.current) return
        completionSentRef.current = true
        phaseRef.current = 'finished'
        setPhase('finished')
        onComplete()
      }, reduceMotion ? 180 : HAPPY_DURATION_MS)
    }, reduceMotion ? 180 : GRAZE_DURATION_MS)
  }

  const prompt = phase === 'waiting'
    ? ['小绵羊吃青草', '点一下小绵羊，陪它尝一口青草。']
    : phase === 'eating'
      ? ['青草真香！', '小绵羊正在慢慢咀嚼。']
      : ['小绵羊好开心！', '它吃饱啦，谢谢你陪着它。']

  return (
    <SceneBackdrop
      className={`lamb-meadow-scene lamb-meadow-scene--${phase}`}
      role="group"
      aria-label="小绵羊吃青草场景"
    >
      <div className="lamb-meadow-scene__prompt" aria-live="polite">
        <h2>{prompt[0]}</h2>
        <p>{prompt[1]}</p>
      </div>

      <CarIllustration className="lamb-meadow-scene__car" label="来陪小绵羊吃青草的小汽车" />

      <TapTarget
        className={[
          'lamb-meadow-scene__lamb-target',
          hintVisible && phase === 'waiting' ? 'lamb-meadow-scene__lamb-target--hinted' : '',
        ].filter(Boolean).join(' ')}
        sceneId={sceneId as SceneId}
        ariaLabel="点一下小绵羊，让它轻轻吃青草"
        disabled={phase !== 'waiting'}
        onActivate={feedLamb}
        onFeedback={onFeedback}
        onInteractionActivity={onInteractionActivity}
      >
        <img src="/images/scenes/lamb-meadow.png" alt="" aria-hidden="true" draggable={false} />
        <span className="lamb-meadow-scene__grass" aria-hidden="true">
          <span className="lamb-meadow-scene__grass-blade lamb-meadow-scene__grass-blade--one" />
          <span className="lamb-meadow-scene__grass-blade lamb-meadow-scene__grass-blade--two" />
          <span className="lamb-meadow-scene__grass-blade lamb-meadow-scene__grass-blade--three" />
          <span className="lamb-meadow-scene__grass-blade lamb-meadow-scene__grass-blade--four" />
        </span>
        <span className="lamb-meadow-scene__happy-glow lamb-meadow-scene__happy-glow--one" />
        <span className="lamb-meadow-scene__happy-glow lamb-meadow-scene__happy-glow--two" />
        <span className="lamb-meadow-scene__happy-glow lamb-meadow-scene__happy-glow--three" />
      </TapTarget>

      <p className="lamb-meadow-scene__announcement" aria-live="polite" aria-atomic="true">
        {phase === 'waiting'
          ? '小绵羊在草地上等着尝青草。'
          : phase === 'eating'
            ? '小绵羊正在轻轻咀嚼青草。'
            : '小绵羊吃饱了，露出了开心的笑容。'}
      </p>
    </SceneBackdrop>
  )
}
