import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Logo from "@/shared/assets/logo_text_dark.svg";
import { Button, Card, Input, Select } from "@/shared/ui";

import { useLoginForm } from "../lib";
import { WORKSPACE_OPTIONS, type LoginFormValues } from "../model";

const Login = () => {
  const navigate = useNavigate();
  const { submitLogin, isLoading } = useLoginForm();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
      workspace: "",
    },
    mode: "onSubmit",
  });

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-white p-4 transition-colors duration-200 dark:bg-bg-black">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-lg dark:border-grey-600 dark:bg-bg-card-black">
          <div className="mb-8 text-center">
            <img src={Logo} alt="Logo" className="mx-auto mb-4 h-12 w-auto" />
            <p className="mt-2 text-grey-600 dark:text-grey-300">
              ERP 시스템에 로그인하세요
            </p>
          </div>

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
