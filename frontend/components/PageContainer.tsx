import React from 'react'

export function PageContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background px-8 py-8 font-sans overflow-hidden">
            {children}
        </div>
    )
}
