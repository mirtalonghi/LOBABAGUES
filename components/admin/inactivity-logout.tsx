"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

import { authClient } from "@/lib/auth-client"
import { MINUTOS_INACTIVIDAD } from "@/lib/site-config"

/*
 * Cierra la sesión del panel después de un rato sin uso.
 * - Cuenta como uso: mover el mouse, tocar la pantalla, hacer clic, escribir o desplazarse.
 * - Un minuto antes de cerrar muestra un aviso con cuenta regresiva.
 * - Si el panel está abierto en varias pestañas, el uso en cualquiera mantiene activas todas.
 */

const LIMITE_MS = MINUTOS_INACTIVIDAD * 60 * 1000
const AVISO_MS = 60 * 1000
const CLAVE = "loba-admin-ultima-actividad"
const EVENTOS = ["pointerdown", "pointermove", "keydown", "scroll", "touchstart", "wheel"] as const

function leerUltima(): number {
  try {
    const v = Number(localStorage.getItem(CLAVE))
    return Number.isFinite(v) && v > 0 ? v : Date.now()
  } catch {
    return Date.now()
  }
}

function guardarUltima(t: number) {
  try {
    localStorage.setItem(CLAVE, String(t))
  } catch {
    /* sin almacenamiento: el temporizador funciona igual en esta pestaña */
  }
}

export function InactivityLogout() {
  const router = useRouter()
  const ultima = useRef<number>(Date.now())
  const cerrando = useRef(false)
  const avisoVisible = useRef(false)
  const [restante, setRestante] = useState<number | null>(null)

  const registrarActividad = useCallback(() => {
    const ahora = Date.now()
    // Evita escribir en cada movimiento del mouse: como mucho una vez cada 5 segundos
    if (ahora - ultima.current < 5000) return
    ultima.current = ahora
    guardarUltima(ahora)
  }, [])

  const seguirConectada = useCallback(() => {
    const ahora = Date.now()
    ultima.current = ahora
    guardarUltima(ahora)
    avisoVisible.current = false
    setRestante(null)
  }, [])

  const cerrarSesion = useCallback(async () => {
    if (cerrando.current) return
    cerrando.current = true
    try {
      await authClient.signOut()
    } finally {
      router.replace("/sign-in?motivo=inactividad")
      router.refresh()
    }
  }, [router])

  useEffect(() => {
    ultima.current = Date.now()
    guardarUltima(ultima.current)

    const alActuar = () => {
      // Mientras se muestra el aviso, solo el botón lo descarta
      if (!avisoVisible.current) registrarActividad()
    }
    EVENTOS.forEach((e) => window.addEventListener(e, alActuar, { passive: true }))

    // Actividad en otra pestaña del panel
    const alCambiarOtraPestana = (e: StorageEvent) => {
      if (e.key === CLAVE && e.newValue) {
        ultima.current = Math.max(ultima.current, Number(e.newValue))
      }
    }
    window.addEventListener("storage", alCambiarOtraPestana)

    const revisar = () => {
      const ultimaReal = Math.max(ultima.current, leerUltima())
      ultima.current = ultimaReal
      const falta = LIMITE_MS - (Date.now() - ultimaReal)
      if (falta <= 0) {
        avisoVisible.current = true
        setRestante(0)
        void cerrarSesion()
      } else if (falta <= AVISO_MS) {
        avisoVisible.current = true
        setRestante(Math.ceil(falta / 1000))
      } else {
        avisoVisible.current = false
        setRestante(null)
      }
    }
    const intervalo = window.setInterval(revisar, 1000)
    // Al volver a la pestaña se revisa enseguida (los navegadores frenan los temporizadores en segundo plano)
    document.addEventListener("visibilitychange", revisar)

    return () => {
      EVENTOS.forEach((e) => window.removeEventListener(e, alActuar))
      window.removeEventListener("storage", alCambiarOtraPestana)
      document.removeEventListener("visibilitychange", revisar)
      window.clearInterval(intervalo)
    }
  }, [cerrarSesion, registrarActividad])

  if (restante === null) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="inactividad-titulo"
        aria-describedby="inactividad-texto"
        className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-xl"
      >
        <h2 id="inactividad-titulo" className="font-serif text-2xl text-card-foreground">
          ¿Seguís ahí?
        </h2>
        <p id="inactividad-texto" className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {restante > 0
            ? `Por seguridad, la sesión se cierra en ${restante} segundo${restante === 1 ? "" : "s"} por inactividad.`
            : "Cerrando la sesión…"}
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
          <button
            type="button"
            autoFocus
            onClick={seguirConectada}
            disabled={restante === 0}
            className="rounded-full bg-foreground px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-background transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            Seguir conectada
          </button>
          <button
            type="button"
            onClick={() => void cerrarSesion()}
            disabled={restante === 0}
            className="rounded-full border border-border px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  )
}
