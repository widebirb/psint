import { useState } from 'react'
import LoginModal from '../components/LoginModal'
import { ChartNoAxesCombined, Zap } from "lucide-react";
import s from './LandingPage.module.css'

export default function LandingPage() {
    const [isLoginOpen, setIsLoginOpen] = useState(false)

    return (
        <div className={s.page}>
            {/*  NAVBAR */}
            <header className={s.nav}>
                <span className={s.logo}>
                    <img src="/illustrations/icon.png" alt="" className={s.logoIcon} />
                    psint
                </span>
                <button
                    id="nav-login-btn"
                    className={s.navLoginBtn}
                    onClick={() => setIsLoginOpen(true)}
                >
                    Login
                </button>
            </header>

            {/*  HERO  */}
            <section className={s.hero}>
                <div className={s.heroContent}>
                    <div className={s.badge}>Track your job applications</div>
                    <h1 className={s.heroTitle}>
                        PS
                        <span className={s.heroAccent}>INT</span><br />
                        <p className={s.featuresEyebrow}>Please Speed I Need This</p>
                    </h1>
                    <p className={s.heroSubtitle}>
                        Save jobs from everywhere in one click.
                        Track every application from saved to offered.
                    </p>
                    <div className={s.heroActions}>
                        <button
                            id="hero-get-started-btn"
                            className={s.btnPrimary}
                            onClick={() => setIsLoginOpen(true)}
                        >
                            Get Started
                        </button>
                        <button
                            id="hero-learn-more-btn"
                            className={s.btnGhost}
                            onClick={() => {
                                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                            }}
                        >
                            See how it works
                        </button>
                    </div>
                </div>

                {/* Decorative hero graphic */}
                <div className={s.heroGraphic} aria-hidden="true">
                    <img
                        src="/illustrations/main.png"
                        alt="Job tracker illustration"
                        className={s.heroIllustration}
                    />
                    {/* Decorative blobs */}
                    <div className={s.blob1} />
                    <div className={s.blob2} />
                </div>
            </section>

            {/*  FEATURES  */}
            <section id="features" className={s.featuresSection}>
                <div className={s.featuresSectionInner}>
                    {/* Left: image/graphic */}
                    <div className={s.featureGraphic} aria-hidden="true">
                        <div className={s.featureMockup}>
                            <div className={s.featureMockupBar}>
                                <span className={s.featureMockupTitle}>Applications</span>
                            </div>
                            <div className={s.featureMockupTable}>
                                {[
                                    { title: 'Software Engineer', co: 'Google', status: 'Offered', statusColor: '#D1FAE5', statusText: '#065F46' },
                                    { title: 'Frontend Developer', co: 'Grab', status: 'Interviewing', statusColor: '#DBEAFE', statusText: '#1E40AF' },
                                    { title: 'Product Designer', co: 'Canva', status: 'Applied', statusColor: '#FEF3C7', statusText: '#92400E' },
                                    { title: 'Backend Engineer', co: 'Shopify', status: 'Saved', statusColor: '#F3F4F6', statusText: '#374151' },
                                    { title: 'Data Analyst', co: 'Meta', status: 'Rejected', statusColor: '#FEE2E2', statusText: '#991B1B' },
                                ].map((row, i) => (
                                    <div key={i} className={s.featureTableRow}>
                                        <div>
                                            <div className={s.featureRowTitle}>{row.title}</div>
                                            <div className={s.featureRowMeta}>{row.co}</div>
                                        </div>
                                        <span className={s.featureRowBadge} style={{ background: row.statusColor, color: row.statusText }}>
                                            {row.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: feature cards */}
                    <div className={s.featuresRight}>
                        <h2 className={s.featuresTitle}>Organize your job search</h2>
                        <p className={s.featuresSubtitle}>
                            Stop losing track of applications across spreadsheets and browser tabs.
                            PSINT brings everything into one clean dashboard.
                        </p>

                        <div className={s.featureGrid}>
                            <div className={s.featureCard}>
                                <span className={s.featureIcon}><Zap /></span>
                                <div>
                                    <h3>Track Applications</h3>
                                    <p>Track your job listings directly from anywhere, without missing an update</p>
                                </div>
                            </div>
                            <div className={s.featureCard}>
                                <span className={s.featureIcon}><ChartNoAxesCombined /></span>
                                <div>
                                    <h3>Watch your stream</h3>
                                    <p>Visual analytics show your pipeline at a glance. Know exactly where you stand.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/*  STATS  */}
            <section className={s.statsSection}>
                <div className={s.statsGrid}>
                    {[
                        { value: 'Informative', label: 'Analytics & Insights', sub: 'Know exactly where you stand' },
                        { value: '30 seconds', label: 'To save a job', sub: 'All in one place' },
                        { value: '100%', label: 'Free to use', sub: 'No paywalls ever' },
                    ].map((stat, i) => (
                        <div key={i} className={s.statCard}>
                            <div className={s.statValue}>{stat.value}</div>
                            <div className={s.statLabel}>{stat.label}</div>
                            <div className={s.statSub}>{stat.sub}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/*  CTA BANNER  */}
            <section className={s.ctaBanner}>
                <h2 className={s.ctaTitle}>Track your job applicaitons now</h2>
                <p className={s.ctaSubtitle}>No more kinda homeless moms</p>
                <button
                    id="cta-get-started-btn"
                    className={s.btnPrimary}
                    onClick={() => setIsLoginOpen(true)}
                >
                    Get Started
                </button>
            </section>

            {/*  FOOTER  */}
            <footer className={s.footer}>
                <span className={s.logo}>
                    <img src="/illustrations/icon.png" alt="" className={s.logoIcon} />
                    psint
                </span>
                <p className={s.footerCopy}>© 2026 psint. All rights reserved.</p>
            </footer>

            {/*  LOGIN MODAL  */}
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </div>
    )
}