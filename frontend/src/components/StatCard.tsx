import type { ReactNode } from "react"
import s from './StatCard.module.css'

interface StatCardProps {
    label: string
    value: number | string
    icon: ReactNode | string
    color?: 'blue' | 'yellow' | 'green' | 'red' | 'default'
}

export default function StatCard({ label, value, icon, color = 'default' }: StatCardProps) {
    return (
        <div className={`${s.card} ${s[color]}`}>
            <div className={s.icon}>{icon}</div>
            <div className={s.body}>
                <span className={s.value}>{value}</span>
                <span className={s.label}>{label}</span>
            </div>
        </div>
    )
}