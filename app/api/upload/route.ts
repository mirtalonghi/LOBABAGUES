import { put } from "@vercel/blob"
import { headers } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

import { auth } from "@/lib/auth"

const MAX_BYTES = 5 * 1024 * 1024 // 5 MB
const TIPOS_OK = ["image/jpeg", "image/png", "image/webp", "image/avif"]

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 })
  }
  if (!TIPOS_OK.includes(file.type)) {
    return NextResponse.json(
      { error: "Formato no válido. Usá JPG, PNG, WEBP o AVIF." },
      { status: 400 },
    )
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "La imagen supera los 5 MB." }, { status: 400 })
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg"
  const blob = await put(`productos/${crypto.randomUUID()}.${ext}`, file, {
    access: "public",
    contentType: file.type,
  })

  return NextResponse.json({ url: blob.url })
}
