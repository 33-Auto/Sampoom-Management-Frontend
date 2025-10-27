import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui";
import { Input } from "@/shared/ui";
import { Select } from "@/shared/ui";

export default function HRMEvaluation() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState("2024-Q1");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const evaluationData = [
    {
      id: "EMP-001",
      name: "김철수",
      position: "개발팀장",
      department: "development",
      period: "2024-Q1",
      overallScore: 4.5,
      scores: {
        performance: 4.8,
        teamwork: 4.2,
        leadership: 4.7,
        communication: 4.3,
        innovation: 4.5,
      },
      goals: [
        { title: "신규 프로젝트 완료", status: "completed", progress: 100 },
        { title: "팀 생산성 20% 향상", status: "completed", progress: 100 },
        {
          title: "기술 교육 프로그램 운영",
          status: "in_progress",
          progress: 80,
        },
      ],
      feedback:
        "뛰어난 기술 리더십과 팀 관리 능력을 보여주었습니다. 신규 프로젝트를 성공적으로 완료하였고, 팀원들의 성장을 위한 교육에도 적극적입니다.",
      nextGoals: [
        "차세대 아키텍처 설계",
        "주니어 개발자 멘토링",
        "기술 블로그 운영",
      ],
      evaluator: "이사 김대표",
      status: "completed",
    },
    {
      id: "EMP-002",
      name: "이영희",
      position: "마케팅 매니저",
      department: "marketing",
      period: "2024-Q1",
      overallScore: 4.2,
      scores: {
        performance: 4.5,
        teamwork: 4.0,
        leadership: 4.1,
        communication: 4.6,
        innovation: 3.8,
      },
      goals: [
        { title: "브랜드 인지도 30% 향상", status: "completed", progress: 100 },
        { title: "신규 캠페인 3개 런칭", status: "completed", progress: 100 },
        { title: "SNS 팔로워 50% 증가", status: "in_progress", progress: 75 },
      ],
      feedback:
        "창의적인 마케팅 전략으로 브랜드 가치 향상에 크게 기여했습니다. 다양한 채널을 활용한 통합 마케팅 캠페인이 성공적이었습니다.",
      nextGoals: [
        "글로벌 마케팅 전략 수립",
        "인플루언서 마케팅 확대",
        "데이터 기반 마케팅 도입",
      ],
      evaluator: "이사 박부장",
      status: "completed",
    },
    {
      id: "EMP-003",
      name: "박민수",
      position: "영업 대표",
      department: "sales",
      period: "2024-Q1",
      overallScore: 4.0,
      scores: {
        performance: 4.3,
        teamwork: 3.8,
        leadership: 3.9,
        communication: 4.2,
        innovation: 3.8,
      },
      goals: [
        { title: "분기 매출 목표 달성", status: "completed", progress: 100 },
        { title: "신규 고객 20개사 확보", status: "in_progress", progress: 85 },
        { title: "고객 만족도 90% 달성", status: "completed", progress: 100 },
      ],
      feedback:
        "목표 매출을 초과 달성하며 뛰어난 영업 성과를 보였습니다. 고객 관계 관리에도 우수한 능력을 발휘했습니다.",
      nextGoals: [
        "대형 고객사 확보",
        "영업 프로세스 개선",
        "후배 영업사원 교육",
      ],
      evaluator: "이사 최부장",
      status: "completed",
    },
    {
      id: "EMP-004",
      name: "정수진",
      position: "인사 담당자",
      department: "hr",
      period: "2024-Q1",
      overallScore: 4.3,
      scores: {
        performance: 4.4,
        teamwork: 4.5,
        leadership: 4.0,
        communication: 4.6,
        innovation: 4.0,
      },
      goals: [
        {
          title: "신입사원 온보딩 프로그램 개선",
          status: "completed",
          progress: 100,
        },
        { title: "직원 만족도 조사 실시", status: "completed", progress: 100 },
        {
          title: "교육 프로그램 3개 신설",
          status: "in_progress",
          progress: 70,
        },
      ],
      feedback:
        "체계적인 인사 관리와 직원 복지 향상에 크게 기여했습니다. 소통 능력이 뛰어나 직원들의 신뢰를 받고 있습니다.",
      nextGoals: [
        "성과 관리 시스템 도입",
        "리더십 교육 프로그램 개발",
        "조직문화 개선 활동",
      ],
      evaluator: "이사 김대표",
      status: "in_progress",
    },
    {
      id: "EMP-005",
      name: "최동욱",
      position: "재무 담당자",
      department: "finance",
      period: "2024-Q1",
      overallScore: 3.8,
      scores: {
        performance: 4.0,
        teamwork: 3.7,
        leadership: 3.5,
        communication: 3.8,
        innovation: 3.9,
      },
      goals: [
        { title: "예산 관리 시스템 구축", status: "in_progress", progress: 60 },
        { title: "비용 절감 10% 달성", status: "completed", progress: 100 },
        { title: "재무 보고서 자동화", status: "in_progress", progress: 40 },
      ],
      feedback:
        "정확한 재무 분석과 비용 관리로 회사 경영에 도움을 주고 있습니다. 시스템 구축 역량을 더 발전시킬 필요가 있습니다.",
      nextGoals: [
        "ERP 시스템 고도화",
        "투자 분석 역량 강화",
        "재무 전략 수립 참여",
      ],
      evaluator: "이사 박부장",
      status: "in_progress",
    },
  ];

  const departmentOptions = [
    { value: "all", label: "전체 부서" },
    { value: "development", label: "개발팀" },
    { value: "marketing", label: "마케팅팀" },
    { value: "sales", label: "영업팀" },
    { value: "hr", label: "인사팀" },
    { value: "finance", label: "재무팀" },
  ];

  const periodOptions = [
    { value: "2024-Q1", label: "2024년 1분기" },
    { value: "2023-Q4", label: "2023년 4분기" },
    { value: "2023-Q3", label: "2023년 3분기" },
    { value: "2023-Q2", label: "2023년 2분기" },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "text-green-600";
    if (score >= 4.0) return "text-blue-600";
    if (score >= 3.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreGrade = (score: number) => {
    if (score >= 4.5) return "S";
    if (score >= 4.0) return "A";
    if (score >= 3.5) return "B";
    if (score >= 3.0) return "C";
    return "D";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "완료";
      case "in_progress":
        return "진행중";
      case "pending":
        return "대기";
      default:
        return "알 수 없음";
    }
  };

  const getDepartmentText = (department: string) => {
    switch (department) {
      case "development":
        return "개발팀";
      case "marketing":
        return "마케팅팀";
      case "sales":
        return "영업팀";
      case "hr":
        return "인사팀";
      case "finance":
        return "재무팀";
      default:
        return department;
    }
  };

  const filteredEvaluations = evaluationData.filter((evaluation) => {
    const matchesDepartment =
      departmentFilter === "all" || evaluation.department === departmentFilter;
    const matchesPeriod = evaluation.period === selectedPeriod;
    return matchesDepartment && matchesPeriod;
  });

  const avgScore =
    filteredEvaluations.length > 0
      ? filteredEvaluations.reduce((sum, e) => sum + e.overallScore, 0) /
        filteredEvaluations.length
      : 0;
  const completedCount = filteredEvaluations.filter(
    (e) => e.status === "completed",
  ).length;
  const highPerformers = filteredEvaluations.filter(
    (e) => e.overallScore >= 4.5,
  ).length;

  const handleViewEvaluation = (evaluation: any) => {
    setSelectedEmployee(evaluation);
    setShowEvaluationModal(true);
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  평균 평가점수
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {avgScore.toFixed(1)}
                </p>
                <p className="mt-1 text-xs text-blue-600">5점 만점</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <i className="ri-star-line text-blue-600"></i>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">평가 완료</p>
                <p className="text-2xl font-bold text-gray-900">
                  {completedCount}
                </p>
                <p className="mt-1 text-xs text-green-600">명</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <i className="ri-check-line text-green-600"></i>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">우수 평가자</p>
                <p className="text-2xl font-bold text-gray-900">
                  {highPerformers}
                </p>
                <p className="mt-1 text-xs text-teal-600">4.5점 이상</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100">
                <i className="ri-trophy-line text-teal-600"></i>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">평가 진행률</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(
                    (completedCount / filteredEvaluations.length) * 100,
                  )}
                  %
                </p>
                <p className="mt-1 text-xs text-purple-600">완료율</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <i className="ri-progress-line text-purple-600"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">성과 평가</h2>
            <div className="flex items-center space-x-3">
              <Button variant="secondary" size="sm">
                <i className="ri-download-line mr-2"></i>
                평가 리포트
              </Button>
              <Button variant="default" size="sm">
                <i className="ri-add-line mr-2"></i>새 평가 시작
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Select
              label="평가 기간"
              options={periodOptions}
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            />
            <Select
              label="부서"
              options={departmentOptions}
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            />
            <div className="flex items-end">
              <Button variant="secondary" size="md" className="w-full">
                <i className="ri-search-line mr-2"></i>
                조회
              </Button>
            </div>
          </div>
        </div>

        {/* Evaluation List */}
        <div className="space-y-4">
          {filteredEvaluations.map((evaluation) => (
            <div
              key={evaluation.id}
              className="rounded-lg border border-gray-200 bg-white p-6"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center space-x-3">
                    <span className="text-lg font-semibold text-gray-900">
                      {evaluation.name}
                    </span>
                    <span className="text-sm text-gray-600">
                      ({evaluation.id})
                    </span>
                    <span
                      className={`rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(evaluation.status)}`}
                    >
                      {getStatusText(evaluation.status)}
                    </span>
                    <div className="flex items-center space-x-1">
                      <span
                        className={`text-2xl font-bold ${getScoreColor(evaluation.overallScore)}`}
                      >
                        {evaluation.overallScore}
                      </span>
                      <span
                        className={`rounded px-2 py-1 text-xs font-bold ${getScoreColor(evaluation.overallScore)} bg-opacity-10`}
                      >
                        {getScoreGrade(evaluation.overallScore)}등급
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                    <div>
                      <p className="text-gray-600">직급/부서</p>
                      <p className="font-medium text-gray-900">
                        {evaluation.position}
                      </p>
                      <p className="text-gray-600">
                        {getDepartmentText(evaluation.department)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">평가 기간</p>
                      <p className="font-medium text-gray-900">
                        {evaluation.period}
                      </p>
                      <p className="text-gray-600">분기별 평가</p>
                    </div>
                    <div>
                      <p className="text-gray-600">평가자</p>
                      <p className="font-medium text-gray-900">
                        {evaluation.evaluator}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleViewEvaluation(evaluation)}
                  >
                    <i className="ri-eye-line mr-1"></i>
                    상세보기
                  </Button>
                  <Button variant="secondary" size="sm">
                    <i className="ri-edit-line"></i>
                  </Button>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-5">
                <div className="text-center">
                  <p className="mb-1 text-xs text-gray-600">업무성과</p>
                  <p
                    className={`text-lg font-bold ${getScoreColor(evaluation.scores.performance)}`}
                  >
                    {evaluation.scores.performance}
                  </p>
                </div>
                <div className="text-center">
                  <p className="mb-1 text-xs text-gray-600">팀워크</p>
                  <p
                    className={`text-lg font-bold ${getScoreColor(evaluation.scores.teamwork)}`}
                  >
                    {evaluation.scores.teamwork}
                  </p>
                </div>
                <div className="text-center">
                  <p className="mb-1 text-xs text-gray-600">리더십</p>
                  <p
                    className={`text-lg font-bold ${getScoreColor(evaluation.scores.leadership)}`}
                  >
                    {evaluation.scores.leadership}
                  </p>
                </div>
                <div className="text-center">
                  <p className="mb-1 text-xs text-gray-600">소통능력</p>
                  <p
                    className={`text-lg font-bold ${getScoreColor(evaluation.scores.communication)}`}
                  >
                    {evaluation.scores.communication}
                  </p>
                </div>
                <div className="text-center">
                  <p className="mb-1 text-xs text-gray-600">혁신성</p>
                  <p
                    className={`text-lg font-bold ${getScoreColor(evaluation.scores.innovation)}`}
                  >
                    {evaluation.scores.innovation}
                  </p>
                </div>
              </div>

              {/* Goals Progress */}
              <div className="mb-4">
                <p className="mb-2 text-sm font-medium text-gray-900">
                  목표 달성 현황
                </p>
                <div className="space-y-2">
                  {evaluation.goals.slice(0, 2).map((goal, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-700">{goal.title}</span>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-20 rounded-full bg-gray-200">
                          <div
                            className={`h-2 rounded-full ${goal.status === "completed" ? "bg-green-500" : "bg-blue-500"}`}
                            style={{ width: `${goal.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">
                          {goal.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback Preview */}
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="line-clamp-2 text-sm text-gray-700">
                  {evaluation.feedback}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Evaluation Detail Modal */}
        {showEvaluationModal && selectedEmployee && (
          <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
            <div className="mx-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  성과 평가 상세
                </h2>
                <button
                  onClick={() => {
                    setShowEvaluationModal(false);
                    setSelectedEmployee(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <div className="space-y-6">
                {/* Employee Info */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                    <div>
                      <span className="text-gray-600">이름:</span>
                      <span className="ml-2 font-medium">
                        {selectedEmployee.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">직급:</span>
                      <span className="ml-2 font-medium">
                        {selectedEmployee.position}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">부서:</span>
                      <span className="ml-2 font-medium">
                        {getDepartmentText(selectedEmployee.department)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">평가기간:</span>
                      <span className="ml-2 font-medium">
                        {selectedEmployee.period}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Overall Score */}
                <div className="rounded-lg bg-blue-50 p-6 text-center">
                  <div
                    className={`mb-2 text-4xl font-bold ${getScoreColor(selectedEmployee.overallScore)}`}
                  >
                    {selectedEmployee.overallScore}
                  </div>
                  <div
                    className={`text-lg font-semibold ${getScoreColor(selectedEmployee.overallScore)}`}
                  >
                    {getScoreGrade(selectedEmployee.overallScore)}등급
                  </div>
                  <p className="mt-1 text-sm text-gray-600">종합 평가 점수</p>
                </div>

                {/* Detailed Scores */}
                <div>
                  <h3 className="mb-3 font-semibold text-gray-900">
                    세부 평가 항목
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {Object.entries(selectedEmployee.scores).map(
                      ([key, score]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                        >
                          <span className="text-gray-700">
                            {key === "performance" && "업무 성과"}
                            {key === "teamwork" && "팀워크"}
                            {key === "leadership" && "리더십"}
                            {key === "communication" && "소통 능력"}
                            {key === "innovation" && "혁신성"}
                          </span>
                          <span
                            className={`text-xl font-bold ${getScoreColor(score as number)}`}
                          >
                            {score}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Goals */}
                <div>
                  <h3 className="mb-3 font-semibold text-gray-900">
                    목표 달성 현황
                  </h3>
                  <div className="space-y-3">
                    {selectedEmployee.goals.map((goal: any, index: number) => (
                      <div key={index} className="rounded-lg bg-gray-50 p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-medium text-gray-900">
                            {goal.title}
                          </span>
                          <span
                            className={`rounded px-2 py-1 text-xs font-medium ${getStatusColor(goal.status)}`}
                          >
                            {getStatusText(goal.status)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="h-2 flex-1 rounded-full bg-gray-200">
                            <div
                              className={`h-2 rounded-full ${goal.status === "completed" ? "bg-green-500" : "bg-blue-500"}`}
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-600">
                            {goal.progress}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feedback */}
                <div>
                  <h3 className="mb-3 font-semibold text-gray-900">
                    평가 피드백
                  </h3>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="leading-relaxed text-gray-700">
                      {selectedEmployee.feedback}
                    </p>
                  </div>
                </div>

                {/* Next Goals */}
                <div>
                  <h3 className="mb-3 font-semibold text-gray-900">
                    다음 분기 목표
                  </h3>
                  <div className="space-y-2">
                    {selectedEmployee.nextGoals.map(
                      (goal: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <i className="ri-arrow-right-line text-gray-400"></i>
                          <span className="text-gray-700">{goal}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button variant="default" className="flex-1">
                    <i className="ri-download-line mr-2"></i>
                    평가서 다운로드
                  </Button>
                  <Button variant="secondary" className="flex-1">
                    <i className="ri-edit-line mr-2"></i>
                    평가 수정
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
