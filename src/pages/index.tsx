import { signOut, useSession } from 'next-auth/react'
import Budget from "./Budget";
import { useDataContext } from '@/context/CategoryContext';
import { useToast } from '@/context/ToastContext';
import { useEffect } from 'react';


export default function Home() {
    const { data: session, status } = useSession()
    const { error } = useDataContext()
    const { showToast } = useToast()

    useEffect(() => {
        if (error) {

            showToast(error, 'error')
        }
    }, [error])

    return (
        <div>
            {session ?
                <div>
                    <p>Welcome, {session?.user?.name}</p>
                    <button onClick={() => {
                        signOut({ callbackUrl: '/login' })
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
