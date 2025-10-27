
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui';
import { Input } from '@/shared/ui';
import { ThemeToggle } from '@/shared/ui';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 테스트 계정 확인 (지점 정보 포함)
    const testAccounts = [
      { username: 'warehouse', password: 'warehouse123', role: 'Warehouse Manager', branch: 'Seoul', branchName: '서울 지점' },
      { username: 'factory', password: 'factory123', role: 'Factory Manager', branch: 'Busan', branchName: '부산 지점' },
      { username: 'warehouse2', password: 'warehouse123', role: 'Warehouse Manager', branch: 'Incheon', branchName: '인천 지점' },
      { username: 'factory2', password: 'factory123', role: 'Factory Manager', branch: 'Daegu', branchName: '대구 지점' }
    ];

    const account = testAccounts.find(
      acc => acc.username === formData.username && acc.password === formData.password
    );

    setTimeout(() => {
      if (account) {
        localStorage.setItem('user', JSON.stringify({
          username: account.username,
          role: account.role,
          branch: account.branch,
          branchName: account.branchName
        }));
        
        if (account.role === 'Warehouse Manager') {
          navigate('/warehouse');
        } else {
          navigate('/factory');
        }
      } else {
        alert('잘못된 사용자명 또는 비밀번호입니다.');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-bg-white dark:bg-bg-black flex items-center justify-center p-4 transition-colors duration-200">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="bg-bg-card-white dark:bg-bg-card-black rounded-lg shadow-lg p-8 border border-grey-200 dark:border-grey-600">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="flex flex-col space-y-1">
                <div className="w-8 h-2 bg-main-500 rounded-full"></div>
                <div className="w-6 h-2 bg-main-400 rounded-full"></div>
                <div className="w-10 h-2 bg-main-600 rounded-full"></div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-grey-900 dark:text-grey-100">품관리</h1>
            <p className="text-grey-600 dark:text-grey-300 mt-2">ERP 시스템에 로그인하세요</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="사용자명"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="사용자명을 입력하세요"
              required
            />

            <Input
              label="비밀번호"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="비밀번호를 입력하세요"
              required
            />

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={!formData.username || !formData.password}
            >
              로그인
            </Button>
          </form>

          {/* Test Accounts */}
          <div className="mt-8 p-4 bg-grey-100 dark:bg-grey-700 rounded-lg border border-grey-200 dark:border-grey-600">
            <h3 className="text-sm font-medium text-grey-800 dark:text-grey-200 mb-3">테스트 계정</h3>
            <div className="space-y-2 text-sm text-grey-700 dark:text-grey-300">
              <div>
                <strong>창고 관리자 (서울):</strong> warehouse / warehouse123
              </div>
              <div>
                <strong>공장 관리자 (부산):</strong> factory / factory123
              </div>
              <div>
                <strong>창고 관리자 (인천):</strong> warehouse2 / warehouse123
              </div>
              <div>
                <strong>공장 관리자 (대구):</strong> factory2 / factory123
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/signup')}
              className="text-main-500 hover:text-main-600 dark:hover:text-main-400 text-sm font-medium cursor-pointer transition-colors duration-200"
            >
              계정이 없으신가요? 회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
