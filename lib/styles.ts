// 문체 카테고리 카탈로그 (80종) — 온보딩 선택 UI용.
// 작풍 가이드(프롬프트)는 server/lib/styles.ts에 있다.
// 두 파일의 키는 scripts/check-styles.mjs로 동기화를 검증한다.

export interface StyleOption {
  value: string;
  label: string;
  description: string;
}

export interface StyleGroup {
  group: string;
  styles: StyleOption[];
}

export const STYLE_GROUPS: StyleGroup[] = [
  {
    group: '한국 웹소설',
    styles: [
      { value: 'kr_webnovel', label: '한국 웹소설식', description: '카카오페이지 정통 회귀물 — 단문과 절단신공' },
      { value: 'novelpia', label: '노벨피아식', description: '사이다 폭주 — 빠른 전개, 시원한 응징' },
      { value: 'munpia', label: '문피아식', description: '묵직한 정통파 — 차곡차곡 쌓는 성장 서사' },
      { value: 'kr_romance_fantasy', label: '로판식', description: '로맨스 판타지 — 황실과 사교계, 운명적 만남' },
      { value: 'kr_hunter', label: '헌터물', description: '게이트와 각성 — 레벨업과 랭킹의 쾌감' },
      { value: 'kr_martial', label: '신무협', description: '한국식 무협 — 협과 정, 통쾌한 무공' },
      { value: 'kr_academy', label: '아카데미물', description: '입학부터 수석까지 — 시험·대련·서열전' },
      { value: 'kr_villainess', label: '악역 영애물', description: '파멸 플래그 회피 — 소설 속 악역으로 빙의' },
      { value: 'kr_office', label: '오피스 현실물', description: '사내 정치와 승진 — 직장인의 회귀 생존기' },
      { value: 'kr_thriller', label: '한국형 스릴러', description: '서늘한 복선과 반전 — 숨 막히는 추적' },
    ],
  },
  {
    group: '일본',
    styles: [
      { value: 'light_novel', label: '라노벨식', description: '가볍고 유쾌하게 — 대사와 츳코미 중심' },
      { value: 'isekai', label: '이세계 전생물', description: '치트 능력과 스테이터스 창 — 전생 판타지' },
      { value: 'shonen', label: '소년만화식', description: '우정·노력·승리 — 뜨거운 성장 배틀' },
      { value: 'seinen', label: '세이넨 누아르', description: '어른의 어둠 — 건조하고 묵직한 심리극' },
      { value: 'slice_of_life', label: '일상물', description: '소소한 행복 — 잔잔한 디테일의 미학' },
      { value: 'naro', label: '나로우식', description: '소설가가 되자 — 담백한 1인칭 모험록' },
      { value: 'visual_novel', label: '미연시식', description: '루트와 호감도 — 선택지가 운명을 가른다' },
      { value: 'jrpg', label: 'JRPG식', description: '퀘스트와 파티 — 모험의 왕도 전개' },
      { value: 'haruki', label: '무라카미풍', description: '고독한 독백과 재즈 — 상실의 문학' },
      { value: 'sekai', label: '세카이계', description: '너와 나, 그리고 세계의 끝 — 거대한 감정' },
    ],
  },
  {
    group: '미국·서구',
    styles: [
      { value: 'us_hero', label: '마블 히어로식', description: '시네마틱 액션 — 위트 있는 농담과 스케일' },
      { value: 'dc_dark', label: 'DC 다크 히어로식', description: '어둠의 기사 — 비장하고 무거운 영웅 서사' },
      { value: 'hollywood_action', label: '할리우드 블록버스터', description: '폭발과 추격 — 쉴 틈 없는 스펙터클' },
      { value: 'noir', label: '하드보일드 누아르', description: '비 내리는 뒷골목 — 건조한 독백의 탐정' },
      { value: 'sitcom', label: '미국 시트콤식', description: '프렌즈처럼 — 티키타카와 상황 코미디' },
      { value: 'ya_novel', label: 'YA 소설식', description: '헝거게임처럼 — 청춘의 선택과 저항' },
      { value: 'stephen_king', label: '킹 스타일 호러', description: '일상에 스며드는 공포 — 서서히 조여온다' },
      { value: 'scifi_golden', label: '정통 SF', description: '아시모프처럼 — 아이디어와 사고실험' },
      { value: 'space_opera', label: '스페이스 오페라', description: '은하를 무대로 — 장대한 우주 모험' },
      { value: 'western', label: '서부극', description: '석양의 결투 — 황야의 무법자' },
    ],
  },
  {
    group: '중화·아시아',
    styles: [
      { value: 'wuxia', label: '정통 무협', description: '강호와 문파 — 의리와 검의 세계' },
      { value: 'xianxia', label: '선협물', description: '수련과 등선 — 경지를 돌파하는 불로의 길' },
      { value: 'murim', label: '무림 회귀물', description: '천하제일인의 두 번째 삶 — 환골탈태' },
      { value: 'cn_webnovel', label: '중국 웹소설식', description: '갱신문 스타일 — 호쾌한 먼치킨 행보' },
      { value: 'hk_action', label: '홍콩 느와르', description: '의리와 배신 — 총성 속의 형제애' },
      { value: 'bollywood', label: '발리우드식', description: '운명과 가족 — 화려하고 극적인 감정' },
    ],
  },
  {
    group: '장르',
    styles: [
      { value: 'romance', label: '로맨스', description: '설렘과 갈등 — 두 사람의 온도' },
      { value: 'pure_romance', label: '순애물', description: '한 사람만을 — 절절하고 올곧은 사랑' },
      { value: 'fantasy_epic', label: '에픽 판타지', description: '반지의 제왕처럼 — 장대한 세계와 여정' },
      { value: 'dark_fantasy', label: '다크 판타지', description: '잔혹한 세계 — 희망은 비싸다' },
      { value: 'urban_fantasy', label: '어반 판타지', description: '도시 속 이능 — 현실과 비일상의 경계' },
      { value: 'mystery', label: '추리물', description: '단서와 트릭 — 진상을 향한 두뇌전' },
      { value: 'courtroom', label: '법정물', description: '이의 있습니다 — 논리와 정의의 공방' },
      { value: 'medical', label: '메디컬', description: '수술실의 긴장 — 생명을 다루는 손' },
      { value: 'cooking', label: '요리물', description: '한 접시의 드라마 — 미각의 승부' },
      { value: 'sports', label: '스포츠물', description: '땀과 역전 — 코트와 그라운드의 청춘' },
      { value: 'music', label: '음악물', description: '무대와 데뷔 — 소리로 증명하는 재능' },
      { value: 'game_streamer', label: '게임 스트리머물', description: '랭커의 귀환 — 방송과 채팅창의 열기' },
      { value: 'entertainment', label: '연예계물', description: '재데뷔의 기회 — 카메라 앞의 인생 2회차' },
      { value: 'stock_money', label: '재벌·투자물', description: '미래 시세를 아는 자 — 부의 설계' },
      { value: 'war_strategy', label: '전쟁 전략물', description: '지휘관의 한 수 — 전장의 체스' },
      { value: 'zombie_apocalypse', label: '좀비 아포칼립스', description: '무너진 세상 — 생존자의 기록' },
      { value: 'survival', label: '서바이벌', description: '데스게임 — 살아남는 자가 강하다' },
      { value: 'horror_occult', label: '오컬트 호러', description: '금기와 의식 — 등 뒤의 무언가' },
      { value: 'heist', label: '하이스트물', description: '완벽한 한탕 — 팀플레이와 반전' },
      { value: 'kaiju', label: '괴수물', description: '거대한 그림자 — 도시를 덮는 공포' },
    ],
  },
  {
    group: '톤·문체',
    styles: [
      { value: 'comedy', label: '코미디', description: '웃음이 먼저 — 가볍고 경쾌한 소동극' },
      { value: 'black_comedy', label: '블랙 코미디', description: '쓴웃음의 미학 — 풍자와 아이러니' },
      { value: 'tearjerker', label: '최루성 신파', description: '눈물 버튼 — 가슴을 적시는 이야기' },
      { value: 'healing', label: '힐링물', description: '괜찮아, 잘했어 — 따뜻한 위로의 서사' },
      { value: 'philosophical', label: '철학적 사색', description: '삶이란 무엇인가 — 질문하는 이야기' },
      { value: 'poetic', label: '시적 서정', description: '문장이 풍경이 되는 — 서정적 묘사' },
      { value: 'minimalist', label: '미니멀리즘', description: '헤밍웨이처럼 — 군더더기 없는 단문' },
      { value: 'classic_literature', label: '고전 문학체', description: '격조 있는 문장 — 근대 소설의 향기' },
      { value: 'fairy_tale', label: '동화체', description: '옛날 옛적에 — 어른을 위한 동화' },
      { value: 'diary', label: '일기체', description: '오늘의 기록 — 내밀한 고백' },
      { value: 'epistolary', label: '서간체', description: '부치지 못한 편지 — 편지로 쓰는 이야기' },
      { value: 'documentary', label: '다큐멘터리체', description: '담담한 관찰 — 사실적 기록의 힘' },
      { value: 'mockumentary', label: '모큐멘터리', description: '더 오피스처럼 — 카메라를 보는 능청' },
      { value: 'satire', label: '풍자체', description: '세태를 꼬집다 — 날카로운 해학' },
    ],
  },
  {
    group: '형식·매체',
    styles: [
      { value: 'movie_script', label: '시나리오체', description: '각본처럼 — 장면 지시문과 대사' },
      { value: 'kdrama', label: 'K-드라마식', description: '엔딩 직전의 멈춤 — 16부작의 호흡' },
      { value: 'webtoon', label: '웹툰 콘티식', description: '컷과 효과음 — 만화적 연출' },
      { value: 'anime', label: '애니메이션 연출', description: '오프닝이 들리는 — 극장판 스케일' },
      { value: 'stage_play', label: '연극 희곡체', description: '무대 위 독백 — 막과 장의 드라마' },
      { value: 'radio_drama', label: '라디오 드라마', description: '소리로만 — 목소리와 효과음의 상상력' },
      { value: 'interactive_chat', label: '채팅 소설식', description: '카톡 화면처럼 — 메시지로 진행' },
      { value: 'sns_thread', label: 'SNS 스레드식', description: '타래로 읽는 — 실시간 게시글 형식' },
      { value: 'news_report', label: '뉴스 보도체', description: '속보입니다 — 기사와 인터뷰 형식' },
      { value: 'podcast', label: '팟캐스트식', description: '심야 방송처럼 — 진행자의 입담' },
    ],
  },
];

export const ALL_STYLES: StyleOption[] = STYLE_GROUPS.flatMap((g) => g.styles);

export const STYLE_LABELS: Record<string, string> = Object.fromEntries(
  ALL_STYLES.map((s) => [s.value, s.label]),
);

export const DEFAULT_STYLE = 'kr_webnovel';
