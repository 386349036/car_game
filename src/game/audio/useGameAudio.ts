import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  GameFeedbackCue,
  GameFeedbackEvent,
  GameFeedbackHandler,
  SceneId,
} from '../sceneTypes'

export interface AudioSettings {
  musicEnabled: boolean
  effectsEnabled: boolean
  voiceEnabled: boolean
}

export type AudioSettingKey = keyof AudioSettings

const STORAGE_KEY = 'car-game-audio-settings-v1'
const DEFAULT_SETTINGS: AudioSettings = {
  musicEnabled: true,
  effectsEnabled: true,
  voiceEnabled: true,
}

const SCENE_PROMPTS: Record<SceneId, string> = {
  stone: '石头挡路啦，请挖掘机来帮忙。',
  bridge: '把木板放到小桥上吧。',
  'traffic-light': '点一点红绿灯，小车就能走啦。',
}

const MUSIC_NOTES = [523.25, 659.25, 587.33, 523.25, 440, 523.25, 659.25, 587.33]

function loadSettings(): AudioSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return DEFAULT_SETTINGS

    const parsed: unknown = JSON.parse(stored)
    if (parsed === null || typeof parsed !== 'object') return DEFAULT_SETTINGS

    const saved = parsed as Partial<AudioSettings>
    return {
      musicEnabled: typeof saved.musicEnabled === 'boolean'
        ? saved.musicEnabled
        : DEFAULT_SETTINGS.musicEnabled,
      effectsEnabled: typeof saved.effectsEnabled === 'boolean'
        ? saved.effectsEnabled
        : DEFAULT_SETTINGS.effectsEnabled,
      voiceEnabled: typeof saved.voiceEnabled === 'boolean'
        ? saved.voiceEnabled
        : DEFAULT_SETTINGS.voiceEnabled,
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

function saveSettings(settings: AudioSettings) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // Storage may be disabled; audio settings still work for this session.
  }
}

function getScenePrompt(sceneId: SceneId | undefined): string | null {
  return sceneId ? SCENE_PROMPTS[sceneId] : null
}

function getTonePattern(cue: GameFeedbackCue): {
  notes: number[]
  duration: number
  volume: number
  gap?: number
  waveform?: OscillatorType
} | null {
  switch (cue) {
    case 'journey-start':
      return { notes: [523, 659, 784], duration: 0.16, volume: 0.038, gap: 0.085 }
    case 'scene-hint':
      return { notes: [659, 784], duration: 0.13, volume: 0.022, gap: 0.08 }
    case 'target-tap':
      return { notes: [740], duration: 0.085, volume: 0.026, waveform: 'triangle' }
    case 'gentle-nudge':
      return { notes: [330, 294], duration: 0.12, volume: 0.018, gap: 0.09 }
    case 'drag-start':
      return { notes: [440], duration: 0.1, volume: 0.016 }
    case 'drag-return':
      return { notes: [392, 349], duration: 0.12, volume: 0.016, gap: 0.09 }
    case 'drag-snap':
      return { notes: [587, 740], duration: 0.15, volume: 0.03, gap: 0.08 }
    case 'object-repaired':
      return { notes: [523, 659, 784], duration: 0.19, volume: 0.034, gap: 0.07 }
    case 'scene-complete':
      return { notes: [587, 740, 880], duration: 0.2, volume: 0.032, gap: 0.075 }
    case 'journey-complete':
      return { notes: [523, 659, 784, 988], duration: 0.22, volume: 0.038, gap: 0.07 }
    default:
      return null
  }
}

function getSpeechText(event: GameFeedbackEvent): string | null {
  switch (event.cue) {
    case 'journey-start':
      return '小车出发啦！'
    case 'scene-hint':
      return getScenePrompt(event.sceneId)
    case 'scene-complete':
      return '真棒，小车继续前进！'
    case 'journey-complete':
      return '小车到家啦，真棒！'
    default:
      return null
  }
}

