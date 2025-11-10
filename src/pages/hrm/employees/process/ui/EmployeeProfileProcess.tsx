import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useUpdateProfileMutation } from "@/pages/hrm/employees/api";
import type { Schemas } from "@/shared/model";
import { Button, Card, Select } from "@/shared/ui";

type UserInfo = Schemas["UserInfoResponse"];

const positionOptions = [
  { value: "STAFF", label: "사원" },
  { value: "SENIOR_STAFF", label: "주임" },
  { value: "ASSISTANT_MANAGER", label: "대리" },
  { value: "MANAGER", label: "과장" },
  { value: "DEPUTY_GENERAL_MANAGER", label: "차장" },
  { value: "GENERAL_MANAGER", label: "부장" },
  { value: "DIRECTOR", label: "이사" },
  { value: "VICE_PRESIDENT", label: "부사장" },
  { value: "PRESIDENT", label: "사장" },
  { value: "CHAIRMAN", label: "회장" },
];

export function EmployeeProfileProcess() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = (location.state as { user?: UserInfo })?.user;

  const [selectedPosition, setSelectedPosition] = useState<
    | "STAFF"
    | "SENIOR_STAFF"
    | "ASSISTANT_MANAGER"
    | "MANAGER"
    | "DEPUTY_GENERAL_MANAGER"
    | "GENERAL_MANAGER"
    | "DIRECTOR"
    | "VICE_PRESIDENT"
    | "PRESIDENT"
    | "CHAIRMAN"
  >((user?.position as any) || "STAFF");

  const updateMutation = useUpdateProfileMutation();

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">사용자 정보를 찾을 수 없습니다.</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={async () => navigate("/hrm/employees")}
            className="mt-4"
          >
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateMutation.mutate(
      {
        params: {
          path: { userId: user.userId! },
          query: { workspace: user.workspace! },
        },
        body: {
          position: selectedPosition,
        },
      },
      {
        onSuccess: () => {
          navigate("/hrm/employees");
        },
        onError: () => {
          alert("프로필 수정에 실패했습니다.");
        },
      },
    );
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="mb-2 flex items-center space-x-3">
            <Button variant="secondary" size="sm" onClick={handleCancel}>
              <i className="ri-arrow-left-line mr-2"></i>
              직원 목록
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              프로필 수정
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {user.userName}님의 직급을 수정합니다.
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    이름
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user.userName}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    이메일
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user.email}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    조직
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user.workspace === "FACTORY"
                      ? "공장"
                      : user.workspace === "WAREHOUSE"
                        ? "창고"
                        : "대리점"}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    지점
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user.branch}
                  </p>
                </div>
              </div>

              <div>
                <Select
                  label="직급"
                  value={selectedPosition}
                  options={positionOptions}
                  onChange={(e) =>
                    setSelectedPosition(
                      (e as React.ChangeEvent<HTMLSelectElement>).target
                        .value as typeof selectedPosition,
                    )
                  }
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={updateMutation.isPending}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "저장 중..." : "저장"}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
