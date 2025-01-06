import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CreateShopForm from "@/components/shops/create-shop-form";

export default async function CreateShopPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "SHOP_OWNER") {
    redirect("/");
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Create New Shop</h1>
      <CreateShopForm />
    </div>
  );
} 