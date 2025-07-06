import styles from '../styles/Login.module.css'


export default function Login() {
    return (
        <div className={styles.login}>
            <h2>Login</h2>

            <form action="">
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" />

                <button>Login</button>
            </form>
        </div>
    )
}