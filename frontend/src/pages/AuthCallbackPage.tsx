import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import s from './LoginPage.module.css'

export default function AuthCallbackPage() {
    const navigate = useNavigate()

    useEffect(() => {
        //gets parameters of url
        const params = new URLSearchParams(window.location.search)
        const token = params.get('token')

        if (token) {
            localStorage.setItem('jwt', token);
            toast.success("Signed in successfully!");
            navigate("/dashboard", { replace: true })
        } else {
            toast.error("Sign in failed. Please try again.")
            navigate("/login", { replace: true })
        }
    }, [navigate])

    return (
        <div className={s.container}>
            <p>Signing you in...</p>
        </div>
    )
}
