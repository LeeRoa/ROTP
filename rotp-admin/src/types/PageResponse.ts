// 어떤 데이터(T)가 와도 페이징 형식을 유지할 수 있도록 제네릭<T>을 사용합니다.
export interface PageResponse<T> {
  content: T[];          // 실제 리스트 데이터 (예: OtpUserResponse[])
  totalPages: number;    // 전체 페이지 수
  totalElements: number; // 전체 아이템 수
  size: number;          // 페이지 크기
  number: number;        // 현재 페이지 (0부터 시작)
}