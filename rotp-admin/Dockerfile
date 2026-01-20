# 1. 빌드 단계 (이미 완료되었다면 생략 가능)
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. 실행 단계 (Nginx)
FROM nginx:stable-alpine
# 빌드된 결과물을 복사 (경로는 프로젝트 설정에 따라 dist 또는 build일 수 있음)
COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]