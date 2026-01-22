export function getDeviceUuid(): string {
    const STORAGE_KEY = "device_uuid";

    // 1. 로컬 스토리지에서 기존 UUID를 찾아봅니다.
    let uuid = localStorage.getItem(STORAGE_KEY);

    // 2. 없으면 새로 생성.
    if (!uuid) {
        // 최신 브라우저는 crypto.randomUUID()를 지원
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            uuid = crypto.randomUUID();
        } else {
            // 구형 브라우저 호환용 (혹은 uuid 라이브러리 설치 없이 간단 구현)
            uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        // 3. 생성한 UUID를 저장해둡니다. (다음번에도 쓰기 위해)
        localStorage.setItem(STORAGE_KEY, uuid);
    }

    return uuid;
}