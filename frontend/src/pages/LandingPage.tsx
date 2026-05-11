import s from './LandingPage.module.css'

function LandingPage() {
    return (
        <main className={s.landing}>
            <nav className={s.nav}>
                <span className={s.logo}>psint</span>
            </nav>

            <section className={s.hero}>
                <h1>Please Speed <br />I need This</h1>
                <p>Save jobs from LinkedIn, Indeed, and JobStreet</p>
                <button className={s.googleBtn}>
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} />
                    Sign in with Google
                </button>
            </section>

            <section className={s.features}>
                <div className={s.featureCard}>
                    <h3>One-Click save</h3>
                    <p>Grave job listings directly from the browser with our Chrome extension.</p>
                </div>
                <div className={s.featureCard}>
                    <h3>Track status</h3>
                    <p>Move application status from applied to offered.</p>
                </div>
                <div className={s.featureCard}>
                    <h3>Stay on top</h3>
                    <p>See your analytics and check how well you're doing.</p>
                </div>
            </section>
        </main>
    )
}

export default LandingPage