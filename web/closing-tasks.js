// Closing checklist, from the "Store #1 Closing Checklist" sheet.
// To change a task, edit its text here and push to GitHub.
// Keep each `id` the same so past records still line up; use a new id for a new task.
window.CLOSING_ROLES = [
  {
    id: "server", name: "Server", ko: "서버",
    tasks: [
      { id: "s1",  ko: "홀 바닥 쓸고 닦기",            en: "Sweep the floor and mop the floor" },
      { id: "s2",  ko: "홀 창문 닫기",                 en: "Close the window" },
      { id: "s3",  ko: "홀 블라인드 내리기",            en: "Pull down the blinds" },
      { id: "s4",  ko: "홀 냉장고 끄기",                en: "Turn off the front fridge" },
      { id: "s5",  ko: "홀 냉장고 김치, 케익등 뒤쪽 냉장고에 넣기", en: "Put the kimchi and cakes in the back fridge from the front fridge" },
      { id: "s6",  ko: "음료냉장고 채우기",             en: "Check and restock drinks" },
      { id: "s7",  ko: "화장실 청소",                  en: "Clean the washroom (toilet, sink, mirror etc)" },
      { id: "s8",  ko: "일회용품 채워넣기",             en: "Check and restock the utensils" },
      { id: "s9",  ko: "오픈사인 끄기",                en: "Turn off the open sign" },
      { id: "s10", ko: "앞쪽 간판 안으로 들여놓기",       en: "Put in the Taste of Seoul sign inside" }
    ]
  },
  {
    id: "cook", name: "Cook", ko: "쿡",
    tasks: [
      { id: "c1", ko: "야채 프렙 및 야채 재고 체크",      en: "Check vegetable prep & stock" },
      { id: "c2", ko: "고기 꺼내놓기",                  en: "Take out meat from the freezer" },
      { id: "c3", ko: "스토브 청소",                    en: "Clean the stove" },
      { id: "c4", ko: "튀김기 전원 끄고 콘센트 뽑기",      en: "Turn off fryer & unplug" },
      { id: "c5", ko: "쿡용 소스 냉장고에 넣기 (물 채우기)", en: "Put cooking sauces back in fridge (fill water)" },
      { id: "c6", ko: "우동 그릇 닦고 물채우기",          en: "Wash the udon bowls and fill with water" }
    ]
  },
  {
    id: "rice", name: "Rice", ko: "라이스",
    tasks: [
      { id: "r1", ko: "밥통 밥 정리",                   en: "Pack leftover rice and put in the fridge" },
      { id: "r2", ko: "다음날 밥 예약하기",              en: "Set rice for next day" },
      { id: "r3", ko: "중간 냉장고 야채 정리",            en: "Organize vegetables in the mid fridge" },
      { id: "r4", ko: "중간 냉장고 청소 및 정리",         en: "Clean the mid fridge (wipe handles and top and inside)" },
      { id: "r5", ko: "전자렌지 청소",                  en: "Clean the microwave" },
      { id: "r6", ko: "소스 채우기",                    en: "Refill the sauces" },
      { id: "r7", ko: "튀김기 코드 뽑기",                en: "Unplug the fryer" }
    ]
  },
  {
    id: "sushi", name: "Sushi", ko: "스시",
    tasks: [
      { id: "u1", ko: "밥통 밥 정리",                   en: "Pack leftover rice and put in the fridge" },
      { id: "u2", ko: "다음날 밥 예약하기",              en: "Set rice for next day" },
      { id: "u3", ko: "냉장고 정리 및 닦기",             en: "Clean the fridge (wipe handles and top and inside)" },
      { id: "u4", ko: "도마 정리 및 닦기",               en: "Clean cutting boards" },
      { id: "u5", ko: "to-go 컨테이너 및 콤보 박스 채우기 (min. 10개)", en: "Restock to-go containers and combo boxes (min. 10)" }
    ]
  },
  {
    id: "leader", name: "Today Leader", ko: "마감 리더", leader: true,
    tasks: [
      { id: "l1", ko: "물류 확인",                      en: "Check inventory" },
      { id: "l2", ko: "냉장고 온도 및 문닫힘 확인",        en: "Check fridge temperature and doors" },
      { id: "l4", ko: "스토브 확인",                     en: "Check the stove" }
    ]
  }
];
