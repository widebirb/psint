import React from 'react'
import s from './LoginPage.module.css'

export default function LoginPage() {
    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
    }

    return (
        <div className={s.container}>
            <div className={s.card}>
                <h1>Job Tracker</h1>
                <p>Track your job applications in one place</p>
                <button className={s.googleBtn} onClick={handleGoogleLogin}>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                    Sign in with Google
                </button>
            </div>
        </div>
    )
}
