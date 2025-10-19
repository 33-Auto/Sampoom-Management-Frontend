import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, vi } from 'vitest'

import { Input, inputVariants } from './Input'

describe('Input', () => {
  it('주어진 값과 함께 렌더링이 되어야 한다', () => {
    render(<Input value="안녕하세요" onClick={() => {}}></Input>)

    // 안녕하세요라는 값이 있어야 한다.
    const inputElement = screen.getByDisplayValue('안녕하세요')

    expect(inputElement).toBeInTheDocument()
  })

  it('User가 값을 입력할 떄 onChange 콜백이 호출되어야 한다', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(<Input value="" onChange={handleChange} />)

    // getByRole를 사용하여 input 요소를 가져올 수 있다.
    const inputElement = screen.getByRole('textbox')

    // User가 값을 입력한다고 쳤을 때
    await user.type(inputElement, '안녕하세요')

    // handleChange가 5번 호출되어야 한다.
    expect(handleChange).toHaveBeenCalledTimes(5)
  })

  it('variant prop이 주어졌을 때, 해당 variant에 맞는 스타일이 적용되어야 한다', () => {
    render(<Input variant="primary" />)

    const inputElement = screen.getByRole('textbox')

    expect(inputElement).toHaveClass(inputVariants({ variant: 'primary' }))
  })

  // disapble 상태에서는 입력이 되면 안된다.
  it('disabled 상태에서는 값을 입력할 수 없어야 한다', async () => {
    const user = userEvent.setup()

    render(<Input disabled />)

    const inputElement = screen.getByRole('textbox')

    // 일단 disaabled 되었다고 단언
    expect(inputElement).toBeDisabled()

    // 실제 유저도 한번 입력해본다.
    await user.type(inputElement, '안녕하세요')

    expect(inputElement).toHaveValue('')
  })

  // disabled 상태에서 스타일이 올바르게 적용되어 있어야한다.
  it('disabled 상태에서는 올바른 스타일이 적용되어야 한다', () => {
    render(<Input disabled />)
    const inputElement = screen.getByRole('textbox')
    expect(inputElement).toHaveAttribute('disabled')
  })

  // cva로 정의한 variant에 따라 다른 스타일이 적용되어야 한다.
  it('variant에 따라 다른 스타일이 적용되어야 한다', () => {
    const { rerender } = render(<Input variant="primary" />)
    const inputElement = screen.getByRole('textbox')

    // 해당 클래스를 가지고 있는지 검사
    expect(inputElement).toHaveClass(inputVariants({ variant: 'primary' }))

    // 클래스에 맞는 스타일이 적용되어 있는지 검사
    expect(inputElement).toHaveClass('dark:border-grey-700')

    rerender(<Input variant="secondary" />)
    expect(inputElement).toHaveClass(inputVariants({ variant: 'secondary' }))
  })

  it('label prop이 주어졌을 때, 해당 label이 렌더링 되어야 한다', () => {
    const labelText = '이것은 라벨입니다'
    render(<Input label={labelText} />)

    const inputElement = screen.getByLabelText(labelText)

    expect(inputElement).toBeInTheDocument()
  })

  it('label prop이 주어지지 않았을 때, label이 렌더링되지 않아야 한다', () => {
    render(<Input />)
    const absentLabel = screen.queryByRole('label')
    expect(absentLabel).not.toBeInTheDocument()
  })

  it('error prop이 true로 주어졌을 때, 에러 스타일이 적용되어야 한다', () => {
    render(<Input error={true} />)
    const inputElement = screen.getByRole('textbox')
    expect(inputElement).toHaveClass(inputVariants({ error: true }))
  })

  it('errorText prop이 주어졌을 때, 에러 텍스트가 렌더링 되어야 한다', () => {
    const errorText = '이것은 에러 텍스트입니다'
    render(<Input errorText={errorText} />)
    const errorElement = screen.getByText(errorText)
    expect(errorElement).toBeInTheDocument()
  })

  it('비밀번호는 type="password"로 렌더링 되어야 한다', () => {
    const labelText = '비밀번호'
    render(<Input type="password" label={labelText} />)
    const inputElement = screen.getByLabelText(labelText)
    expect(inputElement).toHaveAttribute('type', 'password')
  })

  it("비밀번호는 icon을 눌러 type='text'로 변경할 수 있어야 한다", async () => {
    const user = userEvent.setup()
    const labelText = '비밀번호'
    render(<Input type="password" label={labelText} />)
    const inputElement = screen.getByLabelText(labelText)
    expect(inputElement).toHaveAttribute('type', 'password')

    const toggleButton = screen.getByRole('button')
    await user.click(toggleButton)

    expect(inputElement).toHaveAttribute('type', 'text')
  })

  it('helperText prop이 주어졌을 때, 헬프 텍스트가 렌더링 되어야 한다', () => {
    const helperText = '이것은 헬프 텍스트입니다'
    render(<Input helperText={helperText} />)
    const helpElement = screen.getByText(helperText)
    expect(helpElement).toBeInTheDocument()
  })
})
