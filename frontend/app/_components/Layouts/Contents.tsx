import React from 'react'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import AppShell from './AppShell'

export default function Contents({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <AppShell>{children}</AppShell>
            <Footer />
        </>
    )
}
