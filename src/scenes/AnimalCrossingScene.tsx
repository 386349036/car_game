import { useRef, useState, type AnimationEvent } from 'react'
import { CarIllustration, SceneBackdrop } from '../components/SceneArt'
import { TapTarget } from '../game/interaction/TapTarget'
import type { SceneProps } from '../game/sceneTypes'
import './animal-crossing-scene.css'

type CrossingPhase = 'waiting' | 'crossing' | 'finished'

/** A single gentle tap sends a family of ducklings across the zebra crossing. */
export function AnimalCrossingScene({
  sceneId,
  onComplete,
  onFeedback,
  onInteractionActivity,
  hintVisible,
}: SceneProps) {
  const [phase, setPhase] = useState<CrossingPhase>('waiting')
  const phaseRef = useRef<CrossingPhase>('waiting')
  const completionSentRef = useRef(false)

  function startCrossing() {
    if (phaseRef.current !== 'waiting') return
    phaseRef.current = 'crossing'
    setPhase('crossing')
  }

  function handleDucklingsAnimationEnd(event: AnimationEvent<HTMLDivElement>) {
    if (
      event.animationName !== 'animal-crossing-ducklings-walk' ||
      phaseRef.current !== 'crossing' ||
      completionSentRef.current
    ) {
      return
    }

    phaseRef.current = 'finished'
    completionSentRef.current = true
    setPhase('finished')
    onComplete()
  }

  const showHint = hintVisible && phase === 'waiting'

  return (
    <SceneBackdrop
      className={`animal-crossing-scene animal-crossing-scene--${phase}`}
      role="group"
      aria-label="小鸭子过马路场景"
      onAnimationEnd={handleDucklingsAnimationEnd}
    >
      <div className="animal-crossing-scene__prompt">
        <h2>小鸭子过马路</h2>
        <p>{phase === 'waiting' ? '点一点小鸭子，陪它们慢慢过马路。' : '小车停下来，耐心等小鸭子通过。'}</p>
      </div>

      <div className="animal-crossing-scene__crosswalk" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <CarIllustration
        className="animal-crossing-scene__car"
        label="停在斑马线前等待的小汽车"
      />

      <TapTarget
        className={[
          'animal-crossing-scene__duck-target',
          showHint ? 'animal-crossing-scene__duck-target--hinted' : '',
        ].filter(Boolean).join(' ')}
        sceneId={sceneId}
        ariaLabel="点一下小鸭子，让它们过马路"
        disabled={phase !== 'waiting'}
        onActivate={startCrossing}
        onFeedback={onFeedback}
        onInteractionActivity={onInteractionActivity}
      >
        <div className="animal-crossing-scene__ducklings" aria-hidden="true">
          <span className="animal-crossing-scene__duckling animal-crossing-scene__duckling--first">
            <img src="/images/ducklings.webp" alt="" draggable={false} />
          </span>
          <span className="animal-crossing-scene__duckling animal-crossing-scene__duckling--second">
            <img src="/images/ducklings.webp" alt="" draggable={false} />
          </span>
          <span className="animal-crossing-scene__duckling animal-crossing-scene__duckling--third">
            <img src="/images/ducklings.webp" alt="" draggable={false} />
          </span>
        </div>
      </TapTarget>

      <p className="animal-crossing-scene__announcement" aria-live="polite" aria-atomic="true">
        {phase === 'waiting' ? '小鸭子在路边等候。' : '小鸭子正在慢慢通过斑马线。小汽车停下等待。'}
      </p>
    </SceneBackdrop>
  )
}
