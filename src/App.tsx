import { useCallback, useEffect, useReducer, useRef, useState, type MouseEvent } from 'react'
import './App.css'
import {
  gameFlowReducer,
  getJourneySceneOrder,
  getSceneNumber,
  INITIAL_GAME_FLOW,
  SCENE_DETAILS,
  type JourneyId,
} from './game/flow'
import { StoneScene } from './scenes/StoneScene'
import { BridgeScene } from './scenes/BridgeScene'
import { TrafficLightScene } from './scenes/TrafficLightScene'
import { AnimalCrossingScene } from './scenes/AnimalCrossingScene'
import { TireChangeScene } from './scenes/TireChangeScene'
import { RainyDriveScene } from './scenes/RainyDriveScene'
import { NightLightsScene } from './scenes/NightLightsScene'
import { FuelStopScene } from './scenes/FuelStopScene'
import { CarWashScene } from './scenes/CarWashScene'
import { RabbitFeedingScene } from './scenes/RabbitFeedingScene'
import { FlowerWateringScene } from './scenes/FlowerWateringScene'
import { MailDeliveryScene } from './scenes/MailDeliveryScene'
import { FeedChicksScene } from './scenes/FeedChicksScene'
import { KiteFlyingScene } from './scenes/KiteFlyingScene'
import { PuppyFrisbeeScene } from './scenes/PuppyFrisbeeScene'
import { ToyCleanupScene } from './scenes/ToyCleanupScene'
import { FishPondScene } from './scenes/FishPondScene'
import { HomeGarageScene } from './scenes/HomeGarageScene'
import { ElephantBathScene } from './scenes/ElephantBathScene'
import { KittenReunionScene } from './scenes/KittenReunionScene'
import { BirdNestScene } from './scenes/BirdNestScene'
import { TurtleBeachScene } from './scenes/TurtleBeachScene'
import { LambMeadowScene } from './scenes/LambMeadowScene'
import { NewAnimalScene } from './scenes/NewAnimalScene'
import { FarmThemeScene } from './themes/farm/FarmThemeScene'
import { GardenThemeScene } from './themes/garden/GardenThemeScene'
import type { SceneId, SceneProps } from './game/sceneTypes'
import { useGentleHint } from './game/useGentleHint'
import { useGameAudio } from './game/audio/useGameAudio'
import { SceneSelection } from './components/SceneSelection'

const staticScreenContent = {
  car: {
    eyebrow: '旅程完成',
    title: '小车到家啦',
    description: '谢谢你一路陪着小车走过十八个小场景。',
    action: '再玩一次',
  },
  animals: {
    eyebrow: '动物朋友，旅程完成',
    title: '大家玩得真开心',
    description: '谢谢你陪十位动物朋友度过开心的小场景。',
    action: '再玩一次',
  },
  farm: {
    eyebrow: '快乐农场，旅程完成',
    title: '农场朋友都开心啦',
    description: '谢谢你照顾了十位农场朋友。',
    action: '再玩一次',
  },
  garden: {
    eyebrow: '奇妙花园，旅程完成',
    title: '花园开满鲜花啦',
    description: '谢谢你陪花园里的朋友度过十个开心时刻。',
    action: '再玩一次',
  },
} satisfies Record<JourneyId, {
  eyebrow: string
  title: string
  description: string
  action: string
}>

