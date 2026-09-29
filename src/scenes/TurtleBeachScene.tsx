import { useEffect, useRef, useState } from 'react'
import { CarIllustration, SceneBackdrop } from '../components/SceneArt'
import { TapTarget } from '../game/interaction/TapTarget'
import type { SceneId, SceneProps } from '../game/sceneTypes'
import './turtle-beach-scene.css'

type TurtleBeachSceneProps = Omit<SceneProps, 'sceneId'> & { sceneId: string }
type TurtlePhase = 'waiting' | 'crawling' | 'splashing' | 'finished'

const CRAWL_DURATION_MS = 1_850
const SPLASH_DURATION_MS = 1_100

/** One gentle tap helps a little sea turtle reach the water. */
export function TurtleBeachScene({
  sceneId,
  onComplete,
  onFeedback,
  onInteractionActivity,
  hintVisible,
}: TurtleBeachSceneProps) {
  const timersRef = useRef<number[]>([])
  const phaseRef = useRef<TurtlePhase>('waiting')
  const completionSentRef = useRef(false)
  const [phase, setPhase] = useState<TurtlePhase>('waiting')

  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
  }, [])

  function schedule(callback: () => void, delay: number) {
    timersRef.current.push(window.setTimeout(callback, delay))
  }

  function helpTurtle() {
    if (phaseRef.current !== 'waiting') return

    const reduceMotion = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    phaseRef.current = 'crawling'
    setPhase('crawling')

    schedule(() => {
      if (completionSentRef.current) return
      phaseRef.current = 'splashing'
      setPhase('splashing')
      onFeedback({ cue: 'object-repaired', sceneId: sceneId as SceneId })

      schedule(() => {
        if (completionSentRef.current) return
        completionSentRef.current = true
        phaseRef.current = 'finished'
        setPhase('finished')
        onComplete()
      }, reduceMotion ? 180 : SPLASH_DURATION_MS)
    }, reduceMotion ? 180 : CRAWL_DURATION_MS)
  }

  const prompt = phase === 'waiting'
    ? ['小海龟回海边', '点一下小海龟，陪它慢慢爬向海水。']
    : phase === 'crawling'
      ? ['慢慢爬，不着急', '温柔的海水就在前面。']
      : ['到海边啦！', '小海龟回到海水里了。']

  return (
    <SceneBackdrop
      className={`turtle-beach-scene turtle-beach-scene--${phase}`}
      role="group"
      aria-label="小海龟回海边场景"
    >
      <div className="turtle-beach-scene__prompt" aria-live="polite">
        <h2>{prompt[0]}</h2>
        <p>{prompt[1]}</p>
      </div>

      <CarIllustration className="turtle-beach-scene__car" label="在海边陪伴小海龟的小汽车" />

      <div className="turtle-beach-scene__waves" aria-hidden="true">
        <span />
        <span />
      </div>

      <TapTarget
        className={[
          'turtle-beach-scene__turtle-target',
          hintVisible && phase === 'waiting' ? 'turtle-beach-scene__turtle-target--hinted' : '',
        ].filter(Boolean).join(' ')}
        sceneId={sceneId as SceneId}
        ariaLabel="点一下小海龟，陪它爬到海边"
        disabled={phase !== 'waiting'}
        onActivate={helpTurtle}
        onFeedback={onFeedback}
        onInteractionActivity={onInteractionActivity}
      >
        <img src="/images/scenes/turtle-beach.png" alt="" aria-hidden="true" draggable={false} />
      </TapTarget>

      <p className="turtle-beach-scene__announcement" aria-live="polite" aria-atomic="true">
        {phase === 'waiting'
          ? '小海龟在岸边等着回到海水里。'
          : phase === 'crawling'
            ? '小海龟正在慢慢爬向海水。'
            : '小海龟到海边啦，水波轻轻荡开。'}
      </p>
    </SceneBackdrop>
  )
}
