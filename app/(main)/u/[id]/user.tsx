'use client'
import { Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'
import Editpop, { ProfileData } from './components/edit-popup'
import Buttons from './components/buttons'

interface UserProps {
  name: string
  username: string
  email: string
  img: string
}

const User = ({ name, username, email, img }: UserProps) => {
  const [isEdit, setIsEdit] = useState<boolean>(false)

  // Other pages read the username from localStorage, so keep this.
  useEffect(() => {
    localStorage.setItem('username', username ? username : 'unknown')
  }, [username])

  function handleSave(data: ProfileData) {
    // TODO: call your server action here to save the profile, e.g.
    // await updateUserData(data)
    console.log('Profile to save:', data)
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
          onClick={() => setIsEdit(true)}
          aria-label="Edit profile"
          className="shrink-0 rounded-full bg-white/60 p-3 text-zinc-800 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
        >
          <Pencil size={18} />
        </button>
      </section>

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