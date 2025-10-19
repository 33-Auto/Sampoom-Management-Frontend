import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

// 테스트할 컴포넌트와 타입을 import
import type { Column } from "./Table";
import { Table } from "./Table"; // 경로가 올바르다고 가정

// --- 테스트용 공통 데이터 ---
const testColumns: Column[] = [
  { key: "name", title: "Name" },
  { key: "age", title: "Age" },
];

const testData = [{ id: 1, name: "Alice", age: 30 }];

// Feature: 기능 단위를 최상위 describe로 설정
describe("Feature: Table Component", () => {
  // Scenario: 테스트할 시나리오를 describe로 설정
  describe("Scenario 1: 기본 뼈대 렌더링", () => {
    // it: Given-When-Then 구조를 서술형으로 작성
    it("Given: 컬럼과 빈 데이터가 주어졌을 때, When: 렌더링하면, Then: 'table' 역할을 가진 요소가 표시되어야 한다.", () => {
      // Given (전제)
      const props = { columns: testColumns, data: [] };

      // When (행동)
      render(<Table {...props} />);

      // Then (결과)
      expect(screen.getByRole("table")).toBeInTheDocument();
    });
  });

  describe("Scenario 2: 테이블 헤더 렌더링", () => {
    it("Given: 컬럼이 주어졌을 때, When: 렌더링하면, Then: 'columnheader' 역할의 헤더들이 표시되어야 한다.", () => {
      // Given
      const props = { columns: testColumns, data: [] };

      // When
      render(<Table {...props} />);

      // Then
      expect(
        screen.getByRole("columnheader", { name: "Name" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("columnheader", { name: "Age" }),
      ).toBeInTheDocument();
    });
  });

  describe("Scenario 3: 데이터가 없는 상태 표시", () => {
    it("Given: 데이터가 비어있을 때, When: 렌더링하면, Then: '데이터가 없습니다.' 메시지가 표시되어야 한다.", () => {
      // Given
      const props = { columns: testColumns, data: [] };

      // When
      render(<Table {...props} />);

      // Then
      expect(screen.getByText("데이터가 없습니다.")).toBeInTheDocument();
    });
  });

  describe("Scenario 4: 데이터가 있는 상태 표시", () => {
    it("Given: 데이터가 존재할 때, When: 렌더링하면, Then: 'cell' 역할의 데이터가 표시되어야 한다.", () => {
      // Given
      const props = { columns: testColumns, data: testData };

      // When
      render(<Table {...props} />);

      // Then
      expect(screen.getByRole("cell", { name: "Alice" })).toBeInTheDocument();
      expect(screen.getByRole("cell", { name: "30" })).toBeInTheDocument();
    });

    it("Given: 데이터가 존재할 때, When: 렌더링하면, But: '데이터가 없습니다.' 메시지는 표시되지 않아야 한다.", () => {
      // Given
      const props = { columns: testColumns, data: testData };

      // When
      render(<Table {...props} />);

      // But (반대 결과)
      expect(screen.queryByText("데이터가 없습니다.")).not.toBeInTheDocument();
    });
  });

  describe("Scenario 5: 로딩 상태 표시 (확장)", () => {
    it("Given: loading=true 상태일 때, When: 렌더링하면, Then: '로딩 중...' 메시지가 표시되어야 한다.", () => {
      // Given
      const props = { columns: testColumns, data: [], loading: true };

      // When
      render(<Table {...props} />);

      // Then
      expect(screen.getByText("로딩 중...")).toBeInTheDocument();
    });

    it("Given: loading=true 상태일 때, When: 렌더링하면, But: 데이터나 '데이터 없음' 메시지는 표시되지 않아야 한다.", () => {
      // Given
      const props = {
        columns: testColumns,
        data: testData, // 데이터가 있어도 로딩이 우선
        loading: true,
      };

      // When
      render(<Table {...props} />);

      // But
      expect(screen.queryByText("데이터가 없습니다.")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("cell", { name: "Alice" }),
      ).not.toBeInTheDocument();
    });
  });
});
