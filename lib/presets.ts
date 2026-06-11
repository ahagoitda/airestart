import type { PresetScenario } from '@/types';

// 무료 유저용 프리셋 시나리오.
// 본문의 {name}은 플레이 시 사용자 이름으로 치환된다.

const scenario1: PresetScenario = {
  id: 'preset-office-first-love',
  title: '두 번째 인생',
  description: '평범한 회사원이 고등학교 2학년으로 회귀한다. 이번엔 다르게 살 수 있을까?',
  totalEpisodes: 3,
  startNodeId: 'ep1',
  nodes: {
    ep1: {
      id: 'ep1',
      episodeNumber: 1,
      title: '회귀의 순간',
      isEnding: false,
      content: `{name}은(는) 눈을 떴다.

익숙한 천장. 창문 너머로 들리는 운동장의 함성. 칠판 위에 붙은 급훈 — '성실'.

고등학교 2학년 교실이다.

손등을 꼬집어봤다. 아프다. 꿈이 아니다.

전생의 기억이 선명하다. 10년 후, {name}은(는) 야근에 찌든 회사원이었다. 매일 같은 지하철, 같은 자리, 같은 한숨. 그리고 끝내 전하지 못한 한마디.

앞자리에 앉은 박서연의 뒷모습이 보인다. 졸업식 날, 끝내 고백하지 못했던 첫사랑. 10년 내내 가슴 한구석에 박혀 있던 그 이름.

"이번엔... 다르게 살 거야."

심장이 뛴다. 두 번째 인생이 시작됐다.`,
      choices: [
        {
          id: 'ep1-a',
          text: '앞자리의 박서연에게 말을 건다',
          nextNodeId: 'ep2a',
          isPremium: false,
        },
        {
          id: 'ep1-b',
          text: '일단 교실 분위기를 살핀다',
          nextNodeId: 'ep2b',
          isPremium: false,
        },
        {
          id: 'ep1-c',
          text: '전생의 기억을 노트에 정리한다',
          isPremium: true,
        },
      ],
    },
    ep2a: {
      id: 'ep2a',
      episodeNumber: 2,
      title: '첫사랑과의 재회',
      isEnding: false,
      content: `"저기, 서연아."

목소리가 떨렸다. 10년 만에 부르는 이름인데, 입에서는 어제도 불렀던 것처럼 자연스럽게 흘러나왔다.

박서연이 돌아봤다. 기억보다 앳된 얼굴. 기억보다 맑은 눈.

"응? 무슨 일이야?"

전생의 {name}이(가) 결국 하지 못했던 게 바로 이거였다. 말을 거는 것. 고작 이 한마디가 10년을 갈랐다.

"아니, 그... 어제 수학 숙제 있었나 해서."

서연이 피식 웃었다. "너 어제도 물어봤잖아. 47페이지."

아, 맞다. 회귀 전날의 기억까지는 정리가 안 됐다. 하지만 상관없다. 서연이 웃었다. 전생에서는 멀리서만 훔쳐봤던 그 웃음이, 지금 {name}을(를) 향하고 있다.

"고마워. 그리고... 오늘 끝나고 시간 돼?"

말이 먼저 튀어나왔다. 서연의 눈이 살짝 커졌다.`,
      choices: [
        {
          id: 'ep2a-a',
          text: '"같이 떡볶이 먹으러 갈래?" 솔직하게 다가간다',
          nextNodeId: 'ep3a',
          isPremium: false,
        },
        {
          id: 'ep2a-b',
          text: '"아니다, 별거 아니야." 한 발 물러선다',
          nextNodeId: 'ep3a',
          isPremium: false,
        },
        {
          id: 'ep2a-c',
          text: '전생의 기억으로 서연의 비밀을 언급한다',
          isPremium: true,
        },
      ],
    },
    ep2b: {
      id: 'ep2b',
      episodeNumber: 2,
      title: '관찰자의 시간',
      isEnding: false,
      content: `서두르지 말자. {name}은(는) 천천히 교실을 둘러봤다.

10년 전의 교실이 새삼 낯설다. 창가에서 떠드는 무리, 엎드려 자는 녀석, 이어폰을 끼고 문제집을 푸는 반장. 그리고 그중에 — 김태현.

전생의 기억이 스친다. 가장 친한 친구였던 태현. 그리고 졸업 후, {name}의 아이디어를 가로채 먼저 창업했던 태현. 배신을 눈치챈 건 모든 게 끝난 뒤였다.

지금의 태현은 아무것도 모른 채 {name}을(를) 향해 손을 흔들고 있다.

"야, {name}! 점심에 농구 할 거지?"

웃는 얼굴. 저 웃음 뒤에 무엇이 자라게 될지, 지금의 {name}만이 안다.

미래를 안다는 것. 그것은 무기이자 저주였다. 무엇을 바꾸고, 무엇을 그대로 둘 것인가.

종이 울렸다. 두 번째 인생의 첫 수업이 시작된다.`,
      choices: [
        {
          id: 'ep2b-a',
          text: '태현과 예전처럼 지내며 지켜본다',
          nextNodeId: 'ep3b',
          isPremium: false,
        },
        {
          id: 'ep2b-b',
          text: '이번 생에서는 거리를 둔다',
          nextNodeId: 'ep3b',
          isPremium: false,
        },
        {
          id: 'ep2b-c',
          text: '미래의 사업 아이디어를 먼저 기록해둔다',
          isPremium: true,
        },
      ],
    },
    ep3a: {
      id: 'ep3a',
      episodeNumber: 3,
      title: '선택의 결과',
      isEnding: true,
      content: `그날 이후, 무언가가 달라졌다.

서연과 눈이 마주치는 횟수가 늘었다. 복도에서 마주치면 먼저 인사를 건네는 쪽은 이제 서연이었다. 전생에서는 단 한 번도 없던 일이다.

{name}은(는) 알고 있다. 이것은 시작에 불과하다는 것을.

수능까지 1년 6개월. 서연의 집안 사정이 기울기 시작하는 겨울. 태현의 배신이 싹트는 봄. 전생의 {name}이(가) 놓쳤던 모든 갈림길이 아직 앞에 남아 있다.

선택은 운명을 바꾸기 시작했다. 그러나 인생은 생각보다 복잡한 법.

바뀐 미래가 반드시 더 나은 미래라는 보장은, 어디에도 없다.

— 1회차 회귀, 여기까지.

과연 다른 결말이 기다리고 있을까?`,
      choices: [],
    },
    ep3b: {
      id: 'ep3b',
      episodeNumber: 3,
      title: '선택의 결과',
      isEnding: true,
      content: `며칠이 흘렀다.

{name}은(는) 노트 한 권을 샀다. 표지에는 아무것도 쓰지 않았다. 그 안에 적힌 것이 무엇인지 아는 사람은 세상에 단 한 명뿐이다.

태현은 여전히 웃는다. 서연은 여전히 앞자리에 앉아 있다. 세상은 아직 아무것도 모른다.

하지만 {name}은(는) 안다. 다가올 10년의 지도를. 어디에 함정이 있고, 어디에 기회가 있는지.

문제는 하나다. 지도를 들고 있어도, 길을 걷는 것은 결국 자신이라는 것.

선택은 운명을 바꾸기 시작했다. 그러나 인생은 생각보다 복잡한 법.

— 1회차 회귀, 여기까지.

과연 다른 결말이 기다리고 있을까?`,
      choices: [],
    },
  },
};

