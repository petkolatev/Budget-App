import { signOut, useSession } from 'next-auth/react'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Budget from "./Budget";


export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    }
  }, [status, router])

  if (!session) return null

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
