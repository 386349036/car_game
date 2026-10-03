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
  'ocean-shell-pearl',
  'sky-balloon-launch',
  'life-slippers-pair',
  'music-soft-drum',
  'ocean-crab-home',
  'ocean-hermit-shell',
  'ocean-starfish-turn',
  'ocean-octopus-wave',
  'ocean-jellyfish-glow',
  'ocean-whale-splash',
  'ocean-seal-ball',
  'ocean-coral-door',
  'ocean-shell-goodnight',
  'sky-cloud-clear',
  'sky-sun-hello',
  'sky-cloud-train',
  'sky-rainbow-bridge',
  'sky-airship-letter',
  'sky-rain-cloud',
  'sky-windmill-spin',
  'sky-star-home',
  'sky-moon-blanket',
  'life-wash-hands',
  'life-dry-hands',
  'life-bear-bib',
  'life-breakfast-spoon',
  'life-wipe-table',
  'life-socks-basket',
  'life-hang-coat',
  'life-book-shelf',
  'life-bear-blanket',
  'music-bell-ring',
  'music-shaker',
  'music-xylophone',
  'music-pluck-string',
  'music-trumpet',
  'music-accordion',
  'music-bear-dance',
  'music-note-score',
  'music-box-goodnight',
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
  onPlayMusic?: (sceneId: SceneId, signal: AbortSignal) => Promise<void>
}
