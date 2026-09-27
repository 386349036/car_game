import { useEffect, useRef, useState, type AnimationEvent } from 'react'
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
  const entryHintSentRef = useRef(false)

  useEffect(() => {
    if (entryHintSentRef.current) return

    entryHintSentRef.current = true
    onFeedback({ cue: 'scene-hint', sceneId })
  }, [onFeedback, sceneId])

  function beginClearing() {
    if (phaseRef.current !== 'ready') return

    phaseRef.current = 'clearing'
    setPhase('clearing')
  }

  function handleRockAnimationEnd(event: AnimationEvent<SVGSVGElement>) {
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

  function handleCarAnimationEnd(event: AnimationEvent<SVGSVGElement>) {
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
        ariaLabel="路中间的大石头"
        isCorrect={false}
        disabled={targetDisabled}
        onActivate={() => undefined}
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
  onAnimationEnd: (event: AnimationEvent<SVGSVGElement>) => void
}

function StoneIllustration({ onAnimationEnd }: StoneIllustrationProps) {
  return (
    <svg
      className="stone-scene__stone-art"
      viewBox="0 0 160 140"
      aria-hidden="true"
      focusable="false"
      onAnimationEnd={onAnimationEnd}
    >
      <ellipse cx="81" cy="126" rx="58" ry="9" fill="#52616b" opacity=".16" />
      <path
        d="M24 112c-7-11-3-25 5-35l20-28c7-9 18-13 30-12l22 2c13 1 21 9 27 19l13 24c6 10 5 22-2 31l-11 14H38Z"
        fill="#929da0"
        stroke="#68777a"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <path
        d="M48 62c7-9 16-13 28-12"
        fill="none"
        stroke="#c4ccca"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path d="m99 57 12 4" stroke="#c4ccca" strokeWidth="6" strokeLinecap="round" />
      <circle cx="54" cy="91" r="4" fill="#788689" />
    </svg>
  )
}

function ExcavatorIllustration() {
  return (
    <svg
      className="stone-scene__excavator-art"
      viewBox="0 0 240 180"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx="134" cy="159" rx="82" ry="10" fill="#52616b" opacity=".15" />
      <g className="stone-scene__excavator-arm">
        <path
          d="m141 101-33-40-35 10-29 34"
          fill="none"
          stroke="#8c633d"
          strokeWidth="28"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="m141 101-33-40-35 10-29 34"
          fill="none"
          stroke="#f5b34d"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M46 101c-10 3-17 11-18 22l19 8 18-14-5-15Z"
          fill="#e89e3d"
          stroke="#8c633d"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <path d="m74 74 9 14" stroke="#fff0c4" strokeWidth="5" strokeLinecap="round" />
      </g>
      <path
        d="M91 92h77c16 0 28 10 31 26l4 16H76l2-23c1-11 5-19 13-19Z"
        fill="#52616b"
        stroke="#3e4b52"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <circle cx="101" cy="123" r="13" fill="#f7f0d8" />
      <circle cx="139" cy="123" r="13" fill="#f7f0d8" />
      <circle cx="176" cy="123" r="13" fill="#f7f0d8" />
      <path
        d="M108 91V62c0-7 5-12 12-12h31c10 0 18 7 19 17l3 25Z"
        fill="#f5b34d"
        stroke="#8c633d"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <path d="M126 58h22c5 0 9 4 10 9l2 16h-34Z" fill="#bce9e9" />
      <path d="M114 94h65" stroke="#fff0c4" strokeWidth="6" strokeLinecap="round" />
      <circle cx="179" cy="99" r="6" fill="#ffe28b" />
    </svg>
  )
}
