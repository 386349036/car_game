import { useCallback, useReducer, useRef, useState, type MouseEvent } from 'react'
import './App.css'
import { gameFlowReducer, getSceneNumber, INITIAL_GAME_FLOW, SCENE_DETAILS, SCENE_ORDER } from './game/flow'
import type { GameFeedbackEvent, SceneId } from './game/sceneTypes'
import { useGentleHint } from './game/useGentleHint'

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
    description: '谢谢你一路陪着小车，明天还可以再来玩。',
    action: '再玩一次',
  },
}

function App() {
  const [flow, dispatch] = useReducer(gameFlowReducer, INITIAL_GAME_FLOW)
  const [parentPanelOpen, setParentPanelOpen] = useState(false)
  const completedSceneRef = useRef<SceneId | null>(null)
  const sceneId = flow.screen === 'scene' ? flow.sceneId : null

  const handleFeedback = useCallback((_event: GameFeedbackEvent) => {
    // Task 7 will connect these semantic events to the shared audio controls.
  }, [])
  const { hintVisible, onInteractionActivity } = useGentleHint({
    sceneId,
    onFeedback: handleFeedback,
  })

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

    if (flow.screen === 'scene') {
      onInteractionActivity('activity')
      handleSceneComplete(flow.sceneId)
      return
    }

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

  const screen = flow.screen === 'scene' ? 'journey' : flow.screen
  const content = flow.screen === 'scene'
    ? {
        eyebrow: '第 ' + getSceneNumber(flow.sceneId) + ' 段 · 流程预览',
        title: SCENE_DETAILS[flow.sceneId].title,
        description: SCENE_DETAILS[flow.sceneId].previewDescription,
        action: flow.sceneId === 'traffic-light' ? '到达终点' : '继续前进',
      }
    : staticScreenContent[flow.screen]

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
            <aside className="parent-note" id="parent-note" aria-label="家长设置说明">
              <strong>给大人的小角落</strong>
              <p>音乐、音效和语音开关会在后续加入。</p>
              <button type="button" className="note-close" onClick={() => setParentPanelOpen(false)}>
                知道啦
              </button>
            </aside>
          )}
        </div>
      </header>

      <main id="top" className="main-content">
        <section className={'journey-card journey-card--' + screen} aria-labelledby="screen-title">
          <div className={'scene-art scene-art--' + screen} aria-hidden="true">
            <span className="sun" />
            <span className="cloud cloud--one" />
            <span className="cloud cloud--two" />
            <span className="hill hill--back" />
            <span className="hill hill--front" />
            <div className="road">
              <span className="road-dashes" />
            </div>
            <CarIllustration />
            {flow.screen === 'complete' && <span className="celebration-dots" />}
          </div>

          <div className="screen-copy" aria-live="polite">
            <span className="eyebrow">
              <SparkleIcon />
              {content.eyebrow}
            </span>
            <h1 id="screen-title">{content.title}</h1>
            <p>{content.description}</p>
          </div>

          <div className="journey-action">
            <button
              className={'primary-action' + (hintVisible ? ' primary-action--hint' : '')}
              type="button"
              onClick={handleMainAction}
              data-scene-id={sceneId ?? undefined}
            >
              <span>{content.action}</span>
              <span className="action-icon" aria-hidden="true">
                {flow.screen === 'complete' ? <ReplayIcon /> : <ArrowIcon />}
              </span>
            </button>
          </div>
        </section>

        <p className="gentle-note">
          <span className="heart-mark" aria-hidden="true">♥</span>
          每一次帮忙，都是一次开心的出发
        </p>
      </main>
    </div>
  )
}

