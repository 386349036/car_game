import { useCallback, useEffect, useRef } from 'react'
import type { SceneId } from '../sceneTypes'

export const INSTRUMENT_DURATION_MS = 6400
const MAX_WAIT_MS = 7900
export const INSTRUMENT_SCENES = [
  'music-soft-drum', 'music-bell-ring', 'music-shaker', 'music-xylophone',
  'music-pluck-string', 'music-trumpet', 'music-accordion', 'music-bear-dance',
  'music-note-score', 'music-box-goodnight',
] as const

export function useInstrumentPerformance(enabled: boolean, stopVoice: () => void, ensureContext: () => AudioContext | null) {
  const enabledRef = useRef(enabled)
  const buffersRef = useRef(new Map<string, Promise<AudioBuffer | null>>())
  const activeRef = useRef<AudioBufferSourceNode | null>(null)
  const cancelRef = useRef<(() => void) | null>(null)
  const mutedFinishRef = useRef<(() => void) | null>(null)
  const playingRef = useRef(false)

  useEffect(() => {
    enabledRef.current = enabled
    if (!enabled) {
      activeRef.current?.stop()
      mutedFinishRef.current?.()
    }
  }, [enabled])

  useEffect(() => {
    const buffers = buffersRef.current
    const loading = new AbortController()
    const context = ensureContext()
    if (context) for (const scene of INSTRUMENT_SCENES) {
      const decoded = fetch(`${import.meta.env.BASE_URL}audio/instruments/${scene}.wav`, { signal: loading.signal })
        .then(response => { if (!response.ok) throw new Error('Instrument unavailable'); return response.arrayBuffer() })
        .then(data => context.decodeAudioData(data))
        .catch(() => null)
      buffers.set(scene, decoded)
    }
    return () => {
      loading.abort()
      cancelRef.current?.()
      buffers.clear()
    }
  }, [ensureContext])

  const playPerformance = useCallback((sceneId: SceneId, signal: AbortSignal) => new Promise<void>(resolve => {
    cancelRef.current?.()
    if (signal.aborted) { resolve(); return }
    stopVoice()
    playingRef.current = true
    const started = performance.now()
    let settled = false
    let minimumTimer: number | undefined
    let deadlineTimer: number | undefined
    let source: AudioBufferSourceNode | null = null
    let gain: GainNode | null = null
    const finish = () => {
      if (settled) return
      settled = true
      window.clearTimeout(minimumTimer)
      window.clearTimeout(deadlineTimer)
      signal.removeEventListener('abort', finish)
      if (source) { source.onended = null; source.stop(); source.disconnect() }
      gain?.disconnect()
      activeRef.current = null
      cancelRef.current = null
      mutedFinishRef.current = null
      playingRef.current = false
      resolve()
    }
    const afterMinimum = () => {
      if (settled) return
      window.clearTimeout(minimumTimer)
      minimumTimer = window.setTimeout(finish, Math.max(0, INSTRUMENT_DURATION_MS - (performance.now() - started)))
    }
    mutedFinishRef.current = afterMinimum
    cancelRef.current = finish
    signal.addEventListener('abort', finish, { once: true })
    deadlineTimer = window.setTimeout(finish, MAX_WAIT_MS)
    if (!enabledRef.current) { afterMinimum(); return }
    const context = ensureContext()
    if (!context) { afterMinimum(); return }
    void Promise.all([context.resume(), buffersRef.current.get(sceneId)]).then(([, buffer]) => {
      if (settled) return
      if (!buffer || !enabledRef.current) { afterMinimum(); return }
      source = context.createBufferSource()
      gain = context.createGain()
      gain.gain.value = 0.55
      source.buffer = buffer
      source.connect(gain)
      gain.connect(context.destination)
      source.onended = afterMinimum
      activeRef.current = source
      source.start()
    }).catch(afterMinimum)
  }), [stopVoice, ensureContext])

  return { playPerformance, playingRef }
}
