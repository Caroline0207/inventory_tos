# Daily Inventory

스시 가게 일일 재고 부족 수량 입력 웹앱입니다.
직원은 **링크 + 가게 PIN**만 있으면 휴대폰, 태블릿, 컴퓨터 브라우저에서 바로 입력할 수 있습니다. 앱 설치나 회원가입은 필요 없습니다.

- 화면: GitHub Pages (무료)
- 데이터: Supabase (무료 플랜으로 충분)
- 서버 관리: 없음

```
web/                 ← 웹앱 (index.html, app.js, styles.css)
supabase/schema.sql  ← 데이터베이스 구조 + 초기 상품 34개 + PIN 설정
.github/workflows/   ← GitHub에 올리면 자동 배포
```

---

## 처음 한 번만 하는 설정 (약 20분)

### 1단계. Supabase 데이터베이스 만들기

1. https://supabase.com 에 가입하고 **New project**를 만듭니다.
   - Region은 가게와 가까운 **Canada (Central)**를 고르세요.
   - Database password는 따로 적어 두세요. 이 앱에는 쓰이지 않습니다.
2. 프로젝트가 준비되면 왼쪽 메뉴에서 **SQL Editor** → **New query**를 엽니다.
3. `supabase/schema.sql` 파일 내용을 **전부** 복사해서 붙여넣고 **Run**을 누릅니다.
   - "Success" 가 나오면 표 2개(products, inventory_records)와 상품 34개가 만들어집니다.
4. **PIN 설정.** 새 쿼리 창에 아래를 붙여넣고, 숫자를 **본인이 정한 PIN으로 바꾼 뒤** Run을 누릅니다.
   ```sql
   select private.set_pin('staff', '여기에-직원용-PIN');
   select private.set_pin('admin', '여기에-사장님용-PIN');
   ```
   - **직원용 PIN**: 재고 입력과 History 보기
   - **사장님용 PIN**: 여기에 더해 상품 추가/수정, 기준 재고 변경
   - 6자리 이상을 권장합니다. 두 PIN은 서로 다르게 정하세요.
5. 연결 정보를 복사해 둡니다. **Project Settings**에서 찾을 수 있습니다.
   - **Project URL**: `https://xxxxxx.supabase.co` 형태
   - **Publishable key**: `sb_publishable_...` 형태 (예전 프로젝트라면 `anon` `public` 키)
   - ⚠️ **secret key 또는 service_role 키는 절대 쓰지 마세요.**

### 2단계. GitHub에 올리기

1. https://github.com 에서 **New repository**를 만듭니다.
   - 이름 예: `sushi-inventory`
   - **Public**으로 만드세요. 무료 계정의 GitHub Pages는 Public 저장소만 지원합니다. 코드에는 비밀번호나 키가 없어서 공개되어도 괜찮습니다.
2. 이 폴더의 파일을 저장소에 올립니다.
   - 웹에서 올릴 때: **Add file → Upload files**에 `web` 폴더, `supabase` 폴더, `README.md`를 끌어다 놓고 Commit 합니다.
   - `.github` 폴더는 숨김 폴더라 끌어다 놓기가 안 될 수 있습니다. 그럴 때는 **Add file → Create new file**을 누르고, 파일 이름에 `.github/workflows/deploy.yml`을 입력한 뒤 그 파일 내용을 붙여넣고 Commit 하세요.
3. **Settings → Secrets and variables → Actions → New repository secret**에서 두 개를 추가합니다.
   | Name | Value |
   |---|---|
   | `SUPABASE_URL` | 1단계에서 복사한 Project URL |
   | `SUPABASE_ANON_KEY` | 1단계에서 복사한 Publishable key |
4. **Settings → Pages**에서 Source를 **GitHub Actions**로 바꿉니다.
5. **Actions** 탭에서 "Deploy to GitHub Pages"를 열고 **Run workflow**를 누릅니다. (파일을 올릴 때 이미 실행되었다면 실패로 나올 수 있습니다. Secret을 넣은 뒤 다시 실행하면 됩니다.)
6. 초록색 체크가 뜨면 주소가 나옵니다.
   `https://<GitHub아이디>.github.io/sushi-inventory/`

