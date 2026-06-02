# 글/웹사이트 수정
/back `npm run dev`
/front `npm run dev`

# 빌드
/back `npm run dev`
/front `npx vercel@latest pull --environment=production` `npx vercel@latest build --prod`
`npx vercel@latest deploy --prebuilt --prod`...가 아니고
`npx vercel deploy --prebuilt --prod --archive=tgz`