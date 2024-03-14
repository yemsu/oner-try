## 💀 Intro

- **8700명의 유저**가 이용한 Warcraft 3 Onepiece RPG 게임 정보 제공 사이트
- 현재는 게임 운영이 종료되어 [ONER TRY 개발계](https://dev.onertry.xyz/)만 접속 가능합니다.

<p>
  <img src="/public/images/readme/i36g-240314-103622.png" alt="">
  <img src="/public/images/readme/i37g-240314-103705.png" alt="">
</p>

---

## 💀 기술 스택

<p>
  <img src="https://img.shields.io/badge/Nuxt-002E3B?style=for-the-badge&logo=nuxtdotjs&logoColor=#00DC82" alt="nuxt">
  <img src="https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D" alt="vue">
  <img src="https://img.shields.io/badge/sass-CC6699?style=for-the-badge&logo=html5&logoColor=white" alt="sass">
  <img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="html">
</p>

- Nuxt.js : `v2.15.8`
- Vue.js : `v2.6.14`
- SASS : `v1.53.0`

---

### 페이지 소개

- **캐릭터** : 다른 유저들의 **아이템 빌드와 그에 따른 스탯, 시너지 효과**를 확인할 수 있습니다.
- **조합법** : 조합 아이템의 **총 재료 아이템**과 조합법을 **트리구조**로 한눈에 확인할 수 있습니다.
- **랭킹** : 유저들의 랭킹과 아이템 빌드를 캐릭터별로 확인할 수 있습니다.
- **아이템도감** : **등급/능력치별로 필터링**하며 아이템의 자세한 정보들을 확인할 수 있습니다.
- **MY 빌드** : **아이템을 조합하고 스탯, 시너지 효과를 확인**하며 나만의 빌드를 만들 수 있습니다.
- **파티모집** : 함께 게임할 파티원을 구할 수 있는 메뉴로 **채팅 기능**이 구현되어 있습니다.

---

## 💀 페이지 살펴보기

### 🔎  캐릭터 [(링크)](https://dev.onertry.xyz/character/result?nickname=Pinkbean)

![ONER TRY 캐릭터 상세페이지](/public/images/readme/i50g-240314-095049.png)

- 장착 선원, 동료에 따른 **시너지 효과** 계산하여 노출
- 장착 아이템의 옵션과 시너지 효과에 따른 **총 스탯** 계산하여 노출

### 🔎  조합법

![ONER TRY 조합법 상세페이지](/public/images/readme/i55g-240314-095559.png)

- 조합 아이템의 **상위 아이템** 노출
- 로그인 후 **조합법 즐겨 찾기 추가** 기능
- 조합 아이템에 필요한 **총 재료 아이템** 노출
- 조합 재료 **아이템 트리** 노출
  ![ONER TRY 조합법 아이템 트리 구조](/public/images/readme/i58g-240314-095833.png)
        

### 🔎  랭킹

![ONER TRY 랭킹 페이지](/public/images/readme/i4g-240314-100400.png)

- 통합 및 캐릭터별 유저 랭킹
- Infinite Scroll
    
### 🔎  아이템 도감

![ONER TRY 아이템 도감 페이지](/public/images/readme/i7g-240314-100706.png)

- 선택한 **필터**에 맞는 아이템 노출 및 해당 옵션 **하이라이트** 처리

### 🔎  MY 빌드

#### MY 빌드 리스트 페이지
![ONER TRY MY 빌드 리스트 페이지](/public/images/readme/i9g-240314-100935.png)
- 아이템 빌드 간략하게 노출
- 빌드 삭제 기능

#### MY 빌드 생성 페이지
![](/public/images/readme/i13g-240314-101322.png)
- 캐릭터, 아이템, 아이템 강화 수치 설정하고 **실시간으로 스탯을 확인**하며 나만의 빌드 제작 
- 캐릭터 페이지의 `ItemBuild` 컴포넌트 확장하여 재사용
- 아이템도감 페이지의 `ItemTable` 컴포넌트 확장하여 재사용

#### MY 빌드 상세 페이지
![ONER TRY MY 마이 빌드 상세 페이지](/public/images/readme/i9g-240314-100900.png)
- 빌드 수정 기능
- 빌드 이미지로 복사하기 기능 
- 캐릭터 상세 페이지의 `ItemBuild` 컴포넌트 확장하여 재사용

### 🔎  파티 모집

#### 파티모집 리스트 페이지
![](/public/images/readme/i19g-240314-101949.png)
- 파티 분류별 리스트 노출

#### 파티모집 생성 레이어
![](/public/images/readme/i20g-240314-102011.png)
- 제목, 인원, 분류등을 선택 후 파티모집 생성

#### 파티모집 입장
![](/public/images/readme/i21g-240314-102148.png)
- 파티모집 입장 후 노출되는 채팅창
- 유저 입장/퇴장 및 **메세지 수신 시 알람** 기능
- 사운드 **알림 ON/OFF 및 볼륨 조절** 기능
- 우측 멤버 영역 클릭하여 **파티 인원 수 조정** 및 강퇴 기능
- 채팅방 축소 기능

#### 채팅방 축소
![](/public/images/readme/i22g-240314-102249.png)
- 채팅방 축소 버튼을 클릭하거나 **다른 메뉴로 이동시 채팅방 축소**
- 메세지를 수신한 경우 일시적으로 **메세지 말풍선 노출**
- **미확인 메세지 수** 노출

#### 공통 영역
![](/public/images/readme/i28g-240314-102837.png)
- 초반에 파티모집 이용 인원이 저조하여 추가
- 유저들이 사이트의 기능을 이용하며 언제나 원하는 파티를 찾을 수 있도록 **공통 상단 영역에 파티모집 리스트 노출**
- 페이지 이동 마다 파티모집 리스트 **자동 새로고침**
- 파티모집 생성 기능


---


## 💀 SEO

- **SSR**을 위해 페이지 컴포넌트의 **`asyncData`**훅에서  **`Vuex action`**을 호출 하여 SSR에 필요한 데이터 리턴
    ```jsx
    async asyncData({ store }) {
      const { item: { colleagues } } = store.state
      const colleaguesData = colleagues.length === 0
        ? await store.dispatch('item/GET_COLLEAGUES')
        : colleagues
    
      const commonMenu = { all: 'ALL' }
      const optionMenus =  Object.assign({...commonMenu}, noEquipOptions)
      return {
        colleagues: colleaguesData,
        optionMenus,
      }
    }
    ```

- 아이템 조합법 상세페이지 `dynamic route` 정적 생성
  ```js
    generate: {
      routes: async () => {
        const { data: { result: items } } = await axios.get(`${process.env.CONT_PATH}/api/items`)
        const itemRoutes = items.filter((item) => item.ingredients)
          .map((item) => {
            return {
              route: `/composition/${item.type}/${item.id}`,
              payload: item
            }
          })
        return itemRoutes
      }
    }
  ```
    