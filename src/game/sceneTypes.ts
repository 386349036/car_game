export const SCENE_IDS = [
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
  'home-garage',
] as const

export type SceneId = (typeof SCENE_IDS)[number]
export type InteractionPhase = 'start' | 'activity' | 'end'

export type GameFeedbackCue =
  | 'journey-start'
  | 'scene-hint'
  | 'target-tap'
  | 'gentle-nudge'
  | 'drag-start'
  | 'drag-return'
  | 'drag-snap'
  | 'object-repaired'
  | 'scene-complete'
  | 'journey-complete'

export interface GameFeedbackEvent {
  cue: GameFeedbackCue
  sceneId?: SceneId
}

export type GameFeedbackHandler = (event: GameFeedbackEvent) => void

export interface SceneProps {
  sceneId: SceneId
  onComplete: () => void
  onFeedback: GameFeedbackHandler
  onInteractionActivity: (phase?: InteractionPhase) => void
  hintVisible: boolean
}
