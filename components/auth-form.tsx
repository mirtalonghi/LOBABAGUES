"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { authClient } from "@/lib/auth-client"

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nombre, setNombre] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  const esRegistro = mode === "sign-up"

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setCargando(true)

    try {
      const resultado = esRegistro
        ? await authClient.signUp.email({ email, password, name: nombre || email })
        : await authClient.signIn.email({ email, password })

      if (resultado.error) {
        const detalle = resultado.error.message || resultado.error.statusText
        setError(
          detalle
            ? `No pudimos completar la operación: ${detalle}`
            : "No pudimos validar esos datos. Revisá el email y la contraseña.",
        )
        return
      }

      router.push("/admin")
      router.refresh()
    } catch {
      setError("Ocurrió un error inesperado. Intentá de nuevo.")
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6">
      <h1 className="font-serif text-2xl text-card-foreground">
        {esRegistro ? "Crear cuenta" : "Panel de gestión"}
      </h1>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        {esRegistro
          ? "Registrá tu usuario para administrar el catálogo."
          : "Ingresá para administrar productos, stock y promociones."}
      </p>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        {esRegistro ? (
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Nombre
            </span>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoComplete="name"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            />
          </label>
        ) : null}

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Contraseña
          </span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={esRegistro ? "new-password" : "current-password"}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />
          {esRegistro ? (
            <span className="text-[11px] text-muted-foreground">Mínimo 8 caracteres.</span>
          ) : null}
        </label>

        {error ? (
          <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
            <p className="text-sm text-destructive">{error}</p>
            {!esRegistro ? (
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {"Si es tu primera vez, todavía no tenés una cuenta creada. "}
                <Link href="/sign-up" className="text-primary underline-offset-4 hover:underline">
                  Creá tu cuenta acá
                </Link>
                {"."}
              </p>
            ) : null}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={cargando}
          className="mt-2 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-foreground disabled:opacity-60"
        >
          {cargando ? "Procesando..." : esRegistro ? "Crear cuenta" : "Ingresar"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        {esRegistro ? (
          <>
            {"Ya tenés cuenta? "}
            <Link href="/sign-in" className="text-primary underline-offset-4 hover:underline">
              Ingresar
            </Link>
          </>
        ) : (
          <>
            {"No tenés cuenta? "}
            <Link href="/sign-up" className="text-primary underline-offset-4 hover:underline">
              Registrate
            </Link>
          </>
        )}
      </p>
    </div>
  )
}