### 3단계. 직원에게 공유

- 직원에게 **링크**와 **직원용 PIN**을 보내세요.
- 처음 한 번 PIN을 입력하면 그 기기에서는 다시 묻지 않습니다.
- 휴대폰 홈 화면에 추가하면 앱처럼 열립니다.
  - iPhone: Safari → 공유 → **홈 화면에 추가**
  - Android: Chrome → ⋮ → **홈 화면에 추가**

---

## 매일 사용

1. 링크를 엽니다. 오늘 날짜가 자동으로 나옵니다.
2. 각 상품의 **부족한 수량**만 입력합니다. 다 있으면 0 그대로 둡니다.
3. **Save Today's Inventory**를 누릅니다.
4. 같은 날 다시 저장하면 그날 기록이 수정됩니다. 중복 기록은 생기지 않습니다.
5. **Order** 버튼을 누르면 부족한 상품만 모은 주문 문자가 나옵니다. 필요하면 고친 뒤 **Copy**를 눌러 거래처 문자/카톡에 붙여넣으세요. 지난 날짜는 History → 날짜 → **Order text for this day**.

## 자주 하는 일

- **상품 추가/수정/숨기기**: Products 탭 → 사장님용 PIN으로 Unlock → Edit 또는 + Add product.
  상품은 삭제하지 않고 **Active 체크를 해제**해서 숨깁니다. 과거 기록은 그대로 남습니다.
- **PIN 바꾸기** (직원이 그만뒀을 때 등): Supabase SQL Editor에서 1단계 4번 쿼리를 새 PIN으로 다시 실행합니다. 모든 기기에서 다음에 열 때 새 PIN을 묻습니다.
- **기록을 엑셀로 받기**: Supabase → Table Editor → `inventory_records` → Export to CSV.
- **화면 수정 후 반영**: GitHub에서 `web/` 파일을 수정하고 Commit 하면 1~2분 뒤 자동으로 반영됩니다.

## 확인이 필요한 상품 (손글씨가 불분명했던 것)

Products 탭에 노란색 **Needs review**로 표시됩니다. 사장님용 PIN으로 수정하고 저장하면 표시가 사라집니다.

| 상품 | 확인할 내용 |
|---|---|
| Hondashi | 기준 수량과 단위가 비어 있음 |
| Avocado | "Box" 앞 숫자가 사진에서 잘림, 표가 아래로 더 이어질 수 있음 |
| Rice | 10 EA 맞는지 (수량 칸이 기울어져 있음) |
| Salt | 1 EA 맞는지 |
| Tempura Batter | ½ Bag 맞는지 |

## 보안 메모

- 브라우저에 들어가는 Publishable key는 원래 공개용입니다. 이 키만으로는 표를 직접 읽거나 쓸 수 없습니다 (RLS로 막혀 있음). 모든 읽기와 쓰기는 PIN을 확인하는 함수를 거칩니다.
- PIN은 데이터베이스에 암호화(bcrypt)되어 저장됩니다.
- 링크와 직원용 PIN을 아는 사람은 누구나 재고를 입력할 수 있습니다. 직원이 바뀌면 PIN을 바꾸세요.
- Supabase 무료 플랜은 **1주일 동안 아무도 쓰지 않으면 프로젝트가 일시정지**됩니다. 매일 쓰면 문제없고, 정지되면 Supabase 대시보드에서 Restore를 누르면 됩니다.

## 나중에 추가하기 좋은 기능

데이터 구조(`products`, `inventory_records`, 날짜+상품 unique)가 이미 준비되어 있어서 아래 기능은 SQL 함수 하나와 화면 하나씩 추가하면 됩니다.
발주량 자동 계산, 자주 부족한 상품, 30일 평균 부족량, 주간/월간 통계, CSV 내보내기 버튼, 직원별 입력(직원마다 PIN 따로).
