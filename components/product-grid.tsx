"use client"

import Image from "next/image"

import { useCart } from "@/components/cart-provider"
import { formatPrecio, type Product } from "@/lib/products"

export function ProductGrid({ productos }: { productos: Product[] }) {
  const { agregar } = useCart()

  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
      {productos.map((producto) => (
        <li
          key={producto.id}
          className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card"
        >
          <div className="relative aspect-square overflow-hidden bg-muted">
            <Image
              src={producto.imagen}
              alt={producto.nombre}
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {producto.enPromo ? (
              <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-foreground">
                Promo
              </span>
            ) : null}
          </div>
          <div className="flex flex-1 flex-col gap-1.5 p-3 sm:gap-2 sm:p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:text-[11px] sm:tracking-[0.25em]">
              {producto.categoria}
            </p>
            <h3 className="font-serif text-base leading-snug text-card-foreground text-balance sm:text-lg">
              {producto.nombre}
            </h3>
            {producto.descripcion ? (
              <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {producto.descripcion}
              </p>
            ) : null}

            <div className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-2">
              <p className="text-base font-semibold text-primary">
                {formatPrecio(producto.precio)}
              </p>
              {producto.enPromo ? (
                <p className="text-sm text-muted-foreground line-through">
                  {formatPrecio(producto.precioLista)}
                </p>
              ) : null}
            </div>

            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              {producto.stock > 0 ? `${producto.stock} en stock` : "Sin stock"}
            </p>

            <button
              type="button"
              disabled={producto.stock === 0}
              onClick={() => agregar(producto)}
              className="mt-2 w-full rounded-full bg-primary px-2 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] sm:mt-3 sm:px-4 sm:text-xs sm:tracking-[0.18em] text-primary-foreground transition-colors hover:bg-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              {producto.stock === 0 ? "Sin stock" : "Añadir al carrito"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
