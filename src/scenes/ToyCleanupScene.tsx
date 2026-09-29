import { useEffect, useRef, useState } from 'react'
import { CarIllustration, SceneBackdrop } from '../components/SceneArt'
import { ForgivingDrag } from '../game/interaction/ForgivingDrag'
import type { SceneProps } from '../game/sceneTypes'
import './toy-cleanup-scene.css'

type CleanupPhase = 'waiting' | 'storing' | 'driving'

/** Drag the oversized blocks into the open toy box. */
export function ToyCleanupScene({
  sceneId,
  onComplete,
  onFeedback,
  onInteractionActivity,
  hintVisible,
}: SceneProps) {
  const toyBoxRef = useRef<HTMLDivElement | null>(null)
  const phaseRef = useRef<CleanupPhase>('waiting')
  const completedRef = useRef(false)
  const timersRef = useRef<number[]>([])
  const [phase, setPhase] = useState<CleanupPhase>('waiting')

  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
  }, [])

  function schedule(callback: () => void, delay: number) {
    timersRef.current.push(window.setTimeout(callback, delay))
  }

  function storeToys() {
    if (phaseRef.current !== 'waiting') return
    phaseRef.current = 'storing'
    setPhase('storing')
    schedule(() => {
      onFeedback({ cue: 'object-repaired', sceneId })
      phaseRef.current = 'driving'
      setPhase('driving')
      schedule(() => {
        if (completedRef.current) return
        completedRef.current = true
        onComplete()
      }, 1_200)
    }, 900)
  }

  const prompt = phase === 'waiting'
    ? ['玩具要回家啦', '把大积木放进玩具箱吧。']
    : phase === 'storing'
      ? ['玩具收好了！', '积木整齐地住进箱子里。']
      : ['谢谢你帮忙收拾！', '小车继续出发。']

  return (
    <SceneBackdrop
      className={'toy-cleanup-scene toy-cleanup-scene--' + phase}
      role="group"
      aria-label="收好玩具场景"
    >
      <div className="toy-cleanup-scene__prompt" aria-live="polite">
        <h2>{prompt[0]}</h2>
        <p>{prompt[1]}</p>
      </div>

      <CarIllustration className="toy-cleanup-scene__car" label="陪孩子整理玩具的小汽车" />

      <div
        ref={toyBoxRef}
        className={[
          'toy-cleanup-scene__box',
          phase === 'storing' ? 'toy-cleanup-scene__box--glowing' : '',
        ].filter(Boolean).join(' ')}
        role="img"
        aria-label="打开的玩具箱"
      >
        <img src="/images/scenes/toy-box.png" alt="" draggable={false} />
      </div>

      <ForgivingDrag
        className={[
          'toy-cleanup-scene__blocks',
          hintVisible && phase === 'waiting' ? 'toy-cleanup-scene__blocks--hinted' : '',
        ].filter(Boolean).join(' ')}
        sceneId={sceneId}
        ariaLabel="把大积木拖进打开的玩具箱"
        targetRef={toyBoxRef}
        hitSlop={82}
        disabled={phase !== 'waiting'}
        onDrop={storeToys}
        onFeedback={onFeedback}
        onInteractionActivity={onInteractionActivity}
      >
        <img src="/images/scenes/blocks.png" alt="" draggable={false} />
      </ForgivingDrag>

      <p className="toy-cleanup-scene__announcement" aria-live="polite" aria-atomic="true">
        {phase === 'waiting'
          ? '把积木送到打开的玩具箱旁边。'
          : phase === 'storing'
            ? '积木已经放进玩具箱了。'
            : '玩具收好了，小汽车继续前进。'}
      </p>
    </SceneBackdrop>
  )
}
