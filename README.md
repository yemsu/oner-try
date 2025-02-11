# ONER TRY

![](/public/images/readme/i25g-240314-132519.png)

- <u>**8700명의 유저**</u>가 이용한 Warcraft 3 Onepiece RPG 게임 정보 제공 사이트
- 현재는 게임 운영이 종료되어 [ONER TRY 개발계](https://dev-oner-try.netlify.app/)만 접속 가능합니다.

  <img src="/public/images/readme/i36g-240314-103622.png" alt="">

---

## 💀 기술 스택

<p>
  <img src="https://img.shields.io/badge/Nuxt-002E3B?style=for-the-badge&logo=nuxtdotjs&logoColor=#00DC82" alt="nuxt">
  <img src="https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D" alt="vue">
  <img src="https://img.shields.io/badge/sass-CC6699?style=for-the-badge&logo=html5&logoColor=white" alt="sass">
</p>

- Nuxt.js : `v2.15.8`
- Vue.js : `v2.6.14`
- SASS : `v1.53.0`

---

### 페이지 소개

- <a href="#character">캐릭터</a>: 다른 유저들의 **아이템 빌드**를 확인할 수 있습니다.
- <a href="#party">파티모집</a>: 함께 게임할 파티원을 구할 수 있는 메뉴로 **채팅 기능**이 구현되어 있습니다.
- <a href="#myBuild">MY빌드</a>: **아이템을 조합하고 스탯, 시너지 효과를 확인**하며 나만의 빌드를 만들 수 있습니다.
- <a href="#items">아이템도감</a>: **등급/능력치별로 필터링**하며 아이템의 자세한 정보들을 확인할 수 있습니다.
- <a href="#composition">조합법</a>: 조합 아이템의 **총 재료 아이템**과 조합법을 **트리구조**로 한눈에 확인할 수 있습니다.
- <a href="#ranking">랭킹</a>: 유저들의 랭킹과 아이템 빌드를 캐릭터별로 확인할 수 있습니다.

---

## 💀 페이지 살펴보기

 <h3 id="character" style="padding-top: 30px; margin-top: 0">
  <span style="padding-top: 30px;">🔎  캐릭터</span>
 </h3>

 <a href="https://dev-oner-try.netlify.app/character/result?nickname=Pinkbean" target="_blank">🔗page</a>

![ONER TRY 캐릭터 상세페이지](/public/images/readme/i50g-240314-095049.png)

- 장착 선원, 동료에 따른 <u>**시너지 효과**</u> 계산하여 노출
- 장착 아이템의 옵션과 시너지 효과에 따른 <u>**총 스탯**</u> 계산하여 노출

 <h3 id="party" style="padding-top: 30px; margin-top: 0">
  <span style="padding-top: 30px;">🔎  파티모집</span>
 </h3>

 <a href="https://dev-oner-try.netlify.app/party" target="_blank">🔗page (구글 로그인 후 채팅방 생성 가능)</a>


#### 파티 리스트
![](/public/images/readme/i19g-240314-101949.png)

#### 파티 생성 

![onertry-party-1-create](https://github.com/user-attachments/assets/2e5d2f9e-0ab2-4849-bcd4-f89171f86bca)

1. 채팅방 생성
	- 사운드 알림 ON/OFF 및 볼륨 조절 가능
2. 기다리는 동안 채팅방 축소
3. 유저2 페이지 이동
4. 상단 파티 리스트 자동 갱신
	- 초반에 파티모집 이용 인원이 저조하여 추가
	- 유저들이 사이트의 기능을 이용하며 언제나 원하는 파티를 찾을 수 있도록 <u>**공통 상단 영역에 파티모집 리스트 노출**</u>
	- 페이지 이동 마다 파티모집 리스트 <u>**자동 새로고침**</u>

#### 주요 기능

![onertry-party-2-chat](https://github.com/user-attachments/assets/bc9b54e3-890b-41a6-90d6-bbdd93646335)

1. 파티원이 입장했습니다.
	- 축소된 채팅방에 새로운 채팅 내용과 누적 개수가 노출됩니다.
2. 파티 인원을 4인으로 조정합니다.
3. 새로고침 버튼으로 채팅방을 갱신합니다.
4. 방장이 나가면 다음 유저가 방장이 됩니다.
5. 방장은 파티원을 강퇴할 수 있습니다.


 <h3 id="myBuild" style="padding-top: 30px; margin-top: 0">
  <span style="padding-top: 30px;">🔎  MY 빌드</span>
 </h3>

 <a href="https://dev-oner-try.netlify.app/item-build/my" target="_blank">🔗page (구글 로그인 후 접근 가능)</a>

#### MY 빌드 리스트 페이지
![](/public/images/readme/i43g-240315-094349.png)
- 아이템 빌드 간략하게 노출
- 빌드 삭제 기능

#### MY 빌드 생성 페이지
![](/public/images/readme/i43g-240315-094358.png)
- 캐릭터, 아이템, 아이템 강화 수치 설정하고 <u>**실시간으로 스탯을 확인**</u>하며 나만의 빌드 제작 
- 캐릭터 페이지의 `ItemBuild` 컴포넌트 확장하여 재사용
- 아이템도감 페이지의 `ItemTable` 컴포넌트 확장하여 재사용

#### MY 빌드 상세 페이지
![](/public/images/readme/i44g-240315-094421.png)
- 빌드 수정 기능
- 빌드 이미지로 복사하기 기능 
- 캐릭터 상세 페이지의 `ItemBuild` 컴포넌트 확장하여 재사용

    
 <h3 id="items" style="padding-top: 30px; margin-top: 0">
  <span style="padding-top: 30px;">🔎  아이템 도감</span>
 </h3>

 <a href="https://dev-oner-try.netlify.app/items/sailor" target="_blank">🔗page</a>

![ONER TRY 아이템 도감 페이지](/public/images/readme/i7g-240314-100706.png)

- 선택한 <u>**필터**</u>에 맞는 아이템 노출 및 해당 옵션 <u>**하이라이트**</u>처리


<h3 id="composition" style="padding-top: 30px; margin-top: 0">
<span style="padding-top: 30px;">🔎  조합법</span>
</h3>

<a href="https://dev-oner-try.netlify.app/composition/sailor/s94" target="_blank">🔗page</a>

![ONER TRY 조합법 상세페이지](/public/images/readme/i55g-240314-095559.png)

- 조합 아이템의 <u>**상위 아이템**</u>노출
- 로그인 후 <u>**조합법 즐겨 찾기 추가**</u>기능
- 조합 아이템에 필요한 <u>**총 재료 아이템**</u>노출
- 조합 재료 <u>**아이템 트리**</u>노출
  ![ONER TRY 조합법 아이템 트리 구조](/public/images/readme/i58g-240314-095833.png)
        
 <h3 id="ranking" style="padding-top: 30px; margin-top: 0">
  <span style="padding-top: 30px;">🔎  랭킹</span>
 </h3>

 <a href="https://dev-oner-try.netlify.app/ranking" target="_blank">🔗page</a>

![ONER TRY 랭킹 페이지](/public/images/readme/i4g-240314-100400.png)

- 통합 및 캐릭터별 유저 랭킹
- Infinite Scroll
---


## 💀 SEO

- <u>**Prerendering**</u>을 위해 페이지 컴포넌트의 `asyncData`훅에서 데이터 반환
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
    
