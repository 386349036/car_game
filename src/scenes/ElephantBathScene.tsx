import { useEffect, useRef, useState } from 'react'
import { CarIllustration, SceneBackdrop } from '../components/SceneArt'
import { TapTarget } from '../game/interaction/TapTarget'
import type { SceneId, SceneProps } from '../game/sceneTypes'
import './elephant-bath-scene.css'

type ElephantBathProps = Omit<SceneProps, 'sceneId'> & { sceneId: string }
type BathPhase = 'waiting' | 'splashing' | 'driving'

const SPLASH_DURATION_MS = 1_250
const DRIVE_DURATION_MS = 1_300

/** A single gentle tap starts a happy elephant bath, then continues the animal journey. */
export function ElephantBathScene({
  sceneId,
  onComplete,
  onFeedback,
  onInteractionActivity,
  hintVisible,
}: ElephantBathProps) {
  const phaseRef = useRef<BathPhase>('waiting')
  const completedRef = useRef(false)
  const timersRef = useRef<number[]>([])
  const [phase, setPhase] = useState<BathPhase>('waiting')

  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
  }, [])

  function schedule(callback: () => void, delay: number) {
    timersRef.current.push(window.setTimeout(callback, delay))
  }

  function startBath() {
    if (phaseRef.current !== 'waiting') return
    phaseRef.current = 'splashing'
    setPhase('splashing')
    schedule(() => {
      onFeedback({ cue: 'object-repaired', sceneId: sceneId as SceneId })
      phaseRef.current = 'driving'
      setPhase('driving')
      schedule(() => {
        if (completedRef.current) return
        completedRef.current = true
        onComplete()
      }, DRIVE_DURATION_MS)
    }, SPLASH_DURATION_MS)
  }

  const prompt = phase === 'waiting'
    ? ['小象要洗澡啦', '点一点小象，陪它开心玩水。']
    : phase === 'splashing'
      ? ['哗啦啦，洗干净啦！', '小象玩水玩得真开心。']
      : ['谢谢你陪小象玩！', '小车继续陪动物朋友出发。']

  return (
    <SceneBackdrop
      className={'elephant-bath-scene elephant-bath-scene--' + phase}
      role="group"
      aria-label="陪小象洗澡场景"
    >
      <div className="elephant-bath-scene__prompt" aria-live="polite">
        <h2>{prompt[0]}</h2>
        <p>{prompt[1]}</p>
      </div>

      <CarIllustration className="elephant-bath-scene__car" label="陪小象玩水的小汽车" />

      <TapTarget
        className={[
          'elephant-bath-scene__target',
          hintVisible && phase === 'waiting' ? 'elephant-bath-scene__target--hinted' : '',
        ].filter(Boolean).join(' ')}
        sceneId={sceneId as SceneId}
        ariaLabel="点一下小象，陪它开心地洗澡玩水"
        disabled={phase !== 'waiting'}
        onActivate={startBath}
        onFeedback={onFeedback}
        onInteractionActivity={onInteractionActivity}
      >
        <img src="/images/scenes/elephant-bath.png" alt="" aria-hidden="true" draggable={false} />
        <span className="elephant-bath-scene__splash" aria-hidden="true" />
      </TapTarget>

      <p className="elephant-bath-scene__announcement" aria-live="polite" aria-atomic="true">
        {phase === 'waiting'
          ? '小象坐在水边，等着洗澡。'
          : phase === 'splashing'
            ? '小象轻轻喷水，身上的水珠闪闪发亮。'
            : '小象洗好澡啦，小车继续前进。'}
      </p>
    </SceneBackdrop>
  )
}