const scenario2: PresetScenario = {
  id: 'preset-jobseeker-retry',
  title: '재도전',
  description: '서류 탈락 37번의 취준생이 수능 성적표를 받던 날로 회귀한다.',
  totalEpisodes: 3,
  startNodeId: 'ep1',
  nodes: {
    ep1: {
      id: 'ep1',
      episodeNumber: 1,
      title: '성적표를 받던 날',
      isEnding: false,
      content: `"{name}, 네 성적표."

담임이 내민 종이 한 장. {name}은(는) 그것을 받아 드는 순간 깨달았다.

회귀했다. 수능 성적표를 받던 바로 그날로.

전생의 기억이 밀려온다. 점수에 맞춰 골랐던 학과. 적성에 맞지 않아 겉돌던 4년. 졸업 후 이어진 서류 탈락 37번. 면접장에서 "지원 동기가 뭐예요?"라는 질문에 끝내 대답하지 못했던 순간.

지원 동기 같은 건 처음부터 없었으니까. 꿈을 적어야 할 칸에, {name}은(는) 늘 점수를 적었으니까.

손안의 성적표가 구겨진다. 옆자리 친구가 묻는다. "너 어디 쓸 거야?"

10년을 돌아 다시 받은 질문. 이번에는 답이 다를 수 있을까.`,
      choices: [
        {
          id: 'ep1-a',
          text: '점수가 아니라 꿈을 기준으로 학과를 고른다',
          nextNodeId: 'ep2a',
          isPremium: false,
        },
        {
          id: 'ep1-b',
          text: '집에 가서 가족과 먼저 이야기한다',
          nextNodeId: 'ep2b',
          isPremium: false,
        },
        {
          id: 'ep1-c',
          text: '전생에 봤던 10년 치 산업 지형을 복기한다',
          isPremium: true,
        },
      ],
    },
    ep2a: {
      id: 'ep2a',
      episodeNumber: 2,
      title: '꿈을 적는 칸',
      isEnding: false,
      content: `원서 접수 마지막 날. {name}은(는) 모니터 앞에 앉아 있었다.

전생에 적었던 학과명이 기억난다. 안정적이라는 이유로, 부모님이 좋아하신다는 이유로 적었던 그 이름. 그리고 그 선택이 데려간 곳도 기억난다. 새벽 두 시의 독서실, 누구의 것도 아닌 자기소개서, 37번의 불합격 메일.

커서가 깜빡인다.

{name}은(는) 다른 이름을 적었다. 전생 내내 "그때 그걸 했더라면"이라고 곱씹던 바로 그 길.

저장 버튼을 누르는 손이 떨렸다. 무섭지 않다면 거짓말이다. 이 길의 끝은 본 적이 없으니까. 하지만 본 적 있는 길의 끝이 어땠는지는, 누구보다 잘 안다.

그날 저녁, 식탁에서 아버지가 물었다. "원서는 잘 썼고?"

{name}은(는) 숟가락을 내려놓았다. 이제 말해야 한다.`,
      choices: [
        {
          id: 'ep2a-a',
          text: '"제가 정말 하고 싶은 걸 적었어요." 정면으로 말한다',
          nextNodeId: 'ep3a',
          isPremium: false,
        },
        {
          id: 'ep2a-b',
          text: '합격 발표가 날 때까지 일단 말을 아낀다',
          nextNodeId: 'ep3a',
          isPremium: false,
        },
        {
          id: 'ep2a-c',
          text: '미래에 이 분야가 어떻게 되는지 근거를 들어 설득한다',
          isPremium: true,
        },
      ],
    },
    ep2b: {
      id: 'ep2b',
      episodeNumber: 2,
      title: '아버지의 서랍',
      isEnding: false,
      content: `"아버지, 저 진로 때문에 드릴 말씀이 있어요."

전생의 {name}은(는) 이 말을 한 번도 해본 적이 없었다. 묻지 않았고, 듣지 않았고, 점수가 정해주는 대로 갔다. 그래서 몰랐다. 아버지가 어떤 얼굴로 이 말을 듣는지.

아버지는 한참 말이 없다가, 안방 서랍에서 낡은 노트 한 권을 꺼내 왔다.

"네 나이 때 내가 쓰던 거다."

노트 안에는 설계 도면이 가득했다. 한 번도 들어본 적 없는 아버지의 꿈이었다.

"형편 때문에 접었지. 후회하냐고 물으면… 글쎄. 그런데 {name}아, 나는 네가 나중에 이 노트 같은 걸 서랍에 넣어두고 사는 건 보고 싶지 않다."

{name}은(는) 목이 메었다. 전생의 자신이 바로 그 서랍 속 노트처럼 살았다는 걸, 아버지는 모른다.

"그래서, 너는 뭘 하고 싶은데?"`,
      choices: [
        {
          id: 'ep2b-a',
          text: '10년 묵은 진심을 처음으로 꺼내놓는다',
          nextNodeId: 'ep3b',
          isPremium: false,
        },
        {
          id: 'ep2b-b',
          text: '"아버지 꿈 이야기를 더 듣고 싶어요." 먼저 듣는다',
          nextNodeId: 'ep3b',
          isPremium: false,
        },
        {
          id: 'ep2b-c',
          text: '아버지의 접었던 꿈을 함께 다시 펼칠 방법을 찾는다',
          isPremium: true,
        },
      ],
    },
    ep3a: {
      id: 'ep3a',
      episodeNumber: 3,
      title: '선택의 결과',
      isEnding: true,
      content: `합격 발표일 아침.

{name}은(는) 결과 페이지를 열기 전에 잠시 눈을 감았다. 이상한 일이었다. 전생의 어떤 면접 결과를 기다릴 때보다 떨리는데, 동시에 어떤 때보다 후회가 없었다.

떨어져도 다시 쓰면 된다. 이번 생의 {name}은(는) 그걸 안다. 실패가 무서운 게 아니라, 시도하지 않은 채 늙는 게 무섭다는 것을. 그걸 배우는 데 한 번의 인생이 통째로 들었다.

화면이 열렸다.

선택은 운명을 바꾸기 시작했다. 그러나 인생은 생각보다 복잡한 법.

— 1회차 회귀, 여기까지.

과연 다른 결말이 기다리고 있을까?`,
      choices: [],
    },
    ep3b: {
      id: 'ep3b',
      episodeNumber: 3,
      title: '선택의 결과',
      isEnding: true,
      content: `그날 밤, 식탁은 평소보다 오래 차려져 있었다.

{name}와(과) 아버지는 노트를 사이에 두고 세 시간을 이야기했다. 전생을 통틀어 아버지와 나눈 대화보다 길었다.

진로는 아직 정해지지 않았다. 하지만 {name}은(는) 알게 됐다. 전생의 실패는 학과를 잘못 골라서가 아니었다. 아무에게도 묻지 않고, 아무에게도 말하지 않고, 혼자 점수 뒤에 숨었기 때문이었다.

서랍에 들어가는 인생과 식탁 위에 펼쳐지는 인생의 차이를, 이제는 안다.

선택은 운명을 바꾸기 시작했다. 그러나 인생은 생각보다 복잡한 법.

— 1회차 회귀, 여기까지.

과연 다른 결말이 기다리고 있을까?`,
      choices: [],
    },
  },
};

