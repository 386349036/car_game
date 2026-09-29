import { useRef, useState, type AnimationEvent } from 'react'
import { CarIllustration, SceneBackdrop } from '../components/SceneArt'
import { TapTarget } from '../game/interaction/TapTarget'
import type { SceneProps } from '../game/sceneTypes'
import './stone-scene.css'

type StoneScenePhase = 'ready' | 'clearing' | 'driving' | 'finished'

/** The first playable scene: tap the excavator to move the rock off the road. */
export function StoneScene({
  sceneId,
  onComplete,
  onFeedback,
  onInteractionActivity,
  hintVisible,
}: SceneProps) {
  const [phase, setPhase] = useState<StoneScenePhase>('ready')
  const phaseRef = useRef<StoneScenePhase>('ready')

  function beginClearing() {
    if (phaseRef.current !== 'ready') return

    phaseRef.current = 'clearing'
    setPhase('clearing')
  }

  function handleRockAnimationEnd(event: AnimationEvent<HTMLImageElement>) {
    if (
      event.target !== event.currentTarget ||
      event.animationName !== 'stone-rock-to-verge' ||
      phaseRef.current !== 'clearing'
    ) {
      return
    }

    phaseRef.current = 'driving'
    setPhase('driving')
    onFeedback({ cue: 'object-repaired', sceneId })
  }

  function handleCarAnimationEnd(event: AnimationEvent<HTMLImageElement>) {
    if (
      event.target !== event.currentTarget ||
      event.animationName !== 'stone-car-drive' ||
      phaseRef.current !== 'driving'
    ) {
      return
    }

    phaseRef.current = 'finished'
    setPhase('finished')
    onComplete()
  }

  const targetDisabled = phase !== 'ready'
  const showHint = hintVisible && phase === 'ready'

  return (
    <SceneBackdrop
      className={`stone-scene stone-scene--${phase}`}
      role="group"
      aria-label="石头挡路场景"
    >
      <div className="stone-scene__prompt" aria-live="polite">
        <h2>石头挡路啦</h2>
        <p>
          {phase === 'ready'
            ? '请挖掘机来帮忙，让小车继续前进。'
            : phase === 'clearing'
              ? '挖掘机正在搬开大石头。'
              : '石头放到路边啦，小车继续出发！'}
        </p>
      </div>

      <TapTarget
        sceneId={sceneId}
        ariaLabel="点一下大石头或挖掘机，帮小车清开道路"
        disabled={targetDisabled}
        onActivate={beginClearing}
        onFeedback={onFeedback}
        onInteractionActivity={onInteractionActivity}
        className="stone-scene__tap-target stone-scene__rock-target"
      >
        <StoneIllustration onAnimationEnd={handleRockAnimationEnd} />
      </TapTarget>

      <CarIllustration
        className="stone-scene__car"
        label="停在石头前的小汽车"
        onAnimationEnd={handleCarAnimationEnd}
      />

      {/* TapTarget owns the native button; reuse the shared button skin without nesting buttons. */}
      <TapTarget
        sceneId={sceneId}
        ariaLabel="点击挖掘机，帮小车清开石头"
        disabled={targetDisabled}
        onActivate={beginClearing}
        onFeedback={onFeedback}
        onInteractionActivity={onInteractionActivity}
        className={[
          'stone-scene__tap-target',
          'stone-scene__excavator-target',
          'scene-button',
          'scene-button--warm',
          showHint ? 'stone-scene__excavator-target--hinted' : '',
        ].filter(Boolean).join(' ')}
      >
        <ExcavatorIllustration />
      </TapTarget>
    </SceneBackdrop>
  )
}

interface StoneIllustrationProps {
  onAnimationEnd: (event: AnimationEvent<HTMLImageElement>) => void
}

function StoneIllustration({ onAnimationEnd }: StoneIllustrationProps) {
  return (
    <img
      className="stone-scene__stone-art"
      src="/images/stone.png"
      alt=""
      aria-hidden="true"
      draggable={false}
      onAnimationEnd={onAnimationEnd}
    />
  )
}

function ExcavatorIllustration() {
  return (
    <img
      className="stone-scene__excavator-art"
      src="/images/excavator.png"
      alt=""
      aria-hidden="true"
      draggable={false}
    />
  )
}
