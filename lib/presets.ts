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

// 시나리오 2, 3은 9~10주차에 완성 예정 (스펙: "취준생 이지훈의 재도전", "왕따였던 강하늘의 복수")
export const presetScenarios: PresetScenario[] = [scenario1];

export const DEFAULT_PRESET_ID = scenario1.id;

export function getPreset(id: string): PresetScenario {
  const found = presetScenarios.find((s) => s.id === id);
  return found ?? scenario1;
}

/** 본문 속 {name} 플레이스홀더를 사용자 이름으로 치환 */
export function personalize(text: string, name: string): string {
  return text.replaceAll('{name}', name);
}
