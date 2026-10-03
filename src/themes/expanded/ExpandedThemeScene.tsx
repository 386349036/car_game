import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { TapTarget } from '../../game/interaction/TapTarget'
import { ForgivingDrag } from '../../game/interaction/ForgivingDrag'
import type { SceneProps } from '../../game/sceneTypes'
import { EXPANDED_SCENES, type ExpandedSceneId, type ExpandedSceneConfig } from './expandedScenes'
import './expanded-theme-scene.css'
import { INSTRUMENT_DURATION_MS } from '../../game/audio/useInstrumentPerformance'

export function ExpandedThemeScene({ sceneId, onComplete, onFeedback, onInteractionActivity, hintVisible, onPlayMusic }: SceneProps & { sceneId: ExpandedSceneId }) {
  const config: ExpandedSceneConfig = EXPANDED_SCENES[sceneId]
  const [helped, setHelped] = useState(false)
  const startedRef = useRef(false)
  const completedRef = useRef(false)
  const timerRef = useRef<number | null>(null)
  const targetRef = useRef<HTMLDivElement>(null)
  const performanceAbortRef = useRef<AbortController | null>(null)
  const image = (asset: string) => `/images/themes/${config.theme}/${asset}.webp`

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    performanceAbortRef.current?.abort()
  }, [])

  useEffect(() => {
    const states: Partial<Record<ExpandedSceneId, string>> = {
      'sky-moon-blanket': 'moon-friend-asleep',
      'life-bear-blanket': 'child-bed-covered',
      'music-box-goodnight': 'music-eight-tone-box-open',
    }
    const next = states[sceneId]
    if (next) {
      const preload = new Image()
      preload.src = `/images/themes/${sceneId.split('-')[0]}/${next}.webp`
    }
  }, [sceneId])

  function completeAction() {
    if (startedRef.current) return
    startedRef.current = true
    setHelped(true)
    if (config.theme !== 'music') onFeedback({ cue: 'object-repaired', sceneId })
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
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
      timerRef.current = window.setTimeout(finish, config.theme === 'music' ? INSTRUMENT_DURATION_MS : reduced ? 500 : 2400)
    }
  }

  let companion = config.companion
  if (helped && sceneId === 'sky-moon-blanket') companion = 'moon-friend-asleep'
  const background = helped && sceneId === 'life-bear-blanket' ? 'child-bed-covered' : config.background
  const primary = helped && sceneId === 'music-box-goodnight' ? 'music-eight-tone-box-open' : config.asset
  const geometry = { '--target-x': `${config.targetX}%`, '--target-y': `${config.targetY}%` } as CSSProperties
  const needsWater = config.effect === 'whale-splash' || config.effect === 'rain-cloud' || config.effect === 'wash-hands'

  return (
    <section className={`world-scene world-scene--${config.theme} world-scene--${config.effect}${helped ? ' world-scene--helped' : ''}`} style={geometry} role="group" aria-label={config.title}>
      <img className="world-scene__background" src={image(background)} alt="" draggable={false} />
      <div className="world-scene__prompt" aria-live="polite" aria-atomic="true">
        <h2>{helped ? config.success : config.title}</h2>
        <p>{helped ? config.theme === 'music' ? '听听小旋律，奏完再继续。' : '谢谢你，我们继续玩吧。' : config.hint}</p>
      </div>

      {companion && <img className="world-scene__companion" src={image(companion)} alt="" draggable={false} />}
      {config.effect === 'crab-home' && <span className="world-scene__sand-home" aria-hidden="true" />}
      {config.effect === 'whale-splash' && <span className="world-scene__whale-ripple" aria-hidden="true" />}
      {config.effect === 'coral-door' && <img className="world-scene__fish" src={image('coral-fish')} alt="" draggable={false} />}
      {config.effect === 'rainbow-bridge' && <div className="world-scene__rainbow-sides" aria-hidden="true"><span /></div>}
      {config.effect === 'breakfast-spoon' && <img className="world-scene__placemat" src={image('breakfast-place-setting')} alt="" draggable={false} />}
      {config.effect === 'wipe-table' && <span className="world-scene__spill" aria-hidden="true" />}
      {config.effect === 'hang-coat' && <span className="world-scene__hook" aria-hidden="true" />}
      {config.effect === 'note-score' && <span className="world-scene__staff" aria-hidden="true" />}
      {(config.effect === 'wash-hands' || config.effect === 'dry-hands') && <div className="world-scene__hand-marks" aria-hidden="true"><span /><span /><span /></div>}
      {config.effect === 'shell-goodnight' && <div className="world-scene__resting-friends" aria-hidden="true"><img src={image('ocean-crab-home')} alt="" /><img src={image('ocean-whale-splash')} alt="" /></div>}

      {config.mode === 'drag' ? (
        <>
          <div ref={targetRef} className="world-scene__drop-target" aria-hidden="true">
            {!helped && <img className="world-scene__destination-outline" src={image(config.asset)} alt="" draggable={false} />}
          </div>
          <div className={`world-scene__source${hintVisible && !helped ? ' world-scene__target--hinted' : ''}`}>
            <ForgivingDrag sceneId={sceneId} ariaLabel={config.ariaLabel} targetRef={targetRef} disabled={helped} onDrop={completeAction} onFeedback={onFeedback} onInteractionActivity={onInteractionActivity}>
              <img src={image(primary)} alt="" draggable={false} />
            </ForgivingDrag>
          </div>
        </>
      ) : (
        <TapTarget className={`world-scene__target${hintVisible && !helped ? ' world-scene__target--hinted' : ''}`} sceneId={sceneId} ariaLabel={config.ariaLabel} disabled={helped} onActivate={completeAction} onFeedback={onFeedback} onInteractionActivity={onInteractionActivity}>
          <img src={image(primary)} alt="" draggable={false} />
        </TapTarget>
      )}

      {helped && needsWater && <div className="world-scene__water" aria-hidden="true">{Array.from({length: 7}, (_,i) => <span key={i} style={{'--drop':i} as CSSProperties} />)}</div>}
      {helped && config.effect === 'whale-splash' && <span className="world-scene__spray-rainbow" aria-hidden="true" />}
      {helped && config.effect === 'windmill-spin' && <div className="world-scene__breeze" aria-hidden="true"><span /><span /><span /></div>}
      {helped && config.effect === 'xylophone' && <span className="world-scene__key-lights" aria-hidden="true"><i /><i /><i /></span>}
      {helped && config.theme === 'music' && <span className="world-scene__music-notes" aria-hidden="true">♪ ♫ ♪</span>}
      {helped && ['shell-goodnight','moon-blanket','bear-blanket','box-goodnight'].includes(config.effect) && <span className="world-scene__night-shade" aria-hidden="true" />}
    </section>
  )
}
