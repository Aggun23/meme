const catName = {
  img: '이미지',
  gif: 'GIF',
  video: '영상'
};

const tagList = ['이모티콘', '밈 사진', '짤'];

const pads = [
  // [ㄱ]
  { image: 'images/가챠 실패(화사).gif', label: '가챠 실패', cat: 'gif', tags: ['밈 사진'] },
  { image: 'images/갈!!.jpg', label: '갈!!!!', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/개발자 테크트리.jpg', label: '개발자 테크트리', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/개엔밍.webp', label: '개엔밍', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/건메 패드립1.jpg', label: '건메 패드립1', cat: 'img', tags: ['짤'] },
  { image: 'images/건메 패드립2.jpg', label: '건메 패드립2', cat: 'img', tags: ['짤'] },
  { image: 'images/게이임.png', label: '게이임?', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/결국 손 나가는.webp', label: '결국 손 나가는', cat: 'img', tags: ['밈 사진', '짤'] },
  { image: 'images/(경악).jpg', label: '(경악)', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/곰문곰문곰문.jpg', label: '곰문곰문곰문', cat: 'img', tags: ['짤'] },
  { image: 'images/공공의적.webp', label: '공공의 적', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/공부 보이콧.jpg', label: '공부 보이콧', cat: 'img', tags: ['짤'] },
  { image: 'images/교수 폭행.webp', label: '교수 폭행', cat: 'img', tags: ['짤'] },
  { image: 'images/국맛.jpg', label: '국맛', cat: 'img', tags: ['짤'] },
  { image: 'images/굿~.jpg', label: '굿~', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/굿모니에.png', label: '굿모니에', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/그래서 이제 뭐함.jpg', label: '그래서 이제 뭐함?', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/그럼 꺼져.jpg', label: '그럼 꺼져', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/그리고 아무도 없었다.jpg', label: '그리고 아무도 없었다', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/긴급상황.jpg', label: '긴급상황', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/끔찍한 최후다요.png', label: '끔찍한 최후다요', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/끝났다.webp', label: '끝났다', cat: 'img', tags: ['짤'] },

  // [ㄴ]
  { image: 'images/나를 위해, 이재명.jpg', label: '나를 위해, 이재명', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/나쁜 답변 좋은 답변.webp', label: '나쁜 답변 좋은 답변', cat: 'img', tags: ['짤', '밈 사진'] },
  { image: 'images/나쁜아이.png', label: '나쁜아이는 드럼통에', cat: 'img', tags: ['이모티콘', '밈 사진'] },
  { image: 'images/날 죽여라.jpg', label: '날 죽여라', cat: 'img', tags: ['짤'] },
  { image: 'images/남자도 여자처럼 다루면.webp', label: '남자도 여자처럼 다루면', cat: 'img', tags: ['짤'] },
  { image: 'images/내면의 괴렘.gif', label: '내면의 괴렘', cat: 'gif', tags: ['이모티콘'] },
  { image: 'images/내입에내입에.webp', label: '내입에내입에', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/너처럼 눈치빠른 녀석은 싫다니까.jpg', label: '너처럼 눈치 빠른 녀석은', cat: 'img', tags: ['짤'] },
  { image: 'images/농구가 하고 싶어요.jpg', label: '농구가 하고 싶어요', cat: 'img', tags: ['짤'] },
  { image: 'images/뇌손상.jpg', label: '뇌손상', cat: 'img', tags: ['짤'] },
  { image: 'images/뇌에서릭롤링.jpg', label: '뇌에서릭롤링', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/누구도 상처입기 전에.png', label: '누구도 상처입기 전에', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/눈치....png', label: '눈치', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/니하오.webp', label: '니하오', cat: 'img', tags: ['짤'] },

  // [ㄷ]
  { image: 'images/다 아는 사람들이구만.jpg', label: '다 아는 사람들이구만', cat: 'img', tags: ['밈 사진', '짤'] },
  { image: 'images/대문자 I.jpg', label: '대문자 I', cat: 'img', tags: ['짤'] },
  { image: 'images/대학생학대.jpg', label: '대학생학대', cat: 'img', tags: ['짤'] },
  { video: 'images/댄싱히틀러.mp4', label: '댄싱히틀러', cat: 'video', tags: ['밈 사진'] },
  { image: 'images/오리 데니아.webp', label: '데니아 꽥꽥', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/동접(사망).png', label: '동접', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/듀아아아.webp', label: '듀아아아', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/듀아아아 익스트림.png', label: '듀아아아아', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/드디어 올 것이 왔군.png', label: '드디어 올 것이 왔군', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/들숨에재 날숨에명.jpg', label: '들숨에재 날숨에명', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/디버깅의 6단계.jpg', label: '디버깅의 6단계', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/또 당신입니까.png', label: '또 당신입니까', cat: 'img', tags: ['이모티콘'] },

  // [ㄹ]
  { image: 'images/라이드 더 라이트닝.jpg', label: '!라이드 더 라이트닝!', cat: 'img', tags: ['짤'] },

  // [ㅁ]
  { image: 'images/마음속에 매장.jpg', label: '마음속에 매장', cat: 'img', tags: ['밈 사진', '짤'] },
  { image: 'images/맛만 좋으면 그만.webp', label: '맛만 좋으면 그만', cat: 'img', tags: ['짤'] },
  { image: 'images/매튜렁.webp', label: '매튜렁', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/메숭이 이부키.png', label: '메숭이 이부키', cat: 'img', tags: ['이모티콘', '밈 사진'] },
  { image: 'images/메스냥이.jpg', label: '메스냥이', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/메이플 중독증.jpg', label: '메이플 중독', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/지하실.webp', label: '밑바닥에도 바닥이', cat: 'img', tags: ['짤'] },

  // [ㅂ]
  { image: 'images/박지말라고.png', label: '박지 말라고', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/범인은 현장에 나타난다.jpg', label: '범인은 현장에 나타난다', cat: 'img', tags: ['짤'] },
  { image: 'images/변명 컷.jpg', label: '변명 컷', cat: 'img', tags: ['짤'] },
  { image: 'images/분노괴렘.png', label: '분노괴렘', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/빤.png', label: '빤-', cat: 'img', tags: ['이모티콘', '밈 사진'] },
  { image: 'images/빨보추천.png', label: '빨보추천', cat: 'img', tags: ['이모티콘'] },

  // [ㅅ]
  { image: 'images/사람은 실수의 동물.jpg', label: '사람은 실수의 동물', cat: 'img', tags: ['짤'] },
  { image: 'images/살려는 드릴께.gif', label: '살려는 드릴께', cat: 'gif', tags: ['밈 사진', '짤'] },
  { image: 'images/살인이 이래서 나는구나.jpg', label: '살인이 이래서 나는구나', cat: 'img', tags: ['짤'] },
  { image: 'images/살짝덜깻어난.jpg', label: '살짝덜깻어난', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/상처만 남는 게임.png', label: '상처뿐인 게임', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/섭종.png', label: '섭종', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/스피키 나만볼수없지.webp', label: '스피키 나만 볼수없지', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/시각을 포기한다.png', label: '시각을 포기한다', cat: 'img', tags: ['짤'] },
  { image: 'images/회색내복 블래스터1.jpg', label: '신창섭 블래스터1', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/회색내복 블래스터2.jpg', label: '신창섭 블래스터2', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/쌀숭이.jpg', label: '쌀숭이', cat: 'img', tags: ['밈 사진'] },
  { video: 'images/쌀숭이 템플런.mp4', label: '쌀숭이 템플런', cat: 'video', tags: ['밈 사진'] },
  { image: 'images/씨 발 년.png', label: '씨 발 년', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/씹선비.jpg', label: '씹선비', cat: 'img', tags: ['밈 사진'] },

  // [ㅇ]
  { image: 'images/아!루1.jpg', label: '아!루1', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/아!루2.jpg', label: '아!루2', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/아냐 잘못본건가.jpg', label: '아냐 잘못본건가', cat: 'img', tags: ['짤'] },
  { image: 'images/알고리즘.jpg', label: '알고리즘', cat: 'img', tags: ['짤'] },
  { image: 'images/앙카 따봉.png', label: '앙카 따봉', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/앙카 뻐큐.jpg', label: '앙카 Fuckyou', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/어흐.webp', label: '어흐', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/엠마하디국외추방.png', label: '엠마하디 국외추방', cat: 'img', tags: ['짤'] },
  { image: 'images/여기가 내 마운드다요.jpg', label: '여기가 내 마운드다요', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/여름나기.png', label: '여름나기', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/영앙카따봉.png', label: '영애 앙카 따봉', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/영크크.png', label: '영크크', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/예수 2077.gif', label: '예수 2077', cat: 'gif', tags: ['밈 사진'] },
  { image: 'images/오픈 마인드.jpg', label: '오픈 마인드', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/완벽히 이해했어.jpg', label: '완벽히 이해했어', cat: 'img', tags: ['이모티콘', '짤'] },
  { image: 'images/우매함의 봉우리.jpg', label: '우매함의 봉우리', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/유어웰컴.jpg', label: '유어웰컴', cat: 'img', tags: ['짤'] },
  { image: 'images/유치원생 애호가.jpg', label: '유치원생 애호가', cat: 'img', tags: ['짤'] },
  { image: 'images/이게 든쳤나.png', label: '이게 든쳤나', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/이리123.webp', label: '이리 123', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/이리로 들어오도록.jpg', label: '이리로 들어오도록', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/이새끼 웃는데요.jpg', label: '이새끼 웃는데요?', cat: 'img', tags: ['밈 사진', '짤'] },
  { image: 'images/이재명 840명.jpg', label: '이재명 840명', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/이제는 더이상 물러날 곳이 없다.jpg', label: '이제는 더이상', cat: 'img', tags: ['밈 사진', '짤'] },
  { image: 'images/이터널리턴지금바로다운로드.png', label: '이터리 지금바로 다운', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/인피니티 선글라스.gif', label: '인피니티 선글라스', cat: 'gif', tags: ['밈 사진'] },

  // [ㅈ]
  { image: 'images/장학금 면제.jpg', label: '장학금 면제', cat: 'img', tags: ['짤'] },
  { image: 'images/정상수.jpg', label: '정상수', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/조아해요.png', label: '조아해요', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/죽을께.png', label: '죽을께', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/죽음으로 맛있는데.jpg', label: '죽음으로 맛있 / 없는데', cat: 'img', tags: ['짤'] },
  { image: 'images/국가전체주의적인종차별주의.jpg', label: '줄여서 NTR', cat: 'img', tags: ['짤'] },
  { image: 'images/즐거운 인생 내리막길.jpg', label: '즐거운 인생 내리막길', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/지구공룡설.webp', label: '지구공룡설', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/진조가 그럴수도 있지.png', label: '진조가 그럴수도 있지', cat: 'img', tags: ['이모티콘'] },

  // [ㅊ]
  { video: 'images/펠린소맨.mp4', label: '체인소 펠리카', cat: 'video', tags: ['밈 사진'] },
  { image: 'images/최선을 다한다.jpg', label: '최선을 다한다', cat: 'img', tags: ['짤'] },

  // [ㅋ]
  { image: 'images/카멜 따봉.jpg', label: '카멜 따봉', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/스탠드 카멜탈.webp', label: '카멜탈', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/캬루 찬양.jpg', label: '캬루 숭배', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/캬루싸다구.jpg', label: '캬루 싸다구', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/코발정지.png', label: '코발정지', cat: 'img', tags: ['짤'] },
  { image: 'images/콘센트에팡팡팡.gif', label: '콘센트에 팡팡팡', cat: 'gif', tags: ['밈 사진'] },

  // [ㅌ]
  { image: 'images/탐식의 강원기.jpg', label: '탐식의 강원기', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/터져서 없어짐.png', label: '터져서 없어짐', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/테이잉.webp', label: '테이잉', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/텐가로봇.gif', label: '텐가로봇', cat: 'gif', tags: ['밈 사진'] },
  { image: 'images/퇴근하고 싶다.jpg', label: '퇴근하고 싶다', cat: 'img', tags: ['짤'] },
  { image: 'images/티모따봉.jpg', label: '티모따봉', cat: 'img', tags: ['이모티콘'] },

  // [ㅍ]
  { image: 'images/포기하는 순간이.jpg', label: '포기하는 순간이 시합종료', cat: 'img', tags: ['짤'] },
  { image: 'images/핑거스냅.jpg', label: '핑거스냅당', cat: 'img', tags: ['밈 사진'] },

  // [ㅎ]
  { image: 'images/하셔야합니다 실타.jpg', label: '하셔야합니다 실타', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/한가위 괴렘.png', label: '한가위 괴렘', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/한가위 도황.jpg', label: '한가위 도황', cat: 'img', tags: ['짤'] },
  { image: 'images/행복하다면 OK.jpg', label: '행복하다면 OK', cat: 'img', tags: ['밈 사진', '짤'] },
  { image: 'images/헤.jpg', label: '헤', cat: 'img', tags: ['짤'] },
  { image: 'images/호에에 합창단.jpg', label: '호에에에', cat: 'img', tags: ['짤'] },
  { image: 'images/활부1.jpg', label: '활  부', cat: 'img', tags: ['짤'] },
  { image: 'images/활부2.jpg', label: '활 부1', cat: 'img', tags: ['짤'] },
  { image: 'images/활부3.jpg', label: '활 부2', cat: 'img', tags: ['짤'] },
  { image: 'images/황홀!.jpg', label: '황홀!', cat: 'img', tags: ['밈 사진', '짤'] },
  { image: 'images/흠맹밍.webp', label: '흠맹밍', cat: 'img', tags: ['이모티콘'] },
  { image: 'images/히틀러.jpg', label: '히틀러', cat: 'img', tags: ['밈 사진'] },

  // [A-Z]
  { image: 'images/EAT.jpg', label: 'EAT', cat: 'img', tags: ['이모티콘', '밈 사진'] },
  { image: 'images/PC정상화킥.gif', label: 'PC정상화킥', cat: 'gif', tags: ['밈 사진'] },
  { image: 'images/SIUUUU.jpg', label: 'SIUUUU', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/VPN.jpg', label: 'VPN', cat: 'img', tags: ['밈 사진'] },
  { image: 'images/XBOX.jpg', label: 'XBOX', cat: 'img', tags: ['밈 사진'] },
];
