import type { ReactNode } from "react"

interface StatCardProps {
    label: string
    value: number | string
    icon: ReactNode | string
    color?: 'blue' | 'yellow' | 'green' | 'red' | 'default'
}

export default function StatCard({ label, value, icon, color = 'default' }: StatCardProps) {
    return (
        <div className={`stat-card stat-card--${color}`}>
            <div className="stat-card__icon">{icon}</div>
            <div className="stat-card__body">
                <span className="start-card__value">{value}</span>
                <span className="stat-card__label">{label}</span>
            </div>
        </div>
    )
}