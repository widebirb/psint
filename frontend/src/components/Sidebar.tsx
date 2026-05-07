import { NavLink, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import './../index.css'
import { BriefcaseBusiness, FileUser, LayoutDashboard, LogOut } from "lucide-react";
import { size } from "zod";


const ICON_SIZE = 18
const NAV_ITEMS = [
    { to: '/dashboard', label: 'Analytics', icon: < LayoutDashboard size={ICON_SIZE} /> },
    { to: '/application', label: 'Applications', icon: <FileUser size={ICON_SIZE} /> },
]

export default function Sidebar() {
    const navigate = useNavigate();

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

            <button className="sidebar-logout" onClick={handleLogout}>
                <span className="span--with-icon">
                    <LogOut size={ICON_SIZE} />
                </span>
                <span>Log Out</span>
            </button>
        </div >
    )
}