function CarIllustration() {
  return (
    <svg className="car-illustration" viewBox="0 0 320 170" focusable="false">
      <ellipse cx="160" cy="151" rx="126" ry="12" fill="#487c64" opacity=".14" />
      <path
        d="M45 105 62 76c7-12 17-18 33-20l35-4 24-29c6-7 13-10 23-10h30c13 0 24 7 31 18l24 39 25 9c10 4 17 12 17 23v26c0 8-6 14-14 14h-17a34 34 0 0 0-67 0h-57a34 34 0 0 0-67 0H62c-12 0-19-8-19-19v-8c0-5 0-8 2-10Z"
        fill="#ffbd59"
        stroke="#8c633d"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <path d="m145 55 22-27c4-5 8-7 15-7h25c9 0 16 5 21 12l18 29-101-7Z" fill="#bce9e9" stroke="#8c633d" strokeWidth="6" strokeLinejoin="round" />
      <path d="m185 27-22 28 49 3V27h-27Z" fill="#ddf4ed" />
      <path d="M224 29v30l25 2-16-26c-2-3-5-5-9-6Z" fill="#ddf4ed" />
      <path d="M280 99h19c6 0 10 5 10 11v14h-21" fill="#ffe28b" stroke="#8c633d" strokeWidth="6" strokeLinejoin="round" />
      <circle cx="107" cy="130" r="25" fill="#52616b" stroke="#3e4b52" strokeWidth="6" />
      <circle cx="107" cy="130" r="10" fill="#f7f0d8" />
      <circle cx="244" cy="130" r="25" fill="#52616b" stroke="#3e4b52" strokeWidth="6" />
      <circle cx="244" cy="130" r="10" fill="#f7f0d8" />
      <circle cx="275" cy="91" r="5" fill="#fff6d9" />
      <path d="M57 94h35" stroke="#fff0c4" strokeWidth="7" strokeLinecap="round" />
      <path d="M173 79c7 7 18 7 25 0" fill="none" stroke="#79553a" strokeWidth="4" strokeLinecap="round" />
      <circle cx="179" cy="70" r="3.5" fill="#493f36" />
      <circle cx="194" cy="70" r="3.5" fill="#493f36" />
    </svg>
  )
}

function CarBadge() {
  return (
    <svg viewBox="0 0 32 24" aria-hidden="true">
      <path d="m3 15 2-5c.5-1.3 1.5-2 3-2.2l3-.4 2-3c.5-.8 1.2-1.2 2.2-1.2h4c1.2 0 2.2.6 2.8 1.6l2.4 3.4 3 .8c1.2.3 1.8 1.2 1.8 2.4v5.3c0 1-.7 1.7-1.7 1.7h-2a3.3 3.3 0 0 0-6.6 0h-5.7a3.3 3.3 0 0 0-6.6 0H5c-1.4 0-2.2-.9-2.2-2.2V15Z" fill="currentColor" />
      <circle cx="9.3" cy="18" r="2.3" fill="#fff8e9" />
      <circle cx="22.5" cy="18" r="2.3" fill="#fff8e9" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2Z" />
      <path d="m19.4 13.5 1.1.8-1.1 2-1.3-.4a7.8 7.8 0 0 1-1.6 1l-.2 1.4h-2.4l-.4-1.3a7.8 7.8 0 0 1-1.9 0l-.8 1.1-2-1.1.4-1.3a7.8 7.8 0 0 1-1-1.6l-1.4-.2v-2.4l1.3-.4a7.8 7.8 0 0 1 0-1.9l-1.1-.8 1.1-2 1.3.4a7.8 7.8 0 0 1 1.6-1l.2-1.4h2.4l.4 1.3a7.8 7.8 0 0 1 1.9 0l.8-1.1 2 1.1-.4 1.3a7.8 7.8 0 0 1 1 1.6l1.4.2v2.4l-1.3.4a7.8 7.8 0 0 1 0 1.9Z" />
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 1.5 12 7l5.5 2-5.5 2-2 5.5L8 11l-5.5-2L8 7l2-5.5Z" fill="currentColor" />
      <circle cx="17" cy="16.5" r="1.4" fill="currentColor" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.5 12h14m-5.5-5.5 5.5 5.5-5.5 5.5" />
    </svg>
  )
}

function ReplayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 11a8 8 0 0 0-14.8-3L3 11m0-6v6h6m-5 2a8 8 0 0 0 14.8 3L21 13m0 6v-6h-6" />
    </svg>
  )
}

export default App