import { getCartTotal } from "@/lib/action/setCart";
import Sc from "./secondary_client";
import { redirect } from "next/navigation";
import { getUserId } from "@/lib/cookies/cookies_querries";
import Link from "next/link";
export default async function Page() {
  const res = await getCartTotal();
  const getuser = await getUserId()
  if (!getuser) {
    redirect('/login')
  }
  const sId = crypto.randomUUID()

  const total = res.ok ? res.data.total : 0;
  const totalProd = res.ok ? res.data.totalProd : 0;

  return (
    <div>
      <Sc />

      <div className="flex flex-col items-center gap-6" id="details">
        <div className="mb-4 rounded-full bg-slate-100 px-6 py-2 font-semibold shadow-md">
          Cart Details
        </div>

        {/* Cards row */}
        <div className="flex w-full max-w-xl flex-col gap-6 md:flex-row">
          {/* Card 1 */}
          <div className="flex-1 rounded-xl border border-white/40 bg-white/20 p-6 text-black shadow-lg backdrop-blur-md">
            <div className="flex justify-between font-mono text-xl font-bold">
              <span>Items:</span>
              <span>{totalProd}</span>
            </div>
            <div className="mt-10 flex justify-between font-mono text-xl font-bold">
              <span>Total amount:</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
            <div className="mt-14 translate-x-50 flex justify-between  text-xl " >
              <Link
                href={`/cart/${getuser.user_id}/${totalProd}/methods/Sid/${sId}`}
                className="cursor-pointer bg-yellow-300 p-2 rounded-2xl hover:bg-yellow-500"
              >
                Place order
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}