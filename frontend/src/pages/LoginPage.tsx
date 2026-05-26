import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { userApi } from '../api/user'
import s from './LoginPage.module.css'

export default function LoginPage() {
    const navigate = useNavigate()

    const handleSuccess = async (credentialResponse: CredentialResponse) => {
        const idToken = credentialResponse.credential

        if (!idToken) {
            toast.error('No credential received from Google.')
            return
        }

        try {
            const { token } = await userApi.googleLogin(idToken)
            localStorage.setItem('jwt', token)
            toast.success('Signed in successfully!')
            navigate('/dashboard', { replace: true })
        } catch (err) {
            console.error('Login error:', err)
            toast.error('Sign in failed. Please try again.')
        }
    }

    return (
        <div className={s.container}>
            <div className={s.card}>
                <h1>Job Tracker</h1>
                <p>Track your job applications in one place</p>
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={() => toast.error('Google sign in failed. Please try again.')}
                    useOneTap={false}
                    use_fedcm_for_prompt={false}
                    shape="rectangular"
                    size="large"
                    text="signin_with"
                    logo_alignment="left"
                />
            </div>
        </div>
    )
}