"use client"

import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  )

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
    )

    const updateMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    mediaQuery.addEventListener("change", updateMobile)

    updateMobile()

    return () => {
      mediaQuery.removeEventListener("change", updateMobile)
    }
  }, [])

  return !!isMobile
}