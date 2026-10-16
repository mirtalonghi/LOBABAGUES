"use client"

import Image from "next/image"
import { useEffect, useRef, useState, useTransition } from "react"

import {
  ajustarStock,
  eliminarProducto,
  toggleActivo,
  togglePromo,
} from "@/app/actions/products"
import { ProductForm } from "@/components/admin/product-form"
import { formatPrecio, type Product } from "@/lib/products"

export function ProductManager({ productos }: { productos: Product[] }) {
  const [editando, setEditando] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pendiente, startTransition] = useTransition()
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editando) {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [editando])

  function ejecutar(accion: () => Promise<void>) {
    setError(null)
    startTransition(async () => {
      try {
        await accion()
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo completar la acción")
      }
    })
  }

  const sinStock = productos.filter((p) => p.stock === 0).length
  const enPromo = productos.filter((p) => p.enPromo).length

  return (
    <div className="flex flex-col gap-8">
      <dl className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <dt className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Total</dt>
          <dd className="mt-1 font-serif text-2xl text-card-foreground">{productos.length}</dd>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <dt className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Promo</dt>
          <dd className="mt-1 font-serif text-2xl text-card-foreground">{enPromo}</dd>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <dt className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Sin stock
          </dt>
          <dd className="mt-1 font-serif text-2xl text-card-foreground">{sinStock}</dd>
        </div>
      </dl>

      <div
        ref={formRef}
        className={
          editando
            ? "scroll-mt-4 rounded-lg ring-2 ring-primary ring-offset-2 ring-offset-background transition-shadow"
            : "scroll-mt-4"
        }
      >
        {editando ? (
          <ProductForm producto={editando} onDone={() => setEditando(null)} />
        ) : (
          <ProductForm />
        )}
      </div>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-xl text-foreground">Catálogo</h2>

        {productos.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Todavía no hay productos cargados. Creá el primero con el formulario de arriba.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {productos.map((producto) => (
              <li
                key={producto.id}
                className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
              >
                <div className="flex gap-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={producto.imagen}
                      alt={producto.nombre}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      {producto.categoria}
                    </p>
                    <h3 className="truncate font-serif text-base text-card-foreground">
                      {producto.nombre}
                    </h3>
                    <p className="text-sm">
                      {producto.enPromo ? (
                        <>
                          <span className="font-semibold text-accent">
                            {formatPrecio(producto.precio)}
                          </span>{" "}
                          <span className="text-muted-foreground line-through">
                            {formatPrecio(producto.precioLista)}
                          </span>
                        </>
                      ) : (
                        <span className="font-semibold text-primary">
                          {formatPrecio(producto.precioLista)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.14em]">
                  <span
                    className={`rounded-full px-2.5 py-1 ${
                      producto.activo
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {producto.activo ? "Visible" : "Oculto"}
                  </span>
                  {producto.enPromo ? (
                    <span className="rounded-full bg-accent/15 px-2.5 py-1 text-accent">
                      Promo
                    </span>
                  ) : null}
                  <span
                    className={`rounded-full px-2.5 py-1 ${
                      producto.stock === 0
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    Stock {producto.stock}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center overflow-hidden rounded-full border border-border">
                    <button
                      type="button"
                      disabled={pendiente}
                      onClick={() => ejecutar(() => ajustarStock(producto.id, -1))}
                      className="px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                      aria-label={`Restar stock a ${producto.nombre}`}
                    >
                      −
                    </button>
                    <span className="px-2 text-sm text-card-foreground">{producto.stock}</span>
                    <button
                      type="button"
                      disabled={pendiente}
                      onClick={() => ejecutar(() => ajustarStock(producto.id, 1))}
                      className="px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                      aria-label={`Sumar stock a ${producto.nombre}`}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={pendiente}
                    onClick={() => setEditando(producto)}
                    className="rounded-full border border-border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    disabled={pendiente}
                    onClick={() => ejecutar(() => togglePromo(producto.id))}
                    className="rounded-full border border-border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                  >
                    {producto.enPromo ? "Quitar promo" : "Activar promo"}
                  </button>
                  <button
                    type="button"
                    disabled={pendiente}
                    onClick={() => ejecutar(() => toggleActivo(producto.id))}
                    className="rounded-full border border-border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                  >
                    {producto.activo ? "Ocultar" : "Publicar"}
                  </button>
                  <button
                    type="button"
                    disabled={pendiente}
                    onClick={() => {
                      if (!confirm(`Eliminar "${producto.nombre}"?`)) return
                      ejecutar(() => eliminarProducto(producto.id))
                    }}
                    className="rounded-full border border-destructive/40 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
