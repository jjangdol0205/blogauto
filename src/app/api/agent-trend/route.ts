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
당신은 대한민국 상위 0.1% 네이버 블로그 메가 트래픽 마스터(SEO 전문가)이자, **'60대 및 비즈니스/경제 특화 메가 블로그'**를 운영하는 총괄 편집장입니다.
현재 이 블로그(두 번째 블로그)의 궁극적인 목표는 **'일 방문자 5만 명 이상 달성 (네이버 메인/홈판 장악)'**입니다.
이를 위해 철저히 **[크리에이터 어드바이저 데이터]**와 **[60대/경제 타겟]**에 기반하되, 매번 나오는 비슷한 키워드는 배제하고 추천 범위를 획기적으로 넓혀 한방에 **조회수 5만 이상이 찍힐 수 있는 완전히 새롭고 폭발적인 메가 트렌드 롱테일 키워드 5개**를 발굴해야 합니다.
${bannedSection}
${feedbackLearningGuidance}

[사용자 지정 핵심 주제]
- 오늘 집중 탐색할 주제: ${coreKeyword ? `"${coreKeyword}"` : "'60대 관심사 및 비즈니스/경제'"}

[크리에이터 어드바이저 기반 타겟 분석 (학습 데이터: 4월 10일 최신 급상승 패턴)]
- 경제/증시/부동산: '광통신 관련주', '구리 관련주', '대우건설', '시도그룹', '대한광통신', '삼성전자 주가/배당금', '오티에르 반포 청약', '강동헤리티지자이', '임장 뜻'
- 경제/생활/할인가: '기후동행카드', 'kfc 1+1', '청주 빽다방', '옆커폰 퀴즈/정답'
- 비즈니스/계좌/대출: 'ISA 계좌', '청년도약계좌', '2026 민생지원금', '청년미래적금'
- 60대 라이프스타일/이슈: 
  1. 이슈/방송/가십: '김진', '김진 논설위원', '김진 사망/앵커/프로필', '윤여정 아들 유튜브 출연', '이종범 복귀 현역 언급', '심형탁 아들 하루 헤어컷'
  2. 인물: '김창민감독', '박상용 검사 프로필', '김지미 특검보'
  3. 시즌/관광지: '태안 튤립축제', '비슬산 참꽃축제', '강진 남미륵사'
  4. 생활/레시피: '대기 중 이산화탄소 농도', '파김치/쪽파김치 담그는법', '머위나물무침', '오이소박이 레시피', '방풍나물/취나물 무침'
  5. 스포츠/기타: '정호영 정관장 이적', '이정후 샌프란시스코'

[🔥 두 번째 블로그 실제 상위 노출 증명 데이터 (가장 반응이 좋았던 최근 제목들) 🔥]
1. 2026년 국민연금 개혁 확정, 60대 수령액 역대급 인상?
2. 60대라면 '이것' 모르면 매년 200만원 땅에 버립니다!
3. 온누리상품권 10% 할인 4월 종료 임박? 예산 소진 전...
4. OO새마을금고 5% 특판? 2026년 오늘 마감 전에 진짜...
* (특징): 시니어/60대들이 '연금, 지원금, 상품권, 특판금리' 등 자신들의 지갑(돈)과 직결되는 아주 구체적인 '재정적 이슈'에 폭발적으로 반응합니다.

[🚨 두 번째 블로그(Blog2) 핵심 미션: 일방문 5만 달성을 위한 60대/경제 분야 메가 트래픽 능동 추론 🚨]
- 방향성: 매번 똑같은 주제(단순 레시피나 뻔한 프로필)만 돌려쓰는 것을 극도로 경계하십시오. **추천 범위를 크게 넓혀 다양한 카테고리(정부 정책, 시니어 핫이슈, 로또급 재테크 정보, 전국민적 호기심 등)에서 조회수 5만을 터트릴 메가 트렌드**를 타겟팅합니다.
- 능동적 추론: 제공된 4월 10일 데이터 흐름을 읽고, **오늘 혹은 내일 당장 메인 포털을 장식할 만한 '전 국민 혹은 수백만 60대가 집중할 신규 예측 메가 키워드'**를 추론하세요. 
- 단, 상상으로 지어내는 것은 금지입니다. 구글 검색을 통해 '최근 실시간으로 강력한 트래픽이 발생하고 있는지' 검증하고 최종 5개를 엄선하세요.
- 매번 추천하던 키워드와 겹치지 않는, **범위가 훨씬 넓고 새로우면서도 클릭을 유발할 수밖에 없는 자극적인 롱테일 5개**를 추출하세요.

