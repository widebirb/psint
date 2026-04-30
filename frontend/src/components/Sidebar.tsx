import { NavLink, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import './../index.css'

const NAV_ITEMS = [
    { to: '/dashboard', label: 'Analytics', icon: 'A' },
    { to: '/application', label: 'Applications', icon: 'J' },
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
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <button className="sidebar-logout" onClick={handleLogout}>
                <span>Logout</span>
            </button>
        </div>
    )
}