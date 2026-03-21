import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-14">
      <div className="bg-linear-to-r from-blue-600 to-blue-500 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-white font-bold text-xl mb-1">지금 바로 시작하세요</h3>
          <p className="text-blue-100 text-sm">여행까지 남은 시간, 알차게 준비해봐요 🌴</p>
        </div>
        <Link
          href="/auth/register"
          className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap shadow-sm"
        >
          무료로 시작하기 →
        </Link>
      </div>
    </section>
  );
}
