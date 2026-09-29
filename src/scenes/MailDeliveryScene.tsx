import { useEffect, useRef, useState } from 'react'
import { CarIllustration, SceneBackdrop } from '../components/SceneArt'
import { ForgivingDrag } from '../game/interaction/ForgivingDrag'
import type { SceneProps } from '../game/sceneTypes'
import './mail-delivery-scene.css'

type MailPhase = 'waiting' | 'delivering' | 'driving'

/** Drag the envelope into a large, forgiving mailbox target. */
export function MailDeliveryScene({
  sceneId,
  onComplete,
  onFeedback,
  onInteractionActivity,
  hintVisible,
}: SceneProps) {
  const mailboxRef = useRef<HTMLDivElement | null>(null)
  const phaseRef = useRef<MailPhase>('waiting')
  const completedRef = useRef(false)
  const timersRef = useRef<number[]>([])
  const [phase, setPhase] = useState<MailPhase>('waiting')

  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
  }, [])

  function schedule(callback: () => void, delay: number) {
    timersRef.current.push(window.setTimeout(callback, delay))
  }

  function deliverMail() {
    if (phaseRef.current !== 'waiting') return
    phaseRef.current = 'delivering'
    setPhase('delivering')
    schedule(() => {
      onFeedback({ cue: 'object-repaired', sceneId })
      phaseRef.current = 'driving'
      setPhase('driving')
      schedule(() => {
        if (completedRef.current) return
        completedRef.current = true
        onComplete()
      }, 1_300)
    }, 1_000)
  }

  const prompt = phase === 'waiting'
    ? ['信件准备好了', '把大信封送进邮箱里吧。']
    : phase === 'delivering'
      ? ['信件送到啦！', '邮箱的小旗升起来了。']
      : ['谢谢你帮忙送信！', '小车继续出发。']

  return (
    <SceneBackdrop
      className={'mail-delivery-scene mail-delivery-scene--' + phase}
      role="group"
      aria-label="帮忙送信场景"
    >
      <div className="mail-delivery-scene__prompt" aria-live="polite">
        <h2>{prompt[0]}</h2>
        <p>{prompt[1]}</p>
      </div>

      <CarIllustration className="mail-delivery-scene__car" label="经过乡间小路的小汽车" />

      <div
        ref={mailboxRef}
        className="mail-delivery-scene__mailbox"
        role="img"
        aria-label="等着收信的大邮箱"
      >
        <img src="/images/mailbox.png" alt="" draggable={false} />
        <img className="mail-delivery-scene__flag" src="/images/mailbox-flag.png" alt="" aria-hidden="true" draggable={false} />
      </div>

      <ForgivingDrag
        className={[
          'mail-delivery-scene__envelope',
          hintVisible && phase === 'waiting' ? 'mail-delivery-scene__envelope--hinted' : '',
        ].filter(Boolean).join(' ')}
        sceneId={sceneId}
        ariaLabel="把大信封拖到邮箱里"
        targetRef={mailboxRef}
        hitSlop={76}
        disabled={phase !== 'waiting'}
        onDrop={deliverMail}
        onFeedback={onFeedback}
        onInteractionActivity={onInteractionActivity}
      >
        <img src="/images/envelope.png" alt="" draggable={false} />
      </ForgivingDrag>

      <p className="mail-delivery-scene__announcement" aria-live="polite" aria-atomic="true">
        {phase === 'waiting'
          ? '把信封送到大邮箱旁边就能完成。'
          : phase === 'delivering'
            ? '信件飞进邮箱，邮箱小旗升起来了。'
            : '送信完成，小汽车继续前进。'}
      </p>
    </SceneBackdrop>
  )
}
