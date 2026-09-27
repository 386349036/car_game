import { useEffect, useRef, useState } from 'react'
import { SceneBackdrop, CarIllustration } from '../components/SceneArt'
import { ForgivingDrag } from '../game/interaction/ForgivingDrag'
import type { SceneProps } from '../game/sceneTypes'
import './bridge-scene.css'

type BridgeSceneProps = Omit<SceneProps, 'sceneId'> & { sceneId: 'bridge' }

const CAR_CROSSING_MS = 1_350
const BRIDGE_SETTLE_MS = 360

export function BridgeScene({
  sceneId,
  onComplete,
  onFeedback,
  onInteractionActivity,
  hintVisible,
}: BridgeSceneProps) {
  const dropTargetRef = useRef<HTMLDivElement>(null)
  const completionTimerRef = useRef<number | null>(null)
  const dropHandledRef = useRef(false)
  const completionSentRef = useRef(false)
  const [plankPlaced, setPlankPlaced] = useState(false)
  const [carCrossing, setCarCrossing] = useState(false)

  useEffect(() => () => {
    if (completionTimerRef.current !== null) {
      window.clearTimeout(completionTimerRef.current)
    }
  }, [])

  function handlePlankDrop() {
    if (dropHandledRef.current) return

    dropHandledRef.current = true
    setPlankPlaced(true)
    onFeedback({ cue: 'object-repaired', sceneId })

    completionTimerRef.current = window.setTimeout(() => {
      setCarCrossing(true)
      completionTimerRef.current = window.setTimeout(() => {
        completionTimerRef.current = null
        if (completionSentRef.current) return

        completionSentRef.current = true
        onComplete()
      }, CAR_CROSSING_MS)
    }, BRIDGE_SETTLE_MS)
  }

  const sceneClassName = [
    'bridge-scene',
    hintVisible && !plankPlaced ? 'bridge-scene--hint' : '',
    carCrossing ? 'bridge-scene--crossing' : '',
  ].filter(Boolean).join(' ')

  return (
    <SceneBackdrop className={sceneClassName}>
      <div className="bridge-scene__waterway" aria-hidden="true">
        <svg viewBox="0 0 140 340" preserveAspectRatio="none">
          <path
            d="M79-12C18 36 118 82 65 127S17 213 78 251 108 308 48 352"
            fill="none"
            stroke="#72cbd4"
            strokeWidth="50"
            strokeLinecap="round"
          />
          <path
            d="M79-12C18 36 118 82 65 127S17 213 78 251 108 308 48 352"
            fill="none"
            stroke="#a5e8e8"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="2 24"
          />
        </svg>
        <span className="bridge-scene__water-glint bridge-scene__water-glint--one" />
        <span className="bridge-scene__water-glint bridge-scene__water-glint--two" />
      </div>

      <div
        ref={dropTargetRef}
        className={[
          'bridge-scene__drop-target',
          hintVisible && !plankPlaced ? 'bridge-scene__drop-target--hint' : '',
          plankPlaced ? 'bridge-scene__drop-target--placed' : '',
        ].filter(Boolean).join(' ')}
        aria-hidden="true"
      />

      <CarIllustration className="bridge-scene__car" />

      <ForgivingDrag
        className="bridge-scene__plank-drag"
        sceneId={sceneId}
        ariaLabel="木板，拖到桥面空缺处"
        targetRef={dropTargetRef}
        onDrop={handlePlankDrop}
        onFeedback={onFeedback}
        onInteractionActivity={onInteractionActivity}
        disabled={plankPlaced}
      >
        <WoodenPlank />
      </ForgivingDrag>

      <span className="bridge-scene__hint-spark" aria-hidden="true">
        ✨
      </span>

      <p className="bridge-scene__announcement" aria-live="polite" aria-atomic="true">
        {carCrossing
          ? '小桥修好了，小车正在慢慢通过。'
          : plankPlaced
            ? '木板放好了。'
            : hintVisible
              ? '把木板放到桥面空缺处。'
              : '小桥中间有空缺，把木板拖过去吧。'}
      </p>
    </SceneBackdrop>
  )
}

function WoodenPlank() {
  return (
    <svg
      className="bridge-scene__plank-visual"
      viewBox="0 0 208 78"
      focusable="false"
      aria-hidden="true"
    >
      <ellipse cx="104" cy="67" rx="86" ry="7" fill="#5e533e" opacity=".18" />
      <path
        d="M19 17Q19 10 27 10h154q8 0 8 8v40q0 8-8 8H27q-8 0-8-8V17Z"
        fill="#d89252"
        stroke="#8c633d"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <path d="M32 24h143M32 39h143M32 54h143" stroke="#b76e3e" strokeWidth="3.5" strokeLinecap="round" opacity=".78" />
      <path d="M43 17v42M165 17v42" stroke="#f3bd76" strokeWidth="3" strokeLinecap="round" opacity=".85" />
      <circle cx="27" cy="22" r="2.5" fill="#f4d8a2" />
      <circle cx="181" cy="22" r="2.5" fill="#f4d8a2" />
      <circle cx="27" cy="54" r="2.5" fill="#f4d8a2" />
      <circle cx="181" cy="54" r="2.5" fill="#f4d8a2" />
    </svg>
  )
}