export function useGameAudio(journeyActive: boolean) {
  const [settings, setSettings] = useState<AudioSettings>(loadSettings)
  const settingsRef = useRef(settings)
  const audioContextRef = useRef<AudioContext | null>(null)
  const voicesRef = useRef<SpeechSynthesisVoice[]>([])
  const musicTimerRef = useRef<number | null>(null)
  const musicIndexRef = useRef(0)

  useEffect(() => {
    settingsRef.current = settings
    saveSettings(settings)
  }, [settings])

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    const synthesis = window.speechSynthesis
    const refreshVoices = () => {
      voicesRef.current = synthesis.getVoices()
    }
    refreshVoices()
    synthesis.addEventListener('voiceschanged', refreshVoices)

    return () => synthesis.removeEventListener('voiceschanged', refreshVoices)
  }, [])

  useEffect(() => {
    if (!settings.voiceEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }, [settings.voiceEnabled])

  const ensureAudioContext = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined' || typeof window.AudioContext === 'undefined') return null

    try {
      const context = audioContextRef.current ?? new window.AudioContext()
      audioContextRef.current = context
      if (context.state === 'suspended') {
        void context.resume().catch(() => undefined)
      }
      return context
    } catch {
      return null
    }
  }, [])

  const playNotes = useCallback((
    context: AudioContext,
    notes: number[],
    duration: number,
    volume: number,
    gap = 0.075,
    waveform: OscillatorType = 'sine',
  ) => {
    const startTime = context.currentTime

    notes.forEach((frequency, index) => {
      try {
        const oscillator = context.createOscillator()
        const gain = context.createGain()
        const noteStart = startTime + index * gap
        const noteEnd = noteStart + duration

        oscillator.type = waveform
        oscillator.frequency.setValueAtTime(frequency, noteStart)
        gain.gain.setValueAtTime(0.0001, noteStart)
        gain.gain.exponentialRampToValueAtTime(volume, noteStart + 0.025)
        gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd)
        oscillator.connect(gain)
        gain.connect(context.destination)
        oscillator.onended = () => {
          oscillator.disconnect()
          gain.disconnect()
        }
        oscillator.start(noteStart)
        oscillator.stop(noteEnd)
      } catch {
        // An unavailable audio device should never interrupt the scene.
      }
    })
  }, [])

  const stopMusic = useCallback(() => {
    if (musicTimerRef.current !== null) {
      window.clearInterval(musicTimerRef.current)
      musicTimerRef.current = null
    }
    musicIndexRef.current = 0
  }, [])

  const startMusic = useCallback(() => {
    if (!settingsRef.current.musicEnabled || musicTimerRef.current !== null) return

    const context = ensureAudioContext()
    if (!context) return

    const playNextNote = () => {
      const note = MUSIC_NOTES[musicIndexRef.current % MUSIC_NOTES.length]
      musicIndexRef.current += 1
      playNotes(context, [note], 0.62, 0.009, 0, 'sine')
    }

    playNextNote()
    musicTimerRef.current = window.setInterval(playNextNote, 1_700)
  }, [ensureAudioContext, playNotes])

  const speakLocally = useCallback((text: string) => {
    if (
      typeof window === 'undefined' ||
      !settingsRef.current.voiceEnabled ||
      !('speechSynthesis' in window) ||
      typeof SpeechSynthesisUtterance === 'undefined'
    ) {
      return
    }

    const synthesis = window.speechSynthesis
    const availableVoices = [...voicesRef.current, ...synthesis.getVoices()]
    const localChineseVoice = availableVoices.find((voice) =>
      voice.localService && voice.lang.toLowerCase().startsWith('zh'),
    )
    if (!localChineseVoice) return

    try {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.voice = localChineseVoice
      utterance.lang = localChineseVoice.lang
      utterance.rate = 0.84
      utterance.pitch = 1.04
      utterance.volume = 0.76
      synthesis.speak(utterance)
    } catch {
      // Missing or unsupported local speech voices are treated as silent audio.
    }
  }, [])

  const handleFeedback: GameFeedbackHandler = useCallback((event: GameFeedbackEvent) => {
    if (settingsRef.current.effectsEnabled) {
      const context = ensureAudioContext()
      const pattern = getTonePattern(event.cue)
      if (context && pattern) {
        playNotes(
          context,
          pattern.notes,
          pattern.duration,
          pattern.volume,
          pattern.gap,
          pattern.waveform,
        )
      }
    }

    const speechText = getSpeechText(event)
    if (speechText) speakLocally(speechText)
  }, [ensureAudioContext, playNotes, speakLocally])

  const setAudioSetting = useCallback((key: AudioSettingKey, value: boolean) => {
    const nextSettings = { ...settingsRef.current, [key]: value }
    settingsRef.current = nextSettings
    setSettings(nextSettings)

    if (key === 'musicEnabled' && value && journeyActive) {
      ensureAudioContext()
    }
  }, [ensureAudioContext, journeyActive])

  useEffect(() => {
    if (journeyActive && settings.musicEnabled) {
      startMusic()
      return stopMusic
    }

    stopMusic()
  }, [journeyActive, settings.musicEnabled, startMusic, stopMusic])

  return {
    settings,
    setAudioSetting,
    handleFeedback,
  }
}
