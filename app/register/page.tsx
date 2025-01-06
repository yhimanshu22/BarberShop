import RegisterForm from "@/components/pages/auth/register-form"; 
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | WalkInOnline",
  description: "Register your barbershop with WalkInOnline",
};

export default function RegisterPage() {
  return (
    <section className="container flex min-h-[calc(100vh-200px)] items-center justify-center py-12">
      <div className="flex w-full flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold">Register Your Shop</h1>
          <p className="text-muted-foreground">
            Create an account to start managing your barbershop queue
          </p>
        </div>
        <RegisterForm />
      </div>
    </section>
  );
} 