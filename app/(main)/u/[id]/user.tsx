'use client'
import { Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Editpop, { ProfileData } from './components/edit-popup'
import Buttons from './components/buttons'
import { isAlreadyUser, UpdateUserData } from '@/lib/action/user'
type SaveResult = { ok: true } | { ok: false; error: string }
interface UserProps {
  name: string
  username: string
  email: string
  img: string
}

const User = ({ name, username, email, img }: UserProps) => {
  const router = useRouter()
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    localStorage.setItem('username', username ? username : 'unknown')
  }, [username])

  async function handleSave(data: ProfileData): Promise<SaveResult> {
    const changes: Partial<ProfileData> = {}
  
    const newName = data.name.trim()
    const newUsername = data.username.trim()
  
    if (newName && newName !== name) changes.name = newName
    if (newUsername && newUsername !== username) changes.username = newUsername
  
    // Address: send only if the user filled something in
    if (data.street.trim() || data.landmark.trim() || data.area.trim()) {
      changes.street = data.street
      changes.landmark = data.landmark
      changes.area = data.area
    }
  
    if (Object.keys(changes).length === 0) return { ok: true }
  
    if (changes.username) {
      const check = await isAlreadyUser(changes.username)
      if (check.status === 500) {
        return { ok: false, error: 'Something went wrong. Please try again.' }
      }
      if (check.ok) {
        return { ok: false, error: 'This username is already taken.' }
      }
    }
  
    const res = await UpdateUserData(username, changes)
    if (!res.ok) {
      return { ok: false, error: res.err ? String(res.err) : 'Failed to save changes.' }
    }
  
    if (changes.username) localStorage.setItem('username', changes.username)
    router.refresh()
    return { ok: true }
  }

  return (
    <main className="mx-auto grid w-full max-w-3xl gap-8 px-4 py-8 sm:py-12">
      {/* Profile card */}
      <section
        aria-label="Your profile"
        className="flex items-center gap-4 rounded-3xl bg-[#eccea0] p-5 shadow-md sm:gap-5 sm:p-6"
      >
        <img
          src={img}
          alt={`${name}'s avatar`}
          className="h-20 w-20 shrink-0 rounded-full border-2 border-white object-cover shadow-sm sm:h-24 sm:w-24"
        />

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold text-zinc-900 sm:text-2xl">{name}</h1>
          <p className="truncate text-sm font-medium text-zinc-700">@{username}</p>
          <p className="truncate text-sm text-zinc-600">{email}</p>
        </div>

        <button
          type="button"
          onClick={() => {
            setError('')
            setIsEdit(true)
          }}
          aria-label="Edit profile"
          className="shrink-0 rounded-full bg-white/60 p-3 text-zinc-800 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
        >
          <Pencil size={18} />
        </button>
      </section>

      {error && (
        <p role="alert" className="rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Actions */}
      <Buttons username={username} />

      {isEdit && (
        <Editpop
          popUp={setIsEdit}
          name={name}
          username={username}
          email={email}
          img={img}
          onSave={handleSave}
        />
      )}
    </main>
  )
}

export default User