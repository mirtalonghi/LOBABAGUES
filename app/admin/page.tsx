import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { getProductosAdmin } from "@/app/actions/products"
import { ProductManager } from "@/components/admin/product-manager"
import { SignOutButton } from "@/components/admin/sign-out-button"
import { auth } from "@/lib/auth"

export const metadata = {
  title: "Panel de gestión | LOBA BAGUES",
}

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  const productos = await getProductosAdmin()

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div className="flex flex-col gap-1">
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            Panel de gestión
          </p>
          <h1 className="font-serif text-3xl text-foreground">Productos</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {session.user.email}
          </p>
        </div>
        <SignOutButton />
      </header>

      <ProductManager productos={productos} />
    </main>
  )
}
