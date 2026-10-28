"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { authClient } from "@/lib/auth-client"

const caja = "w-full max-w-sm rounded-lg border border-border bg-card p-6"
const etiqueta = "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
const campo =
  "rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
const boton =
  "mt-2 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-foreground disabled:opacity-60"
const link = "text-primary underline-offset-4 hover:underline"

/* ---------- 1. Pedir el link por mail ---------- */

export function OlvideContrasenaForm() {
  const [email, setEmail] = useState("")
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setCargando(true)
    try {
      const resultado = await authClient.requestPasswordReset({
        email,
        redirectTo: "/restablecer-contrasena",
      })
      if (resultado.error) {
        setError("No pudimos enviar el mail. Intentá de nuevo en unos minutos.")
        return
      }
      setEnviado(true)
    } catch {
      setError("Ocurrió un error inesperado. Intentá de nuevo.")
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className={caja}>
      <h1 className="font-serif text-2xl text-card-foreground">Recuperar contraseña</h1>

      {enviado ? (
        <div role="status" className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Si <strong className="text-foreground">{email}</strong> tiene acceso al panel, te enviamos un mail con un
            link para elegir una contraseña nueva. El link vence en 1 hora.
          </p>
          <p>Revisá también la carpeta de spam.</p>
          <Link href="/sign-in" className={link}>
            Volver a ingresar
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Escribí el mail con el que entrás al panel y te mandamos un link para elegir una contraseña nueva.
          </p>
          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className={etiqueta}>Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className={campo}
              />
            </label>
            {error ? (
              <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <button type="submit" disabled={cargando} className={boton}>
              {cargando ? "Enviando..." : "Enviar link"}
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            <Link href="/sign-in" className={link}>
              Volver a ingresar
            </Link>
          </p>
        </>
      )}
    </div>
  )
}

/* ---------- 2. Elegir la contraseña nueva (link del mail) ---------- */

export function RestablecerContrasenaForm({ token, linkInvalido }: { token?: string; linkInvalido: boolean }) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [repetida, setRepetida] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  if (linkInvalido || !token) {
    return (
      <div className={caja}>
        <h1 className="font-serif text-2xl text-card-foreground">Link vencido</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Este link ya se usó o venció. Pedí uno nuevo para elegir tu contraseña.
        </p>
        <Link href="/olvide-contrasena" className={`${boton} mt-6 block text-center`}>
          Pedir un link nuevo
        </Link>
      </div>
    )
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    if (password !== repetida) {
      setError("Las contraseñas no coinciden.")
      return
    }
    setCargando(true)
    try {
      const resultado = await authClient.resetPassword({ newPassword: password, token })
      if (resultado.error) {
        setError("El link venció o ya se usó. Pedí uno nuevo.")
        return
      }
      router.push("/sign-in?motivo=contrasena-cambiada")
    } catch {
      setError("Ocurrió un error inesperado. Intentá de nuevo.")
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className={caja}>
      <h1 className="font-serif text-2xl text-card-foreground">Contraseña nueva</h1>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Elegí la contraseña para entrar al panel.</p>
      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className={etiqueta}>Contraseña nueva</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            className={campo}
          />
          <span className="text-[11px] text-muted-foreground">Mínimo 8 caracteres.</span>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={etiqueta}>Repetila</span>
          <input
            type="password"
            required
            minLength={8}
            value={repetida}
            onChange={(e) => setRepetida(e.target.value)}
            autoComplete="new-password"
            className={campo}
          />
        </label>
        {error ? (
          <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}
        <button type="submit" disabled={cargando} className={boton}>
          {cargando ? "Guardando..." : "Guardar contraseña"}
        </button>
      </form>
    </div>
  )
}
