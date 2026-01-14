# 1. 실행 환경 설정 (Java 17 사용 시)
FROM eclipse-temurin:17-jdk-jammy

# 2. 내 컴퓨터의 jar 파일을 컨테이너 안의 app.jar라는 이름으로 복사
COPY build/libs/*.jar app.jar

# 3. 컨테이너가 켜질 때 실행할 명령어
ENTRYPOINT ["java", "-jar", "/app.jar"]