import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { CarIllustration, SceneBackdrop } from '../components/SceneArt'
import type { SceneProps } from '../game/sceneTypes'
import './kite-flying-scene.css'

type KitePhase = 'waiting' | 'rising' | 'finished'
const KITE_RISE_MS = 2_000

/** Press the large spool once; the kite keeps rising even if the child releases early. */
export function KiteFlyingScene({
  sceneId,
  onComplete,
  onFeedback,
  onInteractionActivity,
  hintVisible,
}: SceneProps) {
  const [phase, setPhase] = useState<KitePhase>('waiting')
  const phaseRef = useRef<KitePhase>('waiting')
  const completedRef = useRef(false)
  const holdActiveRef = useRef(false)
  const timersRef = useRef<number[]>([])

  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
  }, [])

  function schedule(callback: () => void, delay: number) {
    timersRef.current.push(window.setTimeout(callback, delay))
  }

  function startRising() {
    if (phaseRef.current !== 'waiting') return
    phaseRef.current = 'rising'
    setPhase('rising')
    onInteractionActivity('activity')
    onFeedback({ cue: 'target-tap', sceneId })
    schedule(() => {
      onFeedback({ cue: 'object-repaired', sceneId })
      phaseRef.current = 'finished'
      setPhase('finished')
      schedule(() => {
        if (completedRef.current) return
        completedRef.current = true
        onComplete()
      }, 650)
    }, KITE_RISE_MS)
  }

  function beginHold() {
    if (holdActiveRef.current) return
    holdActiveRef.current = true
    onInteractionActivity('start')
    startRising()
  }

  function endHold() {
    if (!holdActiveRef.current) return
    holdActiveRef.current = false
    onInteractionActivity('end')
  }

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    beginHold()
  }

  function handlePointerUp(event: PointerEvent<HTMLButtonElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    endHold()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    if (event.repeat) return
    beginHold()
  }

  function handleKeyUp(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Enter' || event.key === ' ') endHold()
  }

  const prompt = phase === 'waiting'
    ? ['风筝要飞起来啦', '按住大线轴，让风筝慢慢升高。']
    : phase === 'rising'
      ? ['飞得真高！', '风筝继续跟着风儿飞。']
      : ['风筝飞起来啦！', '小车继续去下一站。']

  return (
    <SceneBackdrop
      className={'kite-flying-scene kite-flying-scene--' + phase}
      role="group"
      aria-label="放飞小风筝场景"
    >
      <div className="kite-flying-scene__prompt" aria-live="polite">
        <h2>{prompt[0]}</h2>
        <p>{prompt[1]}</p>
      </div>

      <span className="kite-flying-scene__string" aria-hidden="true" />
      <img className="kite-flying-scene__kite" src="/images/kite.png" alt="" aria-hidden="true" draggable={false} />
      <CarIllustration className="kite-flying-scene__car" label="在草地旁看风筝的小汽车" />

      <button
        className={[
          'kite-flying-scene__spool',
          hintVisible && phase === 'waiting' ? 'kite-flying-scene__spool--hinted' : '',
        ].filter(Boolean).join(' ')}
        type="button"
        aria-label="按住线轴，让风筝升起来"
        disabled={phase === 'finished'}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onClick={startRising}
      >
        <img src="/images/kite-spool.png" alt="" aria-hidden="true" draggable={false} />
      </button>

      <p className="kite-flying-scene__announcement" aria-live="polite" aria-atomic="true">
        {phase === 'waiting'
          ? '按住线轴开始放风筝；松开后风筝也会继续升高。'
          : phase === 'rising'
            ? '风筝正慢慢升向天空。'
            : '风筝已经飞起来了。'}
      </p>
    </SceneBackdrop>
  )
}
