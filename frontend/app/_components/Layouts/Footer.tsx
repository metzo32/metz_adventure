
export default function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white">
            <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img src="/icons/logo_primary.svg" alt="logo" className="w-6 h-6" />
                    <span className="text-slate-500 text-sm font-medium">떠나세연</span>
                </div>
                <p className="text-slate-400 text-xs">2026 · 나만의 여행 기록</p>
            </div>
        </footer>
    )
}
