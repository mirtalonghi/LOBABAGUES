import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quiénes somos | LOBA BAGUES',
  description:
    'Conocé la historia de LOBA BAGUES, tienda de cosmética con fórmulas simples y envíos a todo el país.',
}

export default function QuienesSomosPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 pt-16">
      <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">Nosotras</p>
      <h1 className="mt-2 font-serif text-4xl text-balance sm:text-5xl">Quiénes somos</h1>

      <div className="mt-10 overflow-hidden rounded-lg border border-border">
        <Image
          src="/image/carousel2.png"
          alt="Productos de la línea LOBA BAGUES"
          width={1200}
          height={600}
          className="h-64 w-full object-cover sm:h-80"
        />
      </div>

      <div className="mt-10 flex flex-col gap-6 text-base leading-relaxed text-muted-foreground">
        <p>
          LOBA BAGUES nació con una idea simple: que la cosmética sea fácil de elegir y de usar.
          Trabajamos con fórmulas cortas, texturas livianas y colores que combinan entre sí, para que
          armar tu rutina no dependa de tener veinte productos distintos.
        </p>
        <p>
          Somos un equipo chico y elegimos cada lanzamiento a mano: probamos, ajustamos y recién
          entonces lo sumamos al catálogo. Nos importa que lo que llega a tu casa se sienta bien en la
          piel y que sepas exactamente qué estás comprando.
        </p>
        <p>
          Hacemos envíos a todo el país y respondemos todas las consultas que nos llegan por el
          formulario o por nuestras redes. Si tenés dudas sobre un tono o una textura, escribinos
          antes de comprar.
        </p>
      </div>

      <dl className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { titulo: 'Fórmulas simples', texto: 'Ingredientes claros, sin listas interminables.' },
          { titulo: 'Envíos al país', texto: 'Despachamos a toda la Argentina.' },
          { titulo: 'Atención real', texto: 'Te respondemos nosotras, no un bot.' },
        ].map((item) => (
          <div key={item.titulo} className="rounded-lg border border-border bg-card p-5">
            <dt className="font-serif text-lg text-card-foreground">{item.titulo}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.texto}</dd>
          </div>
        ))}
      </dl>
    </main>
  )
}
