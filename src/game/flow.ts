import type { SceneId } from './sceneTypes'

export type JourneyId = 'car' | 'animals'

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
  'puppy-frisbee',
  'animal-crossing',
  'rabbit-feeding',
  'feed-chicks',
  'fish-pond',
  'kitten-reunion',
  'bird-nest',
  'turtle-beach',
  'lamb-meadow',
  'elephant-bath',
]

export function getJourneySceneOrder(journeyId: JourneyId): readonly SceneId[] {
  return journeyId === 'animals' ? ANIMAL_JOURNEY_ORDER : CAR_JOURNEY_ORDER
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
