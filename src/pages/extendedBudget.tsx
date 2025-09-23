import { useSession } from 'next-auth/react'
import { useDataContext } from '@/context/CategoryContext';
import { useToast } from '@/context/ToastContext';
import { useEffect } from 'react';
import Budget from '@/components/Budget';

export default function BudgetPage() {
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
                        <Budget />
                    </div>
                </div >
                : ''
            }
        </div>
    )
}
