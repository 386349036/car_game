import { useCallback, useEffect, useReducer, useRef, useState, type MouseEvent } from 'react'
import './App.css'
import { gameFlowReducer, getSceneNumber, INITIAL_GAME_FLOW, SCENE_DETAILS, SCENE_ORDER } from './game/flow'
import { StoneScene } from './scenes/StoneScene'
import { BridgeScene } from './scenes/BridgeScene'
import { TrafficLightScene } from './scenes/TrafficLightScene'
import { AnimalCrossingScene } from './scenes/AnimalCrossingScene'
import { TireChangeScene } from './scenes/TireChangeScene'
import { RainyDriveScene } from './scenes/RainyDriveScene'
import type { SceneId, SceneProps } from './game/sceneTypes'
import { useGentleHint } from './game/useGentleHint'
import { useGameAudio } from './game/audio/useGameAudio'

const staticScreenContent = {
  home: {
    eyebrow: '一段轻松的小旅程',
    title: '小汽车修路',
    description: '陪小车一起出发，路上会有小小的惊喜。',
    action: '开始出发',
  },
  complete: {
    eyebrow: '旅程完成',
    title: '小车到家啦',
    description: '谢谢你一路陪着小车走过六个小场景。',
    action: '再玩一次',
  },
}

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
    const isFinalScene = expectedSceneId === SCENE_ORDER[SCENE_ORDER.length - 1]
    handleFeedback({
      cue: isFinalScene ? 'journey-complete' : 'scene-complete',
      sceneId: expectedSceneId,
    })
    dispatch({ type: 'complete-scene', sceneId: expectedSceneId })
  }, [flow, handleFeedback])

  function handleMainAction() {
    setParentPanelOpen(false)
    completedSceneRef.current = null
    handleFeedback({ cue: 'journey-start' })
    dispatch({ type: 'start' })
  }

  function goHome(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    completedSceneRef.current = null
    setParentPanelOpen(false)
    dispatch({ type: 'go-home' })
  }

  const content = flow.screen === 'scene' ? null : staticScreenContent[flow.screen]

  return (
    <div className="app-shell">
      <header className="app-header">
        <a className="brand" href="#top" aria-label="小车小队，回到首页" onClick={goHome}>
          <span className="brand-mark" aria-hidden="true">
            <CarBadge />
          </span>
          <span className="brand-name">小车小队</span>
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

      <main id="top" className={'main-content' + (flow.screen === 'scene' ? ' main-content--scene' : '')}>
        {flow.screen === 'scene' ? (
          <section
            className="scene-stage"
            aria-label={`第 ${getSceneNumber(flow.sceneId)} 段：${SCENE_DETAILS[flow.sceneId].title}`}
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
          <section className={'journey-card journey-card--' + flow.screen} aria-labelledby="screen-title">
            <div className={'scene-art scene-art--' + flow.screen} aria-hidden="true">
              <div className="road">
                <span className="road-dashes" />
              </div>
              <img className="car-illustration" src="/images/car.png" alt="" draggable={false} />
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
                onClick={handleMainAction}
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
  }
}

function CarBadge() {
  return <img src="/images/car.png" alt="" draggable={false} />
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
