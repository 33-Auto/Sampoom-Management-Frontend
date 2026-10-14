import { useNavigate } from "react-router-dom";

import { useAuthStore } from "@/entities/user";
import { getWorkspaceLabel } from "@/shared/constants";
import { Button, Card } from "@/shared/ui";
import ModuleHeader from "@/widgets/Header/ModuleHeader";

const POSITION_LABELS: Record<string, string> = {
  STAFF: "사원",
  SENIOR_STAFF: "주임",
  ASSISTANT_MANAGER: "대리",
  MANAGER: "과장",
  DEPUTY_GENERAL_MANAGER: "차장",
  GENERAL_MANAGER: "부장",
  DIRECTOR: "이사",
  VICE_PRESIDENT: "부사장",
  PRESIDENT: "사장",
  CHAIRMAN: "회장",
};

// 헤더 사용자 메뉴의 "내 프로필"에서 들어오는 화면. 로그인한 사용자 정보를 보여준다.
export const Profile = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const fields = [
    { label: "이름", value: user?.userName },
    { label: "이메일", value: user?.email },
    { label: "조직", value: getWorkspaceLabel(user?.workspace) },
    { label: "지점", value: user?.branch },
    {
      label: "직급",
      value: user?.position
        ? (POSITION_LABELS[user.position] ?? user.position)
        : undefined,
    },
    { label: "입사일", value: user?.startedAt },
  ];

  return (
    <div className="min-h-screen bg-bg-white dark:bg-bg-black">
      <ModuleHeader
        moduleTitle="내 프로필"
        moduleDescription="로그인한 계정 정보를 확인합니다"
        moduleIcon="ri-user-line"
        moduleColor="bg-main-500"
      />
      <div className="mx-auto max-w-3xl p-4 sm:p-6">
        <Card>
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.label}>
                <dt className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                  {field.label}
                </dt>
                <dd className="font-medium break-all text-gray-900 dark:text-white">
                  {field.value ?? "-"}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex justify-end">
            <Button variant="secondary" onClick={async () => navigate("/")}>
              홈으로
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
