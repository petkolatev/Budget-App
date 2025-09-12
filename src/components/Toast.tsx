import styles from '../styles/Toast.module.css';


interface ToastProps {
    message: string;
    type: 'success' | 'error'
    onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
    return (
        <div className={`${styles.toast} ${styles[type]}`}>

            {type === 'success' && (
                <img src="/images/success.png" />
            )}
            {type === 'error' && (
                <img src="/images/error.png" />
            )}
            <span>{message}</span>
            <button onClick={onClose}>X</button>
        </div>
    );
}
