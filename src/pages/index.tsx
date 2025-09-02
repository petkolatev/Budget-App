import { signOut, useSession } from 'next-auth/react'
import Budget from "./Budget";
import { useDataContext } from '@/context/CategoryContext';
import styles from '../styles/Login.module.css'


export default function Home() {
    const { data: session, status } = useSession()
    const { error } = useDataContext()

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
                        {error && <p className={styles.msg}>{error}</p>}
                        <Budget />
                    </div>
                </div >
                : ''
            }

        </div>
    )
}
