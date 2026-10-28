// MAILS AUTORIZADOS PARA EL PANEL DE GESTIÓN
//
// Solo estos mails pueden registrarse y entrar al panel (/admin).
// Para cambiar de dueña: agregá el mail nuevo a la lista, publicá el cambio,
// y que esa persona se registre en /sign-up. Después podés borrar el mail viejo.
// Escribilos en minúscula. Se pueden poner varios, separados por coma.
export const ADMIN_EMAILS = [
  "mirta.wolfsdorf@gmail.com",
]

export function esEmailAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.map((e) => e.trim().toLowerCase()).includes(email.trim().toLowerCase())
}
