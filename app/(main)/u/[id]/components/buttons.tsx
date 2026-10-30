'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import {
  BotMessageSquare,
  LogOut,
  MessageCircle,
  PackageCheck,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react'

interface ButtonsProps {
  username: string
}

interface Item {
  label: string
  icon: LucideIcon
  href: (username: string) => string
}

// The uuid is created at click time, so it is never empty.
const items: Item[] = [
  { label: 'My Orders', icon: ShoppingBag, href: () => `/o/${uuidv4()}` },
  {
    label: 'Connect',
    icon: MessageCircle,
    href: (u) => `/social/${uuidv4()}?u=${encodeURIComponent(u)}`,
  },
  { label: 'Hina', icon: BotMessageSquare, href: () => '/hina' },
  { label: 'Become a seller', icon: PackageCheck, href: () => '/patner/v2/' },
]

const cardClass =
  'flex w-full items-center justify-between rounded-2xl bg-white p-5 text-left text-lg font-semibold text-zinc-900 shadow-md transition hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900'

const Buttons = ({ username }: ButtonsProps) => {
  const router = useRouter()

  return (
    <nav aria-label="Account actions" className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map(({ label, icon: Icon, href }) => (
          <button
            key={label}
            type="button"
            onClick={() => router.push(href(username))}
            className={cardClass}
          >
            {label}
            <Icon size={22} aria-hidden="true" />
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => router.push('/logout')}
        className={`${cardClass} text-red-600 hover:bg-red-50`}
      >
        Log Out
        <LogOut size={22} aria-hidden="true" />
      </button>
    </nav>
  )
}

export default Buttons