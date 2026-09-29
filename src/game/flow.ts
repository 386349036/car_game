import { SCENE_IDS, type SceneId } from './sceneTypes'

export const SCENE_ORDER: readonly SceneId[] = SCENE_IDS

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
}

export type GameFlowState =
  | { screen: 'home' }
  | { screen: 'scene'; sceneId: SceneId }
  | { screen: 'complete' }

export type GameFlowAction =
  | { type: 'start' }
  | { type: 'go-home' }
  | { type: 'complete-scene'; sceneId: SceneId }

export const INITIAL_GAME_FLOW: GameFlowState = { screen: 'home' }

export function gameFlowReducer(state: GameFlowState, action: GameFlowAction): GameFlowState {
  switch (action.type) {
    case 'start':
      return { screen: 'scene', sceneId: SCENE_ORDER[0] }
    case 'go-home':
      return INITIAL_GAME_FLOW
    case 'complete-scene': {
      if (state.screen !== 'scene' || state.sceneId !== action.sceneId) return state

      const currentIndex = SCENE_ORDER.indexOf(action.sceneId)
      const nextScene = SCENE_ORDER[currentIndex + 1]

      return nextScene ? { screen: 'scene', sceneId: nextScene } : { screen: 'complete' }
    }
    default:
      return state
  }
}

export function getSceneNumber(sceneId: SceneId): number {
  return SCENE_ORDER.indexOf(sceneId) + 1
}
