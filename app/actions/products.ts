"use server"

import { and, asc, desc, eq, gt } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { mapProducto, slugify, type Product } from "@/lib/products"

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("No autorizado")
  return session
}

/* ---------- Lectura pública ---------- */

export async function getCatalogo(): Promise<Product[]> {
  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.active, true), gt(products.stock, 0)))
    .orderBy(desc(products.onPromo), asc(products.name))
  return rows.map(mapProducto)
}

/* ---------- Lectura del panel ---------- */

export async function getProductosAdmin(): Promise<Product[]> {
  await requireSession()
  const rows = await db.select().from(products).orderBy(desc(products.createdAt))
  return rows.map(mapProducto)
}

/* ---------- Escritura ---------- */

type ProductoInput = {
  nombre: string
  descripcion: string
  categoria: string
  imagen: string
  precio: number
  precioPromo: number | null
  enPromo: boolean
  stock: number
  activo: boolean
}

function parseForm(formData: FormData): ProductoInput {
  const nombre = String(formData.get("nombre") ?? "").trim()
  if (!nombre) throw new Error("El nombre es obligatorio")

  const precio = Number(formData.get("precio") ?? 0)
  if (!Number.isFinite(precio) || precio < 0) throw new Error("Precio inválido")

  const stock = Number(formData.get("stock") ?? 0)
  if (!Number.isInteger(stock) || stock < 0) throw new Error("Stock inválido")

  const enPromo = formData.get("enPromo") === "on"
  const promoRaw = String(formData.get("precioPromo") ?? "").trim()
  const precioPromo = promoRaw === "" ? null : Number(promoRaw)
  if (precioPromo !== null && (!Number.isFinite(precioPromo) || precioPromo < 0)) {
    throw new Error("Precio de promoción inválido")
  }
  if (enPromo && (precioPromo === null || precioPromo >= precio)) {
    throw new Error("El precio de promoción debe ser menor al precio de lista")
  }

  return {
    nombre,
    descripcion: String(formData.get("descripcion") ?? "").trim(),
    categoria: String(formData.get("categoria") ?? "General"),
    imagen: String(formData.get("imagen") ?? "").trim(),
    precio,
    precioPromo,
    enPromo,
    stock,
    activo: formData.get("activo") === "on",
  }
}

export async function crearProducto(formData: FormData) {
  await requireSession()
  const input = parseForm(formData)

  await db.insert(products).values({
    name: input.nombre,
    slug: `${slugify(input.nombre)}-${Date.now().toString(36)}`,
    description: input.descripcion,
    category: input.categoria,
    imageUrl: input.imagen,
    price: input.precio.toFixed(2),
    promoPrice: input.precioPromo === null ? null : input.precioPromo.toFixed(2),
    onPromo: input.enPromo,
    stock: input.stock,
    active: input.activo,
  })

  revalidatePath("/")
  revalidatePath("/admin")
}

export async function actualizarProducto(id: number, formData: FormData) {
  await requireSession()
  const input = parseForm(formData)

  await db
    .update(products)
    .set({
      name: input.nombre,
      description: input.descripcion,
      category: input.categoria,
      imageUrl: input.imagen,
      price: input.precio.toFixed(2),
      promoPrice: input.precioPromo === null ? null : input.precioPromo.toFixed(2),
      onPromo: input.enPromo,
      stock: input.stock,
      active: input.activo,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id))

  revalidatePath("/")
  revalidatePath("/admin")
}

export async function eliminarProducto(id: number) {
  await requireSession()
  await db.delete(products).where(eq(products.id, id))
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function ajustarStock(id: number, delta: number) {
  await requireSession()
  const [row] = await db.select().from(products).where(eq(products.id, id))
  if (!row) throw new Error("Producto no encontrado")

  const nuevo = Math.max(0, row.stock + delta)
  await db
    .update(products)
    .set({ stock: nuevo, updatedAt: new Date() })
    .where(eq(products.id, id))

  revalidatePath("/")
  revalidatePath("/admin")
}

export async function togglePromo(id: number) {
  await requireSession()
  const [row] = await db.select().from(products).where(eq(products.id, id))
  if (!row) throw new Error("Producto no encontrado")
  if (!row.promoPrice) throw new Error("Definí un precio de promoción antes de activarla")

  await db
    .update(products)
    .set({ onPromo: !row.onPromo, updatedAt: new Date() })
    .where(eq(products.id, id))

  revalidatePath("/")
  revalidatePath("/admin")
}

export async function toggleActivo(id: number) {
  await requireSession()
  const [row] = await db.select().from(products).where(eq(products.id, id))
  if (!row) throw new Error("Producto no encontrado")

  await db
    .update(products)
    .set({ active: !row.active, updatedAt: new Date() })
    .where(eq(products.id, id))

  revalidatePath("/")
  revalidatePath("/admin")
}
