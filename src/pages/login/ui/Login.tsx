import { useState } from "react";import { useForm } from "react-hook-form";import { useNavigate } from "react-router-dom";import { users } from "@/entities/user";import Logo from "@/shared/assets/logo_text_dark.svg";
import { Button, Card, Input, Select } from "@/shared/ui";import { useLoginForm } from "../lib";import { WORKSPACE_OPTIONS, type LoginFormValues } from "../model";const Login = () => {
  const navigate = useNavigate();
  const { submitLogin, isLoading } = useLoginForm();
  const [showExampleAccounts, setShowExampleAccounts] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
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

  const handleExampleUserClick = (user: (typeof users)[0]) => {
    setValue("email", user.email);
    setValue("password", user.password);
    setValue("workspace", user.workspace || "");
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

        <button
          onClick={() => setShowExampleAccounts(!showExampleAccounts)}
          className="hover:bg-grey-50 absolute top-1/2 right-0 ml-4 flex h-12 w-12 translate-x-full -translate-y-1/2 items-center justify-center rounded-r-lg border border-l-0 border-grey-200 bg-bg-card-white shadow-md transition-all duration-200 dark:border-grey-700 dark:bg-bg-card-black dark:hover:bg-grey-800"
          aria-label={
            showExampleAccounts ? "예시 계정 숨기기" : "예시 계정 보기"
          }
        >
          <div className="flex flex-col items-center justify-center">
            <i
              className={`ri-${showExampleAccounts ? "close" : "user-line"} text-lg text-grey-600 dark:text-grey-300`}
            />
            <span className="text-[10px] text-grey-900 dark:text-grey-100">
              {showExampleAccounts ? "" : "계정"}
            </span>
          </div>
        </button>
      </div>
      <div
        className={`fixed top-0 right-0 h-full w-96 transform bg-bg-card-white shadow-2xl transition-transform duration-300 ease-in-out dark:bg-bg-card-black ${
          showExampleAccounts ? "translate-x-0" : "translate-x-full"
        } z-40 border-l border-grey-200 dark:border-grey-700`}
      >
        <div className="flex h-full flex-col">
          {/* 헤더 */}
          <div className="flex items-center justify-between border-b border-grey-200 p-4 dark:border-grey-700">
            <div>
              <h3 className="text-lg font-semibold text-grey-900 dark:text-grey-100">
                예시 계정
              </h3>
              <p className="mt-1 text-xs text-grey-600 dark:text-grey-400">
                계정을 클릭하여 자동으로 로그인 정보를 입력할 수 있습니다.
              </p>
            </div>
            <button
              onClick={() => setShowExampleAccounts(false)}
              className="rounded p-1 text-grey-500 transition-colors hover:bg-grey-100 hover:text-grey-700 dark:text-grey-400 dark:hover:bg-grey-800 dark:hover:text-grey-200"
              aria-label="닫기"
            >
              <i className="ri-close-line text-xl" />
            </button>
          </div>

          {/* 스크롤 가능한 계정 목록 */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {users.map((user) => {
                const workspaceLabel =
                  WORKSPACE_OPTIONS.find((opt) => opt.value === user.workspace)
                    ?.label || user.workspace;
                return (
                  <button
                    key={user.email}
                    type="button"
                    onClick={() => {
                      handleExampleUserClick(user);
                      setShowExampleAccounts(false);
                    }}
                    className="bg-grey-50 hover:bg-main-50 dark:hover:bg-main-950 w-full rounded-lg border border-grey-200 p-4 text-left transition-all duration-200 hover:border-main-300 dark:border-grey-700 dark:bg-grey-800 dark:hover:border-main-600"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-grey-900 dark:text-grey-100">
                          {user.userName}
                        </div>
                        <div className="mt-1 text-xs text-grey-600 dark:text-grey-400">
                          {user.email}
                        </div>
                        <div className="mt-2 text-xs text-grey-500 dark:text-grey-500">
                          비밀번호: {user.password}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="rounded-full bg-main-100 px-2 py-1 text-xs font-medium text-main-700 dark:bg-main-900 dark:text-main-300">
                          {workspaceLabel}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 오버레이 - 패널이 열려있을 때 배경 어둡게 */}
      {showExampleAccounts && (
        <div
          className="fixed inset-0 z-30 bg-black/20 transition-opacity duration-300"
          onClick={() => setShowExampleAccounts(false)}
        />
      )}
    </div>
  );
};

export { Login };
