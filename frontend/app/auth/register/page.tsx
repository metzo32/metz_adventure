"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/Button";
import { InputRhf } from "@/components/RHF/InputRhf";
import { registerUser } from "@/app/api/auth";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

const Page = () => {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, watch } = useForm<RegisterForm>({
    defaultValues: { name: "", email: "", password: "", passwordConfirm: "" },
  });

  const password = watch("password");

  const onRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    setErrorMsg("");

    try {
      await registerUser({ name: data.name, email: data.email, password: data.password });

      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      router.push("/");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "회원가입에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = handleSubmit(onRegister);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center -mt-18 px-4">
      <div className="w-full max-w-md flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-1">떠나세연</h1>
          <p className="text-text-secondary text-sm">나의 여행 플래너</p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-6">회원가입</h2>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            <InputRhf
              control={control}
              name="name"
              label="이름"
              placeholder="홍길동"
              rules={{ required: "이름을 입력해주세요." }}
            />
            <InputRhf
              control={control}
              name="email"
              label="이메일"
              placeholder="example@email.com"
              rules={{
                required: "이메일을 입력해주세요.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "올바른 이메일 형식이 아닙니다.",
                },
              }}
            />
            <InputRhf
              control={control}
              name="password"
              label="비밀번호"
              type="password"
              placeholder="8자 이상 입력해주세요."
              rules={{
                required: "비밀번호를 입력해주세요.",
                minLength: { value: 8, message: "비밀번호는 8자 이상이어야 합니다." },
              }}
            />
            <InputRhf
              control={control}
              name="passwordConfirm"
              label="비밀번호 확인"
              type="password"
              placeholder="비밀번호를 다시 입력해주세요."
              rules={{
                required: "비밀번호 확인을 입력해주세요.",
                validate: (value) => value === password || "비밀번호가 일치하지 않습니다.",
              }}
            />

            {errorMsg && (
              <p className="text-red-500 text-xs">{errorMsg}</p>
            )}

            <Button onClick={handleFormSubmit} className="w-full mt-2" mode="full">
              {isLoading ? "가입 중..." : "회원가입"}
            </Button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            이미 계정이 있으신가요?{" "}
            <Link href="/auth/login" className="text-primary font-medium hover:underline">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
