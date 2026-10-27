// Store #2 weekly inventory (once a week, Saturday), from the store's weekly form.
// To change an item, edit its text here and push to GitHub.
// Keep each item `id` the same so past checks still line up; use a new id for a new item.
// input: number = staff enter how much is short vs `target` (in `unit`); flag = one "Need to order" toggle; text = written answer.
// `target` comes from each item's SAFE line in the original form. `options` are kept for reference.
// level: ok (green, SAFE) · low (yellow) · order (red, ORDER/REQUEST) · urgent (OUT)
// type "text": staff type an answer (write "None" / "없음" if nothing is needed).
window.STORE2_WEEKLY = {
 "sections": [
  {
   "en": "Front Area – POS & Service Area",
   "ko": "앞쪽 – 포스 및 장사 구역",
   "note": "Start at the POS area and check all items used for daily service. / 포스기 쪽부터 시작하여 장사 중 바로 사용하는 재고를 순서대로 확인해주세요.",
   "items": [
    {
     "name": "Ground Black Pepper (1.7 kg)",
     "ko": "그라운드 후추 (1.7kg)",
     "note": "",
     "options": [
      {
       "label": "1/3통 이상 / ⅓ Container or More",
       "status": "SAFE",
       "level": "ok"
      },
      {
       "label": "1/5통 이상 ~ 1/3통 미만 / ⅕–Less than ⅓",
       "status": "LOW",
       "level": "low"
      },
      {
       "label": "1/5통 미만 / Less than ⅕",
       "status": "ORDER",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT",
       "level": "urgent"
      }
     ],
     "id": "w001",
     "input": "number",
     "target": 0.33,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Tteokbokki Sauce – Bulk Container",
     "ko": "떡볶이 소스 – 큰통 기준",
     "note": "",
     "options": [
      {
       "label": "3/4통 이상 / ¾ Container or More",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1/3통 이상 ~ 3/4통 미만 / ⅓–Less than ¾",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1/3통 미만 / Less than ⅓",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT",
       "level": "urgent"
      }
     ],
     "id": "w002",
     "input": "number",
     "target": 0.75,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Sriracha Sauce",
     "ko": "스리라차 소스",
     "note": "",
     "options": [
      {
       "label": "1통 이상 / 1+ Container",
       "status": "SAFE",
       "level": "ok"
      },
      {
       "label": "반통 이상 ~ 1통 미만 / ½–Less than 1",
       "status": "LOW",
       "level": "low"
      },
      {
       "label": "반통 미만 / Less than ½",
       "status": "ORDER",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT",
       "level": "urgent"
      }
     ],
     "id": "w003",
     "input": "number",
     "target": 1.0,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Okonomiyaki Sauce",
     "ko": "오꼬노미야끼 소스",
     "note": "",
     "options": [
      {
       "label": "반통 이상 / ½ Container or More",
       "status": "SAFE",
       "level": "ok"
      },
      {
       "label": "1/5통 이상 ~ 반통 미만 / ⅕–Less than ½",
       "status": "LOW",
       "level": "low"
      },
      {
       "label": "1/5통 미만 / Less than ⅕",
       "status": "ORDER",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT",
       "level": "urgent"
      }
     ],
     "id": "w004",
     "input": "number",
     "target": 0.5,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Sesame Oil",
     "ko": "참기름",
     "note": "용기가 불투명하므로 들어서 무게를 확인해주세요. / Container is opaque — check by lifting and estimating the weight.",
     "options": [
      {
       "label": "새것 1통 이상 또는 충분히 무거움 / 1+ Full Container or Feels Heavy",
       "status": "SAFE",
       "level": "ok"
      },
      {
       "label": "사용 중이며 어느 정도 무게가 있음 / Partially Used, Still Has Good Weight",
       "status": "LOW",
       "level": "low"
      },
      {
       "label": "들었을 때 가벼움 / Feels Light",
       "status": "ORDER",
       "level": "order"
      },
      {
       "label": "거의 비었거나 없음 / Almost Empty or OUT",
       "status": "URGENT",
       "level": "urgent"
      }
     ],
     "id": "w005",
     "input": "number",
     "target": 1.0,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Poke panko",
     "ko": "포케 팬코",
     "note": "",
     "options": [
      {
       "label": "1.5봉 이상 / 1½ Bags or More",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "반 봉지 이상 ~ 1.5봉 미만 / ½–Less than 1½ Bags",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "반 봉지 미만 / Less than ½ Bag",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT",
       "level": "urgent"
      }
     ],
     "id": "w006",
     "input": "number",
     "target": 1.5,
     "unit": "Bag",
     "unitKo": "봉"
    },
    {
     "name": "Sesame Seeds",
     "ko": "참깨",
     "note": "",
     "options": [
      {
       "label": "여분 1/3봉지 이상 / ⅓ Bag or More in Backup",
       "status": "SAFE",
       "level": "ok"
      },
      {
       "label": "여분 1/3봉지 미만 / Less than ⅓ Bag in Backup",
       "status": "LOW",
       "level": "low"
      },
      {
       "label": "소분통 채운 후 여분 없음 / No Backup After Refilling Container",
       "status": "ORDER",
       "level": "order"
      },
      {
       "label": "소분통도 거의 없음 / Portion Container Almost Empty",
       "status": "URGENT",
       "level": "urgent"
      }
     ],
     "id": "w007",
     "input": "number",
     "target": 0.33,
     "unit": "Bag",
     "unitKo": "봉"
    },
    {
     "name": "Fine Chili Powder",
     "ko": "얇은 고춧가루",
     "note": "",
     "options": [
      {
       "label": "반통 이상 / ½ Container or More",
       "status": "SAFE",
       "level": "ok"
      },
      {
       "label": "1/5통 이상 ~ 반통 미만 / ⅕–Less than ½",
       "status": "LOW",
       "level": "low"
      },
      {
       "label": "1/5통 미만 / Less than ⅕",
       "status": "ORDER",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT",
       "level": "urgent"
      }
     ],
     "id": "w008",
     "input": "number",
     "target": 0.5,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Coarse Chili Powder",
     "ko": "굵은 고춧가루",
     "note": "",
     "options": [
      {
       "label": "반통 이상 / ½ Container or More",
       "status": "SAFE",
       "level": "ok"
      },
      {
       "label": "1/5통 이상 ~ 반통 미만 / ⅕–Less than ½",
       "status": "LOW",
       "level": "low"
      },
      {
       "label": "1/5통 미만 / Less than ⅕",
       "status": "ORDER",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT",
       "level": "urgent"
      }
     ],
     "id": "w009",
     "input": "number",
     "target": 0.5,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Custard",
     "ko": "커스타드",
     "note": "냉장고 진열을 먼저 채운 후 남은 백업 재고를 기준으로 체크 / Restock the display fridge first, then check the remaining backup stock.",
     "options": [
      {
       "label": "진열 후 백업 1박스 이상 / 1+ Backup Box After Restocking",
       "status": "SAFE",
       "level": "ok"
      },
      {
       "label": "진열 후 백업 3개 이상 / 3+ Backup Packs After Restocking",
       "status": "LOW",
       "level": "low"
      },
      {
       "label": "진열 후 백업 3개 미만 / Less than 3 Backup Packs After Restocking",
       "status": "ORDER",
       "level": "order"
      },
      {
       "label": "백업 없음 / No Backup",
       "status": "URGENT",
       "level": "urgent"
      }
     ],
     "id": "w010",
     "input": "number",
     "target": 1.0,
     "unit": "Box",
     "unitKo": "박스"
    },
    {
     "name": "Choco Pie",
     "ko": "초코파이",
     "note": "냉장고 진열을 먼저 채운 후 남은 백업 재고를 기준으로 체크 / Restock the display fridge first, then check the remaining backup stock.",
     "options": [
      {
       "label": "진열 후 백업 1박스 이상 / 1+ Backup Box After Restocking",
       "status": "SAFE",
       "level": "ok"
      },
      {
       "label": "진열 후 백업 3개 이상 / 3+ Backup Packs After Restocking",
       "status": "LOW",
       "level": "low"
      },
      {
       "label": "진열 후 백업 3개 미만 / Less than 3 Backup Packs After Restocking",
       "status": "ORDER",
       "level": "order"
      },
      {
       "label": "백업 없음 / No Backup",
       "status": "URGENT",
       "level": "urgent"
      }
     ],
     "id": "w011",
     "input": "number",
     "target": 1.0,
     "unit": "Box",
     "unitKo": "박스"
    },
    {
     "name": "Fresh Berry",
     "ko": "후레시베리",
     "note": "냉장고 진열을 먼저 채운 후 남은 백업 재고를 기준으로 체크 / Restock the display fridge first, then check the remaining backup stock.",
     "options": [
      {
       "label": "진열 후 백업 1박스 이상 / 1+ Backup Box After Restocking",
       "status": "SAFE",
       "level": "ok"
      },
      {
       "label": "진열 후 백업 3개 이상 / 3+ Backup Packs After Restocking",
       "status": "LOW",
       "level": "low"
      },
      {
       "label": "진열 후 백업 3개 미만 / Less than 3 Backup Packs After Restocking",
       "status": "ORDER",
       "level": "order"
      },
      {
       "label": "백업 없음 / No Backup",
       "status": "URGENT",
       "level": "urgent"
      }
     ],
     "id": "w012",
     "input": "number",
     "target": 1.0,
     "unit": "Box",
     "unitKo": "박스"
    },
    {
     "name": "Card Terminal Paper Rolls",
     "ko": "카드용지 롤",
     "note": "",
     "options": [
      {
       "label": "7롤 이상 / 7+ Rolls",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "3–6롤 / 3-6 Rolls",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "3롤 미만 / Less than 3 Rolls",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w013",
     "input": "number",
     "target": 7.0,
     "unit": "Roll",
     "unitKo": "롤"
    },
    {
     "name": "Loyalty Cards",
     "ko": "로열티 카드",
     "note": "",
     "options": [
      {
       "label": "반 박스 이상 / ½ Box or More",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "30개 이상 ~ 반 박스 미만 / 30+ Cards–Less than ½ Box",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "30개 미만 / Less than 30 Cards",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w014",
     "input": "number",
     "target": 0.5,
     "unit": "Box",
     "unitKo": "박스"
    },
    {
     "name": "Disposable Forks",
     "ko": "일회용 포크",
     "note": "",
     "options": [
      {
       "label": "한 박스 이상 / 1 Box or More",
       "status": "SAFE",
       "level": "ok"
      },
      {
       "label": "1/3박스 이상 ~ 한 박스 미만 / 1/3–Less than 1 Box",
       "status": "LOW",
       "level": "low"
      },
      {
       "label": "1/5박스 미만 / Less than ⅕ Box",
       "status": "ORDER",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT",
       "level": "urgent"
      }
     ],
     "id": "w015",
     "input": "number",
     "target": 1.0,
     "unit": "Box",
     "unitKo": "박스"
    },
    {
     "name": "Disposable Spoons",
     "ko": "일회용 숟가락",
     "note": "",
     "options": [
      {
       "label": "1 박스 이상 / 1 Box or More",
       "status": "SAFE",
       "level": "ok"
      },
      {
       "label": "1/3박스 이상 ~ 한 박스 미만 / 1/3–Less than 1 Box",
       "status": "LOW",
       "level": "low"
      },
      {
       "label": "1/5박스 미만 / Less than ⅕ Box",
       "status": "ORDER",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT",
       "level": "urgent"
      }
     ],
     "id": "w016",
     "input": "number",
     "target": 1.0,
     "unit": "Box",
     "unitKo": "박스"
    },
    {
     "name": "Disposable Chopsticks",
     "ko": "일회용 젓가락",
     "note": "",
     "options": [
      {
       "label": "5봉지 이상 / 5+ Bags",
       "status": "SAFE",
       "level": "ok"
      },
      {
       "label": "리스탁 후 2봉지 이상 ~ 4봉지 미만 / 2 bags–Less than 4 Bags After Restocking",
       "status": "LOW",
       "level": "low"
      },
      {
       "label": "리스탁 후 반 봉지 미만 / Less than ½ Bag After Restocking",
       "status": "ORDER",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT",
       "level": "urgent"
      }
     ],
     "id": "w017",
     "input": "number",
     "target": 5.0,
     "unit": "Bag",
     "unitKo": "봉"
    },
    {
     "name": "Napkins",
     "ko": "냅킨",
     "note": "",
     "options": [
      {
       "label": "리스탁 후 5묶음 이상 / 5+ Packs After Restocking",
       "status": "SAFE",
       "level": "ok"
      },
      {
       "label": "리스탁 후 2묶음 이상 ~ 4묶음 미만 / 2–Less than 4 Packs",
       "status": "LOW",
       "level": "low"
      },
      {
       "label": "리스탁 후 1묶음 미만 / Less than 1 Pack",
       "status": "ORDER",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT",
       "level": "urgent"
      }
     ],
     "id": "w018",
     "input": "number",
     "target": 5.0,
     "unit": "Pack",
     "unitKo": "팩"
    },
    {
     "name": "Small To-Go Bags",
     "ko": "투고 봉투 (Small)",
     "note": "",
     "options": [
      {
       "label": "반 박스 이상 / ½ Box or More",
       "status": "SAFE",
       "level": "ok"
      },
      {
       "label": "2묶음 이상 ~ 반 박스 미만 / 2+ Packs–Less than ½ Box",
       "status": "LOW",
       "level": "low"
      },
      {
       "label": "2묶음 미만 / Less than 2 Packs",
       "status": "ORDER",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT",
       "level": "urgent"
      }
     ],
     "id": "w019",
     "input": "number",
     "target": 0.5,
     "unit": "Box",
     "unitKo": "박스"
    },
    {
     "name": "Large To-Go Bags",
     "ko": "투고 봉투 (Large)",
     "note": "",
     "options": [
      {
       "label": "반 박스 이상 / ½ Box or More",
       "status": "SAFE",
       "level": "ok"
      },
      {
       "label": "2묶음 이상 ~ 반 박스 미만 / 2+ Packs–Less than ½ Box",
       "status": "LOW",
       "level": "low"
      },
      {
       "label": "2묶음 미만 / Less than 2 Packs",
       "status": "ORDER",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT",
       "level": "urgent"
      }
     ],
     "id": "w020",
     "input": "number",
     "target": 0.5,
     "unit": "Box",
     "unitKo": "박스"
    },
    {
     "name": "Small Hot Drink Cups & Lids",
     "ko": "작은 뜨거운 음료 컵 & 뚜껑",
     "note": "",
     "options": [
      {
       "label": "1줄 이상 / 1+ Sleeve",
       "status": "SAFE",
       "level": "ok"
      },
      {
       "label": "1/3줄 초과 ~ 1줄 미만 / More than ⅓–Less than 1 Sleeve",
       "status": "LOW",
       "level": "low"
      },
      {
       "label": "1/3줄 이하 / ⅓ Sleeve or Less",
       "status": "ORDER",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT",
       "level": "urgent"
      }
     ],
     "id": "w021",
     "input": "number",
     "target": 1.0,
     "unit": "Sleeve",
     "unitKo": "줄"
    },
    {
     "name": "Large Hot Drink Cups & Lids",
     "ko": "큰 뜨거운 음료 컵 & 뚜껑",
     "note": "",
     "options": [
      {
       "label": "1줄 이상 / 1+ Sleeve",
       "status": "SAFE",
       "level": "ok"
      },
      {
       "label": "1/3줄 초과 ~ 1줄 미만 / More than ⅓–Less than 1 Sleeve",
       "status": "LOW",
       "level": "low"
      },
      {
       "label": "1/3줄 이하 / ⅓ Sleeve or Less",
       "status": "ORDER",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT",
       "level": "urgent"
      }
     ],
     "id": "w022",
     "input": "number",
     "target": 1.0,
     "unit": "Sleeve",
     "unitKo": "줄"
    },
    {
     "name": "Low To-Go Containers & Lids",
     "ko": "부족한 투고 용기 & 뚜껑",
     "note": "Please list ONLY containers or lids with less than ½ sleeve remaining. If everything is sufficiently stocked, write “None.”\n반 줄 미만으로 남은 투고 용기 또는 뚜껑만 적어주세요. 모두 충분하면 “없음”이라고 적어주세요.",
     "options": [],
     "id": "w023",
     "type": "text",
     "input": "text"
    },
    {
     "name": "Dupbap Containers and lids for open fridge",
     "ko": "덮밥 용기와 뚜껑(쿨러용)",
     "note": "",
     "options": [
      {
       "label": "50개 이상 / 50+",
       "status": "SAFE",
       "level": "ok"
      },
      {
       "label": "25–40개 / 25–40",
       "status": "LOW",
       "level": "low"
      },
      {
       "label": "15개 미만 / Less than 15",
       "status": "ORDER",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT",
       "level": "urgent"
      }
     ],
     "id": "w024",
     "input": "number",
     "target": 50.0,
     "unit": "EA",
     "unitKo": "개"
    },
    {
     "name": "Jabchae Containers and lids for open fridge",
     "ko": "잡채 용기와 뚜껑(쿨러용)",
     "note": "",
     "options": [
      {
       "label": "50개 이상 / 50+",
       "status": "SAFE",
       "level": "ok"
      },
      {
       "label": "24–40개 / 25–40",
       "status": "LOW",
       "level": "low"
      },
      {
       "label": "15개 미만 / Less than 15",
       "status": "ORDER",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT",
       "level": "urgent"
      }
     ],
     "id": "w025",
     "input": "number",
     "target": 50.0,
     "unit": "EA",
     "unitKo": "개"
    },
    {
     "name": "Seaweed salad Containers",
     "ko": "씨위드샐러드용기",
     "note": "",
     "options": [
      {
       "label": "15개 이상 / 30+",
       "status": "SAFE",
       "level": "ok"
      },
      {
       "label": "5-15개 / 5-15",
       "status": "LOW",
       "level": "low"
      },
      {
       "label": "5개 미만 / Less than 5",
       "status": "ORDER",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT",
       "level": "urgent"
      }
     ],
     "id": "w026",
     "input": "number",
     "target": 30.0,
     "unit": "EA",
     "unitKo": "개"
    },
    {
     "name": "Miso Soup Containers & Lids",
     "ko": "미소숩 용기 & 뚜껑",
     "note": "",
     "options": [
      {
       "label": "2줄 이상 / 2+ Sleeves",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "반 줄 이상 ~ 2줄 미만 / ½–Less than 2 Sleeves",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "반 줄 미만 / Less than ½ Sleeve",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w027",
     "input": "number",
     "target": 2.0,
     "unit": "Sleeve",
     "unitKo": "줄"
    },
    {
     "name": "1000 mL Container&Lids",
     "ko": "1000mL 컨테이너&뚜껑",
     "note": "",
     "options": [
      {
       "label": "2줄 이상 / 2+ Sleeves",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "반 줄 이상 ~ 2줄 미만 / ½–Less than 2 Sleeves",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "반 줄 미만 / Less than ½ Sleeve",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w028",
     "input": "number",
     "target": 2.0,
     "unit": "Sleeve",
     "unitKo": "줄"
    },
    {
     "name": "Bubble Tea Cups & Lids",
     "ko": "버블티 컵 & 뚜껑",
     "note": "",
     "options": [
      {
       "label": "4줄 이상 / 4+ Sleeves",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1줄 이상 ~ 4줄 미만 / 1–Less than 4 Sleeves",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1줄 미만 / Less than 1 Sleeve",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w029",
     "input": "number",
     "target": 4.0,
     "unit": "Sleeve",
     "unitKo": "줄"
    },
    {
     "name": "Fried Onions",
     "ko": "프라이드 어니언",
     "note": "",
     "options": [
      {
       "label": "2봉 이상 / 2+ Bags",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1봉 이상 ~ 2봉 미만 / 1–Less than 2 Bags",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1봉 미만 / Less than 1 Bag",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w030",
     "input": "number",
     "target": 2.0,
     "unit": "Bag",
     "unitKo": "봉"
    },
    {
     "name": "Wasabi Powder",
     "ko": "와사비파우더",
     "note": "",
     "options": [
      {
       "label": "2봉 이상 / 2+ Bags",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1봉 이상 ~ 2봉 미만 / 1–Less than 2 Bags",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1봉 미만 / Less than 1 Bag",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w031",
     "input": "number",
     "target": 2.0,
     "unit": "Bag",
     "unitKo": "봉"
    },
    {
     "name": "Sushi Gloves",
     "ko": "스시 장갑",
     "note": "Please enter the SIZE and QUANTITY needed. If no gloves are needed, write “None.”\n필요한 장갑의 사이즈와 수량을 적어주세요. 필요한 장갑이 없으면 “없음”이라고 적어주세요.",
     "options": [],
     "id": "w032",
     "type": "text",
     "input": "text"
    },
    {
     "name": "Gloves for middle part",
     "ko": "중간파트 장갑",
     "note": "Please enter the SIZE and QUANTITY needed. If no gloves are needed, write “None.”\n필요한 장갑의 사이즈와 수량을 적어주세요. 필요한 장갑이 없으면 “없음”이라고 적어주세요.",
     "options": [],
     "id": "w033",
     "type": "text",
     "input": "text"
    },
    {
     "name": "Half-Size Seaweed",
     "ko": "하프사이즈 김",
     "note": "",
     "options": [
      {
       "label": "4봉 이상 / 4+ Bags",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1봉 이상 ~ 4봉 미만 / 1–Less than 4 Bags",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1봉 미만 / Less than 1 Bag",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w034",
     "input": "number",
     "target": 4.0,
     "unit": "Bag",
     "unitKo": "봉"
    },
    {
     "name": "Full-Size Seaweed",
     "ko": "풀사이즈 김",
     "note": "",
     "options": [
      {
       "label": "3봉 이상 / 3+ Bags",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1봉 이상 ~ 3봉 미만 / 1–Less than 3 Bags",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1봉 미만 / Less than 1 Bag",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w035",
     "input": "number",
     "target": 3.0,
     "unit": "Bag",
     "unitKo": "봉"
    },
    {
     "name": "To-Go Sushi Soy Sauce",
     "ko": "투고 스시 간장",
     "note": "",
     "options": [
      {
       "label": "2박스 이상 / 2+ Boxes",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1박스 이상 ~ 2박스 미만 / 1–Less than 2 Boxes",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1박스 미만 / Less than 1 Box",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w036",
     "input": "number",
     "target": 2.0,
     "unit": "Box",
     "unitKo": "박스"
    },
    {
     "name": "Sushi Panko",
     "ko": "스시팬코",
     "note": "",
     "options": [
      {
       "label": "6kg 박스 있음 / 6 kg Box Available",
       "status": "SAFE",
       "level": "ok"
      },
      {
       "label": "6kg 박스 거의 없음 또는 없음 / 6 kg Box Almost Empty or Out",
       "status": "ORDER",
       "level": "order"
      }
     ],
     "id": "w037",
     "input": "flag"
    },
    {
     "name": "Lemon",
     "ko": "레몬",
     "note": "",
     "options": [
      {
       "label": "7개 이상 / 7+ Lemons",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "4–6개 / 4–6 Lemons",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "3개 이하 / 3 or Fewer Lemons",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w038",
     "input": "number",
     "target": 7.0,
     "unit": "EA",
     "unitKo": "개"
    },
    {
     "name": "Lime",
     "ko": "라임",
     "note": "",
     "options": [
      {
       "label": "6개 이상 / 6+ Lemons",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "4개 이하 / 4 or Fewer Limes",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w039",
     "input": "number",
     "target": 6.0,
     "unit": "EA",
     "unitKo": "개"
    },
    {
     "name": "Pickled Ginger – Stock Level",
     "ko": "생강 – 재고 상태",
     "note": "",
     "options": [
      {
       "label": "4 Bags or More / 4봉 이상",
       "status": "",
       "level": "ok"
      },
      {
       "label": "2-3Bags / 2-3봉",
       "status": "",
       "level": "low"
      },
      {
       "label": "OUT / 없음",
       "status": "",
       "level": "urgent"
      }
     ],
     "id": "w040",
     "input": "number",
     "target": 4.0,
     "unit": "Bag",
     "unitKo": "봉"
    },
    {
     "name": "Wasabi mayo",
     "ko": "와사비마요",
     "note": "",
     "options": [
      {
       "label": "SAFE / 여유",
       "status": "",
       "level": "ok"
      },
      {
       "label": "NEED TO ORDER / 주문해야함",
       "status": "",
       "level": "urgent"
      }
     ],
     "id": "w041",
     "input": "flag"
    },
    {
     "name": "Yuzu mayo",
     "ko": "유주마요",
     "note": "",
     "options": [
      {
       "label": "SAFE / 여유",
       "status": "",
       "level": "ok"
      },
      {
       "label": "NEED TO ORDER / 주문해야함",
       "status": "",
       "level": "urgent"
      }
     ],
     "id": "w042",
     "input": "flag"
    },
    {
     "name": "Sesame mayo",
     "ko": "세서미마요",
     "note": "",
     "options": [
      {
       "label": "SAFE / 여유",
       "status": "",
       "level": "ok"
      },
      {
       "label": "NEED TO ORDER / 주문해야함",
       "status": "",
       "level": "urgent"
      }
     ],
     "id": "w043",
     "input": "flag"
    },
    {
     "name": "Garlic mayo",
     "ko": "갈릭마요",
     "note": "",
     "options": [
      {
       "label": "SAFE / 여유",
       "status": "",
       "level": "ok"
      },
      {
       "label": "NEED TO ORDER / 주문해야함",
       "status": "",
       "level": "urgent"
      }
     ],
     "id": "w044",
     "input": "flag"
    },
    {
     "name": "Cheongyang Chili Peppers – Stock Level",
     "ko": "청양고추 – 재고 상태",
     "note": "",
     "options": [
      {
       "label": "Enough / 충분함",
       "status": "",
       "level": "ok"
      },
      {
       "label": "Low / 얼마 안 남음",
       "status": "",
       "level": "low"
      },
      {
       "label": "Almost Out / 거의 없음",
       "status": "",
       "level": "order"
      },
      {
       "label": "OUT / 없음",
       "status": "",
       "level": "urgent"
      }
     ],
     "id": "w045",
     "input": "flag"
    }
   ],
   "id": "ws1"
  },
  {
   "en": "Supply Area – Near Washroom",
   "ko": "비품 구역 – 화장실 앞",
   "note": "",
   "items": [
    {
     "name": "Yuzu Syrup",
     "ko": "유자청",
     "note": "",
     "options": [
      {
       "label": "4통 이상 / 4+ Containers",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "2통 이상 ~ 4통 미만 / 2–Less than 4 Containers",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1통 미만 / Less than 1 Container",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w046",
     "input": "number",
     "target": 4.0,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Lemon juice",
     "ko": "레몬즙",
     "note": "",
     "options": [
      {
       "label": "3통 이상 / 3+ Containers",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "2통 이상 ~ 3통 미만 / 2–Less than 3 Containers",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1통 미만 / Less than 1 Container",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w047",
     "input": "number",
     "target": 3.0,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Bubble Tea Straws",
     "ko": "버블티 빨대",
     "note": "",
     "options": [
      {
       "label": "1박스 이상 / 1+ Box",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "반 박스 이상 ~ 1박스 미만 / ½–Less than 1 Box",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "반 박스 미만 / Less than ½ Box",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w048",
     "input": "number",
     "target": 1.0,
     "unit": "Box",
     "unitKo": "박스"
    },
    {
     "name": "Bubly",
     "ko": "버블리",
     "note": "냉장고를 먼저 채운 후 남은 백업 재고 기준 / Restock the fridge first, then check remaining backup stock.",
     "options": [
      {
       "label": "리스탁 후 2박스 이상 / 2+ Boxes After Restocking",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "반 박스 이상 ~ 2박스 미만 / ½–Less than 2 Boxes",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "반 박스 미만 / Less than ½ Box",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w049",
     "input": "number",
     "target": 2.0,
     "unit": "Box",
     "unitKo": "박스"
    },
    {
     "name": "Matcha Powder",
     "ko": "말차 파우더",
     "note": "",
     "options": [
      {
       "label": "2봉 이상 / 2+ Bags",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1봉 이상 ~ 2봉 미만 / 1–Less than 2 Bags",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1봉 미만 / Less than 1 Bag",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w050",
     "input": "number",
     "target": 2.0,
     "unit": "Bag",
     "unitKo": "봉"
    },
    {
     "name": "Taro Powder",
     "ko": "타로 파우더",
     "note": "",
     "options": [
      {
       "label": "2봉 이상 / 2+ Bags",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1봉 이상 ~ 2봉 미만 / 1–Less than 2 Bags",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1봉 미만 / Less than 1 Bag",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w051",
     "input": "number",
     "target": 2.0,
     "unit": "Bag",
     "unitKo": "봉"
    },
    {
     "name": "Milk tea Powder",
     "ko": "밀크티 파우더",
     "note": "",
     "options": [
      {
       "label": "2봉 이상 / 2+ Bags",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1봉 이상 ~ 2봉 미만 / 1–Less than 2 Bags",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1봉 미만 / Less than 1 Bag",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w052",
     "input": "number",
     "target": 2.0,
     "unit": "Bag",
     "unitKo": "봉"
    },
    {
     "name": "Takeout Drink Supplies Request",
     "ko": "투고 음료용품 요청",
     "note": "Please list any takeout drink supplies that are running low or need to be ordered, such as sealing film or drink carriers. If nothing is needed, write “None.”\n투고용 음료 실링지, 음료 캐리어 등 부족하거나 주문이 필요한 음료용품을 적어주세요. 필요한 것이 없으면 “없음”이라고 적어주세요.",
     "options": [],
     "id": "w053",
     "type": "text",
     "input": "text"
    },
    {
     "name": "Half-Pound Chicken Box",
     "ko": "하프파운드용 치킨박스",
     "note": "",
     "options": [
      {
       "label": "30개 이상 / 30+ Boxes",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "10–29개 / 10–29 Boxes",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "10개 미만 / Less than 10 Boxes",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w054",
     "input": "number",
     "target": 30.0,
     "unit": "Box",
     "unitKo": "박스"
    },
    {
     "name": "One-Pound Chicken Box",
     "ko": "원파운드용 치킨박스",
     "note": "",
     "options": [
      {
       "label": "30개 이상 / 30+ Boxes",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "10–29개 / 10–29 Boxes",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "10개 미만 / Less than 10 Boxes",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w055",
     "input": "number",
     "target": 30.0,
     "unit": "Box",
     "unitKo": "박스"
    },
    {
     "name": "Small Sushi Platter Boxes",
     "ko": "스시 플래터 작은 박스",
     "note": "Restock the front area first, then check the remaining backup stock. / 앞쪽을 먼저 리스탁한 후 남은 백업 재고를 확인해주세요.",
     "options": [
      {
       "label": "20개 이상 / 20+ Boxes",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "5–19개 / 5–19 Boxes",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "5개 미만 / Less than 5 Boxes",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w056",
     "input": "number",
     "target": 20.0,
     "unit": "Box",
     "unitKo": "박스"
    },
    {
     "name": "Large Sushi Platter Boxes",
     "ko": "스시 플래터 큰 박스",
     "note": "Restock the front area first, then check the remaining backup stock. / 앞쪽을 먼저 리스탁한 후 남은 백업 재고를 확인해주세요.",
     "options": [
      {
       "label": "20개 이상 / 20+ Boxes",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "5–19개 / 5–19 Boxes",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "5개 미만 / Less than 5 Boxes",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w057",
     "input": "number",
     "target": 20.0,
     "unit": "Box",
     "unitKo": "박스"
    },
    {
     "name": "Mayonnaise –(pails)",
     "ko": "마요네즈",
     "note": "",
     "options": [
      {
       "label": "반통 이상 / ½ Container or More",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1/3통 이상 ~ 반통 미만 / ⅓–Less than ½ Container",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1/3통 미만 / Less than ⅓ Container",
       "status": "ORDER / 주문 필요",
       "level": "order"
      }
     ],
     "id": "w058",
     "input": "number",
     "target": 0.5,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "MSG (Mi-won)",
     "ko": "미원",
     "note": "",
     "options": [
      {
       "label": "Enough Stock / 넉넉함",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "Need to Order / 주문 필요",
       "status": "ORDER",
       "level": "order"
      }
     ],
     "id": "w059",
     "input": "flag"
    },
    {
     "name": "Potato Starch",
     "ko": "감자전분",
     "note": "",
     "options": [
      {
       "label": "Enough Stock / 넉넉함",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "Need to Order / 주문 필요",
       "status": "ORDER",
       "level": "order"
      }
     ],
     "id": "w060",
     "input": "flag"
    },
    {
     "name": "Black Bean Paste (Chunjang)",
     "ko": "춘장",
     "note": "",
     "options": [
      {
       "label": "Enough Stock / 넉넉함",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "Need to Order / 주문 필요",
       "status": "ORDER",
       "level": "order"
      }
     ],
     "id": "w061",
     "input": "flag"
    },
    {
     "name": "Chinese soy sauce",
     "ko": "중국간장",
     "note": "",
     "options": [
      {
       "label": "Enough Stock / 넉넉함",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "Need to Order / 주문 필요",
       "status": "ORDER",
       "level": "order"
      }
     ],
     "id": "w062",
     "input": "flag"
    },
    {
     "name": "Miso Soup",
     "ko": "미소숩",
     "note": "",
     "options": [
      {
       "label": "2봉 이상 / 2+ Bags",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "반 봉 이상 ~ 2봉 미만 / ½–Less than 2 Bags",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "반 봉 미만 / Less than ½ Bag",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w063",
     "input": "number",
     "target": 2.0,
     "unit": "Bag",
     "unitKo": "봉"
    },
    {
     "name": "Rice",
     "ko": "쌀",
     "note": "",
     "options": [
      {
       "label": "3포대 이상 / 3+ Bags",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1포대 이상 ~ 3포대 미만 / 1–Less than 3 Bags",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1포대 미만 / Less than 1 Bag",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w064",
     "input": "number",
     "target": 3.0,
     "unit": "Sack",
     "unitKo": "포대"
    },
    {
     "name": "Rice cake",
     "ko": "떡",
     "note": "Exclude individually portioned bags. / 1인분으로 소분된 봉투 제외",
     "options": [
      {
       "label": "2봉 이상 / 2+ Bags",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1봉 이상 ~ 2봉 미만 / 1–Less than 2 Bags",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1봉 미만 / Less than 1 Bag",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w065",
     "input": "number",
     "target": 2.0,
     "unit": "Bag",
     "unitKo": "봉"
    },
    {
     "name": "Purple rice",
     "ko": "흑미",
     "note": "",
     "options": [
      {
       "label": "1봉 이상 / 1+ Bag",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1/3봉 초과 ~ 1봉 미만 / More than ⅓–Less than 1 Bag",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1/3봉 이하 / ⅓ Bag or Less",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w066",
     "input": "number",
     "target": 1.0,
     "unit": "Bag",
     "unitKo": "봉"
    },
    {
     "name": "White sesame seeds",
     "ko": "참깨",
     "note": "1000mL Container",
     "options": [
      {
       "label": "2통 이상 / 2+ Containers",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1통 이상 ~ 2통 미만 / 1–Less than 2 Containers",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1통 미만 / Less than 1 Container",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w067",
     "input": "number",
     "target": 2.0,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Black sesame seeds",
     "ko": "검은깨",
     "note": "1000mL Container",
     "options": [
      {
       "label": "1통 이상 / 1+ Containers",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1통 미만 / Less than 1 Container",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w068",
     "input": "number",
     "target": 1.0,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Yuzu Soy Sauce",
     "ko": "유자 소이",
     "note": "",
     "options": [
      {
       "label": "반통 이상 / ½ Container or More",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1/5통 이상 ~ 반통 미만 / ⅕–Less than ½ Container",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1/5통 미만 / Less than ⅕ Container",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w069",
     "input": "number",
     "target": 0.5,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Tsuyu",
     "ko": "쯔유",
     "note": "",
     "options": [
      {
       "label": "반통 이상 / ½ Container or More",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1/5통 이상 ~ 반통 미만 / ⅕–Less than ½ Container",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1/5통 미만 / Less than ⅕ Container",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w070",
     "input": "number",
     "target": 0.5,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Gluten free soy sauce",
     "ko": "글루텐 프리 스",
     "note": "",
     "options": [
      {
       "label": "반통 이상 / ½ Container or More",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1/5통 이상 ~ 반통 미만 / ⅕–Less than ½ Container",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1/5통 미만 / Less than ⅕ Container",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w071",
     "input": "number",
     "target": 0.5,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Yuzu Dressing",
     "ko": "유자 드레싱",
     "note": "",
     "options": [
      {
       "label": "반통 이상 / ½ Container or More",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1/5통 이상 ~ 반통 미만 / ⅕–Less than ½ Container",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1/5통 미만 / Less than ⅕ Container",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w072",
     "input": "number",
     "target": 0.5,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Soy Sauce",
     "ko": "간장",
     "note": "",
     "options": [
      {
       "label": "반통 이상 / ½ Container or More",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1/5통 이상 ~ 반통 미만 / ⅕–Less than ½ Container",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1/5통 미만 / Less than ⅕ Container",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w073",
     "input": "number",
     "target": 0.5,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Dumpling Soy Sauce",
     "ko": "만두 간장",
     "note": "",
     "options": [
      {
       "label": "반통 이상 / ½ Container or More",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1/5통 이상 ~ 반통 미만 / ⅕–Less than ½ Container",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1/5통 미만 / Less than ⅕ Container",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w074",
     "input": "number",
     "target": 0.5,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Cook Soy Sauce",
     "ko": "쿡 간장",
     "note": "",
     "options": [
      {
       "label": "3/4통 이상 / 3/4 Container or More",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1/5통 이상 ~ 3/4통 미만 / ⅕–Less than 3/4 Container",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1/5통 미만 / Less than ⅕ Container",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w075",
     "input": "number",
     "target": 0.75,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Canned Tuna",
     "ko": "캔 튜나",
     "note": "",
     "options": [
      {
       "label": "3캔 이상 / 3+ Cans",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "2캔 / 2 Cans",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1캔 이하 / 1 Can or Less",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w076",
     "input": "number",
     "target": 3.0,
     "unit": "Can",
     "unitKo": "캔"
    },
    {
     "name": "Canned mushroom",
     "ko": "캔 머쉬룸",
     "note": "Exclude portioned stock. Check backup cans only. / 소분되어 있는 재고는 제외하고 백업 캔만 확인해주세요.",
     "options": [
      {
       "label": "백업 1캔 이상 / 1+ Backup Can",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "백업 없음 / No Backup Can",
       "status": "ORDER / 주문 필요",
       "level": "order"
      }
     ],
     "id": "w077",
     "input": "number",
     "target": 1.0,
     "unit": "Can",
     "unitKo": "캔"
    },
    {
     "name": "Mango Syrup",
     "ko": "망고 시럽",
     "note": "The container is opaque, so estimate the remaining amount by weight. / 용기 안이 보이지 않으므로 무게로 대략적인 양을 확인해주세요.",
     "options": [
      {
       "label": "반통 이상 / ½ Container or More",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "반통 미만 / Less than ½ Container",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "거의 없음 / Almost Out",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w078",
     "input": "number",
     "target": 0.5,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Passion fruit Syrup",
     "ko": "패션후르츠 시럽",
     "note": "The container is opaque, so estimate the remaining amount by weight. / 용기 안이 보이지 않으므로 무게로 대략적인 양을 확인해주세요.",
     "options": [
      {
       "label": "반통 이상 / ½ Container or More",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "반통 미만 / Less than ½ Container",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "거의 없음 / Almost Out",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w079",
     "input": "number",
     "target": 0.5,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Brown sugar Syrup",
     "ko": "브라운슈가 시럽",
     "note": "The container is opaque, so estimate the remaining amount by weight. / 용기 안이 보이지 않으므로 무게로 대략적인 양을 확인해주세요.",
     "options": [
      {
       "label": "반통 이상 / ½ Container or More",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "반통 미만 / Less than ½ Container",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "거의 없음 / Almost Out",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w080",
     "input": "number",
     "target": 0.5,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Honeydew Syrup",
     "ko": "허니듀 시럽",
     "note": "The container is opaque, so estimate the remaining amount by weight. / 용기 안이 보이지 않으므로 무게로 대략적인 양을 확인해주세요.",
     "options": [
      {
       "label": "반통 이상 / ½ Container or More",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "반통 미만 / Less than ½ Container",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "거의 없음 / Almost Out",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w081",
     "input": "number",
     "target": 0.5,
     "unit": "Container",
     "unitKo": "통"
    }
   ],
   "id": "ws2"
  },
  {
   "en": "Freezer Items",
   "ko": "냉동고 보관 제품",
   "note": "",
   "items": [
    {
     "name": "Unagi",
     "ko": "우나기",
     "note": "",
     "options": [
      {
       "label": "5봉 이상 / 5+ Packs",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "2–4봉 / 2–4 Packs",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "2봉 미만 / Less than 2 Packs",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w082",
     "input": "number",
     "target": 5.0,
     "unit": "Pack",
     "unitKo": "팩"
    },
    {
     "name": "Shredded Crab",
     "ko": "슈레디드크랩",
     "note": "",
     "options": [
      {
       "label": "5봉 이상 / 5+ Packs",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "2–4봉 / 2–4 Packs",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "2봉 미만 / Less than 2 Packs",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w083",
     "input": "number",
     "target": 5.0,
     "unit": "Pack",
     "unitKo": "팩"
    },
    {
     "name": "Tamago",
     "ko": "타마고",
     "note": "",
     "options": [
      {
       "label": "3봉 이상 / 3+ Packs",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "2봉 / 2 Packs",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w084",
     "input": "number",
     "target": 3.0,
     "unit": "Pack",
     "unitKo": "팩"
    },
    {
     "name": "Seaweed Salad",
     "ko": "씨위드샐러드",
     "note": "Exclude the stock in the refrigerator. / 냉장고에 있는 재고 제외",
     "options": [
      {
       "label": "3봉 이상 / 3+ Packs",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "2봉 / 2 Packs",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w085",
     "input": "number",
     "target": 3.0,
     "unit": "Pack",
     "unitKo": "팩"
    },
    {
     "name": "Inari",
     "ko": "유부",
     "note": "Exclude the stock in the refrigerator. / 냉장고에 있는 재고 제외",
     "options": [
      {
       "label": "2봉 이상 / 2+ Packs",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1봉 / 1 Packs",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w086",
     "input": "number",
     "target": 2.0,
     "unit": "Pack",
     "unitKo": "팩"
    },
    {
     "name": "Masago",
     "ko": "마사고",
     "note": "Exclude the stock in the refrigerator. / 냉장고에 있는 재고 제외",
     "options": [
      {
       "label": "3통 이상 / 3+ Containers",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1-2통 / 1-2Container",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w087",
     "input": "number",
     "target": 3.0,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Imitation Crab stick",
     "ko": "맛살스틱",
     "note": "Exclude the stock in the refrigerator. / 냉장고에 있는 재고 제외",
     "options": [
      {
       "label": "6팩 이상 / 6+ packs",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "2-4팩 / 2-4packs",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w088",
     "input": "number",
     "target": 6.0,
     "unit": "Pack",
     "unitKo": "팩"
    },
    {
     "name": "Fish Cake",
     "ko": "오뎅",
     "note": "Exclude rice cakes and portioned stock. / 떡과 소분되어 있는 재고 제외",
     "options": [
      {
       "label": "2봉 이상 / 2+ Bags",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1봉 이상 ~ 2봉 미만 / 1–Less than 2 Bags",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1봉 미만 / Less than 1 Bag",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w089",
     "input": "number",
     "target": 2.0,
     "unit": "Bag",
     "unitKo": "봉"
    },
    {
     "name": "Portioned Ham & Bacon (For Tteokbokki)",
     "ko": "떡볶이용 햄 & 베이컨 소분백",
     "note": "",
     "options": [
      {
       "label": "15봉 이상 / 15+ Portioned Bags",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "6–14봉 / 6–14 Portioned Bags",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "5봉 이하 / 5 or Fewer Portioned Bags",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w090",
     "input": "number",
     "target": 15.0,
     "unit": "Bag",
     "unitKo": "봉"
    }
   ],
   "id": "ws3"
  },
  {
   "en": "Refrigerated Items",
   "ko": "냉장고 제품",
   "note": "",
   "items": [
    {
     "name": "Strawberry Purée",
     "ko": "딸기청",
     "note": "",
     "options": [
      {
       "label": "4통 이상 / 4+ Containers",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "2–3통 / 2–3 Containers",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "2통 미만 / Less than 2 Containers",
       "status": "ORDER / 주문 필요",
       "level": "order"
      }
     ],
     "id": "w091",
     "input": "number",
     "target": 4.0,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Mango Purée",
     "ko": "망고청",
     "note": "",
     "options": [
      {
       "label": "3통 이상 / 3+ Containers",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1-2통 / 1-2 Containers",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1통 미만 / Less than 1 Containers",
       "status": "ORDER / 주문 필요",
       "level": "order"
      }
     ],
     "id": "w092",
     "input": "number",
     "target": 3.0,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Low Toppings",
     "ko": "부족한 토핑",
     "note": "Please list any toppings that are running low or need to be ordered.\n부족하거나 주문이 필요한 토핑이 있으면 적어주세요.\ne.g., Mango Popping Boba, Lychee Popping Boba, Rainbow Jelly, etc. / 예: 망고 팝핑보바, 리치 팝핑보바, 레인보우 젤리 등\nIf nothing is needed, write “None.” / 필요한 것이 없으면 “없음”이라고 적어주세요.",
     "options": [],
     "id": "w093",
     "type": "text",
     "input": "text"
    },
    {
     "name": "Gochujang Sauce",
     "ko": "고추장 소스",
     "note": "Refill the front container first, then check the remaining backup stock. / 앞쪽 용기를 먼저 채운 후 남은 백업 재고를 확인해주세요.",
     "options": [
      {
       "label": "거의 1통 / Almost 1 Full Container",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1/3통 이상 ~ 1통 미만 / ⅓–Less than 1 Container",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1/3통 미만 / Less than ⅓ Container",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w094",
     "input": "number",
     "target": 1.0,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Teriyaki Sauce",
     "ko": "데리야끼 소스",
     "note": "Refill the front container first, then check the remaining backup stock. / 앞쪽 용기를 먼저 채운 후 남은 백업 재고를 확인해주세요.",
     "options": [
      {
       "label": "거의 1통 / Almost 1 Full Container",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1/3통 이상 ~ 1통 미만 / ⅓–Less than 1 Container",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1/3통 미만 / Less than ⅓ Container",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w095",
     "input": "number",
     "target": 1.0,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Sweet & Spicy Sauce",
     "ko": "스윗 앤 스파이시 소스",
     "note": "Refill the front container first, then check the remaining backup stock. / 앞쪽 용기를 먼저 채운 후 남은 백업 재고를 확인해주세요.",
     "options": [
      {
       "label": "거의 1통 / Almost 1 Full Container",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1/3통 이상 ~ 1통 미만 / ⅓–Less than 1 Container",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1/3통 미만 / Less than ⅓ Container",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w096",
     "input": "number",
     "target": 1.0,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Honey Garlic Sauce",
     "ko": "허니갈릭 소스",
     "note": "Refill the front container first, then check the remaining backup stock. / 앞쪽 용기를 먼저 채운 후 남은 백업 재고를 확인해주세요.",
     "options": [
      {
       "label": "거의 1통 / Almost 1 Full Container",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1/3통 이상 ~ 1통 미만 / ⅓–Less than 1 Container",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1/3통 미만 / Less than ⅓ Container",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w097",
     "input": "number",
     "target": 1.0,
     "unit": "Container",
     "unitKo": "통"
    }
   ],
   "id": "ws4"
  },
  {
   "en": "Cleaning Supplies Cabinet (In Front of Washroom)",
   "ko": "화장실 앞 청소용품 수납장",
   "note": "",
   "items": [
    {
     "name": "Black Garbage Bags (30 Gallon)",
     "ko": "검정 쓰레기봉투 (30갤런)",
     "note": "",
     "options": [
      {
       "label": "충분함 / Enough Stock",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "주문 필요 / Need to Order",
       "status": "ORDER / 주문 필요",
       "level": "order"
      }
     ],
     "id": "w098",
     "input": "flag"
    },
    {
     "name": "Windex",
     "ko": "윈덱스",
     "note": "",
     "options": [
      {
       "label": "충분함 / Enough Stock",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "주문 필요 / Need to Order",
       "status": "ORDER / 주문 필요",
       "level": "order"
      }
     ],
     "id": "w099",
     "input": "flag"
    },
    {
     "name": "Febreze",
     "ko": "페브리즈",
     "note": "",
     "options": [
      {
       "label": "충분함 / Enough Stock",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "주문 필요 / Need to Order",
       "status": "ORDER / 주문 필요",
       "level": "order"
      }
     ],
     "id": "w100",
     "input": "flag"
    },
    {
     "name": "Dishwashing Detergent",
     "ko": "주방세제",
     "note": "Exclude the container currently in use. Check backup stock only. / 현재 사용 중인 통은 제외하고 백업 재고만 확인해주세요.",
     "options": [
      {
       "label": "백업 1통 있음 / 1+ Backup Container",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "백업 없음 / No Backup Container",
       "status": "ORDER / 주문 필요",
       "level": "order"
      }
     ],
     "id": "w101",
     "input": "number",
     "target": 1.0,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Toilet Paper",
     "ko": "화장실 휴지",
     "note": "",
     "options": [
      {
       "label": "6롤 이상 / 6+ Rolls",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "3–5롤 / 3–5 Rolls",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "3롤 미만 / Less than 3 Rolls",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "w102",
     "input": "number",
     "target": 6.0,
     "unit": "Roll",
     "unitKo": "롤"
    }
   ],
   "id": "ws5"
  }
 ],
 "extra": {
  "title": "Additional Items or Replacements Needed",
  "ko": "추가 필요 또는 교체 물품",
  "help": "",
  "question": "Are there any additional items needed or anything that needs to be replaced? 추가로 필요하거나 교체해야 할 물건이 있습니까?"
 }
};
