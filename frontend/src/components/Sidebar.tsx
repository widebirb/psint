import { NavLink, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import s from './Sidebar.module.css'
import { BriefcaseBusiness, CircleQuestionMarkIcon, Clipboard, FileUser, LayoutDashboard, LogOut } from "lucide-react";
import { useUser } from "../hooks/useUser";

const ICON_SIZE = 18
const NAV_ITEMS = [
    { to: '/dashboard', label: 'Analytics', icon: <LayoutDashboard size={ICON_SIZE} /> },
    { to: '/applications', label: 'Applications', icon: <FileUser size={ICON_SIZE} /> },
]

export default function Sidebar() {
    const navigate = useNavigate();
    const { data: user, isLoading } = useUser();

    const handleLogout = () => {
        localStorage.removeItem('jwt')
        toast.success('Logged out')
        navigate('/login', { replace: true })
    }

    const handleCopyToken = () => {
        const token = localStorage.getItem('jwt')
        if (!token) {
            toast.error('No token found. Please sign in first.')
            return
        }
        navigator.clipboard.writeText(token)
            .then(() => toast.success('Token copied! Paste it in the Chrome extension\'s Settings tab.'))
            .catch(() => toast.error('Failed to copy. Try copying from DevTools then Application then Local Storage.'))
    }

    return (
        <div className={s.sidebar}>
            <div className={s.logo}>
                <BriefcaseBusiness size={25} />
                <span>PSINT</span>
            </div>

            <nav className={s.nav}>
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `${s.link} ${isActive ? s.linkActive : ''}`
                        }
                    >
                        <span className={s.iconWrap}>{item.icon}</span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Copy token for Chrome extension */}
            <button className={s.copyToken} onClick={handleCopyToken} title="Copy JWT for Chrome extension">
                <span className={s.iconWrap}>
                    <Clipboard size={ICON_SIZE} />
                </span>
                <span>Copy Token</span>
            </button>

            {/* user profile */}
            <div className={s.profile}>
                {!isLoading && user && (
                    <>
                        <div className={s.avatar}>
                            {user.avatar_url
                                ? <img src={user.avatar_url} alt={user.name ?? 'User'} referrerPolicy="no-referrer" />
                                : <span className={s.avatarFallback}>
                                    {user.name?.charAt(0).toUpperCase() ?? <CircleQuestionMarkIcon size={35} />}
                                </span>
                            }
                        </div>
                        <div className={s.profileInfo}>
                            <span className={s.profileName}>{user.name ?? 'User'}</span>
                            <span className={s.profileEmail}>{user.email}</span>
                        </div>
                    </>
                )}
                {isLoading && <div className={s.skeleton} />}
            </div>

            <button className={s.logout} onClick={handleLogout}>
                <span className={s.iconWrap}>
                    <LogOut size={ICON_SIZE} />
                </span>
                <span>Log Out</span>
            </button>
        </div>
    )
}