import React from 'react'
import './../index.css'

export default function LoginPage() {
    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Job Tracker</h1>
                <p>Track your job applications in one place</p>
                <button className="google-btn" onClick={handleGoogleLogin}>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                    Sign in with Google
                </button>
            </div>
        </div>
    )
}
