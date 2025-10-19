import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
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

      error: {
        true: 'border-error-red focus:border-error-red focus:ring-error-red',
        false:
          'border-grey-300 dark:border-grey-600 focus:border-main-500 focus:ring-main-500',
      },

      defaultVariants: {
        error: 'false',
      },
    },
  },
)

// variant를 받아주는 interface를 정의한다
// cva로 생성한 InputVariants의 VariantProps를 상속받는다
interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string
  errorText?: String
  helperText?: String
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant,
      label,
      error,
      errorText,
      helperText,
      type = 'text',
      id,
      ...props
    },
    ref,
  ) => {
    const reactId = React.useId()
    const inputId = id || reactId
    const hasError = !!errorText
    const isPassword = type === 'password'
    const [showPassword, setShowPassword] = React.useState(false)
    const inputType = isPassword && showPassword ? 'text' : type
    return (
      <div className="w-full">
        {label && (
          <label
            className="block text-sm font-medium text-grey-700 dark:text-grey-300 mb-1"
            htmlFor={inputId}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            type={inputType}
            className={inputVariants({ variant, error: hasError })}
            {...props}
          />
          {isPassword && (
            <div className="absolute inset-y-0 right-0 top-1/2  transform -translate-y-1/2 flex items-center pr-3">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className=" bg-transparent p-0 text-grey-400 dark:text-grey-500 hover:text-grey-600 dark:hover:text-grey-300 cursor-pointer"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          )}
        </div>

        {errorText && (
          <p className="mt-1 text-sm text-error-red">{errorText}</p>
        )}

        {helperText && !errorText && (
          <p className="mt-1 text-sm text-grey-500 dark:text-grey-400">
            {helperText}
          </p>
        )}
      </div>
    )
  },
)

export { Input, inputVariants }
