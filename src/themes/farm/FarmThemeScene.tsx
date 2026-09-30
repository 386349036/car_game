import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { TapTarget } from '../../game/interaction/TapTarget'
import type { SceneId, SceneProps } from '../../game/sceneTypes'
import './farm-theme-scene.css'

type FarmPhase = 'waiting' | 'helping' | 'celebrating'
type FarmEffect = 'hay' | 'eggs' | 'bubbles' | 'apples' | 'sprout' | 'wool' | 'pumpkin' | 'water' | 'carrot' | 'stars'

interface FarmSceneConfig {
  title: string
  hint: string
  helping: string
  celebrating: string
  ariaLabel: string
  target: {
    x: number
    y: number
    mobileX: number
    mobileY: number
    width: number
    height: number
  }
  effect: FarmEffect
}

const FARM_SCENES: Partial<Record<SceneId, FarmSceneConfig>> = {
  'farm-feed-cow': {
    title: '奶牛饿了', hint: '点一下干草，喂给奶牛吃。', helping: '奶牛吃得真香！', celebrating: '谢谢你照顾奶牛！',
    ariaLabel: '点一下干草，喂奶牛吃', target: { x: 64, y: 83, mobileX: 77, mobileY: 78, width: 29, height: 26 }, effect: 'hay',
  },
  'farm-egg-basket': {
    title: '鸡蛋收好啦', hint: '点一下鸡蛋，让它落进篮子里。', helping: '鸡蛋轻轻落进篮子啦。', celebrating: '又收好一枚新鲜鸡蛋！',
    ariaLabel: '点一下鸡蛋，让它落进篮子里', target: { x: 36, y: 54, mobileX: 35, mobileY: 54, width: 22, height: 26 }, effect: 'eggs',
  },
  'farm-pig-bath': {
    title: '小猪洗澡啦', hint: '点一下大海绵，帮小猪洗澡。', helping: '泡泡轻轻飘起来啦！', celebrating: '小猪洗得干干净净。',
    ariaLabel: '点一下海绵，帮小猪洗澡', target: { x: 67, y: 58, mobileX: 83, mobileY: 57, width: 28, height: 29 }, effect: 'bubbles',
  },
  'farm-apple-picking': {
    title: '摘苹果装进篮', hint: '点一下树上的红苹果，把它摘进篮子。', helping: '红苹果落进篮子啦！', celebrating: '篮子装满香甜苹果。',
    ariaLabel: '点一下树上的红苹果，把苹果摘进篮子', target: { x: 49, y: 28, mobileX: 49, mobileY: 31, width: 24, height: 25 }, effect: 'apples',
  },
  'farm-seed-planting': {
    title: '种下一粒种子', hint: '点一下小种子，把它种进土里。', helping: '种子住进松软的泥土啦。', celebrating: '小种子准备长大啦！',
    ariaLabel: '点一下种子，把种子种进土里', target: { x: 51, y: 54, mobileX: 51, mobileY: 53, width: 25, height: 24 }, effect: 'sprout',
  },
  'farm-sheep-brushing': {
    title: '绵羊梳梳毛', hint: '点一下大刷子，帮绵羊梳梳毛。', helping: '绵羊的毛变蓬松啦！', celebrating: '绵羊舒服地笑了。',
    ariaLabel: '点一下刷子，帮绵羊梳毛', target: { x: 69, y: 60, mobileX: 87, mobileY: 58, width: 29, height: 28 }, effect: 'wool',
  },
  'farm-pumpkin-tractor': {
    title: '南瓜装上车', hint: '点一下大南瓜，装上拖拉机。', helping: '大南瓜稳稳放好啦。', celebrating: '拖拉机准备出发！',
    ariaLabel: '点一下地上的南瓜，让它跳进拖拉机车斗', target: { x: 24, y: 83, mobileX: 25, mobileY: 83, width: 26, height: 26 }, effect: 'pumpkin',
  },
  'farm-fill-trough': {
    title: '给水槽添水', hint: '点一下蓝色水桶，把水倒进水槽。', helping: '清清的水流进水槽啦。', celebrating: '农场朋友有水喝啦！',
    ariaLabel: '点一下右上角的蓝色水桶，给水槽添水', target: { x: 77, y: 39, mobileX: 77, mobileY: 39, width: 28, height: 30 }, effect: 'water',
  },
  'farm-carrot-harvest': {
    title: '拔出大胡萝卜', hint: '点一下胡萝卜，把它拔出来。', helping: '胡萝卜出来啦！', celebrating: '收获了一根大胡萝卜。',
    ariaLabel: '点一下胡萝卜，把胡萝卜拔出来', target: { x: 50, y: 70, mobileX: 50, mobileY: 66, width: 29, height: 29 }, effect: 'carrot',
  },
  'farm-barn-goodnight': {
    title: '农场朋友晚安', hint: '点一下谷仓大门，让朋友们进去休息。', helping: '门打开啦，大家往里走。', celebrating: '朋友们都进屋啦，晚安！',
    ariaLabel: '点一下谷仓大门，让动物朋友们进入谷仓', target: { x: 50, y: 63, mobileX: 50, mobileY: 62, width: 41, height: 43 }, effect: 'stars',
  },
}

