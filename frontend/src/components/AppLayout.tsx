import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import s from './AppLayout.module.css'

export default function AppLayout() {
    return (
        <div className={s.layout}>
            <Sidebar />
            <main className={s.main}>
                <Outlet />
            </main>
        </div>
    )
}