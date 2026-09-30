// Statistics must never delay or interrupt the game.
export function startVisitStats() {
  let id: string | undefined
  let elapsed = 0
  let previous = performance.now()
  let visible = document.visibilityState === 'visible'
  const sample = () => {
    const now = performance.now()
    if (visible) elapsed += Math.min((now - previous) / 1000, 30)
    previous = now
  }
  const send = () => {
    sample()
    if (!id) return
    void fetch('/api/visits', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, seconds: elapsed }), keepalive: true,
    }).catch(() => {})
  }
  void fetch('/api/visits', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}',
  }).then(async (response) => {
    if (response.ok) id = (await response.json()).id
  }).catch(() => {})
  window.setInterval(send, 15000)
  document.addEventListener('visibilitychange', () => {
    send()
    visible = document.visibilityState === 'visible'
  })
  window.addEventListener('pagehide', send)
}
