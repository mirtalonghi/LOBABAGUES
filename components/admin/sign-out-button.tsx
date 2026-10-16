"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { authClient } from "@/lib/auth-client"

export function SignOutButton() {
  const router = useRouter()
  const [saliendo, setSaliendo] = useState(false)

  return (
    <button
      type="button"
      disabled={saliendo}
      onClick={async () => {
        setSaliendo(true)
        await authClient.signOut()
        router.push("/sign-in")
        router.refresh()
      }}
      className="rounded-full border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
    >
      {saliendo ? "Saliendo..." : "Cerrar sesión"}
    </button>
  )
}
