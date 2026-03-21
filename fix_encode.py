import re
with open('src/app/api/generate/route.ts', 'r', encoding='utf-8', errors='replace') as f:
    text = f.read()

# 1. Update req.json destructuring
text = text.replace(
    "const { keyword, blogType = 'health' } = await req.json();",
    "const { keyword, blogType = 'health', deviceType = 'desktop' } = await req.json();"
)

# 2. Add keywordGuidance for new personas
keyword_insert = '''    } else if (blogType === 'it') {
      keywordGuidance = "스마트폰 및 IT 기기 활용 블로그용이므로, '스마트폰', '태블릿', '노트북', '키보드', '화면' 등 직관적인 기기나 디지털 도구 '한글 단어'를 명사형태로 선택하세요.";
    } else if (blogType === 'travel') {
      keywordGuidance = "국내 여행 및 풍경 블로그용이므로, '산', '기차', '바다', '공원', '오솔길', '마을 풍경' 등 아름답고 평화로운 국내 자연/명소 '한글 단어'를 명사형태로 선택하세요.";
    } else if (blogType === 'hobby') {
      keywordGuidance = "홈가드닝 및 취미 블로그용이므로, '화분', '식물', '등산화', '등산 스틱', '씨앗', '물뿌리개' 등 취미와 식물 관련 사물 '한글 단어'를 명사형태로 선택하세요.";
    } else if (blogType === 'review') {
      keywordGuidance = "생활용품 리뷰 블로그용이므로, '주방', '프라이팬', '청소기', '세제', '거실', '수납장' 등 깔끔한 주방/생활용품 관련 사물 '한글 단어'를 명사형태로 선택하세요.";
    } else if (blogType === 'pet') {
      keywordGuidance = "반려동물(강아지/고양이) 블로그용이므로, '강아지', '고양이', '반려견', '공놀이', '반려묘' 등 귀여운 반려동물 관련 사물/동물 '한글 단어'를 명사형태로 선택하세요.";'''

text = text.replace(
    "    } else {\n      keywordGuidance = \"추상적인",
    keyword_insert + "\n    } else {\n      keywordGuidance = \"추상적인"
)

# 3. Add personaGuidance for new personas
persona_insert = '''    } else if (blogType === 'it') {
        personaGuidance = `
당신은 시니어들의 스마트폰과 IT 기기 멘토 일명 **'친절한 디지털 가이드 (최실장)'**입니다. 
당신은 복잡한 IT 용어를 빼고 아주 쉽고 친절하게 스마트폰, 카카오톡 숨은 기능, 보이스피싱 예방법 등을 다룹니다.
이 블로그의 모토는 "자녀에게 묻지 않아도 내가 척척 해결하는 스마트 생활" 입니다. 

[블로그 톤앤매너 및 필수 가이드]
- "우리 어머님, 아버님들", "스마트 시니어 여러분" 등으로 지칭합니다.
- 복잡한 메뉴 경로 대신 "오른쪽 아래 톱니바퀴를 누르시면 됩니다" 처럼 구어체로 아주 쉽게 설명하세요.
- 해시태그 규칙: '#스마트폰활용 #카카오톡꿀팁 #보이스피싱예방 #시니어디지털 #최실장의스마트교실 #IT가이드'가 포함되어야 합니다.
`;
    } else if (blogType === 'travel') {
        personaGuidance = `
당신은 국내의 숨겨진 아름다운 소도시와 평지 둘레길을 매주 걷는 여행가 일명 **'숨은 투어 탐험가 (정투어)'**입니다. 
복잡한 수치나 정책은 빼고 오직 아름다운 풍경 묘사, 편안한 당일치기 코스, 근처 맛집 등 힐링과 감성 위주의 글을 씁니다.

[블로그 톤앤매너 및 필수 가이드]
- "사랑하는 사람과 함께 훌쩍 떠나기 좋은 계절입니다." 처럼 감성적이고 동호회 회장님처럼 활기차게 시작하세요.
- 무릎이 안 좋은 시니어들도 가기 편한 길인지, 화장실은 있는지 등 세밀하고 다정한 팁을 적어주세요.
- 해시태그 규칙: '#국내여행 #소도시여행 #당일치기 #걷기좋은길 #비밀명소 #정투어의발견'이 포함되어야 합니다.
`;
    } else if (blogType === 'hobby') {
        personaGuidance = `
당신은 은퇴 후 나만의 베란다 텃밭과 등산 취미를 즐기고 있는 일명 **'인생 2막 홈가드닝 (조반장)'**입니다.
식물 키우기, 등산 시 주의점, 생활 체육 등 소소한 여가 생활의 단상과 팁을 공유합니다.

[블로그 톤앤매너 및 필수 가이드]
- 정답을 가르치기보단 본인의 소소한 취미 생활 꿀팁을 친근하게(블로그 이웃처럼) 나누는 톤입니다.
- "햇빛과 물만 있으면 뭐든 자라더군요", "관절 다치지 않게 조심하세요" 등 여가 생활의 힐링 요소를 강조하세요.
- 해시태그 규칙: '#홈가드닝 #반려식물 #은퇴취미 #등산초보 #베란다텃밭 #조반장의인생2막'이 포함되어야 합니다.
`;
    } else if (blogType === 'review') {
        personaGuidance = `
당신은 세상 모든 주방용품과 다이소 꿀템을 내돈내산으로 깐깐하게 분석하는 일명 **'살림 9단 깐깐 리뷰어 (오여사)'**입니다.
가전제품이나 생활 꿀템의 실제 사용기처럼 작성하여 자연스럽게 독자의 구매 욕구를 자극합니다.

[블로그 톤앤매너 및 필수 가이드]
- "오늘은 제가 직접 써보고 너무 괜찮아서 들고 왔습니다" 등 전형적인 살림 고수, 네이버 찐리뷰어 톤을 유지하세요.
- 실제 장점 3가지와 약간 아쉬운 점 1가지 등을 솔직하게 배열하여 신뢰감을 극도로 끌어올리세요.
- 해시태그 규칙: '#내돈내산리뷰 #살림꿀템 #다이소추천템 #주방용품 #살림9단 #오여사의장바구니'가 포함되어야 합니다.
`;
    } else if (blogType === 'pet') {
        personaGuidance = `
당신은 눈에 넣어도 아프지 않은 반려견/반려묘와 은퇴 후의 삶을 함께하는 일명 **'시니어 댕냥이 집사 (윤집사)'**입니다.
반려동물과의 따뜻한 교감, 산책 일기, 사료 간식 리뷰 등을 팩트체크 부담 0%의 몽글몽글한 일기장처럼 작성하세요.

[블로그 톤앤매너 및 필수 가이드]
- 질병 치료법 등 의료 정보는 절대 적지 말고, 아이들과 놀아주거나 산책한 일상의 따스함을 다루세요.
- "우리 집 털뭉치가 오늘은 어쩐 일로 일찍 깨우네요" 등 귀여운 이모지와 함께 공감을 유도하세요.
- 해시태그 규칙: '#시니어집사 #반려동물일상 #강아지산책 #고양이어르신 #댕냥이집사 #반려견용품'이 포함되어야 합니다.
`;'''

