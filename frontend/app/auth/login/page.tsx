"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/Button";
import { InputRhf } from "@/components/RHF/InputRhf";

type LoginForm = {
  email: string;
  password: string;
};

const Page = () => {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit } = useForm<LoginForm>({
    defaultValues: { email: "", password: "" },
  });

  const onLogin = async (data: LoginForm) => {
    setIsLoading(true);
    setErrorMsg("");

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setErrorMsg("이메일 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    router.push("/places");
  };

  const handleFormSubmit = handleSubmit(onLogin);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center -mt-18 px-4">
      <div className="w-full max-w-md flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-1">떠나세연</h1>
          <p className="text-text-secondary text-sm">나의 여행 플래너</p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-6">로그인</h2>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            <InputRhf
              control={control}
              name="email"
              label="이메일"
              type="text"
              placeholder="example@email.com"
              rules={{ required: "이메일을 입력해주세요." }}
            />
            <InputRhf
              control={control}
              name="password"
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력해주세요."
              rules={{ required: "비밀번호를 입력해주세요." }}
            />

            {errorMsg && (
              <p className="text-red-500 text-xs">{errorMsg}</p>
            )}

            <Button onClick={handleFormSubmit} className="w-full mt-2" mode="full">
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            계정이 없으신가요?{" "}
            <Link href="/auth/register" className="text-primary font-medium hover:underline">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
