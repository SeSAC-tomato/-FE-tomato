# useAuthStore 사용법 및 활용 가이드

zustand를 활용한 전역 인증 상태 관리 훅입니다. 로그인/로그아웃, 유저 정보, 토큰 등 인증 관련 상태를 전역에서 쉽게 관리할 수 있습니다.

---

## 📦 기본 사용법

```tsx
import { useAuthStore } from "@/store/useAuthStore";
```

---

## 주요 상태 및 메서드

| 이름        | 타입/설명                   |
| ----------- | --------------------------- | ------------------------- |
| isLoggedIn  | boolean                     | 로그인 여부               |
| user        | User \| null                | 유저 정보 (예: { email }) |
| accessToken | string \| null              | 액세스 토큰               |
| login       | (user, accessToken) => void | 로그인 처리               |
| logout      | () => void                  | 로그아웃 처리             |

---

## 로그인 상태 확인

```tsx
const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

if (isLoggedIn) {
  // 로그인된 사용자
} else {
  // 비로그인 사용자
}
```

---

## 로그인 처리

```tsx
const login = useAuthStore((state) => state.login);

// 로그인 성공 시
login({ email: "test@test.com" }, "발급받은_토큰");
```

---

## 로그아웃 처리

```tsx
const logout = useAuthStore((state) => state.logout);

// 로그아웃 버튼 클릭 시
logout();
```

---

## 유저 정보/토큰 사용

```tsx
const user = useAuthStore((state) => state.user);
const accessToken = useAuthStore((state) => state.accessToken);

console.log(user?.email);
console.log(accessToken);
```

---

## 예시: 로그인 상태에 따라 UI 분기

```tsx
const { isLoggedIn, user, logout } = useAuthStore();

return (
  <div>
    {isLoggedIn ? (
      <>
        <span>{user?.email}님 환영합니다!</span>
        <button onClick={logout}>로그아웃</button>
      </>
    ) : (
      <button onClick={() => router.push("/login")}>로그인</button>
    )}
  </div>
);
```

---

## 📝 활용 팁

- **어떤 컴포넌트에서든 import 후 바로 사용 가능** (전역 상태)
- **로그인/로그아웃/유저 정보/토큰 등 인증 관련 모든 상태 관리에 활용**
- **페이지 접근 제어, 헤더 표시, API 요청 시 토큰 사용 등 다양한 곳에 활용**

---
