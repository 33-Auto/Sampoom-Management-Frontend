import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, it, expect } from "vitest";

import { Select } from "@/shared/ui";
// --- 테스트용 공통 데이터 ---
const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
];

describe("공통 컴포넌트인 Select 컴포넌트의 테스트", () => {
  describe("기능1 : Select 컴포넌트를 렌더링한다.", () => {
    it("시나리오 : Select 컴포넌트가 정상적으로 렌더링된다.", () => {
      // When
      render(<Select />);

      // Then
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
  });

  describe("기능2 : Select 컴포넌트의 옵션을 렌더링한다.", () => {
    it("시나리오 : 주어진 옵션들이 Select 컴포넌트에 정상적으로 렌더링된다.", () => {
      // Given
      const props = options;

      // When
      // 외부에서 options를 props로 받아서 렌더링한다.
      render(<Select options={props} />);

      // Then
      props.forEach((option) => {
        expect(
          screen.getByRole("option", { name: option.label }),
        ).toBeInTheDocument();
      });
    });
  });

  describe("기능3 : tailwindCSS가 제대로 넘어오는지 검사한다.", () => {
    it("시나리오 : className으로 tailwindCSS가 적용이 가능하다.", () => {
      // Given
      const className = "border-grey-300 new-custom-class";

      // When
      render(<Select className={className} />);

      // Then
      expect(screen.getByRole("combobox")).toHaveClass(
        "border-grey-300",
        "new-custom-class",
      );
    });
  });

  describe("기능4 : Select 컴포넌트가 ref를 제대로 전달받는지 검사한다.", () => {
    it("시나리오 : ref가 Select 컴포넌트에 정상적으로 전달된다.", () => {
      // Given
      const ref = React.createRef<HTMLSelectElement>();

      // When
      render(<Select ref={ref} />);

      // Then
      expect(ref.current).toBeInstanceOf(HTMLSelectElement);
    });
  });

  // describe("기능5 : Select 컴포넌트의 variant prop이 제대로 동작하는지 검사한다.", () => {
  //   it("시나리오 : variant prop이 Select 컴포넌트에 정상적으로 전달된다.", () => {
  //     // Given
  //     const variant = "default";

  //     // When
  //     render(<Select variant={variant} />);

  //     // Then
  //     // default variant에 해당하는 className이 적용되었는지 확인
  //     expect(screen.getByRole("combobox")).toHaveClass(
  //       selectVariants({ variant }),
  //     );
  //   });
  // });

  // describe("기능6 : Select 컴포넌트의 error variant가 제대로 동작하는지 검사한다.", () => {
  //   it("시나리오 : error variant가 Select 컴포넌트에 정상적으로 전달된다.", () => {
  //     // Given
  //     const variant = "error";

  //     // When
  //     render(<Select variant={variant} />);

  //     // Then
  //     // error variant에 해당하는 className이 적용되었는지 확인
  //     expect(screen.getByRole("combobox")).toHaveClass(
  //       selectVariants({ variant }),
  //     );
  //   });
  // });

  describe("기능7 : Select 컴포넌트가 추가적인 props를 제대로 전달받는지 검사한다.", () => {
    it("시나리오 : 추가적인 props가 Select 컴포넌트에 정상적으로 전달된다.", () => {
      // Given
      const additionalProps = {
        disabled: true,
        "data-testid": "custom-select",
      };

      // When
      render(<Select {...additionalProps} />);

      // Then
      // 추가적인 props가 적용되었는지 확인
      const selectElement = screen.getByTestId("custom-select");
      expect(selectElement).toBeDisabled();
    });
  });

  describe("기능8 : Select 컴포넌트가 빈 옵션 배열을 처리하는지 검사한다.", () => {
    it("시나리오 : 빈 옵션 배열이 Select 컴포넌트에 정상적으로 처리된다.", () => {
      // Given
      const emptyOptions: typeof options = []; // 빈 옵션 배열

      // When
      render(<Select options={emptyOptions} />);

      // Then
      // 옵션이 없으므로 option 요소가 존재하지 않아야 한다.
      const selectElement = screen.getByRole("combobox");
      expect(selectElement.children.length).toBe(0);
    });
  });

  describe("기능 9: label prop이 Select 컴포넌트에 제대로 전달되는지 검사한다.", () => {
    it("시나리오 : label prop이 Select 컴포넌트에 정상적으로 전달된다.", () => {
      // Given
      const label = "Test Select";

      // When
      render(<Select label={label} />);

      // Then
      const labelElement = screen.getByText(label);
      expect(labelElement).toBeInTheDocument();
    });
  });

  describe("기능 10: errorText prop이 Select 컴포넌트에 제대로 전달되는지 검사한다.", () => {
    it("시나리오 : errorText prop이 Select 컴포넌트에 정상적으로 전달된다.", () => {
      // Given
      const errorText = "지역을 선택해주세요.";

      // When
      render(<Select errorText={errorText} />);

      // Then
      const errorElement = screen.getByText(errorText);
      expect(errorElement).toBeInTheDocument();

      // border의 색상도 변하는지 확인
      expect(screen.getByRole("combobox")).toHaveClass("border-error-red");
    });
  });

  describe("기능 11: helperText prop이 Select 컴포넌트에 제대로 전달되는지 검사한다.", () => {
    it("시나리오 : helperText prop이 Select 컴포넌트에 정상적으로 전달된다.", () => {
      // Given
      const helperText = "지역을 선택해주세요.";

      // When
      render(<Select helperText={helperText} />);

      // Then
      const helperElement = screen.getByText(helperText);
      expect(helperElement).toBeInTheDocument();
    });
  });

  describe("기능 12: label을 누르면 select로 포커스가 된다.", () => {
    it("시나리오 : label을 누르면 select로 포커스가 된다", async () => {
      // Given
      const labelText = "비밀번호";
      const user = userEvent.setup();

      // When
      render(<Select label={labelText} />);
      await user.click(screen.getByText(labelText));

      // Then
      expect(screen.getByLabelText(labelText)).toHaveFocus();
    });
  });
});
