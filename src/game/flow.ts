import { SCENE_IDS, type SceneId } from './sceneTypes'

export const SCENE_ORDER: readonly SceneId[] = SCENE_IDS

export const SCENE_DETAILS: Record<SceneId, { title: string; previewDescription: string }> = {
  stone: {
    title: '石头挡路',
    previewDescription: '石头挡路的正式画面会在后续场景任务中接入。',
  },
  bridge: {
    title: '修好小桥',
    previewDescription: '铺木板、修好小桥的正式互动会在后续场景任务中接入。',
  },
  'traffic-light': {
    title: '红绿灯放行',
    previewDescription: '点击红绿灯的正式互动会在后续场景任务中接入。',
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