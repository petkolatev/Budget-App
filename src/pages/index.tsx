import { useRouter } from "next/router";
import Budget from "./Budget";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter()
  const [name, setName] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      router.replace('/login')
      return
    }

    fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          setName(data.name)
        } else {
          router.replace('/login')
        }
      })
      .catch(() => {
        router.replace('/login')
      })
  }, [router])

  return (
    <div>
      {name ?
        <div>
          <p>Welcome, {name}</p>
          <button onClick={() => {
            localStorage.removeItem('token')
            router.push('/login')
          }}>
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
