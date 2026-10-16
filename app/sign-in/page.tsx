import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { AuthForm } from "@/components/auth-form"
import { auth } from "@/lib/auth"

export default async function SignInPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect("/admin")

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <AuthForm mode="sign-in" />
    </main>
  )
}
