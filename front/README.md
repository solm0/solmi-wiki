# 글/웹사이트 수정
/back/keystone `npm run dev`
/front `npm run dev`

# 빌드
/back/keystone `npm run dev`
/front `npx vercel@latest pull --environment=production` `npx vercel@latest build --prod` `npx vercel@latest deploy --prebuilt --prod`