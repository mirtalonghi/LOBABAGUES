import { OlvideContrasenaForm } from "@/components/password-reset-forms"

export const metadata = {
  title: "Recuperar contraseña | LOBA BAGUES",
}

export default function OlvideContrasenaPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <OlvideContrasenaForm />
    </main>
  )
}
