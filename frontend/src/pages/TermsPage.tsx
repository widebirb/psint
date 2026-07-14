import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import s from "./TermsPage.module.css"

export default function TermsPage() {
    const navigate = useNavigate()

    return (
        <div className={s.page}>
            <nav className={s.nav}>
                <span className={s.logo}>psint</span>
                <button className={s.backBtn} onClick={() => navigate("/")}>
                    <ArrowLeft size={16} /> Back
                </button>
            </nav>

            <div className={s.container}>
                <section id="privacy">
                    <h1 className={s.pageTitle}>Privacy Policy</h1>
                    <p className={s.lastUpdated}>
                        Last updated: July 14, 2026
                    </p>

                    <p>
                        PSINT is a personal portfolio project. We collect your Google name,
                        email, and profile picture solely to create and identify your account.
                        Your data is not sold, shared, or used for advertising.
                    </p>
                    <p>If you have questions, contact us at: bridhone@gmail.com</p>

                </section>
                <hr className={s.divider} />

                <section id="terms">
                    <h1 className={s.pageTitle}>Terms of Service</h1>
                    <p className={s.lastUpdated}>
                        Last updated: July 14, 2026
                    </p>

                    <p>
                        PSINT is a personal portfolio project provided as-is. By using this
                        app you agree to use it only for tracking your own job applications. We
                        reserve the right to suspend access at any time. Governed by the laws of
                        the Republic of the Philippines.
                    </p>
                    <p>These Terms apply to all users of PSINT.</p>

                </section>
            </div>
        </div>
    )
}
