import User from './user'
import { senduserData } from '@/lib/action/user'
import { redirect } from 'next/navigation'

const page = async() => {
  const userDat =await senduserData()
  console.log(userDat)
  let img:string = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail_unscaled&_=20170328184010"

  if(!userDat){
    redirect('/login')
  }
  


  return (
    <div>
      <User username={userDat.username} email={userDat.email} name={userDat.name_} img={img}  />
    </div>
  )
}

export default page
