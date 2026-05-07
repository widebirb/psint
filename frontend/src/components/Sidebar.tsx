import { NavLink, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import './../index.css'
import { BriefcaseBusiness, CircleQuestionMarkIcon, FileUser, LayoutDashboard, LogOut } from "lucide-react";
import { size } from "zod";
import { useUser } from "../hooks/useUser";


const ICON_SIZE = 18
const NAV_ITEMS = [
    { to: '/dashboard', label: 'Analytics', icon: < LayoutDashboard size={ICON_SIZE} /> },
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

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <BriefcaseBusiness size={25} />
                <span>PSINT</span>
            </div>

            <nav>
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={(isActive) =>
                            `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
                        }
                    >
                        <span className="span--with-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* user profile */}
            <div className="sidebar-profile">
                {!isLoading && user && (
                    <>
                        <div className="sidebar-avatar">
                            {user.avatar_url
                                ? <img src={user.avatar_url} alt={user.name ?? 'User'} referrerPolicy="no-referrer" />
                                : <span className="sidebar-avatar__fallback">
                                    {user.name?.charAt(0).toUpperCase() ?? <CircleQuestionMarkIcon size={35} />}
                                </span>
                            }
                        </div>
                        <div className="sidebar-profile__info">
                            <span className="sidebar-profile__name">{user.name ?? 'User'}</span>
                            <span className="sidebar-profile__email">{user.email}</span>
                        </div>
                    </>
                )}
                {isLoading && <div className="sidebar-profile__skeleton" />}
            </div>


            <button className="sidebar-logout" onClick={handleLogout}>
                <span className="span--with-icon">
                    <LogOut size={ICON_SIZE} />
                </span>
                <span>Log Out</span>
            </button>
        </div >
    )
}