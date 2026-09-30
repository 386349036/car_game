import { useEffect, useRef, useState } from 'react'
import { TapTarget } from '../../game/interaction/TapTarget'
import type { SceneId, SceneProps } from '../../game/sceneTypes'
import './garden-theme-scene.css'

type GardenEffect =
  | 'water'
  | 'sprout'
  | 'butterfly'
  | 'berry'
  | 'leaves'
  | 'stone'
  | 'gate'
  | 'lantern'
  | 'dandelion'
  | 'snail'

interface GardenSceneConfig {
  title: string
  hint: string
  helping: string
  celebrating: string
  ariaLabel: string
  target: { x: number; y: number; width: number; height: number }
  effect: GardenEffect
}

const GARDEN_SCENES: Partial<Record<SceneId, GardenSceneConfig>> = {
  'garden-water-daisy': {
    title: '给小雏菊浇水',
    hint: '点一点小水壶，给花朵浇浇水。',
    helping: '小雏菊喝到水啦！',
    celebrating: '花儿开心地开放啦！',
    ariaLabel: '点一下小水壶，给小雏菊浇水',
    target: { x: 66, y: 79, width: 19, height: 20 },
    effect: 'water',
  },
  'garden-plant-sunflower': {
    title: '种下向日葵种子',
    hint: '点一下大种子，把它种进松软的土里。',
    helping: '种子落进松软的泥土啦！',
    celebrating: '盖好泥土，小种子准备长大！',
    ariaLabel: '点一下土堆旁的向日葵种子，把它种进土里',
    target: { x: 68, y: 76, width: 17, height: 19 },
    effect: 'sprout',
  },
  'garden-butterfly-flower': {
    title: '蝴蝶来做客',
    hint: '点一下小蝴蝶，让它飞到花朵上。',
    helping: '小蝴蝶飞向花朵啦！',
    celebrating: '小蝴蝶停在花心上啦！',
    ariaLabel: '点一下左边的小蝴蝶，让它飞到花朵上',
    target: { x: 30, y: 58, width: 22, height: 25 },
    effect: 'butterfly',
  },
  'garden-pick-strawberry': {
    title: '摘一颗红草莓',
    hint: '点一下大草莓，把它摘进篮子。',
    helping: '红草莓飞向篮子啦！',
    celebrating: '红草莓稳稳落进篮子！',
    ariaLabel: '点一下画面中间的大草莓，把它摘下来',
    target: { x: 53, y: 72, width: 34, height: 32 },
    effect: 'berry',
  },
  'garden-sweep-leaves': {
    title: '把叶子扫成堆',
    hint: '点一下小扫帚，把落叶扫成堆。',
    helping: '小扫帚正在把落叶扫成堆。',
    celebrating: '花园小路变整齐啦！',
    ariaLabel: '点一下小扫帚，帮忙扫好落叶',
    target: { x: 52, y: 76, width: 42, height: 29 },
    effect: 'leaves',
  },
  'garden-stone-path': {
    title: '铺好花园小路',
    hint: '点一下中间的大石头，铺好小路。',
    helping: '石头轻轻落到小路上啦！',
    celebrating: '花园小路铺好啦！',
    ariaLabel: '点一下中间的大块石头，铺好花园小路',
    target: { x: 50, y: 71, width: 39, height: 29 },
    effect: 'stone',
  },
  'garden-gate-hedgehog': {
    title: '打开花园小门',
    hint: '点一下小门，邀请刺猬进来。',
    helping: '小门轻轻打开啦！',
    celebrating: '小刺猬走进花园啦！',
    ariaLabel: '点一下中间的花园小门，邀请小刺猬进来',
    target: { x: 48, y: 68, width: 31, height: 37 },
    effect: 'gate',
  },
  'garden-light-lantern': {
    title: '点亮花园灯',
    hint: '点一下左边的灯笼，照亮小路。',
    helping: '灯笼亮起来啦！',
    celebrating: '暖暖的灯光照亮小路。',
    ariaLabel: '点一下画面左边的灯笼，照亮花园小路',
    target: { x: 49, y: 63, width: 23, height: 38 },
    effect: 'lantern',
  },
  'garden-dandelion-wish': {
    title: '吹散蒲公英',
    hint: '点一下中间的蒲公英，让小绒球飞起来。',
    helping: '好多小绒毛飞起来啦！',
    celebrating: '小小的愿望飞向四面八方。',
    ariaLabel: '点一下中间的大蒲公英，让它的种子飞起来',
    target: { x: 49, y: 59, width: 43, height: 55 },
    effect: 'dandelion',
  },
  'garden-snail-lettuce': {
    title: '小蜗牛吃生菜',
    hint: '点一下生菜叶，送给小蜗牛吃。',
    helping: '小蜗牛吃得真香！',
    celebrating: '谢谢你陪小蜗牛吃生菜。',
    ariaLabel: '点一下生菜叶，送给小蜗牛吃',
    target: { x: 49, y: 72, width: 48, height: 35 },
    effect: 'snail',
  },
}

const HELPING_DELAY_MS = 1_700
const COMPLETION_DELAY_MS = 1_150

