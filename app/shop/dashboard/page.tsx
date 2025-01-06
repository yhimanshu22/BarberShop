import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "SHOP_OWNER") {
    redirect("/")
  }

  return (
    <div>
      <h1>Shop Dashboard</h1>
      {/* Dashboard content */}
    </div>
  )
} 