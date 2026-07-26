import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  // 암호화 키
  // NextAuth가 쿠키 안에 넣을 JWT 로그인 토큰을 암호화하는 키. 
  // -> 이 값이 없거나 서버마다 다르면 - 복호화에 실패해서 로그인 풀림
  secret: process.env.NEXTAUTH_SECRET,

  // 로그인 방법 - 여기서는 직접 이메일, 비밀번호 전송
  // 경우에 따라 소셜 로그인 기능 추가 가능
  providers: [
    CredentialsProvider({
      name: "credentials",
      //로그인 폼에 입력받을 값
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      //실제 로그인 검증 함수. payload = 폼 입력값
      async authorize(payload) {
        console.log("[AUTH] authorize 시작:", { email: payload?.email, hasPassword: !!payload?.password });

        if (!payload?.email || !payload?.password) {
          console.log("[AUTH] authorize 실패: payload 누락");
          return null;
        }

        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`;
        console.log("[AUTH] 백엔드 요청:", apiUrl);

        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: payload.email, password: payload.password }),
        });

        console.log("[AUTH] 백엔드 응답 status:", res.status);

        if (!res.ok) {
          const errorBody = await res.text();
          console.log("[AUTH] authorize 실패: 백엔드 에러", errorBody);
          return null;
        }

        const user = await res.json();
        console.log("[AUTH] authorize 성공, user:", { id: user?.id, email: user?.email });
        return user;
      },
    }),
  ],
  // 쿠키 설정
  cookies: {
    sessionToken: {
      name: "next-auth.session-token", // 이름 직접 명시
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  // JWT 설정 - 세션을 DB에 저장하지 않고 JWT 쿠키 자체에 담겠다는 선언
  session: { strategy: "jwt" },
  // JWT에 담을 내용
  callbacks: {
    // JWT 쿠키를 만들거나 조회할 때마다 실행 - BE에서 받은 user.id를 토큰에 추가
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        console.log("[AUTH] jwt 콜백 (최초 로그인):", { tokenId: token.id });
      }
      return token;
    },
    // 클라이언트에서 useSession() 호출 시 실행.
    // 토큰에서 꺼낸 id를 세션 객체에 담고 - 컴포넌트에서 session.user.id로 접근 가능
    async session({ session, token }) {
      console.log("[AUTH] session 콜백:", { tokenId: token?.id, hasUser: !!session.user });
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  // 커스텀 페이지 지정 - 로그인 튕겼을 때 자동 라우트
  pages: {
    signIn: "/auth/login",
  },
};
