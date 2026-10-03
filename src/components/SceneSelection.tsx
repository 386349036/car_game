import { useEffect, useRef } from 'react'
import type { NewThemeJourneyId } from '../game/flow'
import './scene-selection.css'

export type SelectionPage = 1 | 2

const newThemes = [
  { id: 'ocean', title: '海洋奇遇', description: '去海里发现温柔的小惊喜' },
  { id: 'sky', title: '天空旅行', description: '坐上小气球，看看天空' },
  { id: 'life', title: '生活小帮手', description: '小小的帮忙，暖暖的快乐' },
  { id: 'music', title: '音乐派对', description: '点出小旋律，和朋友摇一摇' },
] as const

type SceneSelectionProps = {
  page: SelectionPage
  onPageChange: (page: SelectionPage) => void
  onStartCar: () => void
  onStartAnimals: () => void
  onStartFarm: () => void
  onStartGarden: () => void
  onStartNewTheme: (journeyId: NewThemeJourneyId) => void
}

export function SceneSelection({ page, onPageChange, onStartCar, onStartAnimals, onStartFarm, onStartGarden, onStartNewTheme }: SceneSelectionProps) {
  const previousButtonRef = useRef<HTMLButtonElement>(null)
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  const lastPageRef = useRef(page)

  useEffect(() => {
    if (lastPageRef.current === page) return
    lastPageRef.current = page
    // The activated boundary button becomes disabled; keep focus on an enabled control.
    const button = page === 2 ? previousButtonRef.current : nextButtonRef.current
    button?.focus({ preventScroll: true })
  }, [page])

  return (
    <section className="scene-selection" aria-labelledby="selection-title">
      <header className="scene-selection__heading">
        <span className="scene-selection__eyebrow"><span aria-hidden="true">✦</span> 三岁的童话世界</span>
        <h1 id="selection-title">今天想去哪里玩？</h1>
        <p>点一点，开始一段开心的小旅程</p>
      </header>

      {page === 1 ? (
        <div id="theme-directory" className="scene-selection__grid" role="group" aria-label="场景选择，第1页">
          <button className="scene-choice scene-choice--car scene-choice--active" type="button" onClick={onStartCar}>
            <span className="scene-choice__art scene-choice__art--car" aria-hidden="true">
              <img className="scene-choice__meadow" src="/images/meadow.webp" alt="" draggable={false} />
              <span className="scene-choice__road" />
              <img className="scene-choice__image scene-choice__image--car" src="/images/car.webp" alt="" draggable={false} />
            </span>
            <span className="scene-choice__copy">
              <span className="scene-choice__badge scene-choice__badge--active">现在可以玩</span>
              <span className="scene-choice__title">小汽车“帮帮号”</span>
              <span className="scene-choice__description">一起帮小车向前开</span>
              <span className="scene-choice__action">开始游戏 <span aria-hidden="true">➜</span></span>
            </span>
          </button>

          <button
            className="scene-choice scene-choice--animals scene-choice--active"
            type="button"
            onClick={onStartAnimals}
            aria-label="开始小动物朋友主题，共十个互动场景"
          >
            <span className="scene-choice__art scene-choice__art--animals" aria-hidden="true">
              <img className="scene-choice__image scene-choice__image--puppy" src="/images/interactive/animal-fox.webp" alt="" draggable={false} />
              <img className="scene-choice__image scene-choice__image--ducklings" src="/images/interactive/animal-panda.webp" alt="" draggable={false} />
            </span>
            <span className="scene-choice__copy">
              <span className="scene-choice__badge scene-choice__badge--active">十个轻松小场景</span>
              <span className="scene-choice__title">小动物朋友</span>
              <span className="scene-choice__description">和动物朋友一起玩</span>
              <span className="scene-choice__action">开始游戏 <span aria-hidden="true">➜</span></span>
            </span>
          </button>

          <button
            className="scene-choice scene-choice--farm scene-choice--active"
            type="button"
            onClick={onStartFarm}
            aria-label="开始快乐农场主题，共十个互动场景"
          >
            <span className="scene-choice__art scene-choice__art--farm" aria-hidden="true">
              <img className="scene-choice__image scene-choice__theme-preview" src="/images/themes/farm/farm-feed-cow.webp" alt="" draggable={false} />
            </span>
            <span className="scene-choice__copy">
              <span className="scene-choice__badge scene-choice__badge--active">十个轻松小场景</span>
              <span className="scene-choice__title">快乐农场</span>
              <span className="scene-choice__description">照顾农场动物，收获好心情</span>
              <span className="scene-choice__action">开始游戏 <span aria-hidden="true">➜</span></span>
            </span>
          </button>

          <button
            className="scene-choice scene-choice--garden scene-choice--active"
            type="button"
            onClick={onStartGarden}
            aria-label="开始奇妙花园主题，共十个互动场景"
          >
            <span className="scene-choice__art scene-choice__art--garden" aria-hidden="true">
              <img className="scene-choice__image scene-choice__theme-preview" src="/images/themes/garden/garden-water-daisy.webp" alt="" draggable={false} />
            </span>
            <span className="scene-choice__copy">
              <span className="scene-choice__badge scene-choice__badge--active">十个轻松小场景</span>
              <span className="scene-choice__title">奇妙花园</span>
              <span className="scene-choice__description">种花、捉迷藏，发现小惊喜</span>
              <span className="scene-choice__action">开始游戏 <span aria-hidden="true">➜</span></span>
            </span>
          </button>
        </div>
      ) : (
        <div id="theme-directory" className="scene-selection__grid" role="group" aria-label="场景选择，第2页">
          {newThemes.map((theme) => (
            <button key={theme.id} type="button" className={`scene-choice scene-choice--new-theme scene-choice--active scene-choice--${theme.id}`} onClick={() => onStartNewTheme(theme.id)} aria-label={`开始${theme.title}主题，共十个互动场景`}>
              <span className="scene-choice__art" aria-hidden="true">
                <img className="scene-choice__cover" src={`/images/themes/upcoming/${theme.id}-cover.webp`} alt="" draggable={false} />
              </span>
              <span className="scene-choice__copy">
                <span className="scene-choice__badge scene-choice__badge--active">十个轻松小场景</span>
                <span className="scene-choice__title">{theme.title}</span>
                <span className="scene-choice__description">{theme.description}</span>
                <span className="scene-choice__action">开始游戏 <span aria-hidden="true">➜</span></span>
              </span>
            </button>
          ))}
        </div>
      )}

      <nav className="scene-selection__pagination" aria-label="主题目录翻页">
        <button ref={previousButtonRef} type="button" disabled={page === 1} onClick={() => onPageChange(1)} aria-controls="theme-directory">
          <span aria-hidden="true">←</span> 上一页
        </button>
        <span className="scene-selection__page-status" role="status" aria-live="polite" aria-atomic="true">第{page}页 / 共2页</span>
        <button ref={nextButtonRef} type="button" disabled={page === 2} onClick={() => onPageChange(2)} aria-controls="theme-directory">
          下一页 <span aria-hidden="true">→</span>
        </button>
      </nav>
    </section>
  )
}
