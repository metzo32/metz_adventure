
export default function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white">
            <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">CM</span>
                    </div>
                    <span className="text-slate-500 text-sm font-medium">Chiang Mai Journey</span>
                </div>
                <p className="text-slate-400 text-xs">2026 · 나만의 여행 기록</p>
            </div>
        </footer>
    )
}
