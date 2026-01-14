# 1단계: 빌드 (Node.js 이용)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2단계: 실행 (Nginx 이용)
FROM nginx:stable-alpine
# 빌드된 파일(dist 또는 build)을 Nginx 웹 루트로 복사
# Vite를 쓰시면 dist, CRA를 쓰시면 build 폴더입니다.
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx 80포트 개방
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]