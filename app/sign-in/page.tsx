import { redirect } from "next/navigation"

import { AuthForm } from "@/components/auth-form"
import { getSesionAdmin } from "@/lib/admin"

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { session, esAdmin } = await getSesionAdmin()
  if (session?.user && esAdmin) redirect("/admin")

  const { motivo } = await searchParams
  const aviso =
    motivo === "inactividad"
      ? "Cerramos tu sesión por inactividad. Ingresá de nuevo para seguir."
      : motivo === "contrasena-cambiada"
        ? "Listo, tu contraseña se cambió. Ingresá con la nueva."
        : null

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 py-16">
      {aviso && (
        <p
          role="status"
          className="w-full max-w-sm rounded-lg border border-border bg-muted px-4 py-3 text-sm leading-relaxed text-muted-foreground"
        >
          {aviso}
        </p>
      )}
      <AuthForm mode="sign-in" />
    </main>
  )
}
