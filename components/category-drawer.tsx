"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"

import { CATEGORIAS } from "@/lib/products"

const enlacesExtra = [
  { nombre: "Ofertas", href: "/#ofertas" },
  { nombre: "Quiénes somos", href: "/quienes-somos" },
]

export function CategoryDrawer() {
  const [abierto, setAbierto] = useState(false)

  useEffect(() => {
    if (!abierto) return
    const cerrarConEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAbierto(false)
    }
    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", cerrarConEscape)
    return () => {
      document.body.style.overflow = overflowPrevio
      window.removeEventListener("keydown", cerrarConEscape)
    }
  }, [abierto])

  const cerrar = () => setAbierto(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        aria-expanded={abierto}
        aria-controls="menu-categorias"
        className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-background/10"
      >
        <Menu className="size-6" aria-hidden="true" />
        <span className="sr-only">Abrir menú de categorías</span>
      </button>

      <div
        aria-hidden={!abierto}
        onClick={cerrar}
        className={`fixed inset-0 z-[60] bg-foreground/50 transition-opacity duration-300 ${
          abierto ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        id="menu-categorias"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de categorías"
        inert={!abierto}
        className={`fixed inset-y-0 left-0 z-[70] flex w-[82%] max-w-xs flex-col bg-background text-foreground shadow-xl transition-transform duration-300 ${
          abierto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <p className="font-serif text-lg tracking-[0.18em]">Categorías</p>
          <button
            type="button"
            onClick={cerrar}
            className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-muted"
          >
            <X className="size-5" aria-hidden="true" />
            <span className="sr-only">Cerrar menú</span>
          </button>
        </div>

        <nav aria-label="Categorías" className="flex-1 overflow-y-auto px-2 py-3">
          <ul className="flex flex-col">
            <li>
              <Link
                href="/#productos"
                onClick={cerrar}
                className="flex rounded-md px-3 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition-colors hover:bg-muted"
              >
                Todos los productos
              </Link>
            </li>
            {CATEGORIAS.map((categoria) => (
              <li key={categoria}>
                <Link
                  href={`/?categoria=${encodeURIComponent(categoria)}#productos`}
                  onClick={cerrar}
                  className="flex rounded-md px-3 py-3 text-sm uppercase tracking-[0.18em] transition-colors hover:bg-muted"
                >
                  {categoria}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="mt-3 flex flex-col border-t border-border pt-3">
            {enlacesExtra.map((enlace) => (
              <li key={enlace.href}>
                <Link
                  href={enlace.href}
                  onClick={cerrar}
                  className="flex rounded-md px-3 py-3 text-sm uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {enlace.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}