function App() {
  const [flow, dispatch] = useReducer(gameFlowReducer, INITIAL_GAME_FLOW)
  const [parentPanelOpen, setParentPanelOpen] = useState(false)
  const completedSceneRef = useRef<SceneId | null>(null)
  const sceneId = flow.screen === 'scene' ? flow.sceneId : null

  const { settings: audioSettings, setAudioSetting, handleFeedback } = useGameAudio(flow.screen === 'scene')
  const promptedSceneRef = useRef<SceneId | null>(null)
  const { hintVisible, onInteractionActivity } = useGentleHint({
    sceneId,
    onFeedback: handleFeedback,
  })

  useEffect(() => {
    if (flow.screen !== 'scene') {
      promptedSceneRef.current = null
      return
    }

    if (promptedSceneRef.current === flow.sceneId) return
    promptedSceneRef.current = flow.sceneId
    handleFeedback({ cue: 'scene-hint', sceneId: flow.sceneId })
  }, [flow.screen, sceneId, handleFeedback])

  const handleSceneComplete = useCallback((expectedSceneId: SceneId) => {
    if (
      flow.screen !== 'scene' ||
      flow.sceneId !== expectedSceneId ||
      completedSceneRef.current === expectedSceneId
    ) {
      return
    }

    completedSceneRef.current = expectedSceneId
    const sceneOrder = getJourneySceneOrder(flow.journeyId)
    const isFinalScene = expectedSceneId === sceneOrder[sceneOrder.length - 1]
    handleFeedback({
      cue: isFinalScene ? 'journey-complete' : 'scene-complete',
      sceneId: expectedSceneId,
    })
    dispatch({ type: 'complete-scene', sceneId: expectedSceneId })
  }, [flow, handleFeedback])

  function handleMainAction(journeyId: JourneyId = 'car') {
    setParentPanelOpen(false)
    completedSceneRef.current = null
    handleFeedback({ cue: 'journey-start', sceneId: getJourneySceneOrder(journeyId)[0] })
    dispatch({ type: 'start', journeyId })
  }

  function goHome(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    completedSceneRef.current = null
    setParentPanelOpen(false)
    dispatch({ type: 'go-home' })
  }

  const content = flow.screen === 'complete' ? staticScreenContent[flow.journeyId] : null

  return (
    <div className="app-shell">
      <header className="app-header">
        <a className="brand" href="#top" aria-label="我今年3岁，回到首页" onClick={goHome}>
          <span className="brand-mark" aria-hidden="true">
            <CarBadge />
          </span>
          <span className="brand-name">我今年3岁</span>
        </a>

        <div className="parent-entry-wrap">
          <button
            className="parent-entry"
            type="button"
            aria-expanded={parentPanelOpen}
            aria-controls="parent-note"
            onClick={() => setParentPanelOpen((isOpen) => !isOpen)}
          >
            <SettingsIcon />
            <span>家长设置</span>
          </button>
          {parentPanelOpen && (
            <aside className="parent-note" id="parent-note" aria-label="家长声音设置">
              <strong>给大人的小角落</strong>
              <div className="audio-setting-list" role="group" aria-label="声音设置">
                <label className="audio-setting-row">
                  <span className="audio-setting-copy">
                    <strong>背景音乐</strong>
                    <small>轻柔旋律</small>
                  </span>
                  <input
                    type="checkbox"
                    checked={audioSettings.musicEnabled}
                    onChange={(event) => setAudioSetting('musicEnabled', event.currentTarget.checked)}
                  />
                </label>
                <label className="audio-setting-row">
                  <span className="audio-setting-copy">
                    <strong>互动音效</strong>
                    <small>点击与完成反馈</small>
                  </span>
                  <input
                    type="checkbox"
                    checked={audioSettings.effectsEnabled}
                    onChange={(event) => setAudioSetting('effectsEnabled', event.currentTarget.checked)}
                  />
                </label>
                <label className="audio-setting-row">
                  <span className="audio-setting-copy">
                    <strong>中文语音</strong>
                    <small>播放游戏内置语音</small>
                  </span>
                  <input
                    type="checkbox"
                    checked={audioSettings.voiceEnabled}
                    onChange={(event) => setAudioSetting('voiceEnabled', event.currentTarget.checked)}
                  />
                </label>
              </div>
              <p className="audio-settings-note">语音和音效随游戏提供；手机上无需安装中文语音包。</p>
              <button type="button" className="note-close" onClick={() => setParentPanelOpen(false)}>
                知道啦
              </button>
            </aside>
          )}
        </div>
      </header>

      <main
        id="top"
        className={
          'main-content' +
          (flow.screen === 'scene' ? ' main-content--scene' : '') +
          (flow.screen === 'home' ? ' main-content--selection' : '')
        }
      >
        {flow.screen === 'home' ? (
          <SceneSelection
            onStartCar={() => handleMainAction('car')}
            onStartAnimals={() => handleMainAction('animals')}
            onStartFarm={() => handleMainAction('farm')}
            onStartGarden={() => handleMainAction('garden')}
          />
        ) : flow.screen === 'scene' ? (
          <section
            className="scene-stage"
            aria-label={`第 ${getSceneNumber(flow.sceneId, flow.journeyId)} 段：${SCENE_DETAILS[flow.sceneId].title}`}
          >
            <GameScene
              sceneId={flow.sceneId}
              onComplete={() => handleSceneComplete(flow.sceneId)}
              onFeedback={handleFeedback}
              onInteractionActivity={onInteractionActivity}
              hintVisible={hintVisible}
            />
          </section>
        ) : (
          <section
            className={
              'journey-card journey-card--complete' +
              (flow.journeyId === 'farm' || flow.journeyId === 'garden' ? ' journey-card--themed-complete' : '')
            }
            aria-labelledby="screen-title"
          >
            <div className="scene-art scene-art--complete" aria-hidden="true">
              {flow.screen === 'complete' && flow.journeyId === 'animals' ? (
                <div className="animal-celebration">
                  <img
                    className="animal-celebration__friend animal-celebration__friend--puppy"
                    src="/images/interactive/animal-fox.webp"
                    alt=""
                    draggable={false}
                  />
                  <img
                    className="animal-celebration__friend animal-celebration__friend--elephant"
                    src="/images/scenes/elephant-bath.webp"
                    alt=""
                    draggable={false}
                  />
                  <img
                    className="animal-celebration__friend animal-celebration__friend--ducklings"
                    src="/images/interactive/animal-panda.webp"
                    alt=""
                    draggable={false}
                  />
                </div>
              ) : flow.screen === 'complete' && (flow.journeyId === 'farm' || flow.journeyId === 'garden') ? (
                <img
                  className="theme-complete-illustration"
                  src={flow.journeyId === 'farm'
                    ? '/images/themes/farm/farm-barn-goodnight.webp'
                    : '/images/themes/garden/garden-snail-lettuce.webp'}
                  alt=""
                  draggable={false}
                />
              ) : (
                <>
                  <div className="road">
                    <span className="road-dashes" />
                  </div>
                  <img className="car-illustration" src="/images/car.webp" alt="" draggable={false} />
                </>
              )}
              {flow.screen === 'complete' && <span className="celebration-dots" />}
            </div>

            <div className="screen-copy" aria-live="polite">
              <span className="eyebrow">
                <SparkleIcon />
                {content?.eyebrow}
              </span>
              <h1 id="screen-title">{content?.title}</h1>
              <p>{content?.description}</p>
            </div>

            <div className="journey-action">
              <button
                className="primary-action"
                type="button"
                onClick={() => handleMainAction(flow.screen === 'complete' ? flow.journeyId : 'car')}
              >
                <span>{content?.action}</span>
                <span className="action-icon" aria-hidden="true">
                  {flow.screen === 'complete' ? <ReplayIcon /> : <ArrowIcon />}
                </span>
              </button>
            </div>
          </section>
        )}

        {flow.screen !== 'scene' && (
          <p className="gentle-note">
            <span className="heart-mark" aria-hidden="true">♥</span>
            每一次帮忙，都是一次开心的出发
          </p>
        )}
      </main>
    </div>
  )
}

