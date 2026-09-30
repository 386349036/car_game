import type { SceneId } from './sceneTypes'

export type JourneyId = 'car' | 'animals' | 'farm' | 'garden'

export const CAR_JOURNEY_ORDER: readonly SceneId[] = [
  'stone',
  'bridge',
  'traffic-light',
  'animal-crossing',
  'tire-change',
  'rainy-drive',
  'night-lights',
  'fuel-stop',
  'car-wash',
  'rabbit-feeding',
  'flower-watering',
  'mail-delivery',
  'feed-chicks',
  'kite-flying',
  'puppy-frisbee',
  'toy-cleanup',
  'fish-pond',
  'home-garage',
]

export const SCENE_ORDER: readonly SceneId[] = CAR_JOURNEY_ORDER

export const ANIMAL_JOURNEY_ORDER: readonly SceneId[] = [
  'animal-squirrel',
  'animal-bear',
  'animal-fox',
  'animal-panda',
  'animal-giraffe',
  'kitten-reunion',
  'bird-nest',
  'turtle-beach',
  'lamb-meadow',
  'elephant-bath',
]

export const FARM_JOURNEY_ORDER: readonly SceneId[] = [
  'farm-feed-cow',
  'farm-egg-basket',
  'farm-pig-bath',
  'farm-apple-picking',
  'farm-seed-planting',
  'farm-sheep-brushing',
  'farm-pumpkin-tractor',
  'farm-fill-trough',
  'farm-carrot-harvest',
  'farm-barn-goodnight',
]

export const GARDEN_JOURNEY_ORDER: readonly SceneId[] = [
  'garden-water-daisy',
  'garden-plant-sunflower',
  'garden-butterfly-flower',
  'garden-pick-strawberry',
  'garden-sweep-leaves',
  'garden-stone-path',
  'garden-gate-hedgehog',
  'garden-light-lantern',
  'garden-dandelion-wish',
  'garden-snail-lettuce',
]

export function getJourneySceneOrder(journeyId: JourneyId): readonly SceneId[] {
  switch (journeyId) {
    case 'animals':
      return ANIMAL_JOURNEY_ORDER
    case 'farm':
      return FARM_JOURNEY_ORDER
    case 'garden':
      return GARDEN_JOURNEY_ORDER
    case 'car':
      return CAR_JOURNEY_ORDER
  }
}

export const SCENE_DETAILS: Record<SceneId, { title: string }> = {
  stone: {
    title: '石头挡路',
  },
  bridge: {
    title: '修好小桥',
  },
  'traffic-light': {
    title: '红绿灯放行',
  },
  'animal-crossing': {
    title: '小鸭子过马路',
  },
  'tire-change': {
    title: '换上新轮胎',
  },
  'rainy-drive': {
    title: '雨天开雨刷',
  },
  'night-lights': {
    title: '夜间开车灯',
  },
  'fuel-stop': {
    title: '给小车加油',
  },
  'car-wash': {
    title: '泡泡洗车',
  },
  'rabbit-feeding': {
    title: '给兔子送胡萝卜',
  },
  'flower-watering': {
    title: '给花浇水',
  },
  'mail-delivery': {
    title: '帮忙送信',
  },
  'feed-chicks': {
    title: '喂小鸡吃谷粒',
  },
  'kite-flying': {
    title: '放飞小风筝',
  },
  'puppy-frisbee': {
    title: '陪小狗玩飞盘',
  },
  'toy-cleanup': {
    title: '收好玩具',
  },
  'fish-pond': {
    title: '帮助小鱼回池塘',
  },
  'home-garage': {
    title: '回家停车',
  },
  'kitten-reunion': {
    title: '小猫找到妈妈',
  },
  'bird-nest': {
    title: '小鸟回鸟窝',
  },
  'turtle-beach': {
    title: '小海龟回海边',
  },
  'lamb-meadow': {
    title: '小绵羊吃青草',
  },
  'elephant-bath': {
    title: '小象洗澡啦',
  },
  'animal-squirrel': { title: '小松鼠抱松果' },
  'animal-bear': { title: '小熊挥挥手' },
  'animal-fox': { title: '小狐狸跳一跳' },
  'animal-panda': { title: '熊猫吃竹叶' },
  'animal-giraffe': { title: '长颈鹿够树叶' },
  'farm-feed-cow': { title: '给奶牛喂干草' },
  'farm-egg-basket': { title: '收鸡蛋啦' },
  'farm-pig-bath': { title: '给小猪洗澡' },
  'farm-apple-picking': { title: '摘苹果装篮' },
  'farm-seed-planting': { title: '种下一粒种子' },
  'farm-sheep-brushing': { title: '帮绵羊梳梳毛' },
  'farm-pumpkin-tractor': { title: '南瓜装上拖拉机' },
  'farm-fill-trough': { title: '给小水槽添水' },
  'farm-carrot-harvest': { title: '拔出胡萝卜' },
  'farm-barn-goodnight': { title: '农场朋友晚安' },
  'garden-water-daisy': { title: '给小雏菊浇水' },
  'garden-plant-sunflower': { title: '种下向日葵种子' },
  'garden-butterfly-flower': { title: '蝴蝶来做客' },
  'garden-pick-strawberry': { title: '摘一颗红草莓' },
  'garden-sweep-leaves': { title: '把叶子扫成堆' },
  'garden-stone-path': { title: '铺好花园小路' },
  'garden-gate-hedgehog': { title: '打开花园小门' },
  'garden-light-lantern': { title: '点亮花园灯' },
  'garden-dandelion-wish': { title: '吹散蒲公英' },
  'garden-snail-lettuce': { title: '小蜗牛吃生菜' },
}

export type GameFlowState =
  | { screen: 'home' }
  | { screen: 'scene'; sceneId: SceneId; journeyId: JourneyId }
  | { screen: 'complete'; journeyId: JourneyId }

export type GameFlowAction =
  | { type: 'start'; journeyId: JourneyId }
  | { type: 'go-home' }
  | { type: 'complete-scene'; sceneId: SceneId }

export const INITIAL_GAME_FLOW: GameFlowState = { screen: 'home' }

export function gameFlowReducer(state: GameFlowState, action: GameFlowAction): GameFlowState {
  switch (action.type) {
    case 'start':
      return {
        screen: 'scene',
        sceneId: getJourneySceneOrder(action.journeyId)[0],
        journeyId: action.journeyId,
      }
    case 'go-home':
      return INITIAL_GAME_FLOW
    case 'complete-scene': {
      if (state.screen !== 'scene' || state.sceneId !== action.sceneId) return state

      const sceneOrder = getJourneySceneOrder(state.journeyId)
      const currentIndex = sceneOrder.indexOf(action.sceneId)
      if (currentIndex < 0) return state
      const nextScene = sceneOrder[currentIndex + 1]

      return nextScene
        ? { ...state, sceneId: nextScene }
        : { screen: 'complete', journeyId: state.journeyId }
    }
    default:
      return state
  }
}

export function getSceneNumber(sceneId: SceneId, journeyId: JourneyId = 'car'): number {
  return getJourneySceneOrder(journeyId).indexOf(sceneId) + 1
}
