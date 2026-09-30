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
    <img
      className="bridge-scene__plank-visual"
      src="/images/plank.webp"
      alt=""
      aria-hidden="true"
      draggable={false}
    />
  )
}
