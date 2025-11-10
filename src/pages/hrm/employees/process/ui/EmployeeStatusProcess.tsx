import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useUpdateStatusMutation } from "@/pages/hrm/employees/api";
import type { Schemas } from "@/shared/model";
import { Button, Card, Select } from "@/shared/ui";

type UserInfo = Schemas["UserInfoResponse"];

const statusOptions = [
  { value: "ACTIVE", label: "재직" },
  { value: "LEAVE", label: "휴직" },
  { value: "RETIRED", label: "퇴직" },
];

export function EmployeeStatusProcess() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = (location.state as { user?: UserInfo })?.user;

  const [selectedStatus, setSelectedStatus] = useState<
    "ACTIVE" | "LEAVE" | "RETIRED"
  >((user?.status as "ACTIVE" | "LEAVE" | "RETIRED") || "ACTIVE");

  const updateMutation = useUpdateStatusMutation();

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
          employeeStatus: selectedStatus,
        },
      },
      {
        onSuccess: () => {
          navigate("/hrm/employees");
        },
        onError: () => {
          alert("상태 변경에 실패했습니다.");
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
              상태 변경
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {user.userName}님의 상태를 변경합니다.
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
                  label="상태"
                  value={selectedStatus}
                  options={statusOptions}
                  onChange={(e) =>
                    setSelectedStatus(
                      (e as React.ChangeEvent<HTMLSelectElement>).target
                        .value as "ACTIVE" | "LEAVE" | "RETIRED",
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
