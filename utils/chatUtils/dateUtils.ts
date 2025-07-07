export const convertDate = (date: string): string => {
  const postDate = new Date(date);
  const nowDate = new Date();
  if (
    nowDate.getMonth() === postDate.getMonth() &&
    nowDate.getFullYear() === postDate.getFullYear()
  ) {
    //작성한지 일주일 이내
    if (nowDate.getDate() - postDate.getDate() < 7) {
      //작성한지 하루 이내
      if (nowDate.getDate() === postDate.getDate()) {
        //작성한지 한시간 이내
        if (nowDate.getHours() === postDate.getHours()) {
          //작성한지 3분 이내
          if (nowDate.getMinutes() - postDate.getMinutes() < 4) {
            return '방금전';
          }
          const minGap = nowDate.getMinutes() - postDate.getMinutes();
          return minGap + '분전';
        }
        const hoursGap = nowDate.getHours() - postDate.getHours();
        return hoursGap + '시간 전';
      }
      const dateGap = nowDate.getDate() - postDate.getDate();
      return dateGap + '일전';
    }
  }

  return postDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export function formatTimeAmPm(dateTimeString: string): string {
  const dateObject = new Date(dateTimeString);

  // 날짜 객체가 유효한지 확인
  if (isNaN(dateObject.getTime())) {
    console.warn(
      `Invalid date string provided: ${dateTimeString}. Returning empty string.`
    );
    return ''; // 유효하지 않은 날짜의 경우 빈 문자열 반환 또는 에러 처리
  }

  // toLocaleTimeString()을 사용하여 원하는 형식으로 포맷
  // 'ko-KR' 로케일을 사용하여 한국식 오전/오후 표기 사용
  // hour12: true (오전/오후 사용), hour: '2-digit', minute: '2-digit'
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // 오전/오후 표시 여부
    // timeZone: 'Asia/Seoul' // 필요하다면 특정 시간대 지정
  };

  const formattedTime = dateObject.toLocaleTimeString('ko-KR', options);

  // 결과 예시: "오후 3:27", "오전 09:15"
  return formattedTime;
}