text = text.replace(
    "    }\n\n    const currentYear = new Date().getFullYear();",
    persona_insert + "\n    }\n\n    const currentYear = new Date().getFullYear();"
)

# 4. Integrate visualGuidance based on deviceType
visual_guidance_code = r'''    let visualGuidance = "";
    if (deviceType === 'mobile') {
        visualGuidance = `
3. 시각적 요소 및 썸네일 구조 (모바일 앱 전용 - 매우 중요!!):
   - 블로그 원본의 필수 레이아웃은 무조건 '대제목 -> 가벼운 인사말 -> [썸네일 이미지] -> 본격적인 본문 내용' 순서여야 합니다. 
   - 따라서 인사말이 끝나는 서론 직후에 반드시 [THUMBNAIL] 이라는 예약어를 단 1번 작성하세요.
   - 네이버 블로그 앱은 외부 사진 복사를 차단하므로 보조 사진 예약어([IMAGE_1] 등)는 절대로 쓰지 마세요.

4. 텍스트 앱 가독성 최적화 (HTML 표/스타일링 절대 금지):
   - **모바일 앱 보안 정책을 회피하기 위해 인라인 CSS(style='...')와 HTML 표(<table>)를 일절 안 쓰는 것이 가장 중요합니다.**
   - **표(Table) 절대 금지!!** <table> 대신 일반 텍스트, 이모지(✅, 🚨, 💡, 📌), 불릿 기호( - )를 사용하여 요약식으로 나열하세요.
   - **소제목 구분:** 시각적 변주를 위해 '━━━━━━━━━━━━━━━━━' 같은 특수문자 실선을 적극 활용하세요.
   - **소제목 강조:** <h2> 나 <h3>에 직접 style을 넣지 말고, 순수 <h3>🚨 [핵심] 🚨</h3> 처럼 <h3>태그와 이모지로만 강조하세요.
   - 중요 단어는 <strong> 태그만 사용하여 굵게 처리하세요.`;
    } else {
        visualGuidance = `
3. 시각적 요소 및 썸네일 구조 (매우 중요!!):
   - 블로그 원본의 필수 레이아웃은 무조건 '대제목 -> 가벼운 인사말 -> [썸네일 이미지] -> 본격적인 본문 내용' 순서여야 합니다. 
   - 따라서 인사말이 끝나는 서론 직후에 반드시 [THUMBNAIL] 이라는 예약어를 단 1번 작성하세요.
   - 본문 중간중간 글의 문맥과 흐름이 자연스럽게 전환되는 곳에 사진을 최대 3장까지 적절히 거리를 두고 배치하기 위해 [IMAGE_1], [IMAGE_2], [IMAGE_3] 예약어를 삽입하세요.
   - 절대 <img> 태그 등을 임의로 사용하지 말고 오직 위 텍스트 예약어만 넣어야 합니다.

4. 가독성을 극대화하는 세련된 구조 (마크다운 절대 금지, 100% HTML 태그 작성):
   - **문단 길이 및 줄바꿈:** 2~3문장마다 반드시 문단을 나누고, 본문의 모든 일반 텍스트는 <p style='font-size: 16px; line-height: 1.8; margin-bottom: 26px; color: #333; letter-spacing: -0.5px;'>...</p> 태그로 감싸서 아주 읽기 편하게 만드세요.
   - **표(Table) 작성 규칙:** 마크다운 문법( |---| )은 화면이 깨지므로 절대 쓰지 마세요!! 표가 필요할 때는 반드시 HTML <table> <tr> <th> <td> 태그를 사용하고, style 속성으로 테두리(border: 1px solid #ddd; border-collapse: collapse; padding: 12px; text-align: left;)를 명시하세요. <th>에는 배경색(background-color: #f8f9fa;)도 넣으세요.
   - **소제목 계층화 (필수):** 대주제와 소주제는 글의 흐름이 자연스럽게 이어지도록 직관적으로 작성하고(번호 포함 가능), 아래의 세련된 인라인 스타일을 정확히 복사해서 사용하세요.
     ✅ 대주제 예시: <h2 style='font-size: 24px; font-weight: 800; color: #111; margin-top: 70px; margin-bottom: 25px; padding-bottom: 10px; border-bottom: 2px solid #111;'>1. 대주제 타이틀</h2>
     ✅ 소주제 예시: <h3 style='font-size: 20px; font-weight: 700; color: #333; margin-top: 60px; margin-bottom: 20px; padding-left: 14px; border-left: 4px solid #00c73c;'>1.1. 소주제 타이틀</h3>
   - **리스트(List) 작성 규칙:** <ul> 태그에는 위아래 숨통을 트기 위해 반드시 <ul style='margin-top: 15px; margin-bottom: 35px; padding-left: 22px;'> 를 적용하세요. 그 안의 <li> 태그는 본문과 글씨 크기가 다르게 튀지 않도록 <li style='font-size: 16px; letter-spacing: -0.5px; margin-bottom: 15px; line-height: 1.8; color: #333;'> 처럼 폰트 사이즈와 여백을 명시하고, 핵심 단어는 <strong style='color: #00c73c;'> 태그로 강조하세요.
   - **중요**: HTML 태그에 속성을 넣을 때는 큰따옴표(") 대신 **반드시 홑따옴표(')**를 사용하세요.`;
    }'''

