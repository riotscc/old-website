"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

type AuthUser = {
  id?: string
  numberId?: number | null
  discordId?: string | null
  username: string
  displayName: string
  globalName?: string | null
  avatar: string | null
  plan: string
}

type BadgeData = {
  equipped: string[]
  monochrome: boolean
  color: string
  containerEnabled: boolean
  loopEnabled: boolean
  glowEnabled: boolean
}

type DiscordConnection = {
  connected: boolean
  id: string | null
  username: string | null
  displayName: string | null
  avatar: string | null
}

type ConnectionData = {
  discord: DiscordConnection
}

type BootstrapData = {
  user: AuthUser | null
  badges: BadgeData | null
  connections: ConnectionData | null
}

type AuthContextValue = {
  user: AuthUser | null
  badges: BadgeData | null
  connections: ConnectionData | null
  loading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  badges: null,
  connections: null,
  loading: true,
  refreshUser: async () => {},
})

let cachedBootstrap: BootstrapData | undefined
let bootstrapPromise: Promise<BootstrapData> | null = null

function getApiUrl() {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL

  if (!apiUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not configured"
    )
  }

  return apiUrl.replace(/\/$/, "")
}

async function fetchBootstrap(
  force = false
): Promise<BootstrapData> {
  if (force) {
    cachedBootstrap = undefined
    bootstrapPromise = null
  }

  if (cachedBootstrap !== undefined) {
    return cachedBootstrap
  }

  if (bootstrapPromise) {
    return bootstrapPromise
  }

  bootstrapPromise = (async () => {
    try {
      const response = await fetch(
        `${getApiUrl()}/v1/bootstrap`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      )

      if (!response.ok) {
        const empty: BootstrapData = {
          user: null,
          badges: null,
          connections: null,
        }

        cachedBootstrap = empty

        return empty
      }

      const data =
        await response.json()

      if (!data?.user) {
        const empty: BootstrapData = {
          user: null,
          badges: null,
          connections: null,
        }

        cachedBootstrap = empty

        return empty
      }

      const result: BootstrapData = {
        user: {
          id:
            data.user.id,
          numberId:
            data.user.numberId != null
              ? Number(
                  data.user.numberId
                )
              : null,
          discordId:
            data.user.discordId ?? null,
          username:
            data.user.username ||
            data.user.displayName ||
            "user",
          displayName:
            data.user.displayName ||
            data.user.globalName ||
            data.user.username ||
            "User",
          globalName:
            data.user.globalName ?? null,
          avatar:
            data.user.avatar ?? null,
          plan:
            data.plan || "free",
        },

        badges: {
          equipped: Array.isArray(
            data.badges?.equipped
          )
            ? data.badges.equipped
            : [],
          monochrome: Boolean(
            data.badges?.monochrome
          ),
          color:
            data.badges?.color ||
            "#ffffff",
          containerEnabled: Boolean(
            data.badges?.containerEnabled
          ),
          loopEnabled: Boolean(
            data.badges?.loopEnabled
          ),
          glowEnabled: Boolean(
            data.badges?.glowEnabled
          ),
        },

        connections: {
          discord: {
            connected: Boolean(
              data.connections?.discord
                ?.connected
            ),
            id:
              data.connections?.discord
                ?.id ?? null,
            username:
              data.connections?.discord
                ?.username ?? null,
            displayName:
              data.connections?.discord
                ?.displayName ?? null,
            avatar:
              data.connections?.discord
                ?.avatar ?? null,
          },
        },
      }

      cachedBootstrap = result

      return result
    } catch {
      return {
        user: null,
        badges: null,
        connections: null,
      }
    } finally {
      bootstrapPromise = null
    }
  })()

  return bootstrapPromise
}

export function AuthProvider({
  children,
}: {
  children: ReactNode
}) {
  const [user, setUser] =
    useState<AuthUser | null>(
      cachedBootstrap?.user ?? null
    )

  const [badges, setBadges] =
    useState<BadgeData | null>(
      cachedBootstrap?.badges ?? null
    )

  const [
    connections,
    setConnections,
  ] =
    useState<ConnectionData | null>(
      cachedBootstrap?.connections ??
        null
    )

  const [loading, setLoading] =
    useState(
      cachedBootstrap === undefined
    )

  async function loadUser(
    force = false
  ) {
    setLoading(true)

    const data =
      await fetchBootstrap(force)

    setUser(data.user)
    setBadges(data.badges)
    setConnections(data.connections)

    setLoading(false)
  }

  useEffect(() => {
    if (
      cachedBootstrap !== undefined
    ) {
      setUser(
        cachedBootstrap.user
      )

      setBadges(
        cachedBootstrap.badges
      )

      setConnections(
        cachedBootstrap.connections
      )

      setLoading(false)

      return
    }

    void loadUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        badges,
        connections,
        loading,
        refreshUser: () =>
          loadUser(true),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}