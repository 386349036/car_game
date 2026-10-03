import { useEffect, useRef, useState } from 'react'
import { TapTarget } from '../../game/interaction/TapTarget'
import { ForgivingDrag } from '../../game/interaction/ForgivingDrag'
import type { SceneProps } from '../../game/sceneTypes'
import { FIRST_THEME_SCENES, type FirstThemeSceneId } from './firstScenes'
import './first-theme-scene.css'
import { INSTRUMENT_DURATION_MS } from '../../game/audio/useInstrumentPerformance'

export function FirstThemeScene({ sceneId, onComplete, onFeedback, onInteractionActivity, hintVisible, onPlayMusic }: SceneProps & { sceneId: FirstThemeSceneId }) {
  const config = FIRST_THEME_SCENES[sceneId]
  const [helped, setHelped] = useState(false)
  const startedRef = useRef(false)
  const completedRef = useRef(false)
  const timerRef = useRef<number | null>(null)
  const dropTargetRef = useRef<HTMLDivElement>(null)
  const performanceAbortRef = useRef<AbortController | null>(null)

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    performanceAbortRef.current?.abort()
  }, [])

  useEffect(() => {
    if (sceneId !== 'ocean-shell-pearl') return
    const image = new Image()
    image.src = '/images/themes/ocean/ocean-shell-open.webp'
  }, [sceneId])

  function completeAction() {
    if (startedRef.current) return
    startedRef.current = true
    setHelped(true)
    if (sceneId !== 'music-soft-drum') onFeedback({ cue: 'object-repaired', sceneId })
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finish = () => {
      if (completedRef.current) return
      completedRef.current = true
      onComplete()
    }
    if (config.theme === 'music' && onPlayMusic) {
      const controller = new AbortController()
      performanceAbortRef.current = controller
      void onPlayMusic(sceneId, controller.signal).then(() => { if (!controller.signal.aborted) finish() })
    } else {
      timerRef.current = window.setTimeout(finish, config.theme === 'music' ? INSTRUMENT_DURATION_MS : reducedMotion ? 450 : 2200)
    }
  }

  const sprite = `/images/themes/${config.theme}/${config.asset}${sceneId === 'ocean-shell-pearl' && helped ? '-open' : ''}.webp`

  return (
    <section className={`first-theme-scene first-theme-scene--${config.theme}${helped ? ' first-theme-scene--helped' : ''}`} role="group" aria-label={config.title}>
      <img className="first-theme-scene__background" src={`/images/themes/${config.theme}/${config.background}.webp`} alt="" draggable={false} />
      <div className="first-theme-scene__prompt" aria-live="polite" aria-atomic="true">
        <h2>{helped ? config.success : config.title}</h2>
        <p>{helped ? config.theme === 'music' ? '听听小鼓，奏完再继续。' : '谢谢你的小帮忙！' : config.hint}</p>
      </div>

      {sceneId === 'life-slippers-pair' ? (
        <>
          <img className="first-theme-scene__fixed-slipper" src={sprite} alt="" draggable={false} />
          <div ref={dropTargetRef} className="first-theme-scene__drop-target" aria-hidden="true">
            {!helped && <span className="first-theme-scene__drop-outline" />}
          </div>
          <div className={`first-theme-scene__slipper-source${hintVisible && !helped ? ' first-theme-scene__target--hinted' : ''}`}>
            <ForgivingDrag sceneId={sceneId} ariaLabel={config.ariaLabel} targetRef={dropTargetRef} disabled={helped} onDrop={completeAction} onFeedback={onFeedback} onInteractionActivity={onInteractionActivity}>
              <img src={sprite} alt="" draggable={false} />
            </ForgivingDrag>
          </div>
        </>
      ) : sceneId === 'sky-balloon-launch' ? (
        <div className="first-theme-scene__balloon">
          <img src={sprite} alt="" draggable={false} />
          <TapTarget className={`first-theme-scene__basket-target${hintVisible && !helped ? ' first-theme-scene__target--hinted' : ''}`} sceneId={sceneId} ariaLabel={config.ariaLabel} disabled={helped} onActivate={completeAction} onFeedback={onFeedback} onInteractionActivity={onInteractionActivity}>
            <span className="first-theme-scene__basket-hint" aria-hidden="true">✦</span>
          </TapTarget>
        </div>
      ) : (
        <TapTarget className={`first-theme-scene__target${hintVisible && !helped ? ' first-theme-scene__target--hinted' : ''}`} sceneId={sceneId} ariaLabel={config.ariaLabel} disabled={helped} onActivate={completeAction} onFeedback={onFeedback} onInteractionActivity={onInteractionActivity}>
          <img src={sprite} alt="" draggable={false} />
        </TapTarget>
      )}
      {helped && <div className="first-theme-scene__celebration" aria-hidden="true">{config.theme === 'music' ? '♪ ♫ ♪' : '✦ ✧ ✦'}</div>}
    </section>
  )
}
