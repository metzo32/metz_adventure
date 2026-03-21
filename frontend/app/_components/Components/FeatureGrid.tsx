import Link from "next/link";

const features = [
  {
    icon: "✈️",
    title: "위시리스트",
    desc: "가고 싶은 곳, 먹고 싶은 것, 하고 싶은 것을 미리 정리하세요.",
    href: "/wishlist",
    iconBg: "bg-blue-50",
    iconColor: "text-primary",
    badgeBg: "bg-blue-100",
    badgeColor: "text-primary",
  },
  {
    icon: "✅",
    title: "투두 리스트",
    desc: "출발 준비부터 현지 할 일까지 체크리스트로 관리하세요.",
    href: "/todo",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    badgeBg: "bg-indigo-100",
    badgeColor: "text-indigo-700",
  },
  {
    icon: "📔",
    title: "여행 일기",
    desc: "매일의 경험과 감정을 기록하고 추억을 남기세요.",
    href: "/diary",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    badgeBg: "bg-violet-100",
    badgeColor: "text-violet-700",
  },
  {
    icon: "📍",
    title: "방문 장소",
    desc: "다녀온 곳의 별점과 리뷰를 지도와 함께 기록하세요.",
    href: "/places",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    badgeBg: "bg-sky-100",
    badgeColor: "text-sky-700",
  },
  {
    icon: "💰",
    title: "예산 관리",
    desc: "카테고리별 예산과 지출을 실시간 환율로 계산하세요.",
    href: "/budget",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    badgeBg: "bg-emerald-100",
    badgeColor: "text-emerald-700",
  },
  {
    icon: "📊",
    title: "마이 페이지",
    desc: "걸음 수와 일별 지출을 그래프로 한눈에 파악하세요.",
    href: "/mypage",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    badgeBg: "bg-amber-100",
    badgeColor: "text-amber-700",
  },
];

export default function FeatureGrid() {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-14">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-800">여행 관리 기능</h2>
        <p className="text-slate-400 text-sm mt-0.5">계획부터 기록까지 모든 것</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => (
          <Link key={f.href} href={f.href}>
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${f.iconBg} ${f.iconColor}`}>
                  {f.icon}
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${f.badgeBg} ${f.badgeColor}`}>
                  →
                </span>
              </div>
              <h3 className="font-bold text-slate-800 mb-1.5 group-hover:text-blue-600 transition-colors text-sm">
                {f.title}
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
