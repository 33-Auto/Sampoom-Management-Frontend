import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { users } from "@/entities/user";
import Logo from "@/shared/assets/logo_text_dark.svg";
import { Button, Card, Input, Select } from "@/shared/ui";

import { useLoginForm } from "../lib";
import { WORKSPACE_OPTIONS, type LoginFormValues } from "../model";

type ExampleUser = (typeof users)[number];

// mock 배포(데모)에서는 예시 계정을 미리 채워 바로 로그인할 수 있게 한다
const DEMO_ACCOUNT =
  import.meta.env.VITE_USE_MOCK === "true" ? users[0] : undefined;

// 직급은 화면 권한에 영향이 없어서 조직마다 첫 번째 예시 계정 하나만 고르게 한다
const EXAMPLE_ACCOUNTS = WORKSPACE_OPTIONS.flatMap(({ value, label }) => {
  const user = users.find((u) => u.workspace === value);
  return user ? [{ label, user }] : [];
});

const Login = () => {
  const navigate = useNavigate();
  const { submitLogin, isLoading } = useLoginForm();
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: DEMO_ACCOUNT?.email ?? "",
      password: DEMO_ACCOUNT?.password ?? "",
      workspace: DEMO_ACCOUNT?.workspace ?? "",
    },
    mode: "onSubmit",
  });
  const email = useWatch({ control, name: "email" });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await submitLogin(values);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "로그인에 실패했습니다. 다시 시도해주세요.";
      setError("root", { type: "manual", message });
    }
  });

  const handleExampleUserClick = (user: ExampleUser): void => {
    setValue("email", user.email);
    setValue("password", user.password);
    setValue("workspace", user.workspace || "");
    clearErrors();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-bg-white p-4 transition-colors duration-200 dark:bg-bg-black">
      <div className="relative w-full max-w-md">
        <Card className="p-8 shadow-lg dark:border-grey-600 dark:bg-bg-card-black">
          <div className="mb-8 text-center">
            <img src={Logo} alt="Logo" className="mx-auto mb-4 h-12 w-auto" />
            <p className="mt-2 text-grey-600 dark:text-grey-300">
              ERP 시스템에 로그인하세요
            </p>
          </div>

          <section
            aria-labelledby="example-accounts-title"
            className="mb-6 rounded-lg border border-main-200 bg-main-100/50 p-4 dark:border-main-800 dark:bg-main-900/40"
          >
            <h2
              id="example-accounts-title"
              className="text-sm font-semibold text-grey-900 dark:text-grey-100"
            >
              예시 계정으로 둘러보기
            </h2>
            <p className="mt-1 text-xs text-grey-600 dark:text-grey-300">
              부서를 고르면 로그인 정보가 채워집니다.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {EXAMPLE_ACCOUNTS.map(({ label, user }) => {
                const selected = email === user.email;
                return (
                  <button
                    key={user.email}
                    type="button"
                    aria-pressed={selected}
                    title={user.email}
                    onClick={() => handleExampleUserClick(user)}
                    className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${
                      selected
                        ? "border-main-500 bg-main-500 text-white"
                        : "border-grey-200 bg-bg-card-white text-grey-700 hover:border-main-400 hover:text-main-700 dark:border-grey-600 dark:bg-bg-card-black dark:text-grey-100 dark:hover:border-main-400 dark:hover:text-main-300"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </section>

          <form onSubmit={onSubmit} className="space-y-6">
            <Input
              label="이메일"
              type="email"
              placeholder="이메일을 입력하세요"
              autoComplete="email"
              {...register("email", {
                required: "이메일을 입력하세요.",
                pattern: {
                  value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/u,
                  message: "올바른 이메일 형식을 입력하세요.",
                },
              })}
              errorText={errors.email?.message}
            />

            <Input
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              {...register("password", {
                required: "비밀번호를 입력하세요.",
                minLength: {
                  value: 8,
                  message: "비밀번호는 8자 이상이어야 합니다.",
                },
              })}
              errorText={errors.password?.message}
            />

            <Select
              label="조직"
              {...register("workspace", {
                required: "조직을 선택하세요.",
                validate: (value) => value !== "" || "조직을 선택하세요.",
              })}
              options={[
                { value: "" as const, label: "조직을 선택하세요" },
                ...WORKSPACE_OPTIONS,
              ]}
              errorText={errors.workspace?.message}
            />

            {errors.root?.message && (
              <p className="text-sm text-error-red">{errors.root.message}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              loading={isLoading || isSubmitting}
              disabled={isLoading || isSubmitting}
            >
              로그인
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={async () => navigate("/signup")}
              className="cursor-pointer bg-transparent text-sm font-medium text-main-500 transition-colors duration-200 hover:text-main-600 dark:hover:text-main-400"
            >
              계정이 없으신가요? 회원가입
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export { Login };
