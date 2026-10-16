import type { ProductRow } from "@/lib/db/schema"

export type Product = {
  id: number
  nombre: string
  slug: string
  descripcion: string
  categoria: string
  imagen: string
  precioLista: number
  precio: number
  enPromo: boolean
  stock: number
  activo: boolean
}

export const CATEGORIAS = ["Rostro", "Ojos", "Labios", "Uñas", "Cuidado", "Fragancias", "Unlock", "General"] as const

export function mapProducto(row: ProductRow): Product {
  const precioLista = Number(row.price)
  const precioPromo = row.promoPrice === null ? null : Number(row.promoPrice)
  const enPromo = row.onPromo && precioPromo !== null && precioPromo > 0

  return {
    id: row.id,
    nombre: row.name,
    slug: row.slug,
    descripcion: row.description,
    categoria: row.category,
    imagen: row.imageUrl || "/image/Producto-1.jpg",
    precioLista,
    precio: enPromo ? (precioPromo as number) : precioLista,
    enPromo,
    stock: row.stock,
    activo: row.active,
  }
}

export function formatPrecio(valor: number) {
  return `$${valor.toLocaleString("es-AR", { maximumFractionDigits: 2 })}`
}

export function slugify(valor: string) {
  return valor
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
