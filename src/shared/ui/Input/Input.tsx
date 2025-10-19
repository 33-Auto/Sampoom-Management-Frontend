import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

const inputVariants = cva(
  // 기본 스타일 정의
  'w-full px-3 py-2 border rounded-lg text-sm transition-all duration-200 bg-white dark:bg-bg-card-black text-grey-900 dark:text-grey-100 placeholder-grey-400 dark:placeholder-grey-500 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:bg-grey-100 dark:disabled:bg-grey-800 disabled:cursor-not-allowed',
  {
    // 추후 에러에 대한 상황 추가를 위
    variants: {
      variant: {
        primary:
          'border-grey-300 dark:border-grey-700 focus:border-blue-500 focus:ring-blue-500',

        secondary:
          'border-grey-300 dark:border-grey-700 focus:border-green-500 focus:ring-green-500',
      },

      defaultVariants: {
        variant: 'primary',
      },
    },
  },
)

// variant를 받아주는 interface를 정의한다
// cva로 생성한 InputVariants의 VariantProps를 상속받는다
interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

// ref = React.Ref<HTMLInputElement> 를 전달받을 수 있도록 React.forwardRef를 사용한다
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant, ...props }, ref) => {
    return <input ref={ref} className={inputVariants({ variant })} {...props} />
  },
)

export { Input, inputVariants }
