import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ShopsView from "@/components/shops/shops-view";

export default async function ShopsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "SHOP_OWNER") {
    redirect("/");
  }

  return <ShopsView />;
}
