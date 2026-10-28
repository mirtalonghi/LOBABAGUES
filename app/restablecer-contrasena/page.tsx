import { RestablecerContrasenaForm } from "@/components/password-reset-forms"

export const metadata = {
  title: "Contraseña nueva | LOBA BAGUES",
}

export default async function RestablecerContrasenaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { token, error } = await searchParams
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <RestablecerContrasenaForm
        token={typeof token === "string" ? token : undefined}
        linkInvalido={error === "INVALID_TOKEN"}
      />
    </main>
  )
}