const scenario3: PresetScenario = {
  id: 'preset-bullied-payback',
  title: '되갚는 시간',
  description: '교실의 그림자였던 아이가, 모든 것이 시작된 그날 아침으로 회귀한다.',
  totalEpisodes: 3,
  startNodeId: 'ep1',
  nodes: {
    ep1: {
      id: 'ep1',
      episodeNumber: 1,
      title: '모든 것이 시작된 아침',
      isEnding: false,
      content: `책상 위에 낙서가 있었다.

{name}은(는) 그 낙서를 기억한다. 10년이 지나도 잊을 수 없었다. 이것이 시작이었으니까. 처음에는 낙서, 다음에는 책가방, 그다음에는 — 전부 다.

회귀했다. 모든 것이 시작된 바로 그날 아침으로.

교실 뒤쪽에서 웃음소리가 들린다. 정우진과 그 무리들. 전생의 {name}은(는) 이 순간 고개를 숙였다. 못 본 척하면 지나갈 줄 알았다. 지나가지 않았다. 침묵은 허락이 됐고, 1년이 지났을 때 {name}은(는) 교실에서 지워진 사람이 되어 있었다.

그리고 졸업 후 10년. 그 1년이 남긴 그림자는 어떤 면접장에서도, 어떤 관계에서도 {name}의 어깨를 눌렀다.

낙서를 내려다본다. 손이 떨린다. 두려움인지 분노인지 구분이 가지 않는다.

하지만 이번 생의 {name}은(는) 한 가지를 안다. 오늘 고개를 숙이면, 1년 뒤의 교실이 어떤 모습인지.`,
      choices: [
        {
          id: 'ep1-a',
          text: '낙서를 들고 일어나, 모두 앞에서 정우진에게 묻는다',
          nextNodeId: 'ep2a',
          isPremium: false,
        },
        {
          id: 'ep1-b',
          text: '오늘부터 모든 것을 기록하고 증거를 모은다',
          nextNodeId: 'ep2b',
          isPremium: false,
        },
        {
          id: 'ep1-c',
          text: '전생의 기억에서 정우진의 약점을 떠올린다',
          isPremium: true,
        },
      ],
    },
    ep2a: {
      id: 'ep2a',
      episodeNumber: 2,
      title: '고개를 들다',
      isEnding: false,
      content: `{name}은(는) 낙서가 적힌 책상째로 교실 뒤를 향해 돌아섰다.

"이거, 네가 했냐?"

교실이 조용해졌다. 정우진의 얼굴에서 웃음기가 사라지는 데 걸린 시간은 일 초. 전생에서는 한 번도 본 적 없는 표정이었다. 당황.

"뭐? 증거 있어?"

"증거가 필요할 만한 일이라는 건 아네."

뒤쪽 어딘가에서 누군가 피식 웃었다. 정우진 무리가 아닌 쪽에서. 분위기라는 건 이렇게 한 끗에서 갈린다는 걸, 두 번째 인생이 되어서야 알았다.

전생의 {name}은(는) 늘 생각했다. 맞서면 더 심해질 거라고. 그런데 그 생각이 틀렸다는 게 아니다 — 맞설 수도 있는 사람과 절대 맞서지 않는 사람을, 그들은 정확히 구분할 뿐이다.

종이 울리고 담임이 들어왔다. 정우진은 자리로 돌아가며 {name}을(를) 노려봤다.

끝난 게 아니다. 시작이 달라졌을 뿐.`,
      choices: [
        {
          id: 'ep2a-a',
          text: '담임에게 방금 일을 그 자리에서 알린다',
          nextNodeId: 'ep3a',
          isPremium: false,
        },
        {
          id: 'ep2a-b',
          text: '아직은 혼자 버틴다, 대신 같은 편을 만든다',
          nextNodeId: 'ep3a',
          isPremium: false,
        },
        {
          id: 'ep2a-c',
          text: '정우진이 1년 뒤 저지를 일을 미리 차단한다',
          isPremium: true,
        },
      ],
    },
    ep2b: {
      id: 'ep2b',
      episodeNumber: 2,
      title: '기록하는 사람',
      isEnding: false,
      content: `{name}은(는) 그날 문구점에서 수첩 한 권을 샀다.

날짜. 시간. 장소. 한 일. 한 말. 본 사람.

전생의 {name}이(가) 가장 후회한 것은 맞서지 못한 게 아니었다. 아무것도 남기지 않은 것이었다. 1년이 지나 어른들이 "언제부터 그랬니"라고 물었을 때, {name}에게는 기억밖에 없었고, 기억은 증거가 되지 못했다. "장난이었는데요"라는 한마디에 1년이 지워졌다.

이번에는 다르다.

사흘째 되던 날, 옆 반 서지수가 다가왔다. 전생에서 유일하게 {name}에게 말을 걸어주던 아이. 그때는 너무 늦게 그 손을 잡았다.

"너 요즘 뭔가 달라진 것 같아."

수첩을 보여줄까. {name}은(는) 잠시 망설였다. 혼자 싸우는 것과 같이 싸우는 것의 차이를, 전생의 {name}은(는) 끝내 알지 못했다.`,
      choices: [
        {
          id: 'ep2b-a',
          text: '서지수에게 수첩을 보여주고 전부 털어놓는다',
          nextNodeId: 'ep3b',
          isPremium: false,
        },
        {
          id: 'ep2b-b',
          text: '아직은 혼자 간다, 수첩이 채워질 때까지',
          nextNodeId: 'ep3b',
          isPremium: false,
        },
        {
          id: 'ep2b-c',
          text: '학교폭력위원회 절차를 미리 조사해 준비한다',
          isPremium: true,
        },
      ],
    },
    ep3a: {
      id: 'ep3a',
      episodeNumber: 3,
      title: '선택의 결과',
      isEnding: true,
      content: `일주일이 지났다.

교실은 아직 {name}의 편이 아니다. 하지만 더 이상 정우진의 편도 아니다. 낙서는 다시 나타나지 않았다. 그들은 다음 표적을 고르는 중인지도 모르고, 물러서는 중인지도 모른다.

달라진 건 교실이 아니라 {name}이다. 아침에 교문을 지날 때 어깨가 펴져 있다. 전생의 {name}이(가) 끝내 갖지 못했던 것. 두려움이 사라진 게 아니라, 두려움보다 큰 것이 생겼다.

이번 생은 지워지지 않는다. 누구도 {name}을(를) 지우게 두지 않는다.

선택은 운명을 바꾸기 시작했다. 그러나 인생은 생각보다 복잡한 법.

— 1회차 회귀, 여기까지.

과연 다른 결말이 기다리고 있을까?`,
      choices: [],
    },
    ep3b: {
      id: 'ep3b',
      episodeNumber: 3,
      title: '선택의 결과',
      isEnding: true,
      content: `수첩의 세 페이지가 채워졌다.

날짜와 시간과 목격자가 적힌 기록은, 기억과는 다른 무게를 가진다. {name}은(는) 그것을 책가방 안쪽 주머니에 넣고 다닌다. 부적처럼.

이상한 일이다. 아직 아무것도 끝나지 않았는데, 매일 밤 잠드는 게 조금씩 쉬워진다. 전생의 {name}은(는) 당하는 사람이었다. 이번 생의 {name}은(는) 준비하는 사람이다. 같은 교실, 같은 사람들 — 그러나 완전히 다른 시간.

그들은 아직 모른다. 자신들이 무엇을 상대하고 있는지.

선택은 운명을 바꾸기 시작했다. 그러나 인생은 생각보다 복잡한 법.

— 1회차 회귀, 여기까지.

과연 다른 결말이 기다리고 있을까?`,
      choices: [],
    },
  },
};

export const presetScenarios: PresetScenario[] = [scenario1, scenario2, scenario3];

/** 온보딩 프로필에 맞는 프리셋 선택 (매칭 없으면 시나리오 1) */
export function pickPreset(profile: {
  persona: string;
  regret: string;
}): PresetScenario {
  if (profile.persona === 'job_seeker' || profile.regret === 'gave_up_dream') {
    return scenario2;
  }
  if (profile.persona === 'bullied_student' || profile.regret === 'betrayal') {
    return scenario3;
  }
  return scenario1;
}

export function getPreset(id: string): PresetScenario {
  const found = presetScenarios.find((s) => s.id === id);
  return found ?? scenario1;
}

/** 본문 속 {name} 플레이스홀더를 사용자 이름으로 치환 */
export function personalize(text: string, name: string): string {
  return text.replaceAll('{name}', name);
}
