import "server-only"

/*
 * Envío de mails con Resend (https://resend.com), sin librerías extra.
 *
 * Variables de entorno (en Vercel → Settings → Environment Variables):
 *   RESEND_API_KEY  la clave de Resend (obligatoria para enviar)
 *   EMAIL_FROM      remitente, por ejemplo "LOBA BAGUES <panel@tudominio.com>".
 *                   Si no está, se usa el remitente de prueba de Resend, que solo
 *                   puede enviar al mail con el que se creó la cuenta de Resend.
 */

type Mail = { para: string; asunto: string; texto: string; html?: string }

export async function enviarMail({ para, asunto, texto, html }: Mail) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // Sin clave no se puede enviar: queda registrado para poder seguir probando
    console.warn(`[mail] Falta RESEND_API_KEY. Mail para ${para} no enviado.\n${texto}`)
    return
  }

  const respuesta = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "LOBA BAGUES <onboarding@resend.dev>",
      to: [para],
      subject: asunto,
      text: texto,
      ...(html ? { html } : {}),
    }),
  })

  if (!respuesta.ok) {
    const detalle = await respuesta.text().catch(() => "")
    console.error(`[mail] Resend respondió ${respuesta.status}: ${detalle}`)
    throw new Error("No se pudo enviar el mail")
  }
}
