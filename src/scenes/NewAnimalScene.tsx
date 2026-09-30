import { useEffect, useRef, useState } from 'react'
import { TapTarget } from '../game/interaction/TapTarget'
import type { SceneId, SceneProps } from '../game/sceneTypes'
import './new-animal-scene.css'

const ANIMALS: Partial<Record<SceneId, { title: string; hint: string; result: string }>> = {
  'animal-squirrel': { title: '小松鼠和松果', hint: '点一点小松鼠，一起抱住松果。', result: '松果抱好啦！' },
  'animal-bear': { title: '小熊打招呼', hint: '点一点小熊，和它挥挥手。', result: '小熊也向你挥手啦！' },
  'animal-fox': { title: '小狐狸跳一跳', hint: '点一点小狐狸，陪它轻轻跳。', result: '小狐狸跳起来啦！' },
  'animal-panda': { title: '熊猫吃竹叶', hint: '点一点熊猫，送它嫩竹叶。', result: '熊猫吃到竹叶啦！' },
  'animal-giraffe': { title: '长颈鹿够树叶', hint: '点一点长颈鹿，帮它够树叶。', result: '长颈鹿吃到叶子啦！' },
}

export function NewAnimalScene({ sceneId, onComplete, onFeedback, onInteractionActivity, hintVisible }: SceneProps) {
  const config = ANIMALS[sceneId]
  const [helped, setHelped] = useState(false)
  const helpedRef = useRef(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
  }, [])

  if (!config) return null

  function help() {
    if (helpedRef.current) return
    helpedRef.current = true
    setHelped(true)
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    timerRef.current = window.setTimeout(() => {
      onFeedback({ cue: 'object-repaired', sceneId })
      onComplete()
    }, reduced ? 250 : 2200)
  }

  return (
    <section className={`new-animal-scene new-animal-scene--${sceneId} ${helped ? 'new-animal-scene--helped' : ''}`} aria-label={config.title}>
      <div className="new-animal-scene__prompt" aria-live="polite">
        <h2>{config.title}</h2>
        <p>{helped ? config.result : config.hint}</p>
      </div>
      <div className="new-animal-scene__effect" aria-hidden="true">
        <span /><span /><span />
      </div>
      {(sceneId === 'animal-squirrel' || sceneId === 'animal-panda' || sceneId === 'animal-giraffe') && (
        <TapTarget
          className="new-animal-scene__object"
          sceneId={sceneId}
          ariaLabel={sceneId === 'animal-squirrel' ? '点一点松果，送给小松鼠' : sceneId === 'animal-panda' ? '点一点竹枝，送给熊猫' : '点一点树叶，送给长颈鹿'}
          disabled={helped}
          onActivate={help}
          onFeedback={onFeedback}
          onInteractionActivity={onInteractionActivity}
        >
          <img
            src={`/images/scenes/${sceneId === 'animal-squirrel' ? 'animal-pinecone' : sceneId === 'animal-panda' ? 'animal-bamboo' : 'animal-leafy-twig'}.webp`}
            alt=""
            draggable={false}
          />
        </TapTarget>
      )}
      <TapTarget
        className={`new-animal-scene__target ${hintVisible && !helped ? 'new-animal-scene__target--hinted' : ''}`}
        sceneId={sceneId}
        ariaLabel={config.hint}
        disabled={helped}
        onActivate={help}
        onFeedback={onFeedback}
        onInteractionActivity={onInteractionActivity}
      >
        {sceneId === 'animal-bear' ? (
          <span className="new-animal-scene__bear-rig" aria-hidden="true">
            <img className="new-animal-scene__bear-body" src="/images/scenes/animal-bear-body.webp" alt="" draggable={false} />
            <img className="new-animal-scene__bear-arm" src="/images/scenes/animal-bear-arm.webp" alt="" draggable={false} />
          </span>
        ) : (
          <img
            className="new-animal-scene__animal"
            src={sceneId === 'animal-squirrel' ? '/images/scenes/animal-squirrel-empty.webp' : `/images/interactive/${sceneId}.webp`}
            alt=""
            draggable={false}
          />
        )}
      </TapTarget>
      <p className="new-animal-scene__announcement" aria-live="polite">{helped ? config.result : config.hint}</p>
    </section>
  )
}