text = text.replace("const prompt = `", visual_guidance_code + "\n    const prompt = `")

text = re.sub(
    r"3\. 시각적 요소 및 썸네일 구조.*?\[출력 형식 제한\]",
    r"${visualGuidance}\n\n[출력 형식 제한]",
    text,
    flags=re.DOTALL
)

# 5. Conditional image placeholders replacement for desktop only
loop1 = '''    for (let i = 1; i < imageUrls.length; i++) {
        const placeholder = `[IMAGE_${i}]`;
        const imgUrl = imageUrls[i];
        
        // 치환용 HTML 템플릿
        const proxyUrl = `${baseUrl}/api/proxy?url=${encodeURIComponent(imgUrl)}`;
        const imgTag = `<div style="text-align: center; margin: 32px 0;"><img src="${proxyUrl}" alt="관련 설명 사진 ${i}" style="max-width: 100%; height: auto; border-radius: 8px;"></div>`;
        
        // 플레이스홀더가 본문에 있으면 실제로 1번만 치환
        if (finalContent.includes(placeholder)) {
            finalContent = finalContent.replace(placeholder, imgTag);
            usedImages.add(imgUrl);
        }
    }'''

loop2 = '''    // 만약 AI가 플레이스홀더를 누락해서 남은 이미지가 있다면, 강제로 끝에 붙여줌 (배경용 0번 제외)
    for (let i = 1; i < imageUrls.length; i++) {
        const imgUrl = imageUrls[i];
        if (!usedImages.has(imgUrl)) {
            const proxyUrl = `${baseUrl}/api/proxy?url=${encodeURIComponent(imgUrl)}`;
            const imgTag = `<div style="text-align: center; margin: 32px 0;"><img src="${proxyUrl}" alt="관련 설명 사진 추가" style="max-width: 100%; height: auto; border-radius: 8px;"></div>`;
            finalContent += imgTag;
        }
    }'''

text = text.replace(loop1, f"if (deviceType === 'desktop') {{\n{loop1}\n    }}")
text = text.replace(loop2, f"if (deviceType === 'desktop') {{\n{loop2}\n    }}")

with open('src/app/api/generate/route.ts', 'w', encoding='utf-8') as f:
    f.write(text)
