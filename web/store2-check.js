// Store #2 regular inventory check, from the store's check form.
// To change an item, edit its text here and push to GitHub.
// Keep each item `id` the same so past checks still line up; use a new id for a new item.
// input: number = staff enter how much is short vs `target` (in `unit`); flag = one "Need to order" toggle; text = written answer.
// `target` comes from each item's SAFE line in the original form. `options` are kept for reference.
// level: ok (green, SAFE) · low (yellow) · order (red, ORDER/REQUEST) · urgent (OUT) · none (no colour in the form)
window.STORE2_CHECK = {
 "sections": [
  {
   "id": "sec1",
   "en": "Front Area – POS & Service Area",
   "ko": "앞쪽 – 포스 및 장사 구역",
   "note": "Start at the POS area and check all items used for daily service. / 포스기 쪽부터 시작하여 장사 중 바로 사용하는 재고를 순서대로 확인해주세요.",
   "items": [
    {
     "name": "Unagi Sauce",
     "ko": "우나기 소스",
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
       "status": "REQUEST",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT",
       "level": "urgent"
      }
     ],
     "id": "i01",
     "input": "number",
     "target": 1.0,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Teriyaki Sauce (For Dupbap)",
     "ko": "시판 데리야끼 소스 (덮밥용)",
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
       "status": "REQUEST",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT",
       "level": "urgent"
      }
     ],
     "id": "i02",
     "input": "number",
     "target": 1.0,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Cooking Oil",
     "ko": "식용유",
     "note": "",
     "options": [
      {
       "label": "반통 이상 / ½ Container or More",
       "status": "SAFE",
       "level": "ok"
      },
      {
       "label": "1/3통 이상 ~ 반통 미만 / ⅓–Less than ½",
       "status": "ORDER",
       "level": "low"
      },
      {
       "label": "1/3통 미만 / Less than ⅓",
       "status": "URGENT",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT",
       "level": "urgent"
      }
     ],
     "id": "i03",
     "input": "number",
     "target": 0.5,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Coke regular",
     "ko": "",
     "note": "",
     "options": [
      {
       "label": "10+ Backup Drinks After Restocking / 리스탁 후 백업 10개 이상",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "5-8 Backup Drinks After Restocking / 리스탁 후 백업 5-8개",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "3-4 Backup Drinks After Restocking / 리스탁 후 백업 3-4개",
       "status": "REQUEST / 받아야 함",
       "level": "order"
      },
      {
       "label": "No Backup After Restocking / 리스탁 후 백업 없음",
       "status": "URGENT / 긴급 요청",
       "level": "urgent"
      }
     ],
     "id": "i04",
     "input": "number",
     "target": 10.0,
     "unit": "EA",
     "unitKo": "개"
    },
    {
     "name": "Diet Coke",
     "ko": "",
     "note": "",
     "options": [
      {
       "label": "10+ Backup Drinks After Restocking / 리스탁 후 백업 10개 이상",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "5-8 Backup Drinks After Restocking / 리스탁 후 백업 5-8개",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "3-4 Backup Drinks After Restocking / 리스탁 후 백업 3-4개",
       "status": "REQUEST / 받아야 함",
       "level": "order"
      },
      {
       "label": "No Backup After Restocking / 리스탁 후 백업 없음",
       "status": "URGENT / 긴급 요청",
       "level": "urgent"
      }
     ],
     "id": "i05",
     "input": "number",
     "target": 10.0,
     "unit": "EA",
     "unitKo": "개"
    },
    {
     "name": "Coke Zero",
     "ko": "",
     "note": "",
     "options": [
      {
       "label": "10+ Backup Drinks After Restocking / 리스탁 후 백업 10개 이상",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "5-8 Backup Drinks After Restocking / 리스탁 후 백업 5-8개",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "3-4 Backup Drinks After Restocking / 리스탁 후 백업 3-4개",
       "status": "REQUEST / 받아야 함",
       "level": "order"
      },
      {
       "label": "No Backup After Restocking / 리스탁 후 백업 없음",
       "status": "URGENT / 긴급 요청",
       "level": "urgent"
      }
     ],
     "id": "i06",
     "input": "number",
     "target": 10.0,
     "unit": "EA",
     "unitKo": "개"
    },
    {
     "name": "Canada dry",
     "ko": "",
     "note": "",
     "options": [
      {
       "label": "10+ Backup Drinks After Restocking / 리스탁 후 백업 10개 이상",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "5-8 Backup Drinks After Restocking / 리스탁 후 백업 5-8개",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "3-4 Backup Drinks After Restocking / 리스탁 후 백업 3-4개",
       "status": "REQUEST / 받아야 함",
       "level": "order"
      },
      {
       "label": "No Backup After Restocking / 리스탁 후 백업 없음",
       "status": "URGENT / 긴급 요청",
       "level": "urgent"
      }
     ],
     "id": "i07",
     "input": "number",
     "target": 10.0,
     "unit": "EA",
     "unitKo": "개"
    },
    {
     "name": "Fuze",
     "ko": "",
     "note": "",
     "options": [
      {
       "label": "10+ Backup Drinks After Restocking / 리스탁 후 백업 10개 이상",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "5-8 Backup Drinks After Restocking / 리스탁 후 백업 5-8개",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "3-4 Backup Drinks After Restocking / 리스탁 후 백업 3-4개",
       "status": "REQUEST / 받아야 함",
       "level": "order"
      },
      {
       "label": "No Backup After Restocking / 리스탁 후 백업 없음",
       "status": "URGENT / 긴급 요청",
       "level": "urgent"
      }
     ],
     "id": "i08",
     "input": "number",
     "target": 10.0,
     "unit": "EA",
     "unitKo": "개"
    },
    {
     "name": "Sprite",
     "ko": "",
     "note": "",
     "options": [
      {
       "label": "10+ Backup Drinks After Restocking / 리스탁 후 백업 10개 이상",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "5-8 Backup Drinks After Restocking / 리스탁 후 백업 5-8개",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "3-4 Backup Drinks After Restocking / 리스탁 후 백업 3-4개",
       "status": "REQUEST / 받아야 함",
       "level": "order"
      },
      {
       "label": "No Backup After Restocking / 리스탁 후 백업 없음",
       "status": "URGENT / 긴급 요청",
       "level": "urgent"
      }
     ],
     "id": "i09",
     "input": "number",
     "target": 10.0,
     "unit": "EA",
     "unitKo": "개"
    },
    {
     "name": "Arizona",
     "ko": "",
     "note": "",
     "options": [
      {
       "label": "8+ Backup Drinks After Restocking / 리스탁 후 백업 8개 이상",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "5-8 Backup Drinks After Restocking / 리스탁 후 백업 5-8개",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "3-4 Backup Drinks After Restocking / 리스탁 후 백업 3-4개",
       "status": "REQUEST / 받아야 함",
       "level": "order"
      },
      {
       "label": "No Backup After Restocking / 리스탁 후 백업 없음",
       "status": "URGENT / 긴급 요청",
       "level": "urgent"
      }
     ],
     "id": "i10",
     "input": "number",
     "target": 8.0,
     "unit": "EA",
     "unitKo": "개"
    },
    {
     "name": "Milkis",
     "ko": "",
     "note": "",
     "options": [
      {
       "label": "5+ Backup Drinks After Restocking / 리스탁 후 백업 5개 이상",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "3–4 Backup Drinks After Restocking / 리스탁 후 백업 3–4개",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1–2 Backup Drinks After Restocking / 리스탁 후 백업 1–2개",
       "status": "REQUEST / 받아야 함",
       "level": "order"
      },
      {
       "label": "No Backup After Restocking / 리스탁 후 백업 없음",
       "status": "URGENT / 긴급 요청",
       "level": "urgent"
      }
     ],
     "id": "i11",
     "input": "number",
     "target": 5.0,
     "unit": "EA",
     "unitKo": "개"
    },
    {
     "name": "Banana milk",
     "ko": "바나나 우유",
     "note": "",
     "options": [
      {
       "label": "6개 이상 / 6+",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "3–5개 / 3–5",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1–2개 / 1–2",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "No Backup After Restocking / 리스탁 후 백업 없음",
       "status": "URGENT / 긴급 요청",
       "level": "urgent"
      }
     ],
     "id": "i12",
     "input": "number",
     "target": 6.0,
     "unit": "EA",
     "unitKo": "개"
    },
    {
     "name": "Sanpellegrino Lemon",
     "ko": "",
     "note": "",
     "options": [
      {
       "label": "5+ Backup Drinks After Restocking / 리스탁 후 백업 5개 이상",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "3–4 Backup Drinks After Restocking / 리스탁 후 백업 3–4개",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1–2 Backup Drinks After Restocking / 리스탁 후 백업 1–2개",
       "status": "REQUEST / 받아야 함",
       "level": "order"
      },
      {
       "label": "No Backup After Restocking / 리스탁 후 백업 없음",
       "status": "URGENT / 긴급 요청",
       "level": "urgent"
      }
     ],
     "id": "i13",
     "input": "number",
     "target": 5.0,
     "unit": "EA",
     "unitKo": "개"
    },
    {
     "name": "Sanpellegrino Blood orange",
     "ko": "",
     "note": "",
     "options": [
      {
       "label": "5+ Backup Drinks After Restocking / 리스탁 후 백업 5개 이상",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "3–4 Backup Drinks After Restocking / 리스탁 후 백업 3–4개",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1–2 Backup Drinks After Restocking / 리스탁 후 백업 1–2개",
       "status": "REQUEST / 받아야 함",
       "level": "order"
      },
      {
       "label": "No Backup After Restocking / 리스탁 후 백업 없음",
       "status": "URGENT / 긴급 요청",
       "level": "urgent"
      }
     ],
     "id": "i14",
     "input": "number",
     "target": 5.0,
     "unit": "EA",
     "unitKo": "개"
    },
    {
     "name": "Paper Towels",
     "ko": "페이퍼타올",
     "note": "",
     "options": [
      {
       "label": "4개 이상 / 4+ Rolls",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "2–3개 / 2–3 Rolls",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "2개 미만 / Less than 2 Rolls",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "i15",
     "input": "number",
     "target": 4.0,
     "unit": "Roll",
     "unitKo": "롤"
    },
    {
     "name": "Brown Paper Towels",
     "ko": "브라운페이퍼타올",
     "note": "",
     "options": [
      {
       "label": "4개 이상 / 4+ Rolls",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "2–3개 / 2–3 Rolls",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "2개 미만 / Less than 2 Rolls",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "i16",
     "input": "number",
     "target": 4.0,
     "unit": "Roll",
     "unitKo": "롤"
    },
    {
     "name": "Triangle Kimbap Seaweed",
     "ko": "삼각김밥 김",
     "note": "Please check not only the stock next to the microwave, but also the stock on the top shelf of the cabinet above the dining dishes. 전자레인지 옆 재고 뿐만이 아니라 다이닝그릇 위에 있는 장 맨위에 재고도 확인해주세요",
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
     "id": "i17",
     "input": "number",
     "target": 2.0,
     "unit": "Bag",
     "unitKo": "봉"
    },
    {
     "name": "Sushi Vinegar",
     "ko": "스시초",
     "note": "",
     "options": [
      {
       "label": "반통 초과 / More than ½ Container",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "반통 이하 / ½ Container or Less",
       "status": "ORDER / 주문 필요",
       "level": "order"
      }
     ],
     "id": "i18",
     "input": "number",
     "target": 1.0,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Prepped Carrots – Vacuum Packs",
     "ko": "프랩 당근 – 진공팩",
     "note": "",
     "options": [
      {
       "label": "4봉 이상 / 4+ Packs",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "2-3봉 / 2-3 Packs",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1봉 미만 / Less than 1 Pack",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "i19",
     "input": "number",
     "target": 4.0,
     "unit": "Pack",
     "unitKo": "팩"
    },
    {
     "name": "Prepped Purple cabbage – Vacuum Packs",
     "ko": "프랩 적배추 – 진공팩",
     "note": "",
     "options": [
      {
       "label": "4봉 이상 / 4+ Packs",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "2-3봉 / 2-3 Packs",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1봉 미만 / Less than 1 Pack",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "i20",
     "input": "number",
     "target": 4.0,
     "unit": "Pack",
     "unitKo": "팩"
    },
    {
     "name": "Avocado",
     "ko": "아보카도",
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
       "label": "OUT / 재고 없음",
       "status": "",
       "level": "urgent"
      }
     ],
     "id": "i21",
     "input": "number",
     "target": 1.0,
     "unit": "Box",
     "unitKo": "박스"
    },
    {
     "name": "Eggs",
     "ko": "계란",
     "note": "스테인리스 통에 담긴 재고 기준 / Based on stock in the stainless steel container",
     "options": [
      {
       "label": "통 가득 / Full Pan",
       "status": "SAFE",
       "level": "ok"
      },
      {
       "label": "절반 초과 / More than ½ Pan",
       "status": "LOW",
       "level": "low"
      },
      {
       "label": "절반 이하 / ½ Pan or Less",
       "status": "ORDER",
       "level": "order"
      },
      {
       "label": "거의 없음 / Almost Empty",
       "status": "URGENT",
       "level": "urgent"
      }
     ],
     "id": "i22",
     "input": "number",
     "target": 1.0,
     "unit": "Pan",
     "unitKo": "판"
    },
    {
     "name": "Salmon Back Loin – Ready Stock",
     "ko": "연어 등살 – 장사용 재고",
     "note": "",
     "options": [
      {
       "label": "4 or More / 4줄 이상",
       "status": "",
       "level": "none"
      },
      {
       "label": "3 / 3줄",
       "status": "",
       "level": "none"
      },
      {
       "label": "2 / 2줄",
       "status": "",
       "level": "none"
      },
      {
       "label": "1 / 1줄",
       "status": "",
       "level": "none"
      },
      {
       "label": "OUT / 없음",
       "status": "",
       "level": "urgent"
      }
     ],
     "id": "i23",
     "input": "number",
     "target": 4.0,
     "unit": "Strip",
     "unitKo": "줄"
    },
    {
     "name": "Salmon Belly – Ready Stock",
     "ko": "연어 뱃살 – 장사용 재고",
     "note": "",
     "options": [
      {
       "label": "4 or More / 4줄 이상",
       "status": "",
       "level": "none"
      },
      {
       "label": "3 / 3줄",
       "status": "",
       "level": "none"
      },
      {
       "label": "2 / 2줄",
       "status": "",
       "level": "none"
      },
      {
       "label": "1 / 1줄",
       "status": "",
       "level": "none"
      },
      {
       "label": "OUT / 없음",
       "status": "",
       "level": "urgent"
      }
     ],
     "id": "i24",
     "input": "number",
     "target": 4.0,
     "unit": "Strip",
     "unitKo": "줄"
    },
    {
     "name": "Oshi Salmon – Ready Stock",
     "ko": "오시용 연어 – 장사용 재고",
     "note": "",
     "options": [
      {
       "label": "1 Container or More / 1통 이상",
       "status": "",
       "level": "none"
      },
      {
       "label": "Less than 1 Container / 1통 미만",
       "status": "",
       "level": "none"
      },
      {
       "label": "Almost Out / 거의 없음",
       "status": "",
       "level": "none"
      },
      {
       "label": "OUT / 없음",
       "status": "",
       "level": "urgent"
      }
     ],
     "id": "i25",
     "input": "number",
     "target": 1.0,
     "unit": "Container",
     "unitKo": "통"
    }
   ]
  },
  {
   "id": "sec2",
   "en": "Supply Area – Near Washroom",
   "ko": "비품 구역 – 화장실 앞",
   "note": "",
   "items": [
    {
     "name": "Combo Containers and lids",
     "ko": "콤보 컨테이너, 뚜껑",
     "note": "앞쪽 사용 공간을 먼저 리스탁한 후 남은 백업 재고 기준 / Restock the front service area first, then check remaining backup stock.",
     "options": [
      {
       "label": "1줄 반 이상 / 1½+ Sleeves",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "반 줄 이상 ~ 1줄 반 미만 / ½–Less than 1½ Sleeves",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "반 줄 미만 / Less than ½ Sleeve",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "리스탁 후 없음 / No Backup After Restocking",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "i26",
     "input": "number",
     "target": 1.5,
     "unit": "Sleeve",
     "unitKo": "줄"
    },
    {
     "name": "8-Compartment Sushi Case & Lid",
     "ko": "8구 스시 케이스 & 뚜껑",
     "note": "앞쪽 사용 공간을 먼저 리스탁한 후 남은 백업 재고 기준 / Restock the front service area first, then check remaining backup stock.",
     "options": [
      {
       "label": "리스탁 후 2줄 이상 / 2+ Sleeves After Restocking",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "리스탁 후 반 줄 이상 ~ 2줄 미만 / ½–Less than 2 Sleeves After Restocking",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "리스탁 후 반 줄 미만 / Less than ½ Sleeve After Restocking",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "리스탁 후 없음 / No Backup After Restocking",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "i27",
     "input": "number",
     "target": 2.0,
     "unit": "Sleeve",
     "unitKo": "줄"
    },
    {
     "name": "10-Compartment Sushi Case & Lid",
     "ko": "10구 스시 케이스 & 뚜껑",
     "note": "앞쪽 사용 공간을 먼저 리스탁한 후 남은 백업 재고 기준 / Restock the front service area first, then check remaining backup stock.",
     "options": [
      {
       "label": "리스탁 후 2줄 이상 / 2+ Sleeves After Restocking",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "리스탁 후 반 줄 이상 ~ 2줄 미만 / ½–Less than 2 Sleeves After Restocking",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "리스탁 후 반 줄 미만 / Less than ½ Sleeve After Restocking",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "리스탁 후 없음 / No Backup After Restocking",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "i28",
     "input": "number",
     "target": 2.0,
     "unit": "Sleeve",
     "unitKo": "줄"
    },
    {
     "name": "Poke Containers & Lids",
     "ko": "포케 용기 & 뚜껑",
     "note": "앞쪽 사용 공간을 먼저 리스탁한 후 남은 백업 재고 기준 / Restock the front service area first, then check remaining backup stock.",
     "options": [
      {
       "label": "2줄 이상 / 2+ Sleeves",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1줄 이상 ~ 2줄 미만 / 1–Less than 2 Sleeves",
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
     "id": "i29",
     "input": "number",
     "target": 2.0,
     "unit": "Sleeve",
     "unitKo": "줄"
    },
    {
     "name": "Bibimbap Containers & Lids",
     "ko": "비빔밥 용기 & 뚜껑",
     "note": "앞쪽 사용 공간을 먼저 리스탁한 후 남은 백업 재고 기준 / Restock the front service area first, then check remaining backup stock.",
     "options": [
      {
       "label": "2줄 이상 / 2+ Sleeves",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1줄 이상 ~ 2줄 미만 / 1–Less than 2 Sleeves",
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
     "id": "i30",
     "input": "number",
     "target": 2.0,
     "unit": "Sleeve",
     "unitKo": "줄"
    }
   ]
  },
  {
   "id": "sec3",
   "en": "Freezer items",
   "ko": "냉동고 제품",
   "note": "",
   "items": [
    {
     "name": "Meat Dumpling",
     "ko": "고기만두",
     "note": "Exclude the stock in the refrigerator. / 냉장고에 있는 재고 제외",
     "options": [
      {
       "label": "3봉 이상 / 3+ Bags",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1–2봉 / 1–2 Bags",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "i31",
     "input": "number",
     "target": 3.0,
     "unit": "Bag",
     "unitKo": "봉"
    },
    {
     "name": "Veggi Dumpling",
     "ko": "베지만두",
     "note": "Exclude the stock in the refrigerator. / 냉장고에 있는 재고 제외",
     "options": [
      {
       "label": "3봉 이상 / 3+ Bags",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1–2봉 / 1–2 Bags",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "i32",
     "input": "number",
     "target": 3.0,
     "unit": "Bag",
     "unitKo": "봉"
    },
    {
     "name": "Udon Noodles",
     "ko": "우동면",
     "note": "",
     "options": [
      {
       "label": "3봉 이상 / 3+ Bags",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1–2봉 / 1–2 Bags",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "i33",
     "input": "number",
     "target": 3.0,
     "unit": "Bag",
     "unitKo": "봉"
    },
    {
     "name": "Fried Shrimp",
     "ko": "새우튀김",
     "note": "",
     "options": [
      {
       "label": "반 박스 이상 / ½ Box or More",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "반 박스 미만 / Less than ½ Box",
       "status": "ORDER / 주문해야함",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "i34",
     "input": "number",
     "target": 0.5,
     "unit": "Box",
     "unitKo": "박스"
    },
    {
     "name": "YAM",
     "ko": "얌",
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
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "i35",
     "input": "number",
     "target": 2.0,
     "unit": "Bag",
     "unitKo": "봉"
    },
    {
     "name": "ICE",
     "ko": "얼음",
     "note": "",
     "options": [
      {
       "label": "3봉 이상 / 3+ Bags",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1봉 이상 ~ 2봉 미만 / 1–Less than 2 Bags",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "i36",
     "input": "number",
     "target": 3.0,
     "unit": "Bag",
     "unitKo": "봉"
    },
    {
     "name": "Portioned Black Tapioca Pearls",
     "ko": "소분 블랙펄",
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
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "i37",
     "input": "number",
     "target": 15.0,
     "unit": "Bag",
     "unitKo": "봉"
    },
    {
     "name": "Ground Beef",
     "ko": "간 소고기",
     "note": "Exclude cooked/prepped stock. / 볶아놓은 재고 제외",
     "options": [
      {
       "label": "3봉 이상 / 3+ Bags",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1–2봉 / 1–2 Bags",
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
     "id": "i38",
     "input": "number",
     "target": 3.0,
     "unit": "Bag",
     "unitKo": "봉"
    },
    {
     "name": "Dupbap Beef",
     "ko": "덮밥 소고기",
     "note": "Exclude cooked/prepped stock. / 볶아놓은 재고 제외",
     "options": [
      {
       "label": "3봉 이상 / 3+ Bags",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1–2봉 / 1–2 Bags",
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
     "id": "i39",
     "input": "number",
     "target": 3.0,
     "unit": "Bag",
     "unitKo": "봉"
    },
    {
     "name": "Spicy pork",
     "ko": "스파이시 포크",
     "note": "Exclude cooked/prepped stock. / 볶아놓은 재고 제외",
     "options": [
      {
       "label": "3봉 이상 / 3+ Bags",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1–2봉 / 1–2 Bags",
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
     "id": "i40",
     "input": "number",
     "target": 3.0,
     "unit": "Bag",
     "unitKo": "봉"
    },
    {
     "name": "Cube Chicken",
     "ko": "큐브 치킨",
     "note": "",
     "options": [
      {
       "label": "3봉 이상 / 3+ Bags",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1–2봉 / 1–2 Bags",
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
     "id": "i41",
     "input": "number",
     "target": 3.0,
     "unit": "Bag",
     "unitKo": "봉"
    },
    {
     "name": "Halal Chicken",
     "ko": "할랄 치킨",
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
     "id": "i42",
     "input": "flag"
    },
    {
     "name": "Portioned Teriyaki pork",
     "ko": "소분된 데리야끼 포크",
     "note": "",
     "options": [
      {
       "label": "10개 이상 / 10+ Bags",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "4–9개 / 4–9 Bags",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "4개 미만 / Less than 4 Bags",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "i43",
     "input": "number",
     "target": 10.0,
     "unit": "Bag",
     "unitKo": "봉"
    },
    {
     "name": "Boneless Chicken",
     "ko": "본레스 치킨",
     "note": "Count the large bags containing 1-lb portioned bags. / 1파운드씩 소분된 봉투가 들어있는 큰 봉투 기준",
     "options": [
      {
       "label": "큰 봉투 2봉 이상 / 2+ Large Bags",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "큰 봉투 1봉 이상 ~ 2봉 미만 / 1–Less than 2 Large Bags",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "큰 봉투 1봉 미만 / Less than 1 Large Bag",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "i44",
     "input": "number",
     "target": 2.0,
     "unit": "Bag",
     "unitKo": "봉"
    }
   ]
  },
  {
   "id": "sec4",
   "en": "Refrigerated Items",
   "ko": "냉장고 제품",
   "note": "",
   "items": [
    {
     "name": "Spring Mix",
     "ko": "스프링믹스",
     "note": "",
     "options": [
      {
       "label": "8팩 이상 / 8+ Packs",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "4-7팩 / 4-7 Packs",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "3팩 미만 / Less than 3 Packs",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "i45",
     "input": "number",
     "target": 8.0,
     "unit": "Pack",
     "unitKo": "팩"
    },
    {
     "name": "Whole Carrots",
     "ko": "생당근",
     "note": "Check the remaining whole carrots after prepping the carrots for the Cook Station. / 쿡용 당근 프랩을 모두 완료한 후 남은 생당근 기준으로 확인해주세요.",
     "options": [
      {
       "label": "5개 이상 / 5+ Carrots",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "2–4개 / 2–4 Carrots",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "2개 미만 / Less than 2 Carrots",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "i46",
     "input": "number",
     "target": 5.0,
     "unit": "EA",
     "unitKo": "개"
    },
    {
     "name": "Unprepped Zucchini",
     "ko": "프랩 안 된 주키니",
     "note": "Check the remaining whole zucchini after prepping the zucchini for the Cook Station. / 쿡용 주키니 프랩을 모두 완료한 후 남은 생주키니 기준으로 확인해주세요.",
     "options": [
      {
       "label": "6개 이상 / 6+ Zucchini",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "2–5개 / 2–5 Zucchini",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "2개 미만 / Less than 2 Zucchini",
       "status": "ORDER / 주문 필요",
       "level": "order"
      }
     ],
     "id": "i47",
     "input": "number",
     "target": 6.0,
     "unit": "EA",
     "unitKo": "개"
    },
    {
     "name": "Unprepped Cabbage",
     "ko": "프랩 안 된 양배추",
     "note": "Check the remaining whole cabbage after prepping the cabbage for the Cook Station. / 쿡용 양배추 프랩을 모두 완료한 후 남은 생양배추 기준으로 확인해주세요.",
     "options": [
      {
       "label": "1통 이상 / 1+ Whole Cabbage",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "반통 이상 ~ 1통 미만 / ½–Less than 1 Cabbage",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "반통 미만 / Less than ½ Cabbage",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "i48",
     "input": "number",
     "target": 1.0,
     "unit": "Container",
     "unitKo": "통"
    },
    {
     "name": "Unprepped Chives",
     "ko": "프랩 안 된 부추",
     "note": "Check the remaining chives after prepping the chives for the Cook Station. / 쿡용 부추 프랩을 모두 완료한 후 남은 생부추 기준으로 확인해주세요.",
     "options": [
      {
       "label": "반 단 이상 / ½ Bunch or More",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "반 단 미만 / Less than ½ Bunch",
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
     "id": "i49",
     "input": "number",
     "target": 0.5,
     "unit": "Bunch",
     "unitKo": "단"
    },
    {
     "name": "Backup Whole Cucumbers",
     "ko": "백업 생오이",
     "note": "Check after all cucumbers for Bibimbap and Sushi have been prepped. / 비빔밥용과 스시용 오이 프랩을 모두 완료한 후 남은 생오이 기준으로 확인해주세요.",
     "options": [
      {
       "label": "16개 이상 / 16+ Cucumbers",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "10-15개 / 10-15 Cucumbers",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "9개 미만 / Less than 9 Cucumbers",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "i50",
     "input": "number",
     "target": 16.0,
     "unit": "EA",
     "unitKo": "개"
    },
    {
     "name": "Green Onions",
     "ko": "파",
     "note": "Exclude the prepped container at the front. Count only unprepped bunches. / 앞에 프랩되어 있는 통은 제외하고, 프랩 안 된 파만 확인해주세요.",
     "options": [
      {
       "label": "5단 이상 / 5+ Bunches",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1–4단 / 1–4 Bunches",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1단 미만 / Less than 1 Bunch",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "i51",
     "input": "number",
     "target": 5.0,
     "unit": "Bunch",
     "unitKo": "단"
    },
    {
     "name": "Japchae",
     "ko": "잡채",
     "note": "",
     "options": [
      {
       "label": "3봉 이상 / 3+ Bags",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1–2봉 / 1–2 Bags",
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
     "id": "i52",
     "input": "number",
     "target": 3.0,
     "unit": "Bag",
     "unitKo": "봉"
    },
    {
     "name": "Tofu",
     "ko": "두부",
     "note": "",
     "options": [
      {
       "label": "3팩 이상 / 3+ Packs",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "1–2팩 / 1–2 Packs",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1팩 미만 / Less than 1 Pack",
       "status": "ORDER / 주문 필요",
       "level": "order"
      },
      {
       "label": "없음 / OUT",
       "status": "URGENT / 긴급 주문",
       "level": "urgent"
      }
     ],
     "id": "i53",
     "input": "number",
     "target": 3.0,
     "unit": "Pack",
     "unitKo": "팩"
    },
    {
     "name": "Milk",
     "ko": "우유",
     "note": "",
     "options": [
      {
       "label": "3봉 이상 / 3+ Bags",
       "status": "SAFE / 충분",
       "level": "ok"
      },
      {
       "label": "2봉 / 2 Bags",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "1봉 이하 / 1 Bag or Less",
       "status": "ORDER / 주문 필요",
       "level": "order"
      }
     ],
     "id": "i54",
     "input": "number",
     "target": 3.0,
     "unit": "Bag",
     "unitKo": "봉"
    },
    {
     "name": "Heavy Cream",
     "ko": "생크림",
     "note": "The container is opaque, so estimate the remaining amount. / 용기 안이 보이지 않으므로 대략적인 양으로 확인해주세요.",
     "options": [
      {
       "label": "2팩 이상 / 2+ Cartons",
       "status": "SAFE / 여유",
       "level": "ok"
      },
      {
       "label": "약 1팩 이상 ~ 2팩 미만 / About 1–Less than 2 Cartons",
       "status": "LOW / 부족",
       "level": "low"
      },
      {
       "label": "약 1팩 미만 / About Less than 1 Carton",
       "status": "ORDER / 주문 필요",
       "level": "order"
      }
     ],
     "id": "i55",
     "input": "number",
     "target": 2.0,
     "unit": "Carton",
     "unitKo": "팩"
    }
   ]
  }
 ],
 "extra": {
  "title": "Additional Supply Request",
  "ko": "기타 물품 구매 요청",
  "help": "Use this section to request any items not listed in the inventory above that need to be purchased or replaced(e.g., markers, tape, aprons, small supplies etc.) If nothing is needed, select \"NO\" 위 재고 목록에 없는 물품 중 새로 구매하거나 교체가 필요한 제품이 있다면 요청해주세요. (예: 마커, 테이프,앞치마,기타비품등) 필요한 물품이 없다면 \"NO\"를 선택해주세요.",
  "question": "Does anything need to be replaced or ordered? / 교체 또는 추가 구매가 필요한 물품이 있나요?"
 }
};
