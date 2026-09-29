import './scene-selection.css'

type SceneSelectionProps = {
  onStartCar: () => void
  onStartAnimals: () => void
}

export function SceneSelection({ onStartCar, onStartAnimals }: SceneSelectionProps) {
  return (
    <section className="scene-selection" aria-labelledby="selection-title">
      <header className="scene-selection__heading">
        <span className="scene-selection__eyebrow"><span aria-hidden="true">✦</span> 小车小队出发啦</span>
        <h1 id="selection-title">今天想去哪里玩？</h1>
        <p>点一点，开始一段开心的小旅程</p>
      </header>

      <div className="scene-selection__grid" role="group" aria-label="场景选择">
        <button className="scene-choice scene-choice--car scene-choice--active" type="button" onClick={onStartCar}>
          <span className="scene-choice__art scene-choice__art--car" aria-hidden="true">
            <img className="scene-choice__meadow" src="/images/meadow.png" alt="" draggable={false} />
            <span className="scene-choice__road" />
            <img className="scene-choice__image scene-choice__image--car" src="/images/car.png" alt="" draggable={false} />
          </span>
          <span className="scene-choice__copy">
            <span className="scene-choice__badge scene-choice__badge--active">现在可以玩</span>
            <span className="scene-choice__title">小汽车修路</span>
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
            <img className="scene-choice__image scene-choice__image--puppy" src="/images/scenes/puppy.png" alt="" draggable={false} />
            <img className="scene-choice__image scene-choice__image--ducklings" src="/images/ducklings.png" alt="" draggable={false} />
          </span>
          <span className="scene-choice__copy">
            <span className="scene-choice__badge scene-choice__badge--active">十个轻松小场景</span>
            <span className="scene-choice__title">小动物朋友</span>
            <span className="scene-choice__description">和动物朋友一起玩</span>
            <span className="scene-choice__action">开始游戏 <span aria-hidden="true">➜</span></span>
          </span>
        </button>

        <article className="scene-choice scene-choice--farm" aria-label="快乐农场，即将到来">
          <span className="scene-choice__art scene-choice__art--farm" aria-hidden="true">
            <img className="scene-choice__image scene-choice__image--rabbit" src="/images/rabbit-feeding.png" alt="" draggable={false} />
            <img className="scene-choice__image scene-choice__image--chicks" src="/images/feeding-chicks.png" alt="" draggable={false} />
          </span>
          <span className="scene-choice__copy">
            <span className="scene-choice__badge">即将到来</span>
            <span className="scene-choice__title">快乐农场</span>
            <span className="scene-choice__description">给小兔和小鸡送点心</span>
          </span>
        </article>

        <article className="scene-choice scene-choice--garden" aria-label="奇妙花园，即将到来">
          <span className="scene-choice__art scene-choice__art--garden" aria-hidden="true">
            <img className="scene-choice__image scene-choice__image--flower" src="/images/flower-watering.png" alt="" draggable={false} />
            <img className="scene-choice__image scene-choice__image--kite" src="/images/kite.png" alt="" draggable={false} />
          </span>
          <span className="scene-choice__copy">
            <span className="scene-choice__badge">即将到来</span>
            <span className="scene-choice__title">奇妙花园</span>
            <span className="scene-choice__description">浇花、放风筝，真开心</span>
          </span>
        </article>
      </div>
    </section>
  )
}
