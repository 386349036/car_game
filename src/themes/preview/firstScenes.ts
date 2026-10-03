import type { SceneId } from '../../game/sceneTypes'

export const FIRST_THEME_SCENES = {
  'ocean-shell-pearl': {
    background: 'ocean-shell-pearl-bg',
    theme: 'ocean', title: '贝壳打开啦', hint: '点一点贝壳，打开看看吧。',
    ariaLabel: '打开贝壳', success: '贝壳打开啦，珍珠亮晶晶！', asset: 'ocean-shell',
  },
  'sky-balloon-launch': {
    background: 'sky-balloon-launch-bg',
    theme: 'sky', title: '热气球出发', hint: '点一点气球篮，出发吧。',
    ariaLabel: '让热气球出发', success: '热气球慢慢升起来啦！', asset: 'sky-balloon',
  },
  'life-slippers-pair': {
    background: 'life-slippers-pair-bg',
    theme: 'life', title: '拖鞋摆整齐', hint: '把拖鞋放到另一只旁边吧。',
    ariaLabel: '把两只拖鞋摆在一起', success: '两只拖鞋摆整齐啦！', asset: 'life-slipper',
  },
  'music-soft-drum': {
    background: 'music-soft-drum-bg',
    theme: 'music', title: '小鼓咚咚', hint: '点一点小鼓，咚咚咚。',
    ariaLabel: '敲一下小鼓', success: '小鼓咚咚，真好听！', asset: 'music-drum',
  },
} as const satisfies Partial<Record<SceneId, {
  background: string; theme: string; title: string; hint: string; ariaLabel: string; success: string; asset: string
}>>

export type FirstThemeSceneId = keyof typeof FIRST_THEME_SCENES

export function isFirstThemeScene(sceneId: SceneId): sceneId is FirstThemeSceneId {
  return Object.prototype.hasOwnProperty.call(FIRST_THEME_SCENES, sceneId)
}
