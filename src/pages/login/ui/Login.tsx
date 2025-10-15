import Button from '@/shared/ui'

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-[440px] mb-8 p-6 bg-white rounded-lg shadow-md"></div>
      <Button variant="primary" size="md">
        로그인
      </Button>
    </div>
  )
}
