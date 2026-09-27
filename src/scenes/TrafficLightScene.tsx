import { useEffect, useRef, useState } from 'react'
import { SceneBackdrop, CarIllustration } from '../components/SceneArt'
import { TapTarget } from '../game/interaction/TapTarget'
import type { SceneProps } from '../game/sceneTypes'
import './traffic-light-scene.css'

type TrafficLightSceneProps = Omit<SceneProps, 'sceneId'> & { sceneId: 'traffic-light' }

const CROSSING_START_DELAY_MS = 420
const CAR_CROSSING_MS = 1_350

export function TrafficLightScene({
  sceneId,
  onComplete,
  onFeedback,
  onInteractionActivity,
  hintVisible,
}: TrafficLightSceneProps) {
  const completionTimerRef = useRef<number | null>(null)
  const signalHandledRef = useRef(false)
  const completionSentRef = useRef(false)
  const [isGreen, setIsGreen] = useState(false)
  const [carPassing, setCarPassing] = useState(false)

  useEffect(() => () => {
    if (completionTimerRef.current !== null) {
      window.clearTimeout(completionTimerRef.current)
    }
  }, [])

  function handleSignalPress() {
    if (signalHandledRef.current) return

    signalHandledRef.current = true
    setIsGreen(true)
    completionTimerRef.current = window.setTimeout(() => {
      setCarPassing(true)
      completionTimerRef.current = window.setTimeout(() => {
        completionTimerRef.current = null
        if (completionSentRef.current) return

        completionSentRef.current = true
        onComplete()
      }, CAR_CROSSING_MS)
    }, CROSSING_START_DELAY_MS)
  }

  const sceneClassName = [
    'traffic-light-scene',
    hintVisible && !isGreen ? 'traffic-light-scene--hint' : '',
    carPassing ? 'traffic-light-scene--passing' : '',
  ].filter(Boolean).join(' ')

  return (
    <SceneBackdrop className={sceneClassName}>
      <div className="traffic-light-scene__side-road" aria-hidden="true" />
      <div className="traffic-light-scene__main-road" aria-hidden="true">
        <span className="traffic-light-scene__lane-mark" />
        <span className="traffic-light-scene__lane-mark" />
        <span className="traffic-light-scene__lane-mark" />
      </div>
      <div className="traffic-light-scene__crosswalk" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <span className="traffic-light-scene__signal-post" aria-hidden="true" />
      <span className="traffic-light-scene__signal-foot" aria-hidden="true" />

      <CarIllustration className="traffic-light-scene__car" />

      <TapTarget
        className="traffic-light-scene__signal-target"
        sceneId={sceneId}
        ariaLabel={isGreen ? '绿灯亮了，小车正在通行' : '红绿灯，点一下让小车通行'}
        onActivate={handleSignalPress}
        onFeedback={onFeedback}
        onInteractionActivity={onInteractionActivity}
        disabled={isGreen}
      >
        <span
          className="traffic-light-scene__signal-housing"
          data-signal-state={isGreen ? 'green' : 'red'}
          aria-hidden="true"
        >
          <span className="traffic-light-scene__lamp traffic-light-scene__lamp--red" />
          <span className="traffic-light-scene__lamp traffic-light-scene__lamp--yellow" />
          <span className="traffic-light-scene__lamp traffic-light-scene__lamp--green" />
        </span>
      </TapTarget>

      {carPassing && (
        <span className="traffic-light-scene__celebration" aria-hidden="true">
          ✦　✦　✦
        </span>
      )}

      <p className="traffic-light-scene__announcement" aria-live="polite" aria-atomic="true">
        {carPassing
          ? '绿灯亮啦，小车正在安全通过。'
          : isGreen
            ? '绿灯亮啦，小车马上出发。'
            : hintVisible
              ? '点一点红绿灯，让小车安全通过。'
              : '红灯亮着，小车在耐心等待。'}
      </p>
    </SceneBackdrop>
  )
}
