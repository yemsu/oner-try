const timeStamp = () => {
  const date = new Date()
  return date.toLocaleTimeString()
}
export function eventSourceConnect(roomTypes) {
  // const subscribeUrl = 
  const eventSource = new EventSource(`${process.env.API_PATH}/sub`);
  eventSource.onopen = () => {
    console.log('EVNET SOURCE 연결 성공');
  };
  eventSource.addEventListener("refresh", (event) => {
    console.log("SSE refresh!", event.data, timeStamp())
  })
  eventSource.addEventListener("createRoom", (event) => {
    const chatRoomTypeId = event.data
    const { name } = roomTypes.find(({id}) => id === chatRoomTypeId*1)
    console.log('EVNET SOURCE message', name, timeStamp())
    showAlarmNotification(name, '파티가 생성되었습니다.');
  })
  eventSource.onerror = (error) => {
    console.log('EVNET SOURCE 에러:', error, timeStamp());
  };
  eventSource.addEventListener("error", (event) => {
    eventSource.close()
  })
  eventSource.onclose = () => {
    console.log('EVNET SOURCE 연결 종료');
  };
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
    if (permission === "granted") {
      // 알림 생성
      const notification = new Notification(title, {body});
      console.log("Notification granted", notification)
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
  });
}