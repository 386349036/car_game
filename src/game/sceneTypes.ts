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
  'mail-delivery',
  'feed-chicks',
  'kite-flying',
  'puppy-frisbee',
  'toy-cleanup',
  'fish-pond',
  'home-garage',
  'kitten-reunion',
  'bird-nest',
  'turtle-beach',
  'lamb-meadow',
  'elephant-bath',
  'animal-squirrel',
  'animal-bear',
  'animal-fox',
  'animal-panda',
  'animal-giraffe',
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