/** One gentle tap completes a picture-led garden activity. */
export function GardenThemeScene({ sceneId, ...props }: SceneProps) {
  const config = GARDEN_SCENES[sceneId]
  const [phase, setPhase] = useState<'waiting' | 'helping' | 'celebrating'>('waiting')
  const [gateOpen, setGateOpen] = useState(false)
  const phaseRef = useRef<'waiting' | 'helping' | 'celebrating'>('waiting')
  const completedRef = useRef(false)
  const timersRef = useRef<number[]>([])

  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
  }, [])

  if (!config) return null

  const { onComplete, onFeedback, hintVisible } = props
  const prompt = phase === 'waiting'
    ? [config.title, config.hint]
    : phase === 'helping'
      ? [config.helping, '你帮了花园朋友一个大忙。']
      : [config.celebrating, '做得真棒！']

  function helpGardenFriend() {
    if (phaseRef.current !== 'waiting' || completedRef.current) return

    const reduceMotion = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const helpingDelay = sceneId === 'garden-sweep-leaves' ? 3_000 : HELPING_DELAY_MS
    phaseRef.current = 'helping'
    setPhase('helping')

    if (sceneId === 'garden-gate-hedgehog') {
      timersRef.current.push(window.setTimeout(() => setGateOpen(true), reduceMotion ? 180 : 600))
    }

    timersRef.current.push(window.setTimeout(() => {
      if (completedRef.current) return
      onFeedback({ cue: 'object-repaired', sceneId })
      phaseRef.current = 'celebrating'
      setPhase('celebrating')

      timersRef.current.push(window.setTimeout(() => {
        if (completedRef.current) return
        completedRef.current = true
        onComplete()
      }, reduceMotion ? 180 : COMPLETION_DELAY_MS))
    }, reduceMotion ? 180 : helpingDelay))
  }

  return (
    <section
      className={`garden-theme-scene garden-theme-scene--${sceneId} garden-theme-scene--${phase}${gateOpen ? ' garden-theme-scene--gate-open' : ''}`}
      role="group"
      aria-label={config.title}
    >
      <img
        className="garden-theme-scene__illustration"
        src={sceneId === 'garden-gate-hedgehog'
          ? `/images/themes/garden/garden-gate-hedgehog-${gateOpen ? 'open' : 'empty'}.webp`
          : sceneId === 'garden-light-lantern' && phase !== 'waiting'
            ? '/images/themes/garden/garden-light-lantern-bright.webp'
          : [
          'garden-plant-sunflower',
          'garden-butterfly-flower',
          'garden-pick-strawberry',
          'garden-stone-path',
          'garden-dandelion-wish',
        ].includes(sceneId)
          ? `/images/themes/garden/${sceneId}-empty.webp`
          : `/images/themes/garden/${sceneId}.webp`}
        alt=""
        aria-hidden="true"
        draggable={false}
      />

      <div className="garden-theme-scene__prompt" aria-live="polite">
        <h2>{prompt[0]}</h2>
        <p>{prompt[1]}</p>
      </div>

      <div
        className="garden-theme-scene__target-wrap"
        style={{
          left: `${config.target.x}%`,
          top: `${config.target.y}%`,
          width: `${config.target.width}%`,
          height: `${config.target.height}%`,
        }}
      >
        <TapTarget
          className={[
            'garden-theme-scene__target',
            hintVisible && phase === 'waiting' ? 'garden-theme-scene__target--hinted' : '',
          ].filter(Boolean).join(' ')}
          sceneId={sceneId}
          ariaLabel={config.ariaLabel}
          disabled={phase !== 'waiting'}
          onActivate={helpGardenFriend}
          onFeedback={props.onFeedback}
          onInteractionActivity={props.onInteractionActivity}
        >
          <img
            className="garden-theme-scene__object"
            src={sceneId === 'garden-light-lantern'
              ? `/images/interactive/garden-light-lantern-${phase === 'waiting' ? 'off' : 'on'}.webp`
              : `/images/interactive/${sceneId}.webp`}
            alt=""
            draggable={false}
          />
          <span className={`garden-theme-scene__effect garden-theme-scene__effect--${config.effect}`} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </TapTarget>
      </div>

      {sceneId === 'garden-dandelion-wish' && (
        <span className="garden-theme-scene__dandelion-seeds" aria-hidden="true">
          {Array.from({ length: 8 }, (_, index) => (
            <img key={index} src="/images/interactive/garden-dandelion-seed.webp" alt="" draggable={false} />
          ))}
        </span>
      )}

      {sceneId === 'garden-plant-sunflower' && (
        <span className="garden-theme-scene__soil-cover" aria-hidden="true" />
      )}

      {sceneId === 'garden-water-daisy' && (
        <span className="garden-theme-scene__watering-stream" aria-hidden="true">
          <span /><span /><span /><span /><span />
        </span>
      )}

      <p className="garden-theme-scene__announcement" aria-live="polite" aria-atomic="true">
        {phase === 'waiting' ? config.hint : prompt[0]}
      </p>
    </section>
  )
}
