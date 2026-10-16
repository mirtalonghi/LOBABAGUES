import Image from "next/image"
import Link from "next/link"

const redes = [
  { src: "/image/Fcabook.png", nombre: "Facebook" },
  { src: "/image/Instagrampng.png", nombre: "Instagram" },
  { src: "/image/Twiter.jpg", nombre: "Twitter" },
  { src: "/image/Tik-tok1.png", nombre: "TikTok" },
]

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-14 md:flex-row md:justify-between">
        <div className="flex flex-col gap-4 md:max-w-xs">
          <p className="font-serif text-xl tracking-[0.15em]">LOBA BAGUES</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Cosmética pensada para la rutina real: fórmulas simples, colores que combinan y envíos a
            todo el país.
          </p>
          <Link
            href="/quienes-somos"
            className="text-sm uppercase tracking-[0.2em] text-primary underline-offset-4 hover:underline"
          >
            Quiénes somos
          </Link>
        </div>

        <form className="flex w-full flex-col gap-3 md:max-w-md">
          <h2 className="font-serif text-xl">Envíanos tu consulta</h2>
          <label htmlFor="email" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="rounded-md border border-input bg-card px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <label
            htmlFor="mensaje"
            className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
          >
            Tu consulta
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows={4}
            required
            className="rounded-md border border-input bg-card px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="submit"
            className="w-fit rounded-full bg-primary px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-foreground"
          >
            Enviar
          </button>
        </form>

        <div className="flex flex-col gap-4">
          <h2 className="font-serif text-xl">Redes</h2>
          <ul className="flex items-center gap-3">
            {redes.map((red) => (
              <li key={red.nombre}>
                <a
                  href="#"
                  className="block rounded-full ring-offset-2 transition-opacity hover:opacity-70"
                >
                  <Image
                    src={red.src}
                    alt={red.nombre}
                    width={36}
                    height={36}
                    className="size-9 rounded-full object-cover"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border/70 px-4 py-5 text-center text-xs text-muted-foreground">
        {`© ${new Date().getFullYear()} LOBA BAGUES. Todos los derechos reservados.`}
      </div>
    </footer>
  )
}
