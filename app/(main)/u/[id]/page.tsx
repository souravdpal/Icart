import User from './user'
import { senduserData } from '@/lib/action/user'
import { redirect } from 'next/navigation'

const DEFAULT_AVATAR =
  'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'

const Page = async () => {
  const userDat = await senduserData()

  if (!userDat) {
    redirect('/login')
  }

  return (
    <User
      username={userDat.username}
      email={userDat.email}
      name={userDat.name_}
      img={DEFAULT_AVATAR}
    />
  )
}

export default Page