/**
 * @file Button 컴포넌트 테스트
 * @description TDD(테스트 주도 개발) 방법론에 따라 Button 컴포넌트를 개발하는 과정을 시뮬레이션합니다.
 * 각 테스트 케이스는 하나의 요구사항을 정의하며, 이 테스트를 통과시키기 위한 최소한의 코드를 작성하는 과정을 상상하며 진행합니다.
 */

// 테스트에 필요한 라이브러리들을 가져옵니다.
// render, screen: 컴포넌트를 렌더링하고 화면에서 요소를 찾는 데 사용됩니다.
import { render, screen } from "@testing-library/react";
// userEvent: 실제 사용자가 버튼을 클릭하는 것과 같은 상호작용을 시뮬레이션합니다.
import userEvent from "@testing-library/user-event";
// React는 모든 컴포넌트 테스트에 기본적으로 필요합니다.
import React from "react";
// test, expect, vi: Vitest에서 제공하는 테스트 함수, 단언(assertion) 함수, 모의(mock) 함수입니다.
import { test, expect, vi } from "vitest";

// 테스트할 대상인 Button 컴포넌트와, 클래스 검증에 사용할 buttonVariants를 가져옵니다.
import { Button, buttonVariants } from "./Button";

// --- TDD 1단계: 가장 기본적인 기능 정의 (Red -> Green) ---
/**
 * 요구사항 1: "버튼 내부에 원하는 텍스트를 넣어 렌더링할 수 있어야 한다."
 *
 * TDD의 첫 번째 단계는 실패하는 테스트를 작성하는 것입니다. (Red)
 * 아직 Button 컴포넌트가 없다고 가정하면, 이 테스트는 당연히 실패합니다.
 *
 * 이 테스트를 통과시키기 위한 가장 간단한 방법은 무엇일까요? (Green)
 * React.forwardRef<HTMLButtonElement, ButtonProps>(({ children, ...props }, ref) => {
 *   return <button ref={ref} {...props}>{children}</button>;
 * });
 * 위와 같이 최소한의 기능만 가진 Button 컴포n넌트를 작성하는 것입니다.
 */
test("요구사항 1: 버튼은 내부에 포함된 자식 요소를 렌더링해야 한다", () => {
  // 1. 준비 (Arrange): "Click me"라는 텍스트를 가진 Button 컴포넌트를 렌더링합니다.
  render(<Button>Click me</Button>);

  // 2. 실행 (Act) & 3. 단언 (Assert): 화면에서 "button" 역할을 하고 "Click me"라는 이름을 가진 요소를 찾습니다.
  // 해당 요소가 문서 내에 존재하는지 확인합니다.
  const button = screen.getByRole("button", { name: /click me/i });
  expect(button).toBeInTheDocument();
});

// --- TDD 2단계: 속성(Props) 추가 ---
/**
 * 요구사항 2: "버튼을 클릭했을 때, 특정 함수를 실행시킬 수 있어야 한다."
 *
 * 이제 `onClick` 이라는 prop을 처리해야 합니다. 1단계에서 만든 기본 컴포넌트에는 onClick 기능이 없으므로 테스트가 실패할 것입니다. (Red)
 * 테스트를 통과시키기 위해, Button 컴포넌트가 `onClick` prop을 받아서 내부 <button> 요소에 그대로 전달해주면 됩니다. (Green)
 */
test("요구사항 2: onClick 핸들러가 클릭 시 호출되어야 한다", async () => {
  // 준비 (Arrange): userEvent를 설정하고, vi.fn()으로 모의 함수를 만듭니다.
  const user = userEvent.setup();
  const handleClick = vi.fn(); // 클릭되었는지 여부를 감시할 모의 함수
  render(<Button onClick={handleClick}>Click me</Button>);

  // 실행 (Act): 화면에서 버튼을 찾아 클릭합니다.
  const button = screen.getByRole("button");
  await user.click(button);

  // 단언 (Assert): 모의 함수(handleClick)가 정확히 1번 호출되었는지 확인합니다.
  expect(handleClick).toHaveBeenCalledTimes(1);
});

/**
 * 요구사항 3: "버튼이 비활성화(disabled) 상태일 때, 클릭 이벤트가 발생하지 않아야 한다."
 *
 * `disabled` prop을 처리해야 합니다. 이 기능이 없다면 테스트는 실패합니다. (Red)
 * Button 컴포넌트가 `disabled` prop을 받아서 내부 <button> 요소에 전달해주면 테스트를 통過시킬 수 있습니다. (Green)
 */
test("요구사항 3: disabled 상태에서는 클릭되지 않아야 한다", async () => {
  const user = userEvent.setup();
  const handleClick = vi.fn();
  render(
    <Button onClick={handleClick} disabled>
      Click me
    </Button>,
  );

  const button = screen.getByRole("button");

  // 단언 (Assert): 우선 버튼이 비활성화 상태인지 확인합니다.
  expect(button).toBeDisabled();

  // 실행 (Act): 비활성화된 버튼에 클릭을 시도합니다.
  // userEvent는 비활성화된 요소 클릭 시 에러를 발생시키므로, catch로 처리합니다.
  await user.click(button).catch(() => {});

  // 단언 (Assert): 클릭 이벤트가 발생하지 않았으므로, 모의 함수는 호출되지 않아야 합니다.
  expect(handleClick).not.toHaveBeenCalled();
});

// --- TDD 3단계: 복잡한 상태 추가 (Variants) ---
/**
 * 요구사항 4: "버튼의 용도(variant)와 크기(size)에 따라 다른 스타일이 적용되어야 한다."
 *
 * 이 요구사항은 스타일링에 관한 것입니다. 단순히 if문으로 클래스를 분기하는 것은 복잡도를 높입니다.
 * 이 문제를 해결하기 위해 `class-variance-authority`(CVA) 라이브러리를 도입하기로 결정합니다.
 * CVA를 적용하기 전에는 이 테스트가 실패합니다. (Red)
 *
 * `buttonVariants`를 정의하고, 컴포넌트 내에서 `cn(buttonVariants({ variant, size, className }))`를 사용하여
 * prop에 맞는 클래스를 동적으로 생성해주면 테스트를 통과할 수 있습니다. (Green)
 */
test("요구사항 4: variant와 size에 따라 올바른 스타일 클래스를 적용해야 한다", () => {
  // 준비 (Arrange): `destructive` variant와 `sm` size를 가진 버튼을 렌더링합니다.
  const { rerender } = render(
    <Button variant="destructive" size="sm">
      Destructive
    </Button>,
  );

  // 실행 및 단언 (Act & Assert): 해당 variant와 size에 맞는 클래스가 버튼에 적용되었는지 확인합니다.
  let button = screen.getByRole("button");
  expect(button).toHaveClass(
    buttonVariants({ variant: "destructive", size: "sm" }),
  );

  // 리팩토링/확장성 확인: 다른 variant와 size로 변경했을 때도 잘 동작하는지 확인합니다.
  rerender(
    <Button variant="outline" size="lg">
      Outline
    </Button>,
  );
  button = screen.getByRole("button");
  expect(button).toHaveClass(
    buttonVariants({ variant: "outline", size: "lg" }),
  );
});

// --- TDD 4단계: 고급 기능 추가 (Composition) ---
/**
 * 요구사항 5: "버튼을 다른 컴포넌트(예: 링크)처럼 동작하게 만들고 싶다."
 *
 * 이 요구사항은 컴포넌트의 유연성에 관한 것입니다. `asChild`라는 prop을 통해
 * 버튼의 기본 렌더링을 자식 컴포z넌트로 위임하는 기능이 필요합니다.
 * 이 기능이 없으면, 아래 테스트는 `<a>` 태그를 찾지 못해 실패합니다. (Red)
 *
 * 이 문제를 해결하기 위해 `@radix-ui/react-slot`을 도입합니다.
 * 컴포넌트 내부에서 `const Comp = asChild ? Slot : 'button';` 와 같이
 * 렌더링할 요소를 동적으로 결정해주면 테스트를 통과할 수 있습니다. (Green)
 */
test("요구사항 5: asChild prop이 true일 때, 자식 컴포넌트로 렌더링되어야 한다", () => {
  // 준비 (Arrange): asChild prop과 함께 자식으로 `<a>` 태그를 넣어 렌더링합니다.
  render(
    <Button asChild>
      <a href="/#">Link</a>
    </Button>,
  );

  // 실행 및 단언 (Act & Assert): 화면에 "button"이 아닌 "link" 역할의 요소가 있는지 확인합니다.
  const link = screen.getByRole("link", { name: /link/i });
  expect(link).toBeInTheDocument();

  // 추가 단언: `<a>` 태그로 렌더링되었지만, 버튼의 기본 스타일 클래스는 여전히 가지고 있는지 확인합니다.
  expect(link).toHaveClass(
    buttonVariants({ variant: "default", size: "default" }),
  );
  expect(link.tagName).toBe("A");
});

/**
 * TDD 최종 단계: 리팩토링 (Refactor)
 * 모든 테스트가 통과(Green)하면, 코드를 정리하고 개선하는 리팩토링 단계를 거칩니다.
 * 예를 들어, 코드 중복을 제거하거나, 가독성을 높이는 등의 작업을 합니다.
 * 현재의 `Button.tsx` 파일은 이러한 TDD 사이클을 거쳐 완성된 결과물이라고 할 수 있습니다.
 */
