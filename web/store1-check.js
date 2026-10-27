// Store #1 station inventory (Server, Sushi, Middle, Cook), from the store's inventory form.
// To change an item, edit its text here and push to GitHub.
// Keep each item `id` the same so past checks still line up; use a new id for a new item.
// input: number = staff enter how much is SHORT of `target` (in `unit`; +/- moves by `step`), like Store #2
//        count  = staff enter the actual quantity on hand (only for items without a target)
//        choice = staff pick the stock level; the first option is pre-selected
// level: ok (SAFE/OK) · low (LOW) · order (ORDER/BUY/PREP/REQUEST) · urgent (URGENT/OUT)
window.STORE1_STATIONS = {
  "server": {
    "name": "Server",
    "ko": "서버",
    "note": "Enter how much is SHORT of the target for each item, in whole units (case, box, bottle…). Leave 0 if it's full. 품목마다 기준보다 부족한 수량만 단위(박스, 병 등)에 맞춰 정수로 입력해주세요. 가득 차 있으면 0 그대로 두세요.",
    "sections": [
      {
        "en": "Beverages",
        "ko": "음료",
        "note": "Enter how many cases are short of the target, counting the cooler and back stock together. Whole cases only. 냉장고와 보관 재고를 합쳐서 기준보다 부족한 박스 수만 입력해주세요. (예: 기준 3박스, 2박스 있음 → 1)",
        "items": [
          {
            "id": "s1001",
            "name": "Coke(case)",
            "ko": "",
            "note": "",
            "input": "number",
            "unit": "case",
            "unitKo": "박스",
            "step": 1,
            "target": 3
          },
          {
            "id": "s1002",
            "name": "Coke Zero(case)",
            "ko": "",
            "note": "",
            "input": "number",
            "unit": "case",
            "unitKo": "박스",
            "step": 1,
            "target": 3
          },
          {
            "id": "s1003",
            "name": "Diet Coke(case)",
            "ko": "",
            "note": "",
            "input": "number",
            "unit": "case",
            "unitKo": "박스",
            "step": 1,
            "target": 3
          },
          {
            "id": "s1004",
            "name": "Canada dry(case)",
            "ko": "",
            "note": "",
            "input": "number",
            "unit": "case",
            "unitKo": "박스",
            "step": 1,
            "target": 3
          },
          {
            "id": "s1005",
            "name": "Sprite(case)",
            "ko": "",
            "note": "",
            "input": "number",
            "unit": "case",
            "unitKo": "박스",
            "step": 1,
            "target": 3
          },
          {
            "id": "s1006",
            "name": "Fuze(case)",
            "ko": "",
            "note": "",
            "input": "number",
            "unit": "case",
            "unitKo": "박스",
            "step": 1,
            "target": 3
          },
          {
            "id": "s1007",
            "name": "Bottled water(case)",
            "ko": "",
            "note": "",
            "input": "number",
            "unit": "case",
            "unitKo": "박스",
            "step": 1,
            "target": 3
          },
          {
            "id": "s1009",
            "name": "Banana milk(case)",
            "ko": "",
            "note": "",
            "input": "number",
            "unit": "case",
            "unitKo": "박스",
            "step": 1,
            "target": 3
          },
          {
            "id": "s1010",
            "name": "San pellegrino(Red) (4-Pack Sets)",
            "ko": "",
            "note": "",
            "input": "number",
            "unit": "4-pack set",
            "unitKo": "4팩 세트",
            "step": 1,
            "target": 2
          },
          {
            "id": "s1011",
            "name": "San pellegrino(Yellow) (4-Pack Sets)",
            "ko": "",
            "note": "",
            "input": "number",
            "unit": "4-pack set",
            "unitKo": "4팩 세트",
            "step": 1,
            "target": 2
          },
          {
            "id": "s1012",
            "name": "San pellegrino(Green) ( 4-Pack Sets)",
            "ko": "",
            "note": "",
            "input": "number",
            "unit": "4-pack set",
            "unitKo": "4팩 세트",
            "step": 1,
            "target": 2
          },
          {
            "id": "s1013",
            "name": "San pellegrino(Orange) (4-Pack Sets)",
            "ko": "",
            "note": "",
            "input": "number",
            "unit": "4-pack set",
            "unitKo": "4팩 세트",
            "step": 1,
            "target": 2
          },
          {
            "id": "s1014",
            "name": "Arizona (case)",
            "ko": "",
            "note": "",
            "input": "number",
            "unit": "case",
            "unitKo": "박스",
            "step": 1,
            "target": 2
          },
          {
            "id": "s1015",
            "name": "Mango juice(case)",
            "ko": "",
            "note": "",
            "input": "number",
            "unit": "case",
            "unitKo": "박스",
            "step": 1,
            "target": 1
          },
          {
            "id": "s1016",
            "name": "Milkis(case)",
            "ko": "",
            "note": "",
            "input": "number",
            "unit": "case",
            "unitKo": "박스",
            "step": 1,
            "target": 1
          }
        ]
      },
      {
        "en": "Bubble tea Station",
        "ko": "버블티 제조재료 및 용품",
        "note": "Enter how much is short of the target for each item. 각 품목마다 기준보다 부족한 수량만 입력해주세요.",
        "items": [
          {
            "id": "s1017",
            "name": "Bubble tea Straw",
            "ko": "버블티 빨대",
            "note": "",
            "input": "number",
            "unit": "box",
            "unitKo": "박스",
            "step": 1,
            "target": 6
          },
          {
            "id": "s1018",
            "name": "Drink Straw",
            "ko": "음료빨대",
            "note": "",
            "input": "number",
            "unit": "box",
            "unitKo": "박스",
            "step": 1,
            "target": 1
          },
          {
            "id": "s1019",
            "name": "1-Cup Drink bags(pack)",
            "ko": "음료비닐봉투 1구",
            "note": "",
            "input": "number",
            "unit": "pack",
            "unitKo": "묶음",
            "step": 1,
            "target": 4
          },
          {
            "id": "s1020",
            "name": "2-Cup Drink bags(pack)",
            "ko": "음료비닐봉투 2구",
            "note": "",
            "input": "number",
            "unit": "pack",
            "unitKo": "묶음",
            "step": 1,
            "target": 4
          },
          {
            "id": "s1021",
            "name": "Cup Lid Sealing Paper – Stock Level",
            "ko": "음료 뚜껑 실링지",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "Well Stocked / 넉넉함",
                "status": "",
                "level": "ok"
              },
              {
                "label": "Getting Low / 얼마 안 남음",
                "status": "",
                "level": "low"
              },
              {
                "label": "Need to Order / 주문 필요",
                "status": "",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "URGENT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1022",
            "name": "Iced Cups (sleeve)",
            "ko": "아이스컵",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "10 Sleeves or More / 10줄(묶음) 이상",
                "status": "",
                "level": "ok"
              },
              {
                "label": "Less than 5 Sleeves / 5줄(묶음) 미만",
                "status": "",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1023",
            "name": "Iced Cups Lids (sleeve)",
            "ko": "아이스컵 뚜껑",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "10 Sleeves or More / 10줄(묶음) 이상",
                "status": "",
                "level": "ok"
              },
              {
                "label": "Less than 5 Sleeves / 5줄(묶음) 미만",
                "status": "",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1024",
            "name": "Hot Drink cups (sleeve)",
            "ko": "핫 음료 테이크아웃 컵",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "5 Sleeves or More / 5줄 이상",
                "status": "",
                "level": "ok"
              },
              {
                "label": "Less than 3 Sleeves / 3줄 미만",
                "status": "",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1025",
            "name": "Hot Drink Cups Lids (sleeve)",
            "ko": "핫 음료 테이크아웃 뚜껑",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "5 Sleeves or More / 5줄 이상",
                "status": "",
                "level": "ok"
              },
              {
                "label": "Less than 3 Sleeves / 3줄 미만",
                "status": "",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1026",
            "name": "Brown Sugar Syrup UNOPENED(bottle)",
            "ko": "흑당시럽 - 미개봉병만 카운트",
            "note": "",
            "input": "number",
            "unit": "bottle",
            "unitKo": "병",
            "step": 1,
            "target": 2
          },
          {
            "id": "s1027",
            "name": "Mango Syrup UNOPENED(bottle)",
            "ko": "망고시럽 - 미개봉병만 카운트",
            "note": "",
            "input": "number",
            "unit": "bottle",
            "unitKo": "병",
            "step": 1,
            "target": 1
          },
          {
            "id": "s1028",
            "name": "Passion Fruit Syrup UNOPENED(bottle)",
            "ko": "패션후르츠시럽 - 미개봉병만 카운트",
            "note": "",
            "input": "number",
            "unit": "bottle",
            "unitKo": "병",
            "step": 1,
            "target": 1
          },
          {
            "id": "s1029",
            "name": "Bubly – Stock Level",
            "ko": "버블리 – 재고 (box)",
            "note": "",
            "input": "number",
            "unit": "box",
            "unitKo": "박스",
            "step": 1,
            "target": 7
          },
          {
            "id": "s1030",
            "name": "Oat Milk (cartons)",
            "ko": "오트밀크 (팩)",
            "note": "",
            "input": "number",
            "unit": "carton",
            "unitKo": "팩",
            "step": 1,
            "target": 4
          },
          {
            "id": "s1031",
            "name": "Matcha Powder UNOPENED(bags)",
            "ko": "말차파우더 - 미개봉 봉지만 카운트",
            "note": "",
            "input": "number",
            "unit": "bag",
            "unitKo": "봉",
            "step": 1,
            "target": 6
          },
          {
            "id": "s1032",
            "name": "Milk tea Powder UNOPENED(bags)",
            "ko": "밀크티파우더 - 미개봉 봉지만 카운트",
            "note": "",
            "input": "number",
            "unit": "bag",
            "unitKo": "봉",
            "step": 1,
            "target": 6
          },
          {
            "id": "s1033",
            "name": "Taro Powder UNOPENED(bags)",
            "ko": "타로파우더 - 미개봉 봉지만 카운트",
            "note": "",
            "input": "number",
            "unit": "bag",
            "unitKo": "봉",
            "step": 1,
            "target": 3
          },
          {
            "id": "s1034",
            "name": "Lemon Juice - UNOPENED (bottles)",
            "ko": "레몬즙 미개봉병만 카운트",
            "note": "",
            "input": "number",
            "unit": "bottle",
            "unitKo": "병",
            "step": 1,
            "target": 6
          },
          {
            "id": "s1035",
            "name": "Whipping cream - UNOPENED (cartons)",
            "ko": "생크림 미개봉팩만 카운트",
            "note": "",
            "input": "number",
            "unit": "carton",
            "unitKo": "팩",
            "step": 1,
            "target": 2
          },
          {
            "id": "s1036",
            "name": "Yuzu Fruit base - UNOPENED (jar)",
            "ko": "유자청 미개봉병만 카운트",
            "note": "",
            "input": "number",
            "unit": "jar",
            "unitKo": "병",
            "step": 1,
            "target": 12
          },
          {
            "id": "s1037",
            "name": "Strawberry Fruit base (1000ml container)",
            "ko": "딸기청 1000ml",
            "note": "",
            "input": "number",
            "unit": "1000ml container",
            "unitKo": "통",
            "step": 1,
            "target": 8
          },
          {
            "id": "s1038",
            "name": "Mango Fruit base (1000ml container)",
            "ko": "망고청 1000ml",
            "note": "",
            "input": "number",
            "unit": "1000ml container",
            "unitKo": "통",
            "step": 1,
            "target": 8
          },
          {
            "id": "s1039",
            "name": "Lychee Popping boba - UNOPENED(containers)",
            "ko": "리치팝핑보바 - 미개봉통",
            "note": "",
            "input": "number",
            "unit": "container",
            "unitKo": "통",
            "step": 1,
            "target": 2
          },
          {
            "id": "s1040",
            "name": "Mango Popping boba - UNOPENED(containers)",
            "ko": "망고팝핑보바 - 미개봉통",
            "note": "",
            "input": "number",
            "unit": "container",
            "unitKo": "통",
            "step": 1,
            "target": 2
          },
          {
            "id": "s1041",
            "name": "Rainbow Jelly - UNOPENED(containers)",
            "ko": "레인보우젤리 - 미개봉통",
            "note": "",
            "input": "number",
            "unit": "container",
            "unitKo": "통",
            "step": 1,
            "target": 2
          },
          {
            "id": "s1042",
            "name": "Uncooked Tapioca Pearls - UNOPENED(bags)",
            "ko": "안 삶은 타피오카펄 - 미개봉 봉지",
            "note": "",
            "input": "number",
            "unit": "bag",
            "unitKo": "봉",
            "step": 1,
            "target": 6
          },
          {
            "id": "s1043",
            "name": "Cooked Tapioca Pearls(in the Fridge)(bags)",
            "ko": "삶은 타피오카펄(소분된것)(냉동실안에 있는것)",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "30 Bags or More / 30봉 이상",
                "status": "",
                "level": "ok"
              },
              {
                "label": "Less than 15 Bags / 15봉 미만",
                "status": "",
                "level": "low"
              },
              {
                "label": "Less than 5 Bags / 5봉 미만",
                "status": "",
                "level": "order"
              }
            ]
          },
          {
            "id": "s1044",
            "name": "Milk (bags)",
            "ko": "우유 (봉지)",
            "note": "",
            "input": "number",
            "unit": "bag",
            "unitKo": "봉",
            "step": 1,
            "target": 5
          }
        ]
      },
      {
        "en": "Packaging & Store Supplies",
        "ko": "포장용품 및 매장 소모품",
        "note": "Check all packaging materials and general store supplies. Follow the stock level shown for each item. / 포장용품 및 매장 운영에 필요한 소모품의 재고를 확인해주세요. 각 품목의 재고 기준에 따라 확인해주세요.",
        "items": [
          {
            "id": "s1045",
            "name": "Disposable Chopsticks(box)",
            "ko": "일회용 젓가락(박스)",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "More than ½ Box / 반 박스 초과",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "⅓–½ Box / 1/3~1/2박스",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "⅓ Box or Less / 1/3박스 이하",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "URGENT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1046",
            "name": "Disposable Spoons(box)",
            "ko": "일회용 숟가락(박스)",
            "note": "e.g. Unopened 1 box + about half box = 1.5",
            "input": "number",
            "unit": "box",
            "unitKo": "박스",
            "step": 1,
            "target": 1
          },
          {
            "id": "s1047",
            "name": "Disposable Forks(box)",
            "ko": "일회용 포크(박스)",
            "note": "e.g. Unopened 1 box + about half box = 1.5",
            "input": "number",
            "unit": "box",
            "unitKo": "박스",
            "step": 1,
            "target": 1
          },
          {
            "id": "s1048",
            "name": "Napkins(box)",
            "ko": "냅킨(박스)",
            "note": "e.g. Unopened 1 box + about half box = 1.5",
            "input": "number",
            "unit": "box",
            "unitKo": "박스",
            "step": 1,
            "target": 1
          },
          {
            "id": "s1049",
            "name": "Takeout Bags - Small (pack)",
            "ko": "투고 봉투 S (묶음)",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "2 Boxes or More / 2박스 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "1–2 Boxes / 1~2박스",
                "status": "LOW",
                "level": "low"
              },
              {
                "label": "Less than 1 Box / 1박스 미만",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "URGENT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1050",
            "name": "Takeout Bags - Large (pack)",
            "ko": "투고 봉투 L (묶음)",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "2 Boxes or More / 2박스 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "1–2 Boxes / 1~2박스",
                "status": "LOW",
                "level": "low"
              },
              {
                "label": "Less than 1 Box / 1박스 미만",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "URGENT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1051",
            "name": "Large Receipt Paper Rolls – Stock Level",
            "ko": "영수증용지 큰 롤 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "3 Bundles or More / 3묶음 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "2 Bundles / 2묶음",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "1 Bundle / 1묶음",
                "status": "BUY",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "URGENT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1052",
            "name": "Small Receipt Paper Rolls – Stock Level",
            "ko": "영수증용지 작은 롤 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "3 Bundles or More / 3묶음 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "2 Bundles / 2묶음",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "1 Bundle / 1묶음",
                "status": "BUY",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "URGENT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1053",
            "name": "Loyalty Cards – Stock Level",
            "ko": "로얄티 카드 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "½ Box or More / 반 박스 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "More than ⅓ but Less than ½ Box / 1/3 초과 ~ 반 박스 미만",
                "status": "LOW",
                "level": "low"
              },
              {
                "label": "⅓ Box or Less / 1/3박스 이하",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "URGENT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1054",
            "name": "Meal Kit Loyalty Cards – Stock Level",
            "ko": "밀키트 로얄티 카드 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "½ Box or More / 반 박스 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "More than ⅓ but Less than ½ Box / 1/3 초과 ~ 반 박스 미만",
                "status": "LOW",
                "level": "low"
              },
              {
                "label": "⅓ Box or Less / 1/3박스 이하",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "URGENT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1055",
            "name": "A4 Paper – Stock Level",
            "ko": "A4 용지 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "1 Box or More / 1박스 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "½ Box or Less / 반 박스 이하",
                "status": "BUY",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "URGENT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1056",
            "name": "Price Gun Labels – Stock Level",
            "ko": "프라이스건 라벨지 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "2 Bundles or More / 2묶음 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "1 Bundle or More / 1묶음 이상",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "Less than 1 Bundle / 1묶음 미만",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "URGENT",
                "level": "urgent"
              },
              {
                "label": "OUT / 없음",
                "status": "URGENT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1057",
            "name": "Toilet Paper – Stock Level",
            "ko": "화장실 휴지 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "10 Rolls or More / 10개 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "4–9 Rolls / 4~9개",
                "status": "LOW",
                "level": "low"
              },
              {
                "label": "Less than 4 Rolls / 4개 미만",
                "status": "BUY",
                "level": "order"
              }
            ]
          },
          {
            "id": "s1058",
            "name": "Washroom Cleaner – Stock Level",
            "ko": "화장실 청소세제 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "1 Unopened Container or More / 미개봉 1통 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "No Backup, More than ½ Remaining / 미개봉 없음 · 사용 중인 통 반 이상",
                "status": "LOW",
                "level": "low"
              },
              {
                "label": "No Backup, Less than ½ Remaining / 미개봉 없음 · 사용 중인 통 반 미만",
                "status": "BUY",
                "level": "order"
              }
            ]
          },
          {
            "id": "s1059",
            "name": "Garbage Bags – Stock Level",
            "ko": "쓰레기봉투 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "1 Unopened Container or More / 미개봉 1통 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "½–Less than 1 Box / 반 박스~1박스 미만",
                "status": "LOW",
                "level": "low"
              },
              {
                "label": "Less than ½ Box / 반 박스 미만",
                "status": "BUY",
                "level": "order"
              }
            ]
          },
          {
            "id": "s1060",
            "name": "Dishwashing Detergent – Stock Level",
            "ko": "설거지용 세제 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "3 Containers or More / 3통 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "1½–Less than 3 Containers / 1통 반~3통 미만",
                "status": "LOW",
                "level": "low"
              },
              {
                "label": "Less than 1½ Containers / 1통 반 미만",
                "status": "BUY",
                "level": "order"
              }
            ]
          },
          {
            "id": "s1061",
            "name": "Hand Soap – Stock Level",
            "ko": "핸드솝 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "1 Unopened Container or More / 미개봉 백업 1통 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "No Backup, ½ Container or More Remaining / 백업 없음 · 사용 중인 통 반 이상",
                "status": "LOW",
                "level": "low"
              },
              {
                "label": "No Backup, Less than ½ Container Remaining / 백업 없음 · 사용 중인 통 반 미만",
                "status": "BUY",
                "level": "order"
              }
            ]
          },
          {
            "id": "s1062",
            "name": "Dish Sponges – Stock Level",
            "ko": "수세미 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "10 or More / 10개 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "5–9 / 5~9개",
                "status": "LOW",
                "level": "low"
              },
              {
                "label": "Less than 5 / 5개 미만",
                "status": "BUY",
                "level": "order"
              }
            ]
          }
        ]
      },
      {
        "en": "Server Food Supplies",
        "ko": "서버 식재료",
        "note": "Check the stock level of prepared kimchi and count unopened Miso soup bags. Follow the instructions shown for each item. 판매용 김치의 재고 상태를 확인하고, 미소숩은 미개봉봉지만 세어주세요. 각 품목의 안내에 따라 입력해주세요.",
        "items": [
          {
            "id": "s1063",
            "name": "Traditional kimchi",
            "ko": "",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "Above PREP Line / 기준선 이상",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "At or Below PREP Line / 기준선 이하",
                "status": "Production NEEDED",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "Urgent Production",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1064",
            "name": "Red kimchi",
            "ko": "",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "Above PREP Line / 기준선 이상",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "At or Below PREP Line / 기준선 이하",
                "status": "Production NEEDED",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "Urgent Production",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1065",
            "name": "White kimchi",
            "ko": "",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "Above PREP Line / 기준선 이상",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "At or Below PREP Line / 기준선 이하",
                "status": "Production NEEDED",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "Urgent Production",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1066",
            "name": "Custard Cakes (boxes)",
            "ko": "커스타드 (박스)",
            "note": "",
            "input": "number",
            "unit": "box",
            "unitKo": "박스",
            "step": 1,
            "target": 4
          },
          {
            "id": "s1067",
            "name": "Choco Pie (boxes)",
            "ko": "초코파이 (박스)",
            "note": "",
            "input": "number",
            "unit": "box",
            "unitKo": "박스",
            "step": 1,
            "target": 4
          },
          {
            "id": "s1068",
            "name": "Fresh berry (boxes)",
            "ko": "후레쉬베리 (박스)",
            "note": "",
            "input": "number",
            "unit": "box",
            "unitKo": "박스",
            "step": 1,
            "target": 4
          },
          {
            "id": "s1069",
            "name": "Moncher (boxes)",
            "ko": "몽쉘 (박스)",
            "note": "",
            "input": "number",
            "unit": "box",
            "unitKo": "박스",
            "step": 1,
            "target": 4
          }
        ]
      }
    ],
    "extra": {
      "title": "Additional Supply Request",
      "ko": "기타 물품 구매 요청",
      "help": "Use this section to request any items not listed in the inventory above that need to be purchased or replaced(e.g., markers, tape, aprons, small supplies etc.) If nothing is needed, select \"NO\" 위 재고 목록에 없는 물품 중 새로 구매하거나 교체가 필요한 제품이 있다면 요청해주세요. (예: 마커, 테이프,앞치마,기타비품등) 필요한 물품이 없다면 \"NO\"를 선택해주세요.",
      "question": "Does anything need to be replaced or ordered? / 교체 또는 추가 구매가 필요한 물품이 있나요?",
      "details": true
    }
  },
  "sushi": {
    "name": "Sushi",
    "ko": "스시",
    "note": "Count all inventory used at the Sushi Station. Follow the counting unit and instructions shown for each item.\n스시 파트에서 사용하는 모든 재고를 확인해주세요. 각 품목에 표시된 단위와 안내에 따라 입력해주세요.",
    "sections": [
      {
        "en": "Frozen Items",
        "ko": "냉동제품",
        "note": "Count all frozen items used at the Sushi Station. Follow the counting unit shown for each item.\n스시 파트에서 사용하는 냉동제품의 재고를 확인해주세요. 각 품목에 표시된 단위에 맞춰 입력해주세요.",
        "items": [
          {
            "id": "s1071",
            "name": "Unagi – Half Fillet Packs (packs)",
            "ko": "우나기 – 반마리 포장 (팩)",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "1 Box or More / 1박스 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "Less than 1 Box / 1박스 미만",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "Almost Out(Less than 4packs)/ 거의 없음(4팩미만)",
                "status": "URGENT",
                "level": "urgent"
              },
              {
                "label": "OUT / 없음",
                "status": "URGENT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1072",
            "name": "Tempura (boxes)",
            "ko": "새우튀김 (박스)",
            "note": "",
            "input": "number",
            "unit": "box",
            "unitKo": "박스",
            "step": 1,
            "target": 6
          },
          {
            "id": "s1073",
            "name": "Ebi (Cooked Shrimp) – UNOPENED (packs)",
            "ko": "초새우 – 미개봉 팩",
            "note": "",
            "input": "number",
            "unit": "pack",
            "unitKo": "팩",
            "step": 1,
            "target": 15
          },
          {
            "id": "s1074",
            "name": "Saku Tuna – UNOPENED (packs)",
            "ko": "사쿠 참치 – 미개봉 팩",
            "note": "",
            "input": "number",
            "unit": "pack",
            "unitKo": "팩",
            "step": 1,
            "target": 10
          },
          {
            "id": "s1075",
            "name": "Tamago – UNOPENED (packs)",
            "ko": "타마고 – 미개봉 팩",
            "note": "",
            "input": "number",
            "unit": "pack",
            "unitKo": "팩",
            "step": 1,
            "target": 3
          },
          {
            "id": "s1076",
            "name": "Shredded Crab – UNOPENED (packs)",
            "ko": "슈레디드크랩 – 미개봉 팩",
            "note": "",
            "input": "number",
            "unit": "pack",
            "unitKo": "팩",
            "step": 1,
            "target": 20
          },
          {
            "id": "s1077",
            "name": "Imitation Crab – UNOPENED (packs)",
            "ko": "맛살 – 미개봉 팩",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "25 Packs or More / 25팩 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "10–19 Packs / 10~19팩",
                "status": "LOW",
                "level": "low"
              },
              {
                "label": "5–9 Packs / 5~9팩",
                "status": "ORDER",
                "level": "order"
              }
            ]
          },
          {
            "id": "s1078",
            "name": "Fried Yam – UNOPENED (bags)",
            "ko": "미개봉 봉지",
            "note": "",
            "input": "number",
            "unit": "bag",
            "unitKo": "봉",
            "step": 1,
            "target": 8
          },
          {
            "id": "s1079",
            "name": "Inari (Seasoned Tofu Pockets) – UNOPENED (bags)",
            "ko": "유부 – 미개봉 봉지",
            "note": "",
            "input": "number",
            "unit": "bag",
            "unitKo": "봉",
            "step": 1,
            "target": 5
          },
          {
            "id": "s1080",
            "name": "Tobiko – UNOPENED (containers)",
            "ko": "토비코 – 미개봉 통",
            "note": "",
            "input": "number",
            "unit": "container",
            "unitKo": "통",
            "step": 1,
            "target": 2
          },
          {
            "id": "s1081",
            "name": "Masago – UNOPENED (containers)",
            "ko": "마사고 – 미개봉 통",
            "note": "",
            "input": "number",
            "unit": "container",
            "unitKo": "통",
            "step": 1,
            "target": 10
          },
          {
            "id": "s1082",
            "name": "Seaweed Salad – UNOPENED (bags)",
            "ko": "씨위드 샐러드 – 미개봉 봉지",
            "note": "",
            "input": "number",
            "unit": "bag",
            "unitKo": "봉",
            "step": 1,
            "target": 10
          }
        ]
      },
      {
        "en": "Refrigerated Items",
        "ko": "냉장제품",
        "note": "Count all refrigerated items used at the Sushi Station. Follow the counting unit shown for each item.\n스시 파트에서 사용하는 냉장제품의 재고를 확인해주세요. 각 품목에 표시된 단위에 맞춰 입력해주세요.",
        "items": [
          {
            "id": "s1083",
            "name": "Ready-to-Use Salmon Back Loin (packs)",
            "ko": "장사용 연어 등살 (줄)",
            "note": "",
            "input": "number",
            "unit": "pack",
            "unitKo": "팩",
            "step": 1,
            "target": 10
          },
          {
            "id": "s1084",
            "name": "Ready-to-Use Salmon Belly (packs)",
            "ko": "장사용 연어 뱃살 (줄)",
            "note": "",
            "input": "number",
            "unit": "pack",
            "unitKo": "팩",
            "step": 1,
            "target": 10
          },
          {
            "id": "s1085",
            "name": "Lemon (each)",
            "ko": "레몬 (개)",
            "note": "",
            "input": "number",
            "unit": "each",
            "unitKo": "개",
            "step": 1,
            "target": 12
          },
          {
            "id": "s1086",
            "name": "Cheongyang Chili Peppers (packs)",
            "ko": "청양고추 (팩)",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "1 Pack or More / 1팩 이상",
                "status": "",
                "level": "ok"
              },
              {
                "label": "Less than 1 Pack / 1팩 미만",
                "status": "",
                "level": "low"
              },
              {
                "label": "Less than ½ Pack / 반 팩 미만",
                "status": "",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1087",
            "name": "Cucumber – Shared Stock (each)",
            "ko": "오이 – 공용재고 (개)",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "50 or More / 50개 이상",
                "status": "",
                "level": "ok"
              },
              {
                "label": "Less than 30 / 30개 미만",
                "status": "",
                "level": "low"
              },
              {
                "label": "Less than 10 / 10개 미만",
                "status": "",
                "level": "order"
              }
            ]
          },
          {
            "id": "s1088",
            "name": "Avocado Stock Level",
            "ko": "아보카도 재고",
            "note": "Include all avocados in the refrigerator, ripening area, and back stock. Select the approximate total quantity.\n냉장고, 숙성 중인 아보카도 및 보관 재고를 모두 포함하여 대략적인 총 수량을 선택해주세요.",
            "input": "choice",
            "options": [
              {
                "label": "70+ / 70개 이상",
                "status": "",
                "level": "ok"
              },
              {
                "label": "40+ / 40개 이상",
                "status": "",
                "level": "low"
              },
              {
                "label": "10-30 / 10-30개 사이",
                "status": "",
                "level": "order"
              }
            ]
          }
        ]
      },
      {
        "en": "Sauces & Dry Ingredients",
        "ko": "소스 및 상온재료",
        "note": "Count all sauces, seasonings, and dry ingredients used at the Sushi Station. Follow the counting instructions shown for each item.\n스시 파트에서 사용하는 소스, 조미료 및 상온재료의 재고를 확인해주세요. 각 품목의 안내에 따라 입력해주세요.",
        "items": [
          {
            "id": "s1089",
            "name": "Mayonnaise – UNOPENED (pails)",
            "ko": "마요네즈 – 미개봉 말통",
            "note": "",
            "input": "number",
            "unit": "pail",
            "unitKo": "말통",
            "step": 1,
            "target": 3
          },
          {
            "id": "s1090",
            "name": "Spicy Mayo (bags)",
            "ko": "스파이시마요 (소분 봉투)",
            "note": "",
            "input": "number",
            "unit": "bag",
            "unitKo": "봉",
            "step": 1,
            "target": 3
          },
          {
            "id": "s1091",
            "name": "Garlic Mayo (bags)",
            "ko": "갈릭마요 (소분 봉투)",
            "note": "",
            "input": "number",
            "unit": "bag",
            "unitKo": "봉",
            "step": 1,
            "target": 3
          },
          {
            "id": "s1092",
            "name": "Wasabi Mayo (bags)",
            "ko": "와사비마요 (소분 봉투)",
            "note": "",
            "input": "number",
            "unit": "bag",
            "unitKo": "봉",
            "step": 1,
            "target": 3
          },
          {
            "id": "s1093",
            "name": "Sesame Mayo (bags)",
            "ko": "세서미마요 (소분 봉투)",
            "note": "",
            "input": "number",
            "unit": "bag",
            "unitKo": "봉",
            "step": 1,
            "target": 3
          },
          {
            "id": "s1094",
            "name": "Yuzu Mayo (bags)",
            "ko": "유자마요 (소분 봉투)",
            "note": "",
            "input": "number",
            "unit": "bag",
            "unitKo": "봉",
            "step": 1,
            "target": 3
          },
          {
            "id": "s1095",
            "name": "Wasabi Powder – UNOPENED (bags)",
            "ko": "와사비파우더 – 미개봉 봉지",
            "note": "",
            "input": "number",
            "unit": "bag",
            "unitKo": "봉",
            "step": 1,
            "target": 4
          },
          {
            "id": "s1096",
            "name": "Half-Sheet Nori – UNOPENED (bags)",
            "ko": "하프김 – 미개봉 봉투",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "1 Box or More / 1박스 이상",
                "status": "",
                "level": "ok"
              },
              {
                "label": "½ Box or More / 반 박스 이상",
                "status": "",
                "level": "low"
              },
              {
                "label": "Less than ½ Box / 반 박스 미만",
                "status": "",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1097",
            "name": "Full-Sheet Nori – UNOPENED (bags)",
            "ko": "풀김 – 미개봉 봉투",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "1 Box or More / 1박스 이상",
                "status": "",
                "level": "ok"
              },
              {
                "label": "½ Box or More / 반 박스 이상",
                "status": "",
                "level": "low"
              },
              {
                "label": "Less than ½ Box / 반 박스 미만",
                "status": "",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1098",
            "name": "Sushi Panko – Backup Stock",
            "ko": "스시용 팬코 – 백업 재고",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "1 Full Box or More / 새 6kg 1박스 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "No Backup Box / 백업 박스 없음",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "Completely Out / 전체 재고 없음",
                "status": "URGENT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1099",
            "name": "Unagi Sauce - Unopened",
            "ko": "우나기소스 미개봉(병)",
            "note": "",
            "input": "number",
            "unit": "bottle",
            "unitKo": "병",
            "step": 1,
            "target": 8
          },
          {
            "id": "s1100",
            "name": "Cooking Oil Spray – UNOPENED (cans)",
            "ko": "오일 스프레이 – 미개봉 캔",
            "note": "",
            "input": "number",
            "unit": "can",
            "unitKo": "캔",
            "step": 1,
            "target": 5
          },
          {
            "id": "s1101",
            "name": "Butane Gas – Stock Level",
            "ko": "부탄가스 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "3 Bundles or More / 3묶음 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "2 Bundles / 2묶음",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "1 Bundle / 1묶음",
                "status": "URGENT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1102",
            "name": "Takeout Soy Sauce (boxes)",
            "ko": "투고용 간장 (박스)",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "4 Boxes or More / 4박스 이상",
                "status": "",
                "level": "ok"
              },
              {
                "label": "2 Boxes or More / 2박스 이상",
                "status": "",
                "level": "low"
              },
              {
                "label": "Less than 2 Boxes / 2박스 미만",
                "status": "",
                "level": "order"
              }
            ]
          },
          {
            "id": "s1103",
            "name": "Rice – Shared Stock (bags)",
            "ko": "쌀 – 공용재고 (포대)",
            "note": "Shared stock for all stations. Count the total number of rice bags in stock, including opened bags. / 전 파트 공용재고입니다. 사용 중인 포대를 포함하여 전체 쌀 재고를 확인해주세요.",
            "input": "number",
            "unit": "bag",
            "unitKo": "봉",
            "step": 1,
            "target": 12
          },
          {
            "id": "s1104",
            "name": "Sushi Vinegar (containers)",
            "ko": "스시초 (통)",
            "note": "",
            "input": "number",
            "unit": "container",
            "unitKo": "통",
            "step": 1,
            "target": 2
          },
          {
            "id": "s1105",
            "name": "Pickled Ginger – Original Pail Stock",
            "ko": "초생강 – 원본 말통 재고",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "Unopened pail(s) available / 미개봉 말통 있음",
                "status": "",
                "level": "ok"
              },
              {
                "label": "Last pail in use / 마지막 말통 사용 중",
                "status": "주문 필요",
                "level": "order"
              },
              {
                "label": "Out of stock / 재고 없음",
                "status": "긴급 주문",
                "level": "urgent"
              }
            ]
          }
        ]
      },
      {
        "en": "Packaging & Sushi Supplies",
        "ko": "포장용품 및 스시 비품",
        "note": "Count all packaging and disposable supplies used at the Sushi Station. Follow the counting unit shown for each item.\n스시 파트에서 사용하는 포장 및 일회용품의 재고를 확인해주세요. 각 품목에 표시된 단위에 맞춰 입력해주세요.",
        "items": [
          {
            "id": "s1106",
            "name": "8-Compartment Sushi Case (boxes) YW-ST2",
            "ko": "8구 스시케이스 (박스)",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "Backup stock available / 충분 – 여분 있음",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "Last box in use / 주문 필요 – 마지막 박스 사용 중",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "No stock / 재고 없음",
                "status": "OUT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1107",
            "name": "Large Sushi Roll Case (boxes)",
            "ko": "큰 롤용 스시케이스 (박스)",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "Backup stock available / 충분 – 여분 있음",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "Last box in use / 주문 필요 – 마지막 박스 사용 중",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "No stock / 재고 없음",
                "status": "OUT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1108",
            "name": "Small Sushi Platter Box (boxes)",
            "ko": "작은 스시플래터 박스 (박스)",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "Backup stock available / 충분 – 여분 있음",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "Last box in use / 주문 필요 – 마지막 박스 사용 중",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "No stock / 재고 없음",
                "status": "OUT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1109",
            "name": "Large Sushi Platter Box (boxes)",
            "ko": "큰 스시플래터 박스 (박스)",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "Backup stock available / 충분 – 여분 있음",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "Last box in use / 주문 필요 – 마지막 박스 사용 중",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "No stock / 재고 없음",
                "status": "OUT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1110",
            "name": "Round Sushi Platter Case (boxes)",
            "ko": "원형 스시플래터 케이스 (박스)",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "Backup stock available / 충분 – 여분 있음",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "Last box in use / 주문 필요 – 마지막 박스 사용 중",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "No stock / 재고 없음",
                "status": "OUT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1111",
            "name": "Medium Plastic Wrap – UNOPENED (rolls)",
            "ko": "미디엄 사이즈 랩 – 미개봉 롤",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "Backup stock available / 충분 – 여분 있음",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "Last box in use / 주문 필요 – 마지막 박스 사용 중",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "No stock / 재고 없음",
                "status": "OUT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1112",
            "name": "Large Plastic Wrap – UNOPENED (rolls)",
            "ko": "라지 사이즈 랩 – 미개봉 롤",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "Backup stock available / 충분 – 여분 있음",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "Last box in use / 주문 필요 – 마지막 박스 사용 중",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "No stock / 재고 없음",
                "status": "OUT",
                "level": "urgent"
              }
            ]
          }
        ]
      }
    ],
    "extra": {
      "title": "Additional Supply Request",
      "ko": "기타 물품 구매 요청",
      "help": "Use this section to request any items not listed in the inventory above that need to be purchased or replaced(e.g., markers, tape, aprons, small supplies etc.) If nothing is needed, select \"NO\" 위 재고 목록에 없는 물품 중 새로 구매하거나 교체가 필요한 제품이 있다면 요청해주세요. (예: 마커, 테이프,앞치마,기타비품등) 필요한 물품이 없다면 \"NO\"를 선택해주세요.",
      "question": "Does anything need to be replaced or ordered? / 교체 또는 추가 구매가 필요한 물품이 있나요?",
      "details": true
    }
  },
  "middle": {
    "name": "Middle",
    "ko": "중간",
    "note": "Check all inventory used at the Middle Station. Follow the counting unit or stock level shown for each item. / 미들 파트에서 사용하는 모든 재고를 확인해주세요. 각 품목에 표시된 수량 단위 또는 재고 기준에 따라 확인해주세요.",
    "sections": [
      {
        "en": "Frozen Items",
        "ko": "냉동제품",
        "note": "Check all frozen items used at the Middle Station. Follow the counting unit or stock level shown for each item. / 미들 파트에서 사용하는 모든 냉동제품의 재고를 확인해주세요. 각 품목에 표시된 수량 단위 또는 재고 기준에 따라 확인해주세요.",
        "items": [
          {
            "id": "s1113",
            "name": "Pork & Beef Dumpling",
            "ko": "고기만두",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "More than 10 Bags / 10봉 초과",
                "status": "",
                "level": "ok"
              },
              {
                "label": "10 Bags or Less / 10봉 이하",
                "status": "PREP",
                "level": "order"
              },
              {
                "label": "5 Bags or Less / 5봉 이하",
                "status": "PREP URGENT",
                "level": "urgent"
              },
              {
                "label": "OUT / 없음",
                "status": "PREP URGENT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1114",
            "name": "Vegetable Dumpling",
            "ko": "야채만두",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "24 Bags or More / 24봉 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "12–23 Bags / 12~23봉",
                "status": "",
                "level": "low"
              },
              {
                "label": "6–11 Bags / 6~11봉",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "OUT / 없음",
                "status": "URGENT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1115",
            "name": "Fried Boneless Chicken – Stock Level",
            "ko": "튀긴 본레스 치킨 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "In stock / 있음",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "OUT / 없음",
                "status": "URGENT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1116",
            "name": "Chicken Wings – Stock Level",
            "ko": "치킨윙 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "In stock / 있음",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "OUT / 없음",
                "status": "URGENT",
                "level": "urgent"
              }
            ]
          }
        ]
      },
      {
        "en": "Refrigerated Items",
        "ko": "냉장제품",
        "note": "Check all refrigerated items used at the Middle Station. Follow the counting unit or stock level shown for each item. / 미들 파트에서 사용하는 모든 냉장제품의 재고를 확인해주세요. 각 품목에 표시된 수량 단위 또는 재고 기준에 따라 확인해주세요.",
        "items": [
          {
            "id": "s1117",
            "name": "Bibimbap Gochujang Sauce – Stock Level",
            "ko": "비빔밥용 고추장 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "3 Containers or More / 3통 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "1½–Less than 3 Containers / 1통 반~3통 미만",
                "status": "LOW",
                "level": "low"
              },
              {
                "label": "Less than 1½ Containers / 1통 반 미만",
                "status": "PREP",
                "level": "order"
              }
            ]
          },
          {
            "id": "s1118",
            "name": "Bibimbap Teriyaki Sauce – Stock Level",
            "ko": "비빔밥용 데리야끼 소스 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "3 Containers or More / 3통 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "1½–Less than 3 Containers / 1통 반~3통 미만",
                "status": "LOW",
                "level": "low"
              },
              {
                "label": "Less than 1½ Containers / 1통 반 미만",
                "status": "PREP",
                "level": "order"
              }
            ]
          },
          {
            "id": "s1119",
            "name": "Spring Mix (containers)",
            "ko": "스프링믹스 (통)",
            "note": "",
            "input": "number",
            "unit": "container",
            "unitKo": "통",
            "step": 1,
            "target": 15
          },
          {
            "id": "s1120",
            "name": "Purple cabbage – Unprepped Stock",
            "ko": "적양배추 – 프랩 전 재고",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "10 or More / 10개 이상",
                "status": "",
                "level": "ok"
              },
              {
                "label": "Less than 5 / 5개 미만",
                "status": "",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1121",
            "name": "Cabbage – Unprepped Stock",
            "ko": "양배추 – 프랩 전 재고",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "6 or More / 6개 이상",
                "status": "",
                "level": "ok"
              },
              {
                "label": "Less than 3 / 3개 미만",
                "status": "",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1122",
            "name": "Bell Peppers – Stock Level",
            "ko": "파프리카 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "3 Bags or More / 3봉 이상",
                "status": "",
                "level": "ok"
              },
              {
                "label": "1 Bag or More / 1봉 이상",
                "status": "",
                "level": "low"
              },
              {
                "label": "Less than 1 Bag / 1봉 미만",
                "status": "",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1123",
            "name": "Green onions – Stock Level",
            "ko": "파 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "12 Bundles or More / 12묶음 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "6–11 Bundles / 6~11묶음",
                "status": "LOW",
                "level": "low"
              },
              {
                "label": "3–5 Bundles / 3~5묶음",
                "status": "BUY",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1124",
            "name": "Chives – Stock Level",
            "ko": "부추 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "5 Bundles or More / 5묶음 이상",
                "status": "",
                "level": "ok"
              },
              {
                "label": "3 Bundles or More / 3묶음 이상",
                "status": "",
                "level": "low"
              },
              {
                "label": "Less than 3 Bundles / 3묶음 미만",
                "status": "",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1125",
            "name": "Whole Pickled Radish – Stock Level",
            "ko": "통단무지 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "2 Unopened Packs or More / 미개봉 2팩 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "1 Unopened Pack / 미개봉 1팩",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "Only Open Pack in Use / 사용 중인 제품만 있음",
                "status": "URGENT",
                "level": "urgent"
              },
              {
                "label": "OUT / 없음",
                "status": "URGENT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1126",
            "name": "Prepped Carrots – Vacuum Packs",
            "ko": "프랩 당근 – 진공팩",
            "note": "",
            "input": "number",
            "unit": "pack",
            "unitKo": "팩",
            "step": 1,
            "target": 6
          },
          {
            "id": "s1127",
            "name": "Prepped Purple Cabbage– Vacuum Packs",
            "ko": "프랩 적배추 – 진공팩",
            "note": "",
            "input": "number",
            "unit": "pack",
            "unitKo": "팩",
            "step": 1,
            "target": 6
          },
          {
            "id": "s1128",
            "name": "Prepped Cucumber",
            "ko": "프랩 오이",
            "note": "",
            "input": "number",
            "unit": "pack",
            "unitKo": "팩",
            "step": 1,
            "target": 3
          },
          {
            "id": "s1129",
            "name": "Prepped Zucchini",
            "ko": "프랩 호박",
            "note": "",
            "input": "number",
            "unit": "pack",
            "unitKo": "팩",
            "step": 1,
            "target": 3
          },
          {
            "id": "s1130",
            "name": "Zucchini – Unprepped Stock",
            "ko": "호박 – 프랩 전 재고",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "30 or More / 30개 이상",
                "status": "",
                "level": "ok"
              },
              {
                "label": "Less than 20 / 20개 미만",
                "status": "",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1131",
            "name": "Carrots – Unprepped Stock",
            "ko": "당근 – 프랩 전 재고",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "40 or More / 40개 이상",
                "status": "",
                "level": "ok"
              },
              {
                "label": "Less than 20 / 20개 미만",
                "status": "",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1132",
            "name": "Eggs (trays)",
            "ko": "계란 (판)",
            "note": "",
            "input": "number",
            "unit": "tray",
            "unitKo": "판",
            "step": 1,
            "target": 5
          },
          {
            "id": "s1133",
            "name": "Tofu – Stock Level",
            "ko": "두부 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "2 Boxes or More / 2박스 이상",
                "status": "",
                "level": "ok"
              },
              {
                "label": "1 Box or More / 1박스 이상",
                "status": "",
                "level": "low"
              },
              {
                "label": "Less than 1 Box / 1박스 미만",
                "status": "",
                "level": "low"
              },
              {
                "label": "Less than 5 Packs / 낱개 5개 미만",
                "status": "",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "",
                "level": "urgent"
              }
            ]
          }
        ]
      },
      {
        "en": "Sauces & Room-Temperature Ingredients",
        "ko": "소스 및 실온보관 재료",
        "note": "Check all sauces, seasonings, powders, and other ingredients stored at room temperature. Follow the counting unit or stock level shown for each item. / 미들 파트에서 사용하는 소스, 조미료, 가루류 및 기타 실온보관 재료의 재고를 확인해주세요. 각 품목에 표시된 수량 단위 또는 재고 기준에 따라 확인해주세요.",
        "items": [
          {
            "id": "s1134",
            "name": "Panko – Middle Station (bags)",
            "ko": "팬코 – 미들용 (봉지)",
            "note": "",
            "input": "number",
            "unit": "bag",
            "unitKo": "봉",
            "step": 1,
            "target": 8
          },
          {
            "id": "s1135",
            "name": "Tteokbokki Rice Cakes – Stock Level",
            "ko": "떡볶이떡 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "2 Box or More / 2박스 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "Less than 1 Box / 1박스 미만",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "URGENT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1136",
            "name": "Yuzu Soy – Stock Level",
            "ko": "유주소이 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "1 Container or More / 1통 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "⅓–Less than 1 Container / 1/3통~1통 미만",
                "status": "LOW",
                "level": "low"
              },
              {
                "label": "Less than ⅓ Container / 1/3통 미만",
                "status": "PREP",
                "level": "order"
              }
            ]
          },
          {
            "id": "s1137",
            "name": "Dumpling Soy Sauce – Stock Level",
            "ko": "만두간장 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "2 Containers or More / 2통 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "½–Less than 2 Containers / 반 통~2통 미만",
                "status": "REQUEST",
                "level": "order"
              },
              {
                "label": "Less than ½ Container / 반 통 미만",
                "status": "URGENT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1138",
            "name": "Yuzu Dressing – Stock Level",
            "ko": "유자드레싱 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "2 Containers or More / 2통 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "½–Less than 2 Containers / 반 통~2통 미만",
                "status": "REQUEST",
                "level": "order"
              },
              {
                "label": "Less than ½ Container / 반 통 미만",
                "status": "URGENT",
                "level": "urgent"
              }
            ]
          }
        ]
      },
      {
        "en": "Packaging",
        "ko": "포장용기",
        "note": "",
        "items": [
          {
            "id": "s1177",
            "name": "Bibimbap container",
            "ko": "비빔밥 용기",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "Backup stock available / 충분 – 여분 있음",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "Last box in use / 주문 필요 – 마지막 박스 사용 중",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "No stock / 재고 없음",
                "status": "OUT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1178",
            "name": "Poke container",
            "ko": "포케 용기",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "Backup stock available / 충분 – 여분 있음",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "Last box in use / 주문 필요 – 마지막 박스 사용 중",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "No stock / 재고 없음",
                "status": "OUT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1179",
            "name": "Vincenzo & Market Bibimbap container",
            "ko": "Vincenzo&market 비빔밥 용기",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "Backup stock available / 충분 – 여분 있음",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "Last box in use / 주문 필요 – 마지막 박스 사용 중",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "No stock / 재고 없음",
                "status": "OUT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1180",
            "name": "Vincenzo & Market Dupbap container",
            "ko": "Vincenzo&market 덮밥 용기",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "Backup stock available / 충분 – 여분 있음",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "Last box in use / 주문 필요 – 마지막 박스 사용 중",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "No stock / 재고 없음",
                "status": "OUT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1181",
            "name": "Vincenzo & Market Japchae container",
            "ko": "Vincenzo&market 잡채 용기",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "Backup stock available / 충분 – 여분 있음",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "Last box in use / 주문 필요 – 마지막 박스 사용 중",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "No stock / 재고 없음",
                "status": "OUT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1182",
            "name": "Sauce container 0.75oz",
            "ko": "소스 컨테이너 0.75oz",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "Backup stock available / 충분 – 여분 있음",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "Last box in use / 주문 필요 – 마지막 박스 사용 중",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "No stock / 재고 없음",
                "status": "OUT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1183",
            "name": "Sauce container 1oz",
            "ko": "소스 컨테이너 1oz",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "Backup stock available / 충분 – 여분 있음",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "Last box in use / 주문 필요 – 마지막 박스 사용 중",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "No stock / 재고 없음",
                "status": "OUT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1184",
            "name": "Sauce container 1.5oz",
            "ko": "소스 컨테이너 1.5oz",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "Backup stock available / 충분 – 여분 있음",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "Last box in use / 주문 필요 – 마지막 박스 사용 중",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "No stock / 재고 없음",
                "status": "OUT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1185",
            "name": "Sauce container 2oz",
            "ko": "소스 컨테이너 2oz",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "Backup stock available / 충분 – 여분 있음",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "Last box in use / 주문 필요 – 마지막 박스 사용 중",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "No stock / 재고 없음",
                "status": "OUT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1186",
            "name": "Sauce container 4oz",
            "ko": "소스 컨테이너 4oz",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "Backup stock available / 충분 – 여분 있음",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "Last box in use / 주문 필요 – 마지막 박스 사용 중",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "No stock / 재고 없음",
                "status": "OUT",
                "level": "urgent"
              }
            ]
          }
        ]
      }
    ],
    "extra": {
      "title": "Additional Supply Request",
      "ko": "기타 물품 구매 요청",
      "help": "Use this section to request any items not listed in the inventory above that need to be purchased or replaced(e.g., markers, tape, aprons, small supplies etc.) If nothing is needed, select \"NO\" 위 재고 목록에 없는 물품 중 새로 구매하거나 교체가 필요한 제품이 있다면 요청해주세요. (예: 마커, 테이프,앞치마,기타비품등) 필요한 물품이 없다면 \"NO\"를 선택해주세요.",
      "question": "Does anything need to be replaced or ordered? / 교체 또는 추가 구매가 필요한 물품이 있나요?",
      "details": true
    }
  },
  "cook": {
    "name": "Cook",
    "ko": "쿡",
    "note": "Enter how much is SHORT of the target in whole bottles, cans or packs (no decimals). Leave 0 if it's full. 기준보다 부족한 수량을 병·캔·팩 단위 정수로 입력해주세요. 가득 차 있으면 0 그대로 두세요.",
    "sections": [
      {
        "en": "Sauces, Seasonings & Dry Ingredients",
        "ko": "소스 및 상온 조미료",
        "note": "Check all sauces, oils, seasonings, powders, and dry ingredients stored at room temperature. Follow the counting unit or stock level shown for each item. / 실온 보관하는 소스, 오일, 조미료, 가루류 및 건조재료의 재고를 확인해주세요. 각 품목에 표시된 수량 단위 또는 재고 기준에 따라 확인해주세요.",
        "items": [
          {
            "id": "s1139",
            "name": "Store-bought Teriyaki sauce",
            "ko": "시판 데리야끼소스",
            "note": "UNOPENED only / 미개봉만 카운트",
            "input": "number",
            "unit": "bottle",
            "unitKo": "병",
            "step": 1,
            "target": 8
          },
          {
            "id": "s1140",
            "name": "Okonomiyaki sauce",
            "ko": "오꼬노미야끼소스",
            "note": "UNOPENED only / 미개봉만 카운트",
            "input": "number",
            "unit": "bottle",
            "unitKo": "병",
            "step": 1,
            "target": 4
          },
          {
            "id": "s1141",
            "name": "Sesame oil",
            "ko": "참기름",
            "note": "UNOPENED only / 미개봉만 카운트",
            "input": "number",
            "unit": "bottle",
            "unitKo": "병",
            "step": 1,
            "target": 6
          },
          {
            "id": "s1142",
            "name": "Pineapple juice",
            "ko": "파인애플주스",
            "note": "UNOPENED only / 미개봉만 카운트",
            "input": "number",
            "unit": "bottle",
            "unitKo": "병",
            "step": 1,
            "target": 6
          },
          {
            "id": "s1143",
            "name": "Canned Mushroom",
            "ko": "캔버섯",
            "note": "UNOPENED only / 미개봉만 카운트",
            "input": "number",
            "unit": "can",
            "unitKo": "캔",
            "step": 1,
            "target": 2
          },
          {
            "id": "s1144",
            "name": "Blueberry syrup",
            "ko": "블루베리시럽",
            "note": "UNOPENED only / 미개봉만 카운트",
            "input": "number",
            "unit": "bottle",
            "unitKo": "병",
            "step": 1,
            "target": 6
          },
          {
            "id": "s1145",
            "name": "Ketchup",
            "ko": "케찹",
            "note": "UNOPENED only / 미개봉만 카운트",
            "input": "number",
            "unit": "bottle",
            "unitKo": "병",
            "step": 1,
            "target": 2
          },
          {
            "id": "s1146",
            "name": "Corn syrup",
            "ko": "물엿",
            "note": "UNOPENED only / 미개봉만 카운트",
            "input": "number",
            "unit": "bottle",
            "unitKo": "병",
            "step": 1,
            "target": 6
          },
          {
            "id": "s1147",
            "name": "Cooking wine",
            "ko": "미향",
            "note": "UNOPENED only / 미개봉만 카운트",
            "input": "number",
            "unit": "bottle",
            "unitKo": "병",
            "step": 1,
            "target": 6
          },
          {
            "id": "s1148",
            "name": "Fish Sauce",
            "ko": "액젓",
            "note": "UNOPENED only / 미개봉만 카운트",
            "input": "number",
            "unit": "bottle",
            "unitKo": "병",
            "step": 1,
            "target": 6
          },
          {
            "id": "s1149",
            "name": "Black pepper",
            "ko": "후추",
            "note": "UNOPENED only / 미개봉만 카운트",
            "input": "number",
            "unit": "bottle",
            "unitKo": "병",
            "step": 1,
            "target": 1
          },
          {
            "id": "s1150",
            "name": "Ginger powder",
            "ko": "생강가루",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "More than ½ remaining / 충분 – 절반 이상",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "Less than ½ remaining / 부족 – 절반 미만",
                "status": "LOW",
                "level": "low"
              },
              {
                "label": "Almost empty / 주문 필요 – 거의 없음",
                "status": "ORDER",
                "level": "order"
              }
            ]
          },
          {
            "id": "s1151",
            "name": "Onion powder",
            "ko": "양파가루",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "More than ½ remaining / 충분 – 절반 이상",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "Less than ½ remaining / 부족 – 절반 미만",
                "status": "LOW",
                "level": "low"
              },
              {
                "label": "Almost empty / 주문 필요 – 거의 없음",
                "status": "ORDER",
                "level": "order"
              }
            ]
          },
          {
            "id": "s1152",
            "name": "Garlic powder",
            "ko": "마늘가루",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "More than ½ remaining / 충분 – 절반 이상",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "Less than ½ remaining / 부족 – 절반 미만",
                "status": "LOW",
                "level": "low"
              },
              {
                "label": "Almost empty / 주문 필요 – 거의 없음",
                "status": "ORDER",
                "level": "order"
              }
            ]
          },
          {
            "id": "s1153",
            "name": "Fine Red Pepper Powder – BACKUP (bags)",
            "ko": "고운 고춧가루 – 여분 (봉지)",
            "note": "",
            "input": "number",
            "unit": "bag",
            "unitKo": "봉",
            "step": 1,
            "target": 2
          },
          {
            "id": "s1154",
            "name": "Coarse Red Pepper Powder – BACKUP (bags)",
            "ko": "굵은 고춧가루 – 여분 (봉지)",
            "note": "",
            "input": "number",
            "unit": "bag",
            "unitKo": "봉",
            "step": 1,
            "target": 2
          },
          {
            "id": "s1155",
            "name": "MSG (Miwon) (packs)",
            "ko": "미원 (팩)",
            "note": "",
            "input": "number",
            "unit": "pack",
            "unitKo": "팩",
            "step": 1,
            "target": 1
          },
          {
            "id": "s1156",
            "name": "Hondashi (packs)",
            "ko": "혼다시 (팩)",
            "note": "",
            "input": "number",
            "unit": "pack",
            "unitKo": "팩",
            "step": 1,
            "target": 1
          },
          {
            "id": "s1157",
            "name": "Beef Dashida (packs)",
            "ko": "소고기 다시다 (팩)",
            "note": "",
            "input": "number",
            "unit": "pack",
            "unitKo": "팩",
            "step": 1,
            "target": 1
          },
          {
            "id": "s1158",
            "name": "Sugar – Bulk Container Stock",
            "ko": "설탕 – 대용량 보관통 재고",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "More than ⅓ remaining / 충분 – 1/3 이상 남음",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "About ⅓ remaining / 부족 – 약 1/3 남음",
                "status": "LOW",
                "level": "low"
              },
              {
                "label": "Almost empty / 주문 필요 – 거의 없음",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "Empty / 재고 없음",
                "status": "OUT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1159",
            "name": "Salt – Bulk Container Stock",
            "ko": "소금 – 대용량 보관통 재고",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "More than ⅓ remaining / 충분 – 1/3 이상 남음",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "About ⅓ remaining / 부족 – 약 1/3 남음",
                "status": "LOW",
                "level": "low"
              },
              {
                "label": "Almost empty / 주문 필요 – 거의 없음",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "Empty / 재고 없음",
                "status": "OUT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1160",
            "name": "Soy Sauce – Stock Level",
            "ko": "간장 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "1 Pail or More / 1말통 이상",
                "status": "",
                "level": "ok"
              },
              {
                "label": "Less than 1 Pail / 1말통 미만",
                "status": "",
                "level": "low"
              },
              {
                "label": "Less than ½ Pail / 반 말통 미만",
                "status": "",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1161",
            "name": "Cooking Oil – Stock Level",
            "ko": "식용유 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "4 Pails or More / 4말통 이상",
                "status": "",
                "level": "ok"
              },
              {
                "label": "Less than 2 Pails / 2말통 미만",
                "status": "",
                "level": "low"
              },
              {
                "label": "Less than 1 Pail / 1말통 미만",
                "status": "",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1162",
            "name": "Gochujang – Stock Level",
            "ko": "고추장 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "1 Pail or More / 1말통 이상",
                "status": "",
                "level": "ok"
              },
              {
                "label": "Less than 1 Pail / 1말통 미만",
                "status": "",
                "level": "low"
              },
              {
                "label": "Less than ½ Pail / 반 말통 미만",
                "status": "",
                "level": "order"
              },
              {
                "label": "Almost Out / 거의 없음",
                "status": "",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1163",
            "name": "Onion - Stock level",
            "ko": "양파 - 재고상태",
            "note": "",
            "input": "number",
            "unit": "EA",
            "unitKo": "개",
            "step": 1,
            "target": 20
          }
        ]
      },
      {
        "en": "Frozen Items",
        "ko": "냉동제품",
        "note": "Check all frozen items used at the Cook Station. Follow the counting unit or stock level shown for each item. / 쿡 파트에서 사용하는 모든 냉동제품의 재고를 확인해주세요. 각 품목에 표시된 수량 단위 또는 재고 기준에 따라 확인해주세요.",
        "items": [
          {
            "id": "s1164",
            "name": "Minced Garlic – Stock Level",
            "ko": "다진마늘 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "5 Bags or More / 5봉 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "3–4 Bags / 3~4봉",
                "status": "LOW",
                "level": "low"
              },
              {
                "label": "1–2 Bags / 1~2봉",
                "status": "ORDER",
                "level": "order"
              }
            ]
          },
          {
            "id": "s1165",
            "name": "Crushed Pineapple – Stock Level",
            "ko": "간 파인애플 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "3 Bags or More / 3봉 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "2 Bags / 2봉",
                "status": "LOW",
                "level": "low"
              },
              {
                "label": "1 Bag / 1봉",
                "status": "PREP",
                "level": "order"
              }
            ]
          },
          {
            "id": "s1166",
            "name": "Seaweed Rolls (Gimmari) – Stock Level",
            "ko": "김말이 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "3 Bags or More / 3봉 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "2 Bags / 2봉",
                "status": "LOW",
                "level": "low"
              },
              {
                "label": "1 Bag / 1봉",
                "status": "ORDER",
                "level": "order"
              }
            ]
          },
          {
            "id": "s1167",
            "name": "Takoyaki – Stock Level",
            "ko": "타코야끼 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "3 Bags or More / 3봉 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "2 Bags / 2봉",
                "status": "LOW",
                "level": "low"
              },
              {
                "label": "1 Bag / 1봉",
                "status": "ORDER",
                "level": "order"
              }
            ]
          },
          {
            "id": "s1168",
            "name": "Udon Noodles – Stock Level",
            "ko": "우동면 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "7 Bags or More / 7봉 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "5–6 Bags / 5~6봉",
                "status": "LOW",
                "level": "low"
              },
              {
                "label": "3–4 Bags / 3~4봉",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "1–2 Bags / 1~2봉",
                "status": "URGENT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1169",
            "name": "Cube Chicken – Stock Level",
            "ko": "큐브치킨 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "8 Bags or More / 8봉 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "4-6 Bags / 4~6봉",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "Less than 3 Bags / 5봉 미만",
                "status": "URGENT",
                "level": "urgent"
              },
              {
                "label": "1–2 Bags / 1~2봉",
                "status": "URGENT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1170",
            "name": "Ground Meat – Stock Level",
            "ko": "간고기 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "8 Bags or More / 8봉 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "4–7 Bags / 4~7봉",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "Less than 4 Bags / 4봉 미만",
                "status": "URGENT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1171",
            "name": "Rice Bowl Beef – Stock Level",
            "ko": "덮밥용 소고기 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "8 Bags or More / 8봉 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "4–7 Bags / 4~7봉",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "Less than 4 Bags / 4봉 미만",
                "status": "URGENT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1172",
            "name": "Spicy Pork – Stock Level",
            "ko": "스파이시 포크 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "8 Bags or More / 8봉 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "4–7 Bags / 4~7봉",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "Less than 4 Bags / 4봉 미만",
                "status": "URGENT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1173",
            "name": "Teriyaki Pork – Stock Level",
            "ko": "데리야끼 포크 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "5 Bags or More / 5봉 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "2–4 Bags / 2~4봉",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "Less than 2 Bags / 2봉 미만",
                "status": "URGENT",
                "level": "urgent"
              }
            ]
          }
        ]
      },
      {
        "en": "Refrigerated Items & Sauces",
        "ko": "냉장제품 및 소스",
        "note": "Check all frozen items used at the Cook Station. Follow the counting unit or stock level shown for each item. / 쿡 파트에서 사용하는 모든 냉동제품의 재고를 확인해주세요. 각 품목에 표시된 수량 단위 또는 재고 기준에 따라 확인해주세요.",
        "items": [
          {
            "id": "s1174",
            "name": "Sweet & Spicy Chicken Sauce – Stock Level",
            "ko": "스윗앤스파이시 치킨소스 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "3 Containers or More / 3통 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "1–Less than 3 Containers / 1통~3통 미만",
                "status": "LOW",
                "level": "low"
              },
              {
                "label": "Less than 1 Container / 1통 미만",
                "status": "PREP",
                "level": "order"
              }
            ]
          },
          {
            "id": "s1175",
            "name": "Honey Garlic Chicken Sauce – Stock Level",
            "ko": "허니갈릭치킨소스 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "3 Containers or More / 3통 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "1–Less than 3 Containers / 1통~3통 미만",
                "status": "LOW",
                "level": "low"
              },
              {
                "label": "Less than 1 Container / 1통 미만",
                "status": "PREP",
                "level": "order"
              }
            ]
          },
          {
            "id": "s1176",
            "name": "Tteokbokki Sauce – Stock Level",
            "ko": "떡볶이소스 – 재고 상태",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "2 Containers or More / 2통 이상",
                "status": "SAFE",
                "level": "ok"
              },
              {
                "label": "½–Less than 2 Containers / 반 통~2통 미만",
                "status": "LOW",
                "level": "low"
              },
              {
                "label": "Less than ½ Container / 반 통 미만",
                "status": "PREP",
                "level": "order"
              }
            ]
          }
        ]
      },
      {
        "en": "Packaging",
        "ko": "포장용기",
        "note": "",
        "items": [
          {
            "id": "s1187",
            "name": "500ml container",
            "ko": "500ml 컨테이너",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "Backup stock available / 충분 – 여분 있음",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "Last box in use / 주문 필요 – 마지막 박스 사용 중",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "No stock / 재고 없음",
                "status": "OUT",
                "level": "urgent"
              }
            ]
          },
          {
            "id": "s1188",
            "name": "1000ml container",
            "ko": "1000ml 컨테이너",
            "note": "",
            "input": "choice",
            "options": [
              {
                "label": "Backup stock available / 충분 – 여분 있음",
                "status": "OK",
                "level": "ok"
              },
              {
                "label": "Last box in use / 주문 필요 – 마지막 박스 사용 중",
                "status": "ORDER",
                "level": "order"
              },
              {
                "label": "No stock / 재고 없음",
                "status": "OUT",
                "level": "urgent"
              }
            ]
          }
        ]
      }
    ],
    "extra": {
      "title": "Additional Supply Request",
      "ko": "기타 물품 구매 요청",
      "help": "Use this section to request any items not listed in the inventory above that need to be purchased or replaced(e.g., markers, tape, aprons, small supplies etc.) If nothing is needed, select \"NO\" 위 재고 목록에 없는 물품 중 새로 구매하거나 교체가 필요한 제품이 있다면 요청해주세요. (예: 마커, 테이프,앞치마,기타비품등) 필요한 물품이 없다면 \"NO\"를 선택해주세요.",
      "question": "Does anything need to be replaced or ordered? / 교체 또는 추가 구매가 필요한 물품이 있나요?",
      "details": true
    }
  }
};
