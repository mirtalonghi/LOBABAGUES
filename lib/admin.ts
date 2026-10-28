import "server-only"

import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { esEmailAdmin } from "@/lib/admin-emails"

/** Sesión actual y si su mail está autorizado a usar el panel. */
export async function getSesionAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  return { session, esAdmin: esEmailAdmin(session?.user?.email) }
}

/** Para acciones del panel: corta con error si no es una cuenta autorizada. */
export async function requireAdmin() {
  const { session, esAdmin } = await getSesionAdmin()
  if (!session?.user || !esAdmin) throw new Error("No autorizado")
  return session
}
