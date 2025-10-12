//* 1. Vite가 제공하는 import.meta.glob을 사용하여 handlers.ts 파일들을 동적으로 임포트
const modules = import.meta.glob(
  "/src/{entities,features,pages}/**/mocks/handlers.ts",
  { eager: true }, //** 즉시 임포트
);

//* Object.values() 메소드는 전달된 파라미터 객체가 가지는 (열거 가능한) 속성의 값들로 이루어진 배열을 리턴
export const handlers = Object.values(modules)
  .map((module: any) => module.handlers) //* 배열을 map을 통해서 순회 한다음 각 모듈의 handlers 속성에 접근
  .flat(); //* flat() 메소드는 다차원 배열을 1차원 배열로 평탄화 시켜준다.
