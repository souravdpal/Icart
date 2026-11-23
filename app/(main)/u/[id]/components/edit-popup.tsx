'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MailCheck, X } from 'lucide-react'
import { isAlreadyUser } from '@/lib/action/user'

export interface ProfileData {
  name: string
  username: string
  email: string
  street: string
  landmark: string
  area: string
}

export interface SaveResult {
  ok: boolean
  error?: string
}

interface EditpopProps {
  popUp: (x: boolean) => void
  name: string
  email: string
  username: string
  img: string
  onSave?: (data: ProfileData) => Promise<SaveResult>
}

type UsernameStatus =
  | 'idle'
  | 'checking'
  | 'available'
  | 'taken'
  | 'invalid'
  | 'error'

// 3-20 chars: letters, numbers, underscore.
const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/

const inputClass =
  'w-full rounded-xl border border-zinc-200 bg-zinc-100/60 px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800/60'

const labelClass =
  'mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-300'

const Editpop = ({ popUp, name, email, username, img, onSave }: EditpopProps) => {
  const [Name, setName] = useState<string>(name ?? '')
  const [Username, setUsername] = useState<string>(username ?? '')
  const [Email, setEmail] = useState<string>(email ?? '')
  const [street, setStreet] = useState<string>('')
  const [landmark, setLandmark] = useState<string>('')
  const [area, setArea] = useState<string>('')

  const [error, setError] = useState<string>('')
  const [saving, setSaving] = useState<boolean>(false)

  // Async result tagged with the value it was checked for → stale results can't leak.
  const [check, setCheck] = useState<{
    value: string
    status: 'available' | 'taken' | 'error'
  } | null>(null)

  // ---------- Derived status (no setState in effect body) ----------
  const trimmed = Username.trim()
  const original = (username ?? '').trim()

  const syncStatus: 'idle' | 'invalid' | null =
    trimmed === original || trimmed === ''
      ? 'idle'
      : !USERNAME_RE.test(trimmed)
        ? 'invalid'
        : null

  const usernameStatus: UsernameStatus =
    syncStatus !== null
      ? syncStatus
      : check && check.value === trimmed
        ? check.status
        : 'checking'

  // ---------- Only the async server call lives in the effect ----------
  useEffect(() => {
    if (syncStatus !== null) return

    let cancelled = false
    const timer = setTimeout(async () => {
      try {
        const res = await isAlreadyUser(trimmed)
        if (cancelled) return
        setCheck({
          value: trimmed,
          status: res.status === 500 ? 'error' : res.ok ? 'taken' : 'available',
        })
      } catch {
        if (!cancelled) setCheck({ value: trimmed, status: 'error' })
      }
    }, 400)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [trimmed, syncStatus])

  // ---------- Close on Escape ----------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') popUp(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [popUp])

  const usernameBlocked =
    usernameStatus === 'taken' ||
    usernameStatus === 'invalid' ||
    usernameStatus === 'checking'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!onSave || usernameBlocked) return
    setError('')
    setSaving(true)
    try {
      const res = await onSave({
        name: Name,
        username: Username,
        email: Email,
        street,
        landmark,
        area,
      })
      if (res.ok) {
        popUp(false)
      } else {
        setError(res.error ?? 'Failed to save changes.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
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

          {/* Username */}
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
                autoComplete="off"
                className={`${inputClass} ${
                  usernameStatus === 'taken' || usernameStatus === 'invalid'
                    ? 'border-red-500 focus:ring-red-500'
                    : usernameStatus === 'available'
                      ? 'border-emerald-500 focus:ring-emerald-500'
                      : ''
                }`}
              />
            </div>
            {usernameStatus !== 'idle' && (
              <p
                role="status"
                className={`mt-1 text-sm ${
                  usernameStatus === 'available'
                    ? 'text-emerald-600'
                    : usernameStatus === 'checking'
                      ? 'text-zinc-500'
                      : 'text-red-600'
                }`}
              >
                {usernameStatus === 'checking' && 'Checking availability...'}
                {usernameStatus === 'available' && '✓ Username is available'}
                {usernameStatus === 'taken' && '✗ Username is already taken'}
                {usernameStatus === 'invalid' &&
                  'Use 3-20 letters, numbers, or underscores'}
                {usernameStatus === 'error' &&
                  "Couldn't check right now. Try again."}
              </p>
            )}
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
            <legend className="mb-1 text-sm font-semibold">
              Delivery address
            </legend>

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

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

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
              disabled={saving || usernameBlocked}
              className="w-full rounded-2xl bg-blue-600 py-3 font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Editpop