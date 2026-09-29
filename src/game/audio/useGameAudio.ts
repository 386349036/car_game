import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  GameFeedbackCue,
  GameFeedbackEvent,
  GameFeedbackHandler,
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

const VOICE_FILES = {
  start: 'journey-start.mp3',
  stone: 'stone-hint.mp3',
  bridge: 'bridge-hint.mp3',
  'traffic-light': 'traffic-light-hint.mp3',
  'animal-crossing': 'animal-crossing-hint.mp3',
  'tire-change': 'tire-change-hint.mp3',
  'rainy-drive': 'rainy-drive-hint.mp3',
  'night-lights': 'night-lights-hint.mp3',
  'fuel-stop': 'fuel-stop-hint.mp3',
  'car-wash': 'car-wash-hint.mp3',
  'rabbit-feeding': 'rabbit-feeding-hint.mp3',
  'flower-watering': 'flower-watering-hint.mp3',
  'home-garage': 'home-garage-hint.mp3',
  praise: 'scene-complete.mp3',
  finish: 'journey-complete.mp3',
} as const

type VoiceClip = keyof typeof VOICE_FILES

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

function getVoiceClip(event: GameFeedbackEvent): VoiceClip | null {
  switch (event.cue) {
    case 'journey-start':
      return 'start'
    case 'scene-hint':
      return event.sceneId ?? null
    case 'scene-complete':
      return 'praise'
    case 'journey-complete':
      return 'finish'
    default:
      return null
  }
}

export function useGameAudio(journeyActive: boolean) {
  const [settings, setSettings] = useState<AudioSettings>(loadSettings)
  const settingsRef = useRef(settings)
  const audioContextRef = useRef<AudioContext | null>(null)
  const voiceClipsRef = useRef<Partial<Record<VoiceClip, HTMLAudioElement>>>({})
  const activeVoiceRef = useRef<VoiceClip | null>(null)
  const pendingHintRef = useRef<VoiceClip | null>(null)
  const musicTimerRef = useRef<number | null>(null)
  const musicIndexRef = useRef(0)

  const stopVoice = useCallback(() => {
    pendingHintRef.current = null
    const active = activeVoiceRef.current
    activeVoiceRef.current = null
    if (!active) return
    const audio = voiceClipsRef.current[active]
    if (!audio) return
    audio.onended = null
    audio.onerror = null
    audio.pause()
    try {
      audio.currentTime = 0
    } catch {
      // An unloaded clip has no playback position to reset.
    }
  }, [])

  useEffect(() => {
    settingsRef.current = settings
    saveSettings(settings)
  }, [settings])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.Audio === 'undefined') return

    for (const clip of Object.keys(VOICE_FILES) as VoiceClip[]) {
      try {
        const audio = new window.Audio()
        audio.preload = 'auto'
        audio.volume = 0.76
        audio.src = `${import.meta.env.BASE_URL}audio/voice/${VOICE_FILES[clip]}`
        voiceClipsRef.current[clip] = audio
        audio.load()
      } catch {
        // A missing browser audio API should not affect gameplay.
      }
    }

    return () => {
      pendingHintRef.current = null
      activeVoiceRef.current = null
      for (const audio of Object.values(voiceClipsRef.current)) {
        if (!audio) continue
        audio.onended = null
        audio.onerror = null
        audio.pause()
      }
      voiceClipsRef.current = {}
    }
  }, [])

  useEffect(() => {
    if (!settings.voiceEnabled) stopVoice()
  }, [settings.voiceEnabled, stopVoice])

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

  const playVoiceClip = useCallback((clip: VoiceClip) => {
    if (!settingsRef.current.voiceEnabled) return
    const audio = voiceClipsRef.current[clip]
    if (!audio) return

    if (activeVoiceRef.current === clip) return

    // Let the first scene prompt follow the start phrase, and the next scene
    // prompt follow the praise. Keep only the newest pending prompt.
    if (
      (clip === 'stone' || clip === 'bridge' || clip === 'traffic-light') &&
      (activeVoiceRef.current === 'start' || activeVoiceRef.current === 'praise')
    ) {
      pendingHintRef.current = clip
      return
    }

    pendingHintRef.current = null
    const previous = activeVoiceRef.current
    activeVoiceRef.current = null
    if (previous) {
      const previousAudio = voiceClipsRef.current[previous]
      if (previousAudio) {
        previousAudio.onended = null
        previousAudio.onerror = null
        previousAudio.pause()
        try {
          previousAudio.currentTime = 0
        } catch {
          // An unloaded clip has no playback position to reset.
        }
      }
    }

    activeVoiceRef.current = clip
    const finish = () => {
      if (activeVoiceRef.current !== clip) return
      activeVoiceRef.current = null
      audio.onended = null
      audio.onerror = null
      const nextHint = pendingHintRef.current
      pendingHintRef.current = null
      if (nextHint) playVoiceClip(nextHint)
    }

    audio.onended = finish
    audio.onerror = finish
    try {
      audio.currentTime = 0
      void audio.play().catch(finish)
    } catch {
      // Audio can fail to load or play without blocking the game.
      finish()
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

    const voiceClip = getVoiceClip(event)
    if (voiceClip) playVoiceClip(voiceClip)
  }, [ensureAudioContext, playNotes, playVoiceClip])

  const setAudioSetting = useCallback((key: AudioSettingKey, value: boolean) => {
    const nextSettings = { ...settingsRef.current, [key]: value }
    settingsRef.current = nextSettings
    setSettings(nextSettings)

    if (key === 'musicEnabled' && value && journeyActive) {
      ensureAudioContext()
    }
    if (key === 'voiceEnabled' && !value) stopVoice()
  }, [ensureAudioContext, journeyActive, stopVoice])

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
