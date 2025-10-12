import { useEffect } from "react";import { useForm } from "react-hook-form";import { useNavigate } from "react-router-dom";import { useFactoryBranchOptions } from "@/entities/factory";import { useWmsBranchOptions } from "@/entities/wms";import Logo from "@/shared/assets/logo_text_dark.svg";
import { Button, Card, Input, Select } from "@/shared/ui";import { useRegisterForm } from "../lib";import { POSITION_OPTIONS, WORKSPACE_OPTIONS, type RegisterFormValues } from "../model";const Register = () => {
  const navigate = useNavigate();
  const { submitRegister, isLoading } = useRegisterForm();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      userName: "",
      workspace: "",
      branch: "",
      position: "",
    },
    mode: "onSubmit",
  });

  const password = watch("password");
  const workspace = watch("workspace");
  const branchValue = watch("branch");

  const factoryBranchOptions = useFactoryBranchOptions();
  const wmsBranchOptions = useWmsBranchOptions();

  const requiresFactoryBranch = workspace === "PRODUCTION";
  const requiresInventoryBranch = workspace === "INVENTORY";
  const requiresBranchSelection =
    requiresFactoryBranch || requiresInventoryBranch;

  const branchOptions = requiresFactoryBranch
    ? factoryBranchOptions
    : requiresInventoryBranch
      ? wmsBranchOptions
      : [];
  const branchLabel = branchOptions.find(
    (option: any) => option.value === branchValue,
  )?.label;

  useEffect(() => {
    if (!requiresBranchSelection && branchValue !== "") {
      setValue("branch", "");
    }
  }, [branchValue, requiresBranchSelection, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      // branch value 대신 label을 전달
      await submitRegister({
        ...values,
        branch: branchLabel ?? "",
      });
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error
          ? error.message
          : "회원가입에 실패했습니다. 다시 시도해주세요.";
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
              새 계정을 만드세요
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <Input
              label="사용자명"
              type="text"
              placeholder="사용자명을 입력하세요"
              {...register("userName", {
                required: "사용자명을 입력하세요.",
              })}
              errorText={errors.userName?.message}
            />

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

            <Select
              label="조직"
              {...register("workspace", {
                required: "조직을 선택하세요.",
                validate: (value) => value !== "" || "조직을 선택하세요.",
              })}
              value={watch("workspace")}
              options={[
                { value: "" as const, label: "조직을 선택하세요" },
                ...WORKSPACE_OPTIONS,
              ]}
              errorText={errors.workspace?.message}
            />

            <Select
              label="직급"
              {...register("position", {
                required: "직급을 선택하세요.",
                validate: (value) => value !== "" || "직급을 선택하세요.",
              })}
              options={[
                { value: "" as const, label: "직급을 선택하세요" },
                ...POSITION_OPTIONS,
              ]}
              errorText={errors.position?.message}
            />

            <Input
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력하세요"
              autoComplete="new-password"
              {...register("password", {
                required: "비밀번호를 입력하세요.",
                minLength: {
                  value: 8,
                  message: "비밀번호는 8자 이상이어야 합니다.",
                },
              })}
              errorText={errors.password?.message}
            />

            <Input
              label="비밀번호 확인"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              autoComplete="new-password"
              {...register("confirmPassword", {
                required: "비밀번호 확인을 입력하세요.",
                validate: (value) =>
                  value === password || "비밀번호가 일치하지 않습니다.",
              })}
              errorText={errors.confirmPassword?.message}
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
              회원가입
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={async () => navigate("/login")}
              className="cursor-pointer bg-transparent text-sm font-medium text-main-500 transition-colors duration-200 hover:text-main-600 dark:hover:text-main-400"
            >
              이미 계정이 있으신가요? 로그인
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export { Register };