function GameScene({ sceneId, ...sceneProps }: SceneProps) {
  if (sceneId.startsWith('animal-') && sceneId !== 'animal-crossing') {
    return <NewAnimalScene key={sceneId} sceneId={sceneId} {...sceneProps} />
  }
  if (sceneId.startsWith('farm-')) {
    return <FarmThemeScene key={sceneId} sceneId={sceneId} {...sceneProps} />
  }
  if (sceneId.startsWith('garden-')) {
    return <GardenThemeScene key={sceneId} sceneId={sceneId} {...sceneProps} />
  }

  switch (sceneId) {
    case 'stone':
      return <StoneScene {...sceneProps} sceneId="stone" />
    case 'bridge':
      return <BridgeScene {...sceneProps} sceneId="bridge" />
    case 'traffic-light':
      return <TrafficLightScene {...sceneProps} sceneId="traffic-light" />
    case 'animal-crossing':
      return <AnimalCrossingScene {...sceneProps} sceneId="animal-crossing" />
    case 'tire-change':
      return <TireChangeScene {...sceneProps} sceneId="tire-change" />
    case 'rainy-drive':
      return <RainyDriveScene {...sceneProps} sceneId="rainy-drive" />
    case 'night-lights':
      return <NightLightsScene {...sceneProps} sceneId="night-lights" />
    case 'fuel-stop':
      return <FuelStopScene {...sceneProps} sceneId="fuel-stop" />
    case 'car-wash':
      return <CarWashScene {...sceneProps} sceneId="car-wash" />
    case 'rabbit-feeding':
      return <RabbitFeedingScene {...sceneProps} sceneId="rabbit-feeding" />
    case 'flower-watering':
      return <FlowerWateringScene {...sceneProps} sceneId="flower-watering" />
    case 'mail-delivery':
      return <MailDeliveryScene {...sceneProps} sceneId="mail-delivery" />
    case 'feed-chicks':
      return <FeedChicksScene {...sceneProps} sceneId="feed-chicks" />
    case 'kite-flying':
      return <KiteFlyingScene {...sceneProps} sceneId="kite-flying" />
    case 'puppy-frisbee':
      return <PuppyFrisbeeScene {...sceneProps} sceneId="puppy-frisbee" />
    case 'toy-cleanup':
      return <ToyCleanupScene {...sceneProps} sceneId="toy-cleanup" />
    case 'fish-pond':
      return <FishPondScene {...sceneProps} sceneId="fish-pond" />
    case 'home-garage':
      return <HomeGarageScene {...sceneProps} sceneId="home-garage" />
    case 'elephant-bath':
      return <ElephantBathScene {...sceneProps} sceneId="elephant-bath" />
    case 'kitten-reunion':
      return <KittenReunionScene {...sceneProps} sceneId="kitten-reunion" />
    case 'bird-nest':
      return <BirdNestScene {...sceneProps} sceneId="bird-nest" />
    case 'turtle-beach':
      return <TurtleBeachScene {...sceneProps} sceneId="turtle-beach" />
    case 'lamb-meadow':
      return <LambMeadowScene {...sceneProps} sceneId="lamb-meadow" />
  }
}

function CarBadge() {
  return <img src="/images/car.webp" alt="" draggable={false} />
}

function SettingsIcon() {
  return <span aria-hidden="true">⚙</span>
}

function SparkleIcon() {
  return <span aria-hidden="true">✦</span>
}

function ArrowIcon() {
  return <span aria-hidden="true">➜</span>
}

function ReplayIcon() {
  return <span aria-hidden="true">↻</span>
}

export default App
