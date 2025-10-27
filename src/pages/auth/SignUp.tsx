import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Input, Select } from "@/shared/ui";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Warehouse Manager",
    branch: "",
  });
  const [loading, setLoading] = useState(false);

  const roleOptions = [
    { value: "Warehouse Manager", label: "창고 관리자" },
    { value: "Factory Manager", label: "공장 관리자" },
  ];

  const branchOptions = [
    { value: "", label: "지점을 선택하세요" },
    { value: "Seoul", label: "서울 지점" },
    { value: "Busan", label: "부산 지점" },
    { value: "Incheon", label: "인천 지점" },
    { value: "Daegu", label: "대구 지점" },
    { value: "Daejeon", label: "대전 지점" },
    { value: "Gwangju", label: "광주 지점" },
    { value: "Ulsan", label: "울산 지점" },
    { value: "Suwon", label: "수원 지점" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!formData.branch) {
      alert("지점을 선택해주세요.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-white p-4 transition-colors duration-200 dark:bg-bg-black">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-grey-200 bg-bg-card-white p-8 shadow-lg dark:border-grey-600 dark:bg-bg-card-black">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex flex-col space-y-1">
                <div className="h-2 w-8 rounded-full bg-main-500"></div>
                <div className="h-2 w-6 rounded-full bg-main-400"></div>
                <div className="h-2 w-10 rounded-full bg-main-600"></div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-grey-900 dark:text-grey-100">
              품관리
            </h1>
            <p className="mt-2 text-grey-600 dark:text-grey-300">
              새 계정을 만드세요
            </p>
          </div>

          {/* SignUp Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="사용자명"
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="사용자명을 입력하세요"
              required
            />

            <Input
              label="이메일"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="이메일을 입력하세요"
              required
            />

            <Select
              label="역할"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              options={roleOptions}
              required
            />

            <Select
              label="지점명"
              value={formData.branch}
              onChange={(e) =>
                setFormData({ ...formData, branch: e.target.value })
              }
              options={branchOptions}
              required
            />

            <Input
              label="비밀번호"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="비밀번호를 입력하세요"
              required
            />

            <Input
              label="비밀번호 확인"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              placeholder="비밀번호를 다시 입력하세요"
              required
            />

            <Button type="submit" className="w-full" loading={loading}>
              회원가입
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <button
              onClick={async () => navigate("/login")}
              className="cursor-pointer text-sm font-medium text-main-500 transition-colors duration-200 hover:text-main-600 dark:hover:text-main-400"
            >
              이미 계정이 있으신가요? 로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
