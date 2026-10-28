import { betterAuth } from "better-auth"
import { APIError } from "better-auth/api"

import { esEmailAdmin } from "@/lib/admin-emails"
import { pool } from "@/lib/db"
import { enviarMail } from "@/lib/email"
import { MINUTOS_INACTIVIDAD } from "@/lib/site-config"

export const auth = betterAuth({
  database: pool,
  baseURL:
    // En las vistas previas de ramas se usa la dirección de la rama, así los links
    // de los mails (recuperar contraseña) apuntan a la versión que se está probando
    (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_BRANCH_URL
      ? `https://${process.env.VERCEL_BRANCH_URL}`
      : undefined) ??
    process.env.BETTER_AUTH_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.V0_RUNTIME_URL),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    // Recuperar contraseña: el link vence en 1 hora y al cambiarla se cierran las demás sesiones
    resetPasswordTokenExpiresIn: 60 * 60,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      // Solo cuentas autorizadas reciben el mail (al resto no se le avisa nada)
      if (!esEmailAdmin(user.email)) return
      await enviarMail({
        para: user.email,
        asunto: "Restablecer tu contraseña · LOBA BAGUES",
        texto: `Hola ${user.name || ""}\n\nPediste restablecer la contraseña del panel de gestión de LOBA BAGUES.\nEntrá a este link para elegir una nueva (vence en 1 hora):\n\n${url}\n\nSi no fuiste vos, ignorá este mail: tu contraseña no cambia.`,
        html: `<p>Hola,</p><p>Pediste restablecer la contraseña del panel de gestión de <strong>LOBA BAGUES</strong>.</p><p><a href="${url}" style="display:inline-block;background:#7a2a5a;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none">Elegir una contraseña nueva</a></p><p style="color:#666;font-size:13px">El link vence en 1 hora. Si no fuiste vos, ignorá este mail: tu contraseña no cambia.</p>`,
      })
    },
  },
  // Solo los mails de lib/admin-emails.ts pueden crear una cuenta
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (!esEmailAdmin(user.email)) {
            throw new APIError("FORBIDDEN", {
              message: "Este mail no está autorizado para el panel de gestión.",
            })
          }
        },
      },
    },
  },
  trustedOrigins: [
    ...(process.env.NODE_ENV === "development"
      ? [
          "http://localhost:3000",
          ...(process.env.V0_RUNTIME_URL ? [process.env.V0_RUNTIME_URL] : []),
          ...(process.env.V0_DEV_APP_URL ? [process.env.V0_DEV_APP_URL] : []),
          ...(process.env.V0_BUILD_URL ? [process.env.V0_BUILD_URL] : []),
          ...(process.env.V0_SANDBOX_URL ? [process.env.V0_SANDBOX_URL] : []),
        ]
      : []),
    ...(process.env.NODE_ENV === "production"
      ? [
          ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
          // Vistas previas de ramas: Vercel completa VERCEL_BRANCH_URL con la dirección
          // de la rama (loba-bagues-git-<rama>-mirtas-projects.vercel.app)
          ...(process.env.VERCEL_BRANCH_URL ? [`https://${process.env.VERCEL_BRANCH_URL}`] : []),
          ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
            ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
            : []),
          // Vercel asigna varios alias de producción al mismo proyecto y solo uno
          // coincide con VERCEL_PROJECT_PRODUCTION_URL. Autorizamos los alias
          // exactos de este proyecto para que el login funcione desde cualquiera.
          "https://loba-bagues.vercel.app",
          "https://loba-vagues.vercel.app",
          "https://loba-bagues-mirtas-projects.vercel.app",
          "https://loba-bagues-git-main-mirtas-projects.vercel.app",
        ]
      : []),
  ],
  // La sesión vence sola si el panel no se usa (aunque el navegador esté cerrado).
  // Mientras se usa, el panel la renueva (ver components/admin/inactivity-logout.tsx).
  // Se deja un margen de 5 minutos sobre el aviso del navegador.
  session: {
    expiresIn: (MINUTOS_INACTIVIDAD + 5) * 60,
    updateAge: 60,
  },
  ...(process.env.NODE_ENV === "development"
    ? {
        advanced: {
          // Requerido por el iframe cross-site de la preview de v0.
          defaultCookieAttributes: {
            sameSite: "none" as const,
            secure: true,
          },
        },
      }
    : {}),
})
