import User from './user'
import { senduserData } from '@/lib/action/user'
import { redirect } from 'next/navigation'

const DEFAULT_AVATAR =
  'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'

const Page = async () => {
  const result = await senduserData()
  if (!result.ok) redirect('/login')

  const { id, username, email, name } = result.user

  return (
    <User
      id={id}
      username={username}
      email={email}
      name={name}
      img={DEFAULT_AVATAR}
    />
  )
}

export default Page