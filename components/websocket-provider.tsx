"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

type WebSocketContextValue = {
  socket: WebSocket | null
  connected: boolean
  send: (data: unknown) => boolean
}

type ConnectionListener = (
  socket: WebSocket | null,
  connected: boolean
) => void

const WebSocketContext = createContext<WebSocketContextValue>({
  socket: null,
  connected: false,
  send: () => false,
})

let sharedSocket: WebSocket | null = null
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let disconnectTimer: ReturnType<typeof setTimeout> | null = null
let reconnectAttempts = 0
let subscriberCount = 0

const connectionListeners = new Set<ConnectionListener>()

function getWebSocketUrl() {
  if (process.env.NEXT_PUBLIC_WS_URL) {
    return process.env.NEXT_PUBLIC_WS_URL
  }

  if (typeof window === "undefined") {
    return ""
  }

  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"

  return isLocal
    ? "ws://localhost:4000/ws"
    : "wss://api.carts.lol/ws"
}

function notifyConnection(
  socket: WebSocket | null,
  connected: boolean
) {
  for (const listener of connectionListeners) {
    listener(socket, connected)
  }
}

function clearReconnectTimer() {
  if (!reconnectTimer) {
    return
  }

  clearTimeout(reconnectTimer)
  reconnectTimer = null
}

function scheduleReconnect() {
  if (subscriberCount <= 0 || reconnectTimer) {
    return
  }

  reconnectAttempts += 1

  const delay = Math.min(
    1000 * 2 ** Math.min(reconnectAttempts - 1, 4),
    15000
  )

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null

    if (subscriberCount > 0) {
      connectWebSocket()
    }
  }, delay)
}

function connectWebSocket() {
  if (typeof window === "undefined") {
    return
  }

  if (
    sharedSocket?.readyState === WebSocket.OPEN ||
    sharedSocket?.readyState === WebSocket.CONNECTING
  ) {
    return
  }

  clearReconnectTimer()

  const url = getWebSocketUrl()

  if (!url) {
    return
  }

  const ws = new WebSocket(url)

  sharedSocket = ws

  notifyConnection(ws, false)

  ws.onopen = () => {
    if (sharedSocket !== ws) {
      return
    }

    reconnectAttempts = 0

    console.log("[WS] Connected")

    notifyConnection(ws, true)
  }

  ws.onmessage = (event) => {
    if (sharedSocket !== ws) {
      return
    }

    try {
      const data = JSON.parse(event.data)

      if (data.type === "ping") {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              type: "pong",
              t: Date.now(),
            })
          )
        }

        return
      }

      if (data.type === "hello") {
        console.log("[WS] Hello:", data)
        return
      }

      console.log("[WS] Message:", data)
    } catch {
      console.warn("[WS] Invalid message:", event.data)
    }
  }

  ws.onerror = () => {
    if (sharedSocket !== ws) {
      return
    }

    console.warn("[WS] Connection error")
  }

  ws.onclose = (event) => {
    if (sharedSocket !== ws) {
      return
    }

    sharedSocket = null

    notifyConnection(null, false)

    console.log("[WS] Disconnected", {
      code: event.code,
      reason: event.reason || "No reason provided",
      clean: event.wasClean,
    })

    scheduleReconnect()
  }
}

function disconnectWebSocket() {
  clearReconnectTimer()

  const ws = sharedSocket

  sharedSocket = null

  notifyConnection(null, false)

  if (!ws) {
    return
  }

  ws.onopen = null
  ws.onmessage = null
  ws.onerror = null
  ws.onclose = null

  if (
    ws.readyState === WebSocket.OPEN ||
    ws.readyState === WebSocket.CONNECTING
  ) {
    ws.close(1000, "No active subscribers")
  }
}

export function WebSocketProvider({
  children,
}: {
  children: ReactNode
}) {
  const [socket, setSocket] = useState<WebSocket | null>(
    sharedSocket
  )

  const [connected, setConnected] = useState(
    sharedSocket?.readyState === WebSocket.OPEN
  )

  useEffect(() => {
    subscriberCount += 1

    if (disconnectTimer) {
      clearTimeout(disconnectTimer)
      disconnectTimer = null
    }

    const listener: ConnectionListener = (
      nextSocket,
      nextConnected
    ) => {
      setSocket(nextSocket)
      setConnected(nextConnected)
    }

    connectionListeners.add(listener)

    if (sharedSocket) {
      listener(
        sharedSocket,
        sharedSocket.readyState === WebSocket.OPEN
      )
    }

    connectWebSocket()

    return () => {
      connectionListeners.delete(listener)

      subscriberCount = Math.max(
        subscriberCount - 1,
        0
      )

      if (subscriberCount === 0) {
        disconnectTimer = setTimeout(() => {
          disconnectTimer = null

          if (subscriberCount === 0) {
            disconnectWebSocket()
          }
        }, 250)
      }
    }
  }, [])

  const send = (data: unknown) => {
    const ws = sharedSocket

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return false
    }

    try {
      ws.send(JSON.stringify(data))
      return true
    } catch {
      return false
    }
  }

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        connected,
        send,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocket() {
  return useContext(WebSocketContext)
}