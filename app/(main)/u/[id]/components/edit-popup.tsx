'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MailCheck, X } from 'lucide-react'

export interface ProfileData {
  name: string
  username: string
  email: string
  street: string
  landmark: string
  area: string
}

interface EditpopProps {
  popUp: (x: boolean) => void
  name: string
  email: string
  username: string
  img: string
  onSave?: (data: ProfileData) => void
}

const inputClass =
  'w-full rounded-xl border border-zinc-200 bg-zinc-100/60 px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800/60'

const labelClass = 'mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-300'

const Editpop = ({ popUp, name, email, username, img, onSave }: EditpopProps) => {
  const [Name, setName] = useState<string>(name)
  const [Username, setUsername] = useState<string>(username)
  const [Email, setEmail] = useState<string>(email)
  const [street, setStreet] = useState<string>('')
  const [landmark, setLandmark] = useState<string>('')
  const [area, setArea] = useState<string>('')

  // Close with the Escape key.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') popUp(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [popUp])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave?.({ name: Name, username: Username, email: Email, street, landmark, area })
    popUp(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={() => popUp(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 text-zinc-800 shadow-2xl dark:bg-zinc-900 dark:text-zinc-100"
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 id="edit-profile-title" className="text-lg font-bold tracking-tight">
            Edit profile
          </h2>
          <button
            type="button"
            onClick={() => popUp(false)}
            aria-label="Close"
            className="rounded-full p-1.5 transition hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <img
              src={img}
              alt="Your avatar"
              className="h-16 w-16 shrink-0 rounded-full border-2 border-white object-cover shadow-sm dark:border-zinc-700"
            />
            <div className="grid w-full gap-3">
              <div>
                <label htmlFor="edit-name" className={labelClass}>
                  Name
                </label>
                <input
                  id="edit-name"
                  type="text"
                  value={Name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="edit-username" className={labelClass}>
              Username
            </label>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">@</span>
              <input
                id="edit-username"
                type="text"
                value={Username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="edit-email" className={labelClass}>
              Email
            </label>
            <div className="flex items-center gap-2">
              <input
                id="edit-email"
                type="email"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
              <Link
                href={`/email/verify?mail=${encodeURIComponent(Email)}`}
                className="flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                <MailCheck size={16} aria-hidden="true" />
                Verify
              </Link>
            </div>
          </div>

          {/* Delivery address */}
          <fieldset className="grid gap-3">
            <legend className="mb-1 text-sm font-semibold">Delivery address</legend>

            <div>
              <label htmlFor="edit-street" className={labelClass}>
                Street name
              </label>
              <input
                id="edit-street"
                type="text"
                value={street}
                placeholder="Enter street name"
                onChange={(e) => setStreet(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="edit-landmark" className={labelClass}>
                  Landmark (optional)
                </label>
                <input
                  id="edit-landmark"
                  type="text"
                  value={landmark}
                  placeholder="Near..."
                  onChange={(e) => setLandmark(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="edit-area" className={labelClass}>
                  Area
                </label>
                <input
                  id="edit-area"
                  type="text"
                  value={area}
                  placeholder="Enter area"
                  onChange={(e) => setArea(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </fieldset>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => popUp(false)}
              className="w-full rounded-2xl border border-zinc-300 py-3 font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full rounded-2xl bg-blue-600 py-3 font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Editpop