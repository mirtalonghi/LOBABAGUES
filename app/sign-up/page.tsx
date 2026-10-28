import { redirect } from "next/navigation"

import { AuthForm } from "@/components/auth-form"
import { getSesionAdmin } from "@/lib/admin"

export default async function SignUpPage() {
  const { session, esAdmin } = await getSesionAdmin()
  if (session?.user && esAdmin) redirect("/admin")

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <AuthForm mode="sign-up" />
    </main>
  )
}
