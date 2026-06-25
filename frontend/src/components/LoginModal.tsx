import { useEffect } from 'react'
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { userApi } from '../api/user'
import s from './LoginModal.module.css'

interface LoginModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const navigate = useNavigate()

    // Close on Escape key
    useEffect(() => {
        if (!isOpen) return
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [isOpen, onClose])

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    if (!isOpen) return null

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
            onClose()
            navigate('/dashboard', { replace: true })
        } catch (err) {
            console.error('Login error:', err)
            toast.error('Sign in failed. Please try again.')
        }
    }

    return (
        <div
            className={s.overlay}
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
            role="dialog"
            aria-modal="true"
            aria-label="Sign in"
        >
            <div className={s.modal}>
                <button
                    className={s.closeBtn}
                    onClick={onClose}
                    aria-label="Close sign in dialog"
                >
                    ✕
                </button>

                <div className={s.logoMark}>
                    <span className={s.logoText}>psint</span>
                </div>

                <h2 className={s.title}>Welcome back</h2>
                <p className={s.subtitle}>Sign in to track your job applications</p>

                <div className={s.googleWrapper}>
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={() => toast.error('Google sign in failed. Please try again.')}
                        useOneTap={false}
                        use_fedcm_for_prompt={false}
                        shape="rectangular"
                        size="large"
                        text="signin_with"
                        logo_alignment="left"
                        width="320"
                    />
                </div>

                <p className={s.terms}>
                    By signing in, you agree to our{' '}
                    <a href="#" className={s.link}>Terms of Service</a>{' '}and{' '}
                    <a href="#" className={s.link}>Privacy Policy</a>.
                </p>
            </div>
        </div>
    )
}
