interface MeticulousRecorder {
  flush: () => Promise<void>
  getSessionUrl: () => string
}

interface Window {
  Meticulous?: {
    record?: MeticulousRecorder
  }
}