const HELPING_DELAY_MS = 1_750
const COMPLETION_DELAY_MS = 1_350

/** One forgiving tap completes each quiet, picture-led farm activity. */
export function FarmThemeScene(props: SceneProps) {
  const config = FARM_SCENES[props.sceneId]
  const [phase, setPhase] = useState<FarmPhase>('waiting')
  const phaseRef = useRef<FarmPhase>('waiting')
  const completedRef = useRef(false)
  const timersRef = useRef<number[]>([])

  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
  }, [])

  useEffect(() => {
    if (props.sceneId !== 'farm-barn-goodnight') return
    for (const frame of ['open', 'inside']) {
      const image = new Image()
      image.src = `/images/themes/farm/farm-barn-goodnight-${frame}.webp`
    }
  }, [props.sceneId])

  if (!config) return null

  const { sceneId, onComplete, onFeedback, onInteractionActivity, hintVisible } = props
  const isBarnGoodnight = sceneId === 'farm-barn-goodnight'
  const isSeedPlanting = sceneId === 'farm-seed-planting'
  const isPumpkinTractor = sceneId === 'farm-pumpkin-tractor'
  const isFillTrough = sceneId === 'farm-fill-trough'
  const isCarrotHarvest = sceneId === 'farm-carrot-harvest'
  const illustration = isBarnGoodnight
    ? `/images/themes/farm/farm-barn-goodnight-${phase === 'waiting' ? 'closed' : phase === 'helping' ? 'open' : 'inside'}.webp`
    : isSeedPlanting
      ? '/images/themes/farm/farm-seed-planting-empty.webp'
      : isPumpkinTractor
        ? '/images/themes/farm/farm-pumpkin-tractor-empty.webp'
        : isFillTrough
          ? '/images/themes/farm/farm-fill-trough-empty.webp'
          : isCarrotHarvest
            ? '/images/themes/farm/farm-carrot-harvest-empty.webp'
      : `/images/themes/farm/${sceneId}.webp`
  const prompt = phase === 'waiting'
    ? [config.title, config.hint]
    : phase === 'helping'
      ? [config.helping, '你帮了农场朋友一个大忙。']
      : [config.celebrating, '做得真棒！']

  function helpFarmFriend() {
    if (phaseRef.current !== 'waiting') return

    const reduceMotion = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    phaseRef.current = 'helping'
    setPhase('helping')

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
    }, reduceMotion ? 180 : HELPING_DELAY_MS))
  }

  return (
    <section
      className={`farm-theme-scene farm-theme-scene--${sceneId} farm-theme-scene--${phase}`}
      role="group"
      aria-label={config.title}
    >
      <img
        className="farm-theme-scene__illustration"
        src={illustration}
        alt=""
        aria-hidden="true"
        draggable={false}
      />

      <div className="farm-theme-scene__prompt" aria-live="polite">
        <h2>{prompt[0]}</h2>
        <p>{prompt[1]}</p>
      </div>

      <div
        className="farm-theme-scene__target-wrap"
        style={{
          left: `${config.target.x}%`,
          top: `${config.target.y}%`,
          width: `${config.target.width}%`,
          height: `${config.target.height}%`,
          '--farm-target-mobile-x': `${config.target.mobileX}%`,
          '--farm-target-mobile-y': `${config.target.mobileY}%`,
        } as CSSProperties}
      >
        <TapTarget
          className={[
            'farm-theme-scene__target',
            hintVisible && phase === 'waiting' ? 'farm-theme-scene__target--hinted' : '',
          ].filter(Boolean).join(' ')}
          sceneId={sceneId}
          ariaLabel={config.ariaLabel}
          disabled={phase !== 'waiting'}
          onActivate={helpFarmFriend}
          onFeedback={onFeedback}
          onInteractionActivity={onInteractionActivity}
        >
          {!isBarnGoodnight && <>
            <img className="farm-theme-scene__object" src={sceneId === 'farm-egg-basket' ? '/images/interactive/farm-single-egg.webp' : `/images/interactive/${sceneId}.webp`} alt="" draggable={false} />
            <span className={`farm-theme-scene__effect farm-theme-scene__effect--${config.effect}`} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </>}
        </TapTarget>
      </div>

      {isFillTrough && <img
        className="farm-theme-scene__water-pour"
        src="/images/interactive/farm-water-pour.webp"
        alt=""
        aria-hidden="true"
        draggable={false}
      />}

      {isSeedPlanting && <img
        className="farm-theme-scene__soil-cover"
        src="/images/interactive/farm-seed-soil-cover.webp"
        alt=""
        aria-hidden="true"
        draggable={false}
      />}

      <p className="farm-theme-scene__announcement" aria-live="polite" aria-atomic="true">
        {phase === 'waiting' ? config.hint : prompt[0]}
      </p>
    </section>
  )
}
