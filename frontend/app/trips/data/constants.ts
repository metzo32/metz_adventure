export type CountryOption = {
  label: string;
  value: string;      // 국가명 (trip.country에 저장되는 값)
  currency: string;   // ISO 통화 코드 (환율 조회용)
  currencyName: string; // 화폐 한글명
  timezone: string;   // IANA 타임존
};

export const COUNTRIES: CountryOption[] = [
  { label: "🇳🇱 네덜란드", value: "네덜란드", currency: "EUR", currencyName: "유로", timezone: "Europe/Amsterdam" },
  { label: "🇳🇴 노르웨이", value: "노르웨이", currency: "NOK", currencyName: "크로네", timezone: "Europe/Oslo" },
  { label: "🇳🇿 뉴질랜드", value: "뉴질랜드", currency: "NZD", currencyName: "달러", timezone: "Pacific/Auckland" },

  { label: "🇩🇰 덴마크", value: "덴마크", currency: "DKK", currencyName: "크로네", timezone: "Europe/Copenhagen" },
  { label: "🇩🇪 독일", value: "독일", currency: "EUR", currencyName: "유로", timezone: "Europe/Berlin" },

  { label: "🇱🇦 라오스", value: "라오스", currency: "LAK", currencyName: "킵", timezone: "Asia/Vientiane" },
  { label: "🇱🇺 룩셈부르크", value: "룩셈부르크", currency: "EUR", currencyName: "유로", timezone: "Europe/Luxembourg" },

  { label: "🇲🇾 말레이시아", value: "말레이시아", currency: "MYR", currencyName: "링깃", timezone: "Asia/Kuala_Lumpur" },
  { label: "🇲🇽 멕시코", value: "멕시코", currency: "MXN", currencyName: "페소", timezone: "America/Mexico_City" },
  { label: "🇲🇨 모나코", value: "모나코", currency: "EUR", currencyName: "유로", timezone: "Europe/Monaco" },
  { label: "🇺🇸 미국", value: "미국", currency: "USD", currencyName: "달러", timezone: "America/New_York" },

  { label: "🇧🇪 벨기에", value: "벨기에", currency: "EUR", currencyName: "유로", timezone: "Europe/Brussels" },
  { label: "🇻🇳 베트남", value: "베트남", currency: "VND", currencyName: "동", timezone: "Asia/Ho_Chi_Minh" },
  { label: "🇧🇷 브라질", value: "브라질", currency: "BRL", currencyName: "헤알", timezone: "America/Sao_Paulo" },

  { label: "🇸🇦 사우디아라비아", value: "사우디아라비아", currency: "SAR", currencyName: "리얄", timezone: "Asia/Riyadh" },
  { label: "🇸🇪 스웨덴", value: "스웨덴", currency: "SEK", currencyName: "크로나", timezone: "Europe/Stockholm" },
  { label: "🇨🇭 스위스", value: "스위스", currency: "CHF", currencyName: "프랑", timezone: "Europe/Zurich" },
  { label: "🇪🇸 스페인", value: "스페인", currency: "EUR", currencyName: "유로", timezone: "Europe/Madrid" },
  { label: "🇸🇬 싱가포르", value: "싱가포르", currency: "SGD", currencyName: "달러", timezone: "Asia/Singapore" },

  { label: "🇦🇪 아랍에미리트", value: "아랍에미리트", currency: "AED", currencyName: "디르함", timezone: "Asia/Dubai" },
  { label: "🇦🇹 오스트리아", value: "오스트리아", currency: "EUR", currencyName: "유로", timezone: "Europe/Vienna" },
  { label: "🇦🇺 호주", value: "호주", currency: "AUD", currencyName: "달러", timezone: "Australia/Sydney" },

  { label: "🇮🇹 이탈리아", value: "이탈리아", currency: "EUR", currencyName: "유로", timezone: "Europe/Rome" },
  { label: "🇮🇩 인도네시아", value: "인도네시아", currency: "IDR", currencyName: "루피아", timezone: "Asia/Jakarta" },
  { label: "🇮🇳 인도", value: "인도", currency: "INR", currencyName: "루피", timezone: "Asia/Kolkata" },
  { label: "🇯🇵 일본", value: "일본", currency: "JPY", currencyName: "엔", timezone: "Asia/Tokyo" },

  { label: "🇨🇳 중국", value: "중국", currency: "CNY", currencyName: "위안", timezone: "Asia/Shanghai" },
  { label: "🇨🇿 체코", value: "체코", currency: "CZK", currencyName: "코루나", timezone: "Europe/Prague" },

  { label: "🇹🇼 대만", value: "대만", currency: "TWD", currencyName: "달러", timezone: "Asia/Taipei" },
  { label: "🇹🇭 태국", value: "태국", currency: "THB", currencyName: "바트", timezone: "Asia/Bangkok" },
  { label: "🇹🇷 튀르키예", value: "튀르키예", currency: "TRY", currencyName: "리라", timezone: "Europe/Istanbul" },

  { label: "🇵🇹 포르투갈", value: "포르투갈", currency: "EUR", currencyName: "유로", timezone: "Europe/Lisbon" },
  { label: "🇵🇭 필리핀", value: "필리핀", currency: "PHP", currencyName: "페소", timezone: "Asia/Manila" },
  { label: "🇫🇷 프랑스", value: "프랑스", currency: "EUR", currencyName: "유로", timezone: "Europe/Paris" },
  { label: "🇫🇮 핀란드", value: "핀란드", currency: "EUR", currencyName: "유로", timezone: "Europe/Helsinki" },

  { label: "🇭🇰 홍콩", value: "홍콩", currency: "HKD", currencyName: "달러", timezone: "Asia/Hong_Kong" },
  { label: "🇭🇺 헝가리", value: "헝가리", currency: "HUF", currencyName: "포린트", timezone: "Europe/Budapest" },
  { label: "🇬🇧 영국", value: "영국", currency: "GBP", currencyName: "파운드", timezone: "Europe/London" },
];
