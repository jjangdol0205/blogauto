import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import crypto from "crypto";

const ai = new GoogleGenAI({});

export const maxDuration = 60; // Vercel 서버리스 함수 타임아웃 최대 연장

export async function POST(req: Request) {
  try {
    let body: any = {};
    try { body = await req.json(); } catch(e) {}
    const { goodUrl, badUrl, bannedKeywords = [], style, coreKeyword } = body;

    let feedbackLearningGuidance = "";
    if (goodUrl || badUrl) {
      feedbackLearningGuidance += `
[개인화된 맞춤형 타겟팅 지침]
사용자가 과거 작성한 블로그 피드백 주소입니다. 이 블로그의 톤앤매너와 주요 주제(니치)를 분석하고, 사용자의 전문 분야에 맞는 트렌드 키워드를 발굴하세요.
`;
      if (goodUrl) feedbackLearningGuidance += `- 성공 사례(이 분야 위주로 발굴): ${goodUrl}\n`;
      if (badUrl) feedbackLearningGuidance += `- 실패 사례(이 분야와 유사한 포괄적 키워드는 배제): ${badUrl}\n`;
    }
    const bannedSection = bannedKeywords.length > 0 
      ? `\n[절대 금지 키워드 (이미 과거에 3번 이상 추출됨)]\n아래 키워드들은 절대로 다시 제안하지 마세요: ${bannedKeywords.join(', ')}\n` 
      : "";

    let prompt = "";
    
    if (style === 'blog2') {
      prompt = `
당신은 네이버 크리에이터 어드바이저 데이터를 완벽히 분석하는 시니어 및 경제/비즈니스 특화 SEO 마스터입니다.
현재 구글 검색(Google Search)을 실시간으로 활용하여, 네이버 블로그 생태계에서 60대 이상 연령층과 비즈니스/경제 관심사를 가진 타겟이 폭발적으로 유입될 수 있는 **'틈새(니치) 황금 롱테일 키워드' 딱 5개**를 발굴해내세요.
${bannedSection}
${feedbackLearningGuidance}

[사용자 지정 핵심 주제]
- 오늘 집중 탐색할 주제: ${coreKeyword ? `"${coreKeyword}"` : "'60대 관심사 및 비즈니스/경제'"}

[크리에이터 어드바이저 기반 타겟 분석 (학습 데이터: 3/28~4/3 실제 급상승 패턴)]
- 경제/증시/원자재: '삼성전자 주가', '터보퀀트 관련주', 'SK하이닉스 미국 상장 호재', '나스닥 하락에도 매수 선택 이유', '코스피 급락 속 국민연금 매수종목', '금값시세 전쟁 속 급락 이유', '미국 이란 전쟁'
- 경제/상식/생활: '미국환율', '홍해 위치', '세계지도', '후티 반군 뜻', '근로자의날 공휴일', '축의금 봉투 쓰는법', '담배값 2026년'
- 비즈니스/부동산/대출: '아크로드서초 로또 분양가', '성북구 2800가구 대출 막힘 사태', '신생아 특례대출', '기초생활수급자 조건 안내'
- 정부 정책/지원금(가장 강력한 후킹): '2026 민생지원금', '소득 하위 70% 금액', '청년월세지원', '청년미래적금', '차상위계층 조건', '거지맵'
- 앱테크/기념일: '기후동행퀴즈', '카카오뱅크 ai퀴즈', '세계제로웨이스트의 날', '종려주일 뜻'
- 60대 라이프스타일/이슈: 
  1. 인물/방송/논란: 이휘재 나락/근황, 故이상보 비보 및 사인 비공개, 샤이니 태민 성형 의혹, 임영웅, 가요무대출연진, 전원주 고관절 수술, 셰프 손종원·박은영 결혼
  2. 스포츠/갈등: 남/녀 배구(정관장 반야 부키리치 트라이아웃, 도로공사 김종민 감독), 축구 국가대표, KIA->두산 실책 연속
  3. 시즈널/레시피/건강: 진해군항제, 고려산 진달래축제, 응봉산 개나리, 닥터신 기본정보, 봄동 겉절이, 파김치 담그는법

[🚨 핵심 미션: 과거 패턴 기반 '조회수 1,000방 이상' 폭발 트렌드 강력 추론 🚨]
- 목표: 이 키워드로 글을 썼을 때 **무조건 조회수 1,000회 이상이 보장될 만큼 폭발적이고 대중적인 수요**가 있어야 합니다. 
- 단순 과거 반복이 아닙니다. 제공된 3/28~4/3의 일주일 치 빅데이터 카테고리(원자재 시세 변화, 앱테크 퀴즈의 주기성, 연예인 논란의 후속 보도, 시즈널 축제 등) 흐름을 날카롭게 분석하세요.
- 이 분석을 바탕으로, **오늘(현재 날짜) 또는 앞으로 며칠 내에 새롭게 트래픽이 터질 '예측 롱테일 키워드'**를 추론하세요.
- 단, 상상으로 지어내는 것은 금지입니다. 추론된 아이디어를 반드시 구글 검색을 통해 '최근 1~2일 내에 실제로 강력한 트래픽이 몰리고 있는 팩트'인지 검증하고 최종 5개를 엄선하세요.
- 너무 포괄적이거나 빈 수레인 키워드(예: '벚꽃놀이')는 버리고, 타겟(60대/경제)이 미친 듯이 클릭할 수밖에 없는 자극적이고 실질적인 롱테일 키워드 5개를 추출하세요.

반드시 아래 JSON 형식으로만 응답하세요. 백틱(\`\`\`)이나 다른 설명은 절대 추가하지 마세요.
{
  "trends": [
    {
      "keyword": "발굴한 롱테일 키워드",
      "reason": "이 키워드가 타겟(60대/경제)에게 왜 매력적인지 분석 (1~2문장)"
    }
  ]
}
`;
    } else {
      prompt = `
당신은 대한민국 상위 0.1% 네이버 블로그 트래픽 마스터(SEO 전문가)입니다.
현재 구글 검색(Google Search)을 실시간으로 적극 활용하여, 오늘 날짜 기준으로 **'단 1건의 포스팅으로 조회수 1,000회 이상'**을 무조건 낼 수 있는, 폭발적이지만 아직 초대형 인플루언서들이 장악하지 않은 **'틈새(니치) 황금 롱테일 키워드' 딱 5개**를 발굴해내세요.
${bannedSection}
${feedbackLearningGuidance}

[🚨 핵심 미션: 할루시네이션(거짓 정보) 절대 금지 및 100% 실존 데이터 발굴 🚨]
- 절대 가상의 지점명, 존재하지 않는 금리(%), 종목명이나 지역 줍줍 일정을 상상해서 지어내지 마세요.
- 반드시 **현재 구글 검색**을 먼저 실행하여, 최근 1~2주 내에 실제 기사나 커뮤니티(뽐뿌, 블로그)에 올라온 **"현재 진행 중이거나 곧 시작하는 100% 실존하는 상품 및 일정"**만 찾아야 합니다.

[🔥 실제 조회수 1,000회 보장형 대폭발 검증 완료 패턴 (집중 공략) 🔥]
다음은 블로그에서 실제로 압도적인 트래픽(수백~1,000방)을 휩쓴 반면, 단순 상식 키워드는 10~300회에 그친 실제 데이터 결과입니다. 1,000회 이상을 무조건 보장하는 아래 **'선착순/한정판/돈 복사' 패턴**만 구글링하세요.
1. **(1,000방 타겟 1순위) 특정 지점 한정 고금리 특판 예적금 & 개인투자용 국채:**
   - 대박 사례: "새마을금고 4% 비대면 특판 예금" (1,027회), "은행원도 챙기는 개인투자용 국채 3년물" (197회)
   - 조건: 실존하는 'OO신협/새마을금고 특판(비대면)' 혹은 현재 발행/청약 중인 확정 수익형 국채/채권.
2. **(1,000방 타겟 2순위) 핵심 지역 무순위 줍줍 / 로또 청약:**
   - 대박 사례: "서울 무순위 줍줍 99%가 놓치는 비밀" (191회), "분당 더샵 센트르 줍줍" (127회)
   - 조건: 수도권 알짜 입지에서 실제로 진행되는 무순위/계약취소분 청약 단지명 필수.
3. **(1,000방 타겟 3순위) 타겟 밀착형 선착순 지원금 / 수수료 전액 면제:**
   - 대박 사례: "제로페이 온누리상품권 10% 할인" (378회), "증권사 수수료 0원 최저가 비교" (289회)
   - 조건: 예산 소진 시 마감되는 지역화폐/상품권 혜택이나 파격적인 수수료 면제 이벤트.

[❌ 절대 금지: 10~300따리 애매한 조회수 키워드 (조회수 1,000방 불가) ❌]
- 최근 성적표 분석 결과, **'대상포진 예방접종 무료', '국민연금 조기수령', '설날 신권 교환', '명절 통행료 무료', '건보료 폭산 피하기'** 등 누구나 아는 뻔한 상식이나 일반 건강/명절 정보는 최대 100~300회 조회수에 그쳤습니다.
- **절대 위와 같은 일반 상식, 원론적인 연금 정보, 흔한 계절성 키워드를 도출하지 마세요.** 오로지 독자가 "당장 내일 마감이야! 안 하면 수백만 원 손해!"라며 미친 듯이 클릭할 수밖에 없는 파격적인 **'특판 / 줍줍 / 선착순 지원금'**만 엄선하세요.

반드시 아래 JSON 형식으로만 응답하세요. 백틱(\`\`\`)이나 다른 설명은 절대 추가하지 마세요.
{
  "trends": [
    {
      "keyword": "발굴한 롱테일 키워드 (예: 대구 에이스새마을금고 3.99% 예금 특판)",
      "reason": "왜 이 키워드가 일반 상식과 달리 지금 즉각적으로 1,000회 이상의 대폭발을 당길 수 있는지에 대한 분석"
    }
  ]
}
`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.8,
        tools: [{ googleSearch: {} }]
      },
    });

    let trends = [];
    try {
      const jsonStr = response.text?.replace(/```json/g, '').replace(/```/g, '').trim() || '{"trends":[]}';
      const parsed = JSON.parse(jsonStr);
      trends = parsed.trends || [];
      
      // 개수 제한 (만약 5개 이상이면 자름)
      trends = trends.slice(0, 5);
      
    } catch (e: any) {
      console.error("Gemini JSON parse failed, text was:", response.text);
      return NextResponse.json({ error: `AI가 트렌드를 분석하는 중 오류가 발생했습니다: JSON 형태가 아닙니다. (${e.message})` }, { status: 500 });
    }

    // 네이버 검색광고 API로 정확한 트래픽(월간 검색량) 조회
    const customerId = process.env.NAVER_AD_CUSTOMER_ID;
    const accessLicense = process.env.NAVER_AD_ACCESS_LICENSE;
    const secretKey = process.env.NAVER_AD_SECRET_KEY;

    if (customerId && accessLicense && secretKey && trends.length > 0) {
      const timestamp = Date.now().toString();
      const method = "GET";
      const path = "/keywordstool";
      const signature = crypto.createHmac("sha256", secretKey).update(`${timestamp}.${method}.${path}`).digest("base64");

      // Naver keyword hint accepts comma separated, max 5
      const hintKeywords = trends.map((t: any) => t.keyword.replace(/\s+/g, '')).slice(0, 5).join(',');
      const apiUrl = `https://api.naver.com${path}?hintKeywords=${encodeURIComponent(hintKeywords)}&showDetail=1`;

      const naverRes = await fetch(apiUrl, {
        method: "GET",
        headers: { 'X-Timestamp': timestamp, 'X-API-KEY': accessLicense, 'X-Customer': customerId, 'X-Signature': signature }
      });

      if (naverRes.ok) {
        const naverData = await naverRes.json();
        const keywordList = naverData.keywordList || [];
        
        // 맵핑: AI가 생성한 키워드의 띄어쓰기를 없앤 버전으로 네이버 결과 매칭
        trends = trends.map((t: any) => {
          const rawKw = t.keyword.replace(/\s+/g, '');
          const match = keywordList.find((k: any) => k.relKeyword === rawKw);
          if (match) {
             const pc = typeof match.monthlyPcQcCnt === 'string' && match.monthlyPcQcCnt.includes('<') ? 5 : (parseInt(match.monthlyPcQcCnt) || 0);
             const mob = typeof match.monthlyMobileQcCnt === 'string' && match.monthlyMobileQcCnt.includes('<') ? 5 : (parseInt(match.monthlyMobileQcCnt) || 0);
             t.monthlyTotalCnt = pc + mob;
          } else {
             t.monthlyTotalCnt = 0; // 네이버 데이터베이스에 아직 없거나 너무 적음
          }
          return t;
        });
      }
    }

    return NextResponse.json({ trends });

  } catch (error: any) {
    console.error("Agent Trend Error:", error);
    return NextResponse.json({ error: `트렌드 마이닝 중 오류가 발생했습니다: ${error?.message || '알 수 없는 오류'}` }, { status: 500 });
  }
}
