import { LinkPreset } from "./LinkPreset";
import GradBox from "./GradBox";

export default function CtaBanner() {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-14">
      <GradBox direction="r" className="rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-white font-bold text-xl mb-1">지금 바로 시작하세요</h3>
          <p className="text-blue-100 text-sm">여행까지 남은 시간, 알차게 준비해봐요 🌴</p>
        </div>
        <LinkPreset
          href="/auth/register"
          mode="light"
        >
          무료로 시작하기 →
        </LinkPreset>
      </GradBox>
    </section>
  );
}
