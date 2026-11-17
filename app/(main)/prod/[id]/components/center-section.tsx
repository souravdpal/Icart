import React from 'react'
import { Truck, Banknote, Package, CreditCardPlus } from 'lucide-react'

const PERKS = [
  { icon: Truck, label: 'Fast delivery' },
  { icon: Banknote, label: 'Cash on delivery' },
  { icon: Package, label: '7-day delivery' },
  { icon: CreditCardPlus, label: 'Save more with offers' },
]

export default function CenterSection() {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {PERKS.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200"
        >
          <Icon className="size-5 shrink-0 text-sky-600" aria-hidden="true" />
          <span className="font-medium text-slate-800">{label}</span>
        </li>
      ))}
    </ul>
  )
}