반드시 아래 JSON 형식으로만 응답하세요. 백틱(\`\`\`)이나 다른 설명은 절대 추가하지 마세요.
{
  "trends": [
    {
      "keyword": "조회수 5만 이상이 가능한 새롭고 넓은 범위의 폭발적 롱테일 키워드",
      "reason": "이 키워드가 왜 기존과 다르게 5만 뷰 이상을 끌어올 수 있으며, 60대/경제 타겟을 강렬하게 사로잡을 수 있는지(1~2문장)"
    }
  ]
}
`;
    } else {
      prompt = `
당신은 대한민국 상위 0.1% 네이버 블로그 메가 트래픽 마스터(SEO 전문가)입니다.
현재 이 블로그(첫 번째 블로그)는 일 방문자 7,000~8,000명 수준이며, 우리의 새로운 목표는 **'일 방문자 5만 명 이상 (네이버 메인/홈판 노출)'**이라는 압도적인 트래픽을 달성하는 것입니다.
현재 구글 검색(Google Search)을 실시간으로 활용하여, **네이버 홈판 경제/사회/생활 탭에 올라갈 수 있을 만큼 전국민적인 폭발력을 가진 '메가 황금 트렌드/롱테일 키워드' 딱 5개**를 능동적으로 추론하고 발굴해내세요.
${bannedSection}
${feedbackLearningGuidance}

[🚨 첫 번째 블로그(Blog1) 핵심 미션: 일방문 5만 달성을 위한 초강대국급 네이버 메인 타겟팅 🚨]
- 방향성: 자잘한 100~300따리 정보는 쳐다보지도 않습니다. 하루 포스팅으로 최소 3,000~5,000회 이상의 폭발적 뷰를 뽑아야 합니다. 즉, **전 국민적 관심사(메가 어그로, 초대형 정책/이슈, 역대급 청약, 미친 특판, 핫이슈 재테크 등)**만 발굴합니다.
- 다양성 확보 (매우 중요): 매번 '예적금 특판'과 '청약 줍줍'만 반복해서 추천하는 오류를 범하지 마십시오. 추천 범위를 획기적으로 넓혀서, **정치/경제발 초대형 정부 지원, 전국민이 분노/열광하는 당면한 경제 이슈 등 새로운 관점의 5만 뷰 타겟팅 키워드**를 적극 포함하세요.
- 능동적 추론 (홈판 선점): 단순히 오늘 뻔한 이슈를 찾는 걸 넘어, 내일이나 모레 **네이버 홈판 메인에 무조건 걸릴 수밖에 없는 이슈**를 스스로 추론하고 검색으로 팩트체크하여 먼저 선점하세요. 가상의 정보(지점명, 금리 등)는 절대 지어내지 않습니다.

[🔥 첫 번째 블로그 실제 상위 노출 증명 데이터 (가장 반응이 좋았던 최근 제목들) 🔥]
1. OO새마을금고 5.0% 특판? 팩트체크 후 지금 당장 가입... (조회수 1,470회 압도적 1위)
2. 아직도 3%대 예금 찾으세요? 99%가 모르는 송파구 새마을금고... (조회수 750회)
3. 과천 디에트르 퍼스티지 줍줍, 딱 6세대! 10억 로또 청약... (조회수 308회)
4. 동탄역 대방 엘리움 더 시그니처 줍줍? 아직도 모르셨나... (조회수 294회)
* (분석): 방대한 모수(전국민)가 직접적인 '고수익(5% 이상 특판)'이나 '확실한 차익(10억 로또 줍줍)'에 가장 민감하게 반응합니다. 이 성공 패턴을 벤치마킹하되, **동일한 주제(은행/부동산)만 반복하지 말고, 이만큼 강력한 유인력을 가진 다른 분야(예: 전국민 대상 초대형 환급, 역대급 통신/생활비 절감 이슈 등)의 키워드**도 과감히 발굴하세요.

반드시 아래 JSON 형식으로만 응답하세요. 백틱(\`\`\`)이나 다른 설명은 절대 추가하지 마세요.
{
  "trends": [
    {
      "keyword": "조회수 5만 이상 폭발력이 기대되는 새롭고 넓은 범위의 메가 키워드",
      "reason": "왜 이 키워드가 기존(특판/줍줍 집중)의 한계를 깨고 5만 뷰 이상을 달성할 수 있는지(어떤 추론을 거쳤는지) 1~2문장 분석"
    }
  ]
}
`;
    }

    let response;
    // 2.5 버전이 터졌을 경우, 가장 우수하고 안정적인 gemini-pro-latest를 최우선 투입합니다
    const fallbackModels = ["gemini-2.5-flash", "gemini-pro-latest", "gemini-flash-latest"];
    let attempt = 0;

    while (attempt < fallbackModels.length) {
      try {
        const currentModel = fallbackModels[attempt];
        
        // 마지막 최후의 보루 시도 시, 구글 검색 도구가 503 원인일 수 있으므로 검색 툴을 제거합니다.
        const currentConfig: any = {
           systemInstruction: "당신은 트렌드를 분석하는 AI입니다. 구글 검색 과정이나 원본 검색 데이터({'title': ...} 형태)를 절대 출력하지 마세요. 오직 사용자가 요청한 JSON 형식 문서만 출력해야 합니다.",
           temperature: 0.95, // 온도를 높여 더욱 다양하고 창의적인 키워드 도출 유도
        };
        if (attempt < fallbackModels.length - 1) {
           currentConfig.tools = [{ googleSearch: {} }];
        }

        response = await ai.models.generateContent({
          model: currentModel,
          contents: prompt,
          config: currentConfig,
        });
        break; // 성공 시 탈출
      } catch (err: any) {
        attempt++;
        const is503 = err?.status === 503 || err?.message?.includes('503') || err?.message?.includes('high demand') || err?.message?.includes('UNAVAILABLE');
        const is429 = err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('quota');
        
        if ((is503 || is429) && attempt < fallbackModels.length) {
           console.warn(`[Agent-Trend] 503/429 Error on ${fallbackModels[attempt-1]}. Waiting 2.5s before fallback to ${fallbackModels[attempt]}...`);
           await new Promise(resolve => setTimeout(resolve, 2500));
           continue; 
        } else {
           if (attempt >= fallbackModels.length) {
             throw new Error('현재 구글 AI 서버에 전 세계적인 과부하가 발생하여 모든 모델이 지연되고 있습니다. 1~2분 뒤에 다시 시도해주세요.');
           }
           throw new Error(err?.message || '알 수 없는 오류');
        }
      }
    }

    if (!response) {
      throw new Error('AI 응답을 받지 못했습니다.');
    }

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
