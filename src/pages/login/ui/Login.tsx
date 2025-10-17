import { Button } from "@/shared/ui";

export default function Login() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="bg-avocado-300 mb-8 w-[440px] rounded-lg p-6 shadow-md">
        <Button size="lg">로그인</Button>
      </div>
    </div>
  );
}
