// app/profile/edit/page.tsx
import EditProfileForm from "@/components/profile/edit-profile-form" // ✅ fixed spelling and default import

// ✅ Server component (SSR)
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function EditProfilePage() {
  // Optionally fetch initial profile data here (SSR)
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, { cache: "no-store" })
  // const data = await res.json()

  return <EditProfileForm /> // ✅ fixed JSX syntax
}
