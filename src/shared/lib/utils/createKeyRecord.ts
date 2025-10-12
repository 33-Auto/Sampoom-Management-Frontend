/**
 * 데이터의 키를 추출하여 객체로 반환
 * @param data - 데이터 배열
 * @returns 키 객체
 * @example
 * const data = [
 *   { id: 1, name: "John" },
 *   { id: 2, name: "Jane" },
 * ];
 * const keys = createKeyRecord(data);
 * console.log(keys); // { id: "id", name: "name" }
 * @returns { Record<keyof T, keyof T> } 키 객체
 * description : 제네릭 T에 대한 명세는 <string, any> 타입의 Record 타입을 확장한 것 받기로함
 * 우리가 평소에 하는 json 타입의 명세는 Record<string, any> 타입과 동일하다
 * typscript의 타입 정의는 말그대로 '타입'에 대한 정의이기 때문에 java와 다르게 똑같지 않아도(상속형식이라던지) 형식만 맞으면
 * 문제없이 컴파일링이됨
 */
export const createKeyRecord = <T extends Record<string, any>>(
  data: T[],
): Record<keyof T, keyof T> => {
  // 데이터가 있으면 0번 째 인덱스의 키를 추출
  // 없으면 빈 객체 반환
  return data.length > 0
    ? (Object.fromEntries(
        Object.keys(data[0]).map((key) => [key, key]),
      ) as Record<keyof T, keyof T>)
    : ({} as Record<keyof T, keyof T>);
};
