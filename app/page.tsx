import Link from "next/link"

import { getCatalogo } from "@/app/actions/products"
import { HeroCarousel } from "@/components/hero-carousel"
import { ProductGrid } from "@/components/product-grid"
import { CATEGORIAS } from "@/lib/products"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>
}) {
  const { categoria } = await searchParams
  const catalogo = await getCatalogo()
  const promos = catalogo.filter((producto) => producto.enPromo)

  const categoriasConProductos = CATEGORIAS.filter((nombre) =>
    catalogo.some((producto) => producto.categoria.toLowerCase() === nombre.toLowerCase()),
  )
  const categoriaActiva =
    categoriasConProductos.find((nombre) => nombre.toLowerCase() === categoria?.toLowerCase()) ?? null
  const productosVisibles = categoriaActiva
    ? catalogo.filter((producto) => producto.categoria.toLowerCase() === categoriaActiva.toLowerCase())
    : catalogo

  return (
    <main>
      <HeroCarousel ofertas={promos} />

      {promos.length > 0 ? (
        <section id="ofertas" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 pt-16">
          <div className="mb-8 flex flex-col gap-2">
            <p className="text-[11px] uppercase tracking-[0.35em] text-accent">Promociones</p>
            <h2 className="font-serif text-3xl text-balance sm:text-4xl">Precios especiales</h2>
          </div>
          <ProductGrid productos={promos} />
        </section>
      ) : null}

      <section id="productos" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 pt-16">
        <div className="mb-6 flex flex-col gap-2">
          <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">Catálogo</p>
          <h2 className="font-serif text-3xl text-balance sm:text-4xl">
            {categoriaActiva ?? "Todos los productos"}
          </h2>
        </div>

        {categoriaActiva ? (
          <Link
            href="/#productos"
            scroll={false}
            className="mb-8 inline-flex text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Ver todos los productos
          </Link>
        ) : null}

        {catalogo.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-10 text-center">
            <p className="font-serif text-xl text-foreground">
              Todavía no hay productos publicados
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Cargá el catálogo desde el panel de gestión para que aparezca en la tienda.
            </p>
            <Link
              href="/admin"
              className="mt-5 inline-block rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-foreground"
            >
              Ir al panel
            </Link>
          </div>
        ) : (
          <ProductGrid productos={productosVisibles} />
        )}
      </section>
    </main>
  )
}
