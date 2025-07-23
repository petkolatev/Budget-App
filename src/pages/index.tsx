import { signOut, useSession } from 'next-auth/react'

import Budget from "./Budget";


export default function Home() {
  const { data: session, status } = useSession()
 
  return (
    <div>
      {session ?
        <div>
          <p>Welcome, {session?.user?.name}</p>
          <button onClick={() => signOut({ callbackUrl: '/login' })}>
            Logout
          </button>
          <div className="App">
            <Budget />
          </div>
        </div >
        : ''
      }
    </div>
  )
}
