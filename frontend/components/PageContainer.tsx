import React from 'react'

export function PageContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background p-4 lg:p-8 font-sans overflow-hidden">
            {children}
        </div>
    )
}
