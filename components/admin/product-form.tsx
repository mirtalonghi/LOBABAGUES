"use client"

import { useState } from "react"

import { actualizarProducto, crearProducto } from "@/app/actions/products"
import { CATEGORIAS, type Product } from "@/lib/products"

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
const labelClass =
  "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"

export function ProductForm({
  producto,
  onDone,
}: {
  producto?: Product
  onDone?: () => void
}) {
  const [error, setError] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [imagen, setImagen] = useState(producto?.imagen ?? "")
  const [subiendo, setSubiendo] = useState(false)
  const editando = Boolean(producto)

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setError(null)
    setSubiendo(true)
    try {
      const body = new FormData()
      body.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "No se pudo subir la imagen")
      setImagen(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la imagen")
    } finally {
      setSubiendo(false)
      event.target.value = ""
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    setError(null)
    setGuardando(true)

    try {
      if (producto) {
        await actualizarProducto(producto.id, formData)
      } else {
        await crearProducto(formData)
        form.reset()
      }
      onDone?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el producto")
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5"
    >
      <h2 className="font-serif text-xl text-card-foreground">
        {editando ? "Editar producto" : "Nuevo producto"}
      </h2>

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>Nombre</span>
        <input
          name="nombre"
          required
          defaultValue={producto?.nombre}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>Descripción</span>
        <textarea
          name="descripcion"
          rows={3}
          defaultValue={producto?.descripcion}
          className={inputClass}
        />
      </label>

      <div className="flex flex-col gap-4 sm:flex-row">
        <label className="flex flex-1 flex-col gap-1.5">
          <span className={labelClass}>Categoría</span>
          <select
            name="categoria"
            defaultValue={producto?.categoria ?? "General"}
            className={inputClass}
          >
            {CATEGORIAS.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-1 flex-col gap-1.5">
          <span className={labelClass}>Stock</span>
          <input
            name="stock"
            type="number"
            min={0}
            step={1}
            required
            defaultValue={producto?.stock ?? 0}
            className={inputClass}
          />
        </label>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className={labelClass}>Foto del producto</span>
        <input type="hidden" name="imagen" value={imagen} />
        <div className="flex items-center gap-3">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
            {imagen ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagen || "/placeholder.svg"} alt="Vista previa" className="size-full object-cover" />
            ) : (
              <span className="flex size-full items-center justify-center text-[10px] text-muted-foreground">
                Sin foto
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={onFileChange}
              disabled={subiendo}
              className="text-xs text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-[0.14em] file:text-primary-foreground hover:file:bg-foreground disabled:opacity-60"
            />
            {subiendo ? (
              <span className="text-xs text-muted-foreground">Subiendo imagen...</span>
            ) : (
              <span className="text-[11px] text-muted-foreground">JPG, PNG o WEBP, hasta 5 MB.</span>
            )}
            {imagen ? (
              <button
                type="button"
                onClick={() => setImagen("")}
                className="self-start text-[11px] font-semibold uppercase tracking-[0.14em] text-destructive"
              >
                Quitar foto
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <label className="flex flex-1 flex-col gap-1.5">
          <span className={labelClass}>Precio de lista</span>
          <input
            name="precio"
            type="number"
            min={0}
            step="0.01"
            required
            defaultValue={producto?.precioLista ?? ""}
            className={inputClass}
          />
        </label>

        <label className="flex flex-1 flex-col gap-1.5">
          <span className={labelClass}>Precio promo</span>
          <input
            name="precioPromo"
            type="number"
            min={0}
            step="0.01"
            defaultValue={producto?.enPromo ? producto.precio : ""}
            className={inputClass}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-card-foreground">
          <input
            name="enPromo"
            type="checkbox"
            defaultChecked={producto?.enPromo}
            className="size-4 accent-primary"
          />
          En promoción
        </label>
        <label className="flex items-center gap-2 text-sm text-card-foreground">
          <input
            name="activo"
            type="checkbox"
            defaultChecked={producto ? producto.activo : true}
            className="size-4 accent-primary"
          />
          Visible en la tienda
        </label>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={guardando}
          className="rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-foreground disabled:opacity-60"
        >
          {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Crear producto"}
        </button>
        {editando ? (
          <button
            type="button"
            onClick={onDone}
            className="rounded-full border border-border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Cancelar
          </button>
        ) : null}
      </div>
    </form>
  )
}
