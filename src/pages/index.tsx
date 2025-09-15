import { useSession } from 'next-auth/react'
import { useDataContext } from '@/context/CategoryContext';
import { useToast } from '@/context/ToastContext';
import { useEffect } from 'react';
import Dashboard from '@/components/Dashboard';


export default function Home() {
    const { data: session } = useSession()
    const { error } = useDataContext()
    const { showToast } = useToast()

    useEffect(() => {
        if (error) {

            showToast(error, 'error')
        }
    }, [showToast, error])

    return (
        <div>
            {session ?
                <div>
                    <div className="App">
                        <Dashboard />
                    </div>
                </div >
                : ''
            }
        </div>
    )
}
