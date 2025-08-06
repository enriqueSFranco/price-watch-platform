"use client"

import { PropsWithChildren, useEffect, useState } from "react";

export function  MswWorker({children}: PropsWithChildren) {
  const [isMswReady, setIsMswReady] = useState(false);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MSW_ENV !== 'test') return

    const enableMocking = async () => {
      const {worker} = await import('@/mocks/browser')
      await worker.start({
        onUnhandledRequest: "bypass"
      })
      setIsMswReady(true);
    }
    // @ts-expect-error msw not found
    if (!window.msw) {
      enableMocking();
    } else {
      setIsMswReady(true);
    }
  }, [])

  if (process.env.NEXT_PUBLIC_MSW_ENV !== "test") return children;

  if (!isMswReady) {
    return "loading msw worker...";
  }

  return <>{children}</>
}
