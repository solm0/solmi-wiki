const stopwords = require('stopwords-ko').stopwords;

const customStopwords = [
  '있다', '되다', '싶다', '하다', '내', '더', '그냥', '는', '글들', '보고', '있어야', '있었', '하고',
  '그리', '있는', '것이', '같은', '한다', '않는', '내가', '하지', '만든', '아닌', '이유', '만들', '것도', '있고', '필요',
  '쓰고', '쓰는', '하는', '나는', '글을', '기능', '되었', '싶은', '그릴', '것을', '어떻', '모든', '것은', '해도', '앱을',
  '것을', '그걸', '추상적인', '존재하', '시작할', '서로', '보여주', '대한', '했다', '있게', '때는', '없다', '안다', '물에',
  '인생의', '때우', '시에', '일어났', '30', '들리', '넣고', '사용해', '된다', '시간이라', '페이', '만들었', '제작했습니',
  '들어갈', '가는', '가기', '도착했', '없는', '라는', '없었', '가서', '먹을', '알게', 'solmi', '넣어준','존재하','보면',
  '들었','했습니','있습니','라고','frametoascii','p1','p0','p2','에서'
];
const koreanSuffixes = [
  '은', '는', '이', '가', '을', '를', '에', '에서', '으로', '로', '과', '와', '도', '만',
  '랑', '이랑', '하고', '께', '까지', '부터', '보다', '조차', '마저', '이나', '나',
  '이다', '였다', '되다', '있다', '없다', '싶다', '했', '하고', '했어', '있어야', '어야', '싶어',
  '했는데', '겠', 'ㄴ다', '다', '자', '요', '고', '지', '게', '니까', '는데',
];

const stopwordSet = new Set(stopwords);
const customStopwordSet = new Set(customStopwords);

function cleanToken(token: string): string | null {
  token = token.toLowerCase();

  if (/^\d+$/.test(token)) return null; // 숫자-only 토큰 거르기

  const sortedSuffixes = [...koreanSuffixes].sort((a, b) => b.length - a.length);
  for (const suffix of sortedSuffixes) {
    if (token.endsWith(suffix) && token.length > suffix.length + 1) {
      token = token.slice(0, -suffix.length);
      break;
    }
  }

  if (stopwordSet.has(token) || customStopwordSet.has(token)) {
    return null;
  }

  return token;
}

export default function extractKeyword(
  text: string,
) {
  const regex = /[a-zA-Z0-9]+|[가-힣]+/g;
  const match = text.match(regex) || [];
  const tokens = match
    .filter(w => w.length > 1)
  
  const keywordCounts: Record<string, number> = {};

  for (let rawToken of tokens) {
    const clean = cleanToken(rawToken);
    if (!clean) continue;

    keywordCounts[clean] = (keywordCounts[clean] || 0) + 1;
  }

  const keywords = Object.entries(keywordCounts)
    .sort((a, b) => b[1] - a[1])
    .filter(kw => kw[1] >= 3)
    .slice(0, 6)
    .map(([key]) => key);
  
  return keywords;
}