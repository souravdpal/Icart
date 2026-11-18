import { getCartTotal } from '@/lib/action/setCart'
import Sc from './secondary_client'
import { redirect } from 'next/navigation'
import { getUserId } from '@/lib/cookies/cookies_querries'
import Btn from './components/btn'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const getuser = await getUserId()
  if (!getuser) {
    redirect('/login')
  }

  const res = await getCartTotal()
  const total = res.ok ? res.data.total : 0
  const totalProd = res.ok ? res.data.totalProd : 0

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-10 sm:px-6">
      <Sc />

      <section id="details" className="mt-8 flex flex-col items-center gap-6">
        <div className="rounded-full bg-slate-100 px-6 py-2 font-semibold shadow-md">
          Cart Details
        </div>

        <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white/70 p-5 text-slate-900 shadow-lg backdrop-blur-md sm:p-6">
          <dl className="space-y-4 font-mono">
            <div className="flex items-center justify-between gap-4 text-base font-bold sm:text-xl">
              <dt>Items:</dt>
              <dd>{totalProd}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-4 text-base font-bold sm:text-xl">
              <dt>Total amount:</dt>
              <dd>₹{total.toLocaleString('en-IN')}</dd>
            </div>
          </dl>

          <div className="mt-6 flex justify-stretch sm:justify-end [&>*]:w-full sm:[&>*]:w-auto">
            <Btn userid={getuser.user_id} />
          </div>
        </div>
      </section>
    </div>
  )
}