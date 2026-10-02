import "./main.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { VerfiyRefToken } from "@/lib/cookies/cookies_querries";
import { redirect } from "next/navigation";
export default async function RootLayout({ children }: LayoutProps<"/">) {
  const valid = await VerfiyRefToken()
  if(!valid){
    redirect('/login')
  }
  return (
    <div className="bg-gray-300 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}