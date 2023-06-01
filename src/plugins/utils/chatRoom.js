const timeStamp = () => {
  const date = new Date()
  return date.toLocaleTimeString()
}
export function eventSourceConnect(roomTypes, isRestart) {
  // const subscribeUrl = 
  const eventSource = new EventSource(`${process.env.API_PATH}/sub`);
  eventSource.onopen = () => {
    console.log('EVENT SOURCE 연결 성공', isRestart ? '재시도!!!!' : '');
  };
  eventSource.addEventListener("refresh", (event) => {
    console.log("SSE refresh!", event.data, timeStamp())
  })
  eventSource.addEventListener("createRoom", (event) => {
    const chatRoomTypeId = event.data
    const { name } = roomTypes.find(({id}) => id === chatRoomTypeId*1)
    console.log('EVENT SOURCE message', name, timeStamp())
    showAlarmNotification(name, '파티가 생성되었습니다.');
  })
  eventSource.onerror = (error) => {
    console.log('EVENT SOURCE 에러:', error, timeStamp());
    eventSourceConnect(roomTypes, true)
  };
  eventSource.addEventListener("error", (event) => {
    eventSource.close()
  })
  eventSource.onclose = () => {
    console.log('EVENT SOURCE 연결 종료');
  };
}
export function saveAlarmSetting(data) {
  localStorage.setItem('ONER_TRY_IS_CPA', data)
}
export function getSavedAlarmSetting() {
  return JSON.parse(localStorage.getItem('ONER_TRY_IS_CPA'))
}
export function getPermissionIsGranted() {
  return new Promise((resolve) => {
    Notification.requestPermission().then((permission) => {
      console.log("Notification getAlarmSetting", permission)
      resolve(permission === "granted")
    })
  })
}
export function requestPermission() {
  return new Promise((resolve) => {
    Notification.requestPermission().then((permission) => {
      console.log("Notification getAlarmSetting", permission)
      if(permission === "granted") {
        new Notification('파티 생성 알림이 설정되었습니다!')
        afterPermissionGranted(permission)
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })
}
export function showAlarmNotification(title, body) {
  // 브라우저가 알림을 지원하는지 확인
  if (!("Notification" in window)) {
    console.log("브라우저가 알림을 지원하지 않습니다.");
    return;
  }
  // 사용자에게 알림 권한 요청
  Notification.requestPermission().then((permission) => {
    console.log("Notification,", permission)
  });
}
export function afterPermissionGranted(permission) {
  const isSavedSettingOn = getSavedAlarmSetting()
  if (permission === "granted" && isSavedSettingOn) {
    // 알림 생성
    const notification = new Notification(title, {body});
    console.log("Notification granted", notification)
    notificationHandler()
  }
}
export function notificationHandler(notification) {
  notification.onclick = (e) => {
    console.log("notification! @click", e)
  }
  notification.onclose = (e) => {
    console.log("notification! @close", e)
  }
  notification.onerror = (e) => {
    console.log("notification! @error", e)
  }
  notification.onshow = (e) => {
    console.log("notification! @show", e)
  }
}