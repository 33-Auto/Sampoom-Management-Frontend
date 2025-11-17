/**
 * Item 엔티티는 Part 엔티티와 동일한 엔드포인트를 사용하므로
 * 중복 핸들러 등록을 피하기 위해 별도의 http 핸들러를 정의하지 않습니다.
 * 필요한 모킹 데이터는 Part 모듈의 핸들러에서 제공됩니다.
 */
export const handlers: never[] = [];
