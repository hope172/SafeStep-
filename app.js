// ==========================================================================
// SAFESTEP V2 APPLICATION STATE & LOCALIZED DATA (Imun-dong / HUFS Seoul Campus)
// ==========================================================================

// Chat states
const STATE_ALERT = 0;
const STATE_CONDITION = 1; // Renamed from AGE to include pregnant/disabled
const STATE_COMPANION = 2;
const STATE_TRANSPORT = 3;
const STATE_RESULTS = 4;

let currentState = STATE_ALERT;
let selectedDisaster = "flood"; // default: flood (호우/침수)

// User selections
const userProfile = {
    condition: null,    // child, adult, elderly, pregnant, disabled
    companion: null,    // alone, with_child, with_elderly, with_pet
    transport: null     // foot, car, wheelchair
};

// User Location: Hankuk University of Foreign Studies Main Gate (외대 정문)
const USER_LOCATION = { x: 50, y: 60, name: "한국외대 정문" };

// Imun-dong (HUFS) Local Shelters Database
const SHELTER_DATABASE = [
    {
        id: 1,
        name: "한국외대 오바마홀",
        x: 45,
        y: 45, // Located right on HUFS campus
        capacity: 500,
        occupancy: 280, // 56% (medium)
        facilities: ["wheelchair", "medical_center"],
        desc: "한국외대 서울캠퍼스 대형 실내체육시설. 내진 보강 설계 및 비상 임시 의료지원 구비.",
        detourRoute: {
            flood: {
                path: "M 50,60 L 45,45",
                blocked: "M 50,60 L 60,60 L 45,45",
                timeFoot: 3,
                timeCar: 1,
                timeWheelchair: 5,
                instructions: "외대 정문에서 대학 본관을 경유해 오바마홀로 진입하는 정규 경로입니다. 침수 위험이 전혀 없는 최단 고지대 루트입니다.",
                warning: null
            },
            earthquake: {
                path: "M 50,60 L 45,45",
                blocked: "M 50,60 L 30,55 L 45,45",
                timeFoot: 3,
                timeCar: 1,
                timeWheelchair: 5,
                instructions: "외대 본관 앞 개활지를 따라 오바마홀로 이동하십시오. 지진 낙석 등 구조물 붕괴 우려가 없는 안심 경로입니다.",
                warning: null
            },
            wildfire: {
                path: "M 50,60 L 45,45",
                blocked: "M 50,60 L 20,40 L 45,45",
                timeFoot: 3,
                timeCar: 1,
                timeWheelchair: 5,
                instructions: "천장산 산불 저지선 동편 캠퍼스 중심가 도로를 경유하여 오바마홀로 진입하십시오.",
                warning: null
            },
            snow: {
                path: "M 50,60 L 45,45",
                blocked: "M 50,60 L 40,30 L 45,45",
                timeFoot: 4,
                timeCar: 2,
                timeWheelchair: 7,
                instructions: "외대 정문 평지 보도를 통해 서행 이동하십시오. 경사로 제설이 신속히 이뤄진 상태입니다.",
                warning: null
            }
        }
    },
    {
        id: 2,
        name: "이문초등학교 체육관",
        x: 70,
        y: 35, // East-Northeast, towards Jungnangcheon stream
        capacity: 300,
        occupancy: 288, // 96% (extreme crowd!)
        facilities: ["wheelchair", "infant_care"],
        desc: "이문초등학교 실내 강당. 휠체어 램프 설치 완료. 현재 잔여 자리가 매우 협소합니다.",
        detourRoute: {
            flood: {
                path: "M 50,60 L 60,50 L 70,35", // detours flooding
                blocked: "M 50,60 L 70,55 L 70,35",
                timeFoot: 10,
                timeCar: 3,
                timeWheelchair: 15,
                instructions: "중랑천 인근 도로 범람 위험이 있으므로 정문 동편 이면도로를 통해 북동쪽 이문로28길 방향으로 우회하십시오.",
                warning: "중랑천 제방 경보 발령으로 인근 접근 시 안전 요원의 통제에 따라주십시오."
            },
            earthquake: {
                path: "M 50,60 L 70,35",
                blocked: "M 50,60 L 65,50 L 70,35",
                timeFoot: 8,
                timeCar: 2,
                timeWheelchair: 12,
                instructions: "이문초등학교 방면 주택가 좁은 이면도로는 낙하물 위험이 있습니다. 넓은 이문로 대로변 인도를 이용해 안전하게 대피하십시오.",
                warning: "주변 이면도로 낙하물(간판, 벽돌) 우려."
            },
            wildfire: {
                path: "M 50,60 L 70,35",
                blocked: "M 50,60 L 30,50 L 70,35",
                timeFoot: 8,
                timeCar: 2,
                timeWheelchair: 12,
                instructions: "산불 전파 지점(천장산) 반대편인 동부 주택가를 통과해 초등학교 강당에 수월하게 접할 수 있습니다.",
                warning: null
            },
            snow: {
                path: "M 50,60 L 60,50 L 70,35",
                blocked: "M 50,60 L 65,40 L 70,35",
                timeFoot: 12,
                timeCar: 4,
                timeWheelchair: 18,
                instructions: "이문로 동편 도로 중 이문고개 오르막은 결빙 상태입니다. 평지인 골목 초입을 거쳐 안전하게 통행하십시오.",
                warning: "이문고개 언덕 노면 극심한 결빙."
            }
        }
    },
    {
        id: 3,
        name: "이문1동 주민센터",
        x: 25,
        y: 75, // West-South-West, towards Cheonjangsan mountain
        capacity: 200,
        occupancy: 88, // 44% (low crowd)
        facilities: ["pet_friendly", "infant_care"],
        desc: "이문로 안쪽 안전 주택가 내에 위치. 반려동물 임시 동행 구역 운영, 영유아 지원실 완비.",
        detourRoute: {
            flood: {
                path: "M 50,60 L 25,75",
                blocked: "M 50,60 L 50,85 L 25,75",
                timeFoot: 9,
                timeCar: 2,
                timeWheelchair: 14,
                instructions: "남부 외대앞역 방향 지하차도가 침수 중입니다. 역 방면으로 내려가지 마시고 외대정문 서쪽 골목길 주택가로 곧바로 진입해 이동하십시오.",
                warning: "이문 지하차도 전면 통제 및 차량 진입 금지."
            },
            earthquake: {
                path: "M 50,60 L 40,70 L 25,75",
                blocked: "M 50,60 L 25,75",
                timeFoot: 12,
                timeCar: 3,
                timeWheelchair: 18,
                instructions: "외대 정문 서측 상업가 골목은 지진 붕괴 잔해물이 많습니다. 주택가 정비 도로를 통해 이문파출소 방면으로 우회하십시오.",
                warning: "상업지 노후 상가 밀집 지역 구조물 파편 낙하 경보."
            },
            wildfire: {
                path: "M 50,60 L 50,75 L 25,75",
                blocked: "M 50,60 L 25,75",
                timeFoot: 15,
                timeCar: 4,
                timeWheelchair: 22,
                instructions: "주민센터 인근 천장산 산불 저지선 설치 작업 중입니다. 산림 인접 골목 대신 이문로 대로변을 경유하여 남측 진입로를 통해 들어가십시오.",
                warning: "천장산 인접 골목은 산불 가스 및 소방 장비 이동으로 매우 위험합니다."
            },
            snow: {
                path: "M 50,60 L 25,75",
                blocked: "M 50,60 L 20,70 L 25,75",
                timeFoot: 11,
                timeCar: 3,
                timeWheelchair: 16,
                instructions: "천장산 방면 비탈진 이면도로 골목길은 경사가 있어 미끄럽습니다. 상대적으로 완만한 주택단지 사이 평지 도로를 통해 가십시오.",
                warning: "산비탈 경사 골목 결빙 낙상 다발."
            }
        }
    },
    {
        id: 4,
        name: "이문동 쌍용아파트 지하대피소",
        x: 75,
        y: 80, // Southeast, near HUFS Station/Jungnangcheon
        capacity: 400,
        occupancy: 160, // 40% (low crowd)
        facilities: ["wheelchair", "pet_friendly"],
        desc: "튼튼한 콘크리트 철골조 지하 주차장에 조성된 정부 지정 민방위 대피소.",
        detourRoute: {
            flood: {
                path: "M 50,60 L 75,80", // Dangerous underground, will be blocked/disabled
                blocked: "M 50,60 L 50,85 L 75,80",
                timeFoot: 999, // Unusable
                timeCar: 999,
                timeWheelchair: 999,
                instructions: "경고: 호우 및 도로 침수 시 지하주차장은 역류 및 침수 위험이 대단히 높으므로 대피소 진입이 불가합니다.",
                warning: "지하 주차장 입구 차수막 작동 중. 침수 상황 시 진입 절대 차단."
            },
            earthquake: {
                path: "M 50,60 L 65,60 L 75,80",
                blocked: "M 50,60 L 50,85 L 75,80",
                timeFoot: 8,
                timeCar: 2,
                timeWheelchair: 12,
                instructions: "외대앞역 삼거리의 노후 간판 낙하 구역을 우회하여 쌍용아파트 주 출입구 비상 계단 및 엘리베이터(전원 공급 확인 필수)를 통해 대피하십시오.",
                warning: "외대앞역 앞 좁은 보도 낙하물 우려."
            },
            wildfire: {
                path: "M 50,60 L 75,80",
                blocked: "M 50,60 L 35,70 L 75,80",
                timeFoot: 7,
                timeCar: 2,
                timeWheelchair: 10,
                instructions: "천장산 산불 중심에서 가장 멀고 안전한 동남쪽 대형 아동/가족 수용 콘크리트 지하 대피 구역입니다.",
                warning: null
            },
            snow: {
                path: "M 50,60 L 75,80",
                blocked: "M 50,60 L 65,70 L 75,80",
                timeFoot: 10,
                timeCar: 3,
                timeWheelchair: 15,
                instructions: "쌍용아파트 진입로 중 이문 지하차도 인근 물고임 결빙 도로를 우회하여 아파트 상가 사거리 안길로 서행 운행하십시오.",
                warning: "지하주차장 진출입 경사 램프 부분 미끄럼 주의."
            }
        }
    }
];

// Localized Danger Zones per Disaster Type (Imun-dong)
const DANGER_ZONES = {
    flood: [
        { name: "중랑천 수위 위험 구역", x: 85, y: 45, r: 15 },
        { name: "이문 지하차도 전면 침수", x: 50, y: 85, r: 10 }
    ],
    earthquake: [
        { name: "천장산 절개지 낙석 위험", x: 15, y: 25, r: 12 },
        { name: "외대앞역 상업가 건물 붕괴 위험", x: 50, y: 85, r: 12 }
    ],
    wildfire: [
        { name: "천장산 산불 확산 지역", x: 15, y: 30, r: 22 }
    ],
    snow: [
        { name: "천장산 이면길 결빙 통제", x: 30, y: 45, r: 12 },
        { name: "이문고개 언덕 미끄럼 정체", x: 65, y: 65, r: 10 }
    ]
};

// Disaster configuration alerts, weather stats and guide tips
const DISASTER_PRESETS = {
    flood: {
        badgeText: "긴급 호우・침수 경보",
        mainTitle: "집중호우 및 이문동 도로 침수",
        mainDesc: "현재 중랑천 인근 범람 수위 도달 및 이문 지하차도가 전면 침수 통제되었습니다. 대피 대상자 구분에 맞춘 고지대 대피소로 긴급 이동하십시오.",
        weatherTitle: "현재 강수 상태",
        weatherVal: "폭우 (120mm/h)",
        blockTitle: "통제 도로 구역",
        blockVal: "이문 지하차도, 중랑천",
        tips: [
            "침수된 도로나 물 고임 지하차도는 차량 절대 진입 금지",
            "가로등, 전신주, 지하층 전기 차단기 접촉 금지 (감전 예방)",
            "계단 물흐름 발생 시 신속히 최상층 또는 고지대로 이동"
        ]
    },
    earthquake: {
        badgeText: "긴급 지진 재난 경보",
        mainTitle: "규모 5.8 강진 발생 (여진 우려)",
        mainDesc: "현재 지진동으로 인해 건물 유리창 파손 및 외대앞역 노후 상가 낙하물 사고가 빈번합니다. 개활지 또는 내진 설계 완료 대피소로 가십시오.",
        weatherTitle: "진도 등급",
        weatherVal: "진도 VI (강한 진동)",
        blockTitle: "위험 차단선",
        blockVal: "노후 골목상가, 산비탈 낙석",
        tips: [
            "가방이나 손으로 머리를 보호하고 낙하물(간판, 외벽) 경계",
            "엘리베이터 사용 전면 금지, 건물 계단 복도를 통한 신속 대피",
            "지진동 정지 시 낙석 우려되는 천장산 사면 접근 절대 피함"
        ]
    },
    wildfire: {
        badgeText: "긴급 산불 대피 통보",
        mainTitle: "천장산 대형 산불 급속 확산 중",
        mainDesc: "천장산 사면에서 발화한 불길이 서풍을 타고 외대 캠퍼스 서측 민가 구역으로 확산되고 있습니다. 산림 인접 가구는 즉시 동남편 대피소로 대피하십시오.",
        weatherTitle: "풍향 및 풍속",
        weatherVal: "서풍 (8.5m/s, 건조)",
        blockTitle: "진화 작업선",
        blockVal: "천장산 인접 이면도로",
        tips: [
            "문과 창문을 닫아 외부 불씨 차단하고 가스 밸브 잠그기",
            "대피 시 물에 적신 수건으로 코와 입을 가려 질식 가스 방지",
            "바람 방향을 확인하여 불길 반대편(동쪽/남쪽 대로)으로 즉시 피난"
        ]
    },
    snow: {
        badgeText: "대설 재해 및 한파 경보",
        mainTitle: "기습 대설에 따른 급경사 결빙 경보",
        mainDesc: "이문동 일대에 20cm 이상의 폭설과 영하 12도의 한파로 고개길 및 주택가 비탈길 노면이 빙판입니다. 미끄럼 사고 방지 안심 경로로 통행하십시오.",
        weatherTitle: "적설량 및 기온",
        weatherVal: "신적설 22cm / -12.4℃",
        blockTitle: "결빙 위험 지대",
        blockVal: "천장산 사면 경사지, 이문고개",
        tips: [
            "노약자, 임산부는 주택 비탈 골목길을 피하고 대로변 포장길로 이동",
            "주머니에 손을 넣지 마시고 아이젠 등 미끄럼 방지 용품 활용",
            "차량 이동 시 경사 램프 구간 정체 예상되므로 도보 이동 권장"
        ]
    }
};

// Chat Steps definitions (V2 with Pregnant/Disabled options)
const CHAT_QUESTIONS = {
    [STATE_CONDITION]: {
        botMsg: "안녕하세요. SafeStep 실시간 대피 도우미입니다. 신속한 대피 경로 분석을 위해 대피 대상자의 **특성 및 연령대**를 선택해 주세요.",
        options: [
            { value: "child", text: "아동 (13세 미만)", icon: "👶" },
            { value: "adult", text: "일반 성인 (14세 ~ 59세)", icon: "🧑" },
            { value: "elderly", text: "고령자 (60세 이상)", icon: "👵" },
            { value: "pregnant", text: "임산부", icon: "🤰" },
            { value: "disabled", text: "장애인 / 교통약자", icon: "👩‍🦽" }
        ]
    },
    [STATE_COMPANION]: {
        botMsg: "현재 안전 확보가 시급합니다. 대피를 함께 하시는 **동행인 여부**를 탭해 주세요.",
        options: [
            { value: "alone", text: "혼자 대피함", icon: "🙋‍♂️" },
            { value: "with_child", text: "아동 동반", icon: "👩‍👦" },
            { value: "with_elderly", text: "노약자 동반", icon: "🧑‍🦽" },
            { value: "with_pet", text: "반려동물 동반", icon: "🐶" }
        ]
    },
    [STATE_TRANSPORT]: {
        botMsg: "현재 가용할 수 있는 **이동 수단**은 무엇입니까? 침수나 도로 결빙 상황에 대비해 안전한 수단을 선택하십시오.",
        options: [
            { value: "foot", text: "도보 대피 이동", icon: "🚶" },
            { value: "car", text: "차량 이동", icon: "🚗" },
            { value: "wheelchair", text: "휠체어 / 보행 보조기", icon: "👨‍🦽" }
        ]
    }
};

let selectedShelterId = null;

// ==========================================================================
// AI SUITABILITY RANKING & BALANCING ALGORITHM (V2)
// ==========================================================================
function calculateRecommendations() {
    // Randomize initial occupancies slightly on calculation to simulate live dynamic shifts
    SHELTER_DATABASE.forEach(s => {
        let shift = Math.floor(Math.random() * 7) - 3;
        s.occupancy = Math.max(10, Math.min(s.capacity, s.occupancy + shift));
    });

    const scoredShelters = SHELTER_DATABASE.map(shelter => {
        let score = 100;
        
        // 1. Proximity Calculation (Euclidean Distance from HUFS Gate)
        const dx = shelter.x - USER_LOCATION.x;
        const dy = shelter.y - USER_LOCATION.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Base distance penalty
        const distPenalty = distance * 0.9;
        score -= distPenalty;

        // 2. Crowd Penalization & Active Load Balancing
        const occupancyRate = shelter.occupancy / shelter.capacity;
        
        if (occupancyRate >= 0.98) {
            score -= 100; // Critical - Exclude or rank last
        } else if (occupancyRate >= 0.85) {
            score -= 35; // Heavy congestion penalty
        } else if (occupancyRate >= 0.60) {
            score -= 12; // Moderate congestion penalty
        } else if (occupancyRate < 0.45) {
            score += 15; // Low crowd bonus to encourage distribution
        }

        // 3. Multi-Disaster Special Constraints
        let matchDetails = [];
        
        if (selectedDisaster === "flood") {
            // Highly unsafe underground structure (Apt basement)
            if (shelter.id === 4) {
                score -= 120; // Critical danger penalty
                matchDetails.push("지하 대피소: 침수 위험 심각 (-120)");
            }
            // Close to flooding river (Imun Elementary)
            if (shelter.id === 2) {
                score -= 25;
                matchDetails.push("하천(중랑천) 인접 감점 (-25)");
            }
            // High-ground shelter boost (Obama Hall, Imun 1-dong)
            if (shelter.id === 1 || shelter.id === 3) {
                score += 15;
                matchDetails.push("고지대 안전 지대 가점 (+15)");
            }
        } else if (selectedDisaster === "earthquake") {
            // Obama Hall gym structure is highly earthquake resistant
            if (shelter.id === 1) {
                score += 25;
                matchDetails.push("내진 우수 설비 보강 가점 (+25)");
            }
            // Ssangyong Apt underground basement is structured steel concrete (very safe from falling surface debris)
            if (shelter.id === 4) {
                score += 20;
                matchDetails.push("콘크리트 철골조 지하 지탱 가점 (+20)");
            }
            // Imun 1-dong close to mountain cliff rockfall risk
            if (shelter.id === 3) {
                score -= 20;
                matchDetails.push("산사태/낙석 우려지 차폐 감점 (-20)");
            }
        } else if (selectedDisaster === "wildfire") {
            // Wildfire spreading from Cheonjangsan (West). Shelter 3 is West, very close.
            if (shelter.id === 3) {
                score -= 110; // Extremely dangerous wildfire path
                matchDetails.push("산불 중심 확산 경로상 대피소 (-110)");
            }
            // Eastern shelters are safer (Imun Elementary, Ssangyong Apt)
            if (shelter.id === 2 || shelter.id === 4) {
                score += 20;
                matchDetails.push("산불 대피 안심 동부 구역 가점 (+20)");
            }
        } else if (selectedDisaster === "snow") {
            // Heated municipal/college gym indoor shelters get boost
            if (shelter.id === 1 || shelter.id === 3) {
                score += 15;
                matchDetails.push("실내 난방 및 방한 장비 완비 (+15)");
            }
            // Outdoor or deep underground (ramps icy)
            if (shelter.id === 4) {
                score -= 20;
                matchDetails.push("빙판 램프 경사면 진출입 감점 (-20)");
            }
        }

        // 4. User Demographic Condition Match Boosts
        // Disabled / Mobility impaired
        if (userProfile.condition === "disabled") {
            if (shelter.facilities.includes("wheelchair")) {
                score += 50;
                matchDetails.push("장애인 편의 경사 시설 매칭 (+50)");
            } else {
                score -= 60; // Wheelchair access is critical
                matchDetails.push("장애인 보행 보조 미지원 감점 (-60)");
            }
        }

        // Pregnant Woman
        if (userProfile.condition === "pregnant") {
            // Require child/infant care or medical support
            if (shelter.facilities.includes("medical_center")) {
                score += 30;
                matchDetails.push("상주 임시 의약시설 지원 (+30)");
            }
            if (shelter.facilities.includes("infant_care")) {
                score += 20;
                matchDetails.push("임산부/수유 배려 환경 (+20)");
            }
        }

        // Elderly (60+)
        if (userProfile.condition === "elderly") {
            if (shelter.facilities.includes("medical_center")) {
                score += 25;
                matchDetails.push("고령 응급 진료 지원 (+25)");
            }
            if (shelter.facilities.includes("wheelchair")) {
                score += 15;
                matchDetails.push("노약자 보행 보조 지원 (+15)");
            }
        }

        // Child
        if (userProfile.condition === "child") {
            if (shelter.facilities.includes("infant_care")) {
                score += 25;
                matchDetails.push("영유아 대피 구호 세트 제공 (+25)");
            }
        }

        // 5. Companion matches
        if (userProfile.companion === "with_pet") {
            if (shelter.facilities.includes("pet_friendly")) {
                score += 40;
                matchDetails.push("반려동물 격리 수용 구역 지원 (+40)");
            } else {
                score -= 30;
                matchDetails.push("반려동물 출입 제약 감점 (-30)");
            }
        }
        if (userProfile.companion === "with_elderly" && shelter.facilities.includes("medical_center")) {
            score += 20;
            matchDetails.push("동행 고령인 케어 시설 매칭 (+20)");
        }
        if (userProfile.companion === "with_child" && shelter.facilities.includes("infant_care")) {
            score += 20;
            matchDetails.push("아동용 구호품 지원 (+20)");
        }

        // Absolute score floor at 0
        const finalScore = Math.max(0, Math.round(score));

        return {
            ...shelter,
            distance: Math.round(distance * 11), // Simulated real meters
            occupancyRate: Math.round(occupancyRate * 100),
            finalScore,
            matchDetails
        };
    });

    // Sort by final suitability score
    let sorted = scoredShelters.sort((a, b) => b.finalScore - a.finalScore);
    return sorted.slice(0, 3);
}

// ==========================================================================
// SCREEN FLOW CONTROLLER
// ==========================================================================

function changeScreen(screenId) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(screenId).classList.add("active");
    
    if (screenId === "screen-alert") {
        currentState = STATE_ALERT;
        userProfile.condition = null;
        userProfile.companion = null;
        userProfile.transport = null;
        selectedShelterId = null;
        document.getElementById("chat-feed").innerHTML = "";
    }
}

function startChatbot() {
    changeScreen("screen-chat");
    currentState = STATE_CONDITION;
    updateProgressTracker();
    renderChatStep();
}

function updateProgressTracker() {
    document.getElementById("indicator-age").className = "step-indicator";
    document.getElementById("indicator-companion").className = "step-indicator";
    document.getElementById("indicator-transport").className = "step-indicator";
    
    const lines = document.querySelectorAll(".step-line");
    lines[0].className = "step-line";
    lines[1].className = "step-line";

    if (currentState >= STATE_CONDITION) {
        document.getElementById("indicator-age").classList.add("active");
    }
    if (currentState >= STATE_COMPANION) {
        document.getElementById("indicator-age").className = "step-indicator complete";
        document.getElementById("indicator-companion").classList.add("active");
        lines[0].classList.add("active");
    }
    if (currentState >= STATE_TRANSPORT) {
        document.getElementById("indicator-companion").className = "step-indicator complete";
        document.getElementById("indicator-transport").classList.add("active");
        lines[1].classList.add("active");
    }
}

function renderChatStep() {
    const feed = document.getElementById("chat-feed");
    const panel = document.getElementById("action-panel");
    
    panel.innerHTML = "";
    
    const stepData = CHAT_QUESTIONS[currentState];
    if (!stepData) return;

    // Append Bot Bubble
    const botBubble = document.createElement("div");
    botBubble.className = "bubble bot";
    botBubble.innerHTML = stepData.botMsg;
    feed.appendChild(botBubble);
    scrollChatBottom();

    // Render Option Buttons
    stepData.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "btn-option";
        btn.innerHTML = `
            <span class="option-label">
                <span class="option-icon">${opt.icon}</span>
                <span>${opt.text}</span>
            </span>
            <span class="option-arrow">➔</span>
        `;
        btn.addEventListener("click", () => handleUserSelection(opt.value, opt.text));
        panel.appendChild(btn);
    });
}

function handleUserSelection(value, labelText) {
    const feed = document.getElementById("chat-feed");
    
    const userBubble = document.createElement("div");
    userBubble.className = "bubble user";
    userBubble.innerText = labelText;
    feed.appendChild(userBubble);
    scrollChatBottom();

    if (currentState === STATE_CONDITION) {
        userProfile.condition = value;
        currentState = STATE_COMPANION;
        setTimeout(() => {
            updateProgressTracker();
            renderChatStep();
        }, 400);
    } else if (currentState === STATE_COMPANION) {
        userProfile.companion = value;
        currentState = STATE_TRANSPORT;
        setTimeout(() => {
            updateProgressTracker();
            renderChatStep();
        }, 400);
    } else if (currentState === STATE_TRANSPORT) {
        userProfile.transport = value;
        
        // Simulating AI analysis phase
        const calcBubble = document.createElement("div");
        calcBubble.className = "bubble bot";
        calcBubble.innerHTML = `
            <div style="display:flex; align-items:center; gap:8px;">
                <span class="logo-pulse"></span>
                <span>대피 경로 침수 상태 및 대피소 혼잡도를 매칭 분석하고 있습니다. 잠시만 대피 자세를 유지하십시오...</span>
            </div>
        `;
        feed.appendChild(calcBubble);
        scrollChatBottom();
        
        setTimeout(() => {
            showRecommendations();
        }, 1200);
    }
}

function scrollChatBottom() {
    const feed = document.getElementById("chat-feed");
    feed.scrollTop = feed.scrollHeight;
}

// ==========================================================================
// RESULTS DASHBOARD UPDATES (V2)
// ==========================================================================

function showRecommendations() {
    changeScreen("screen-results");
    
    // Set user summary tags
    const conditionTexts = { 
        child: "🧒 아동 (13세 미만)", 
        adult: "🧑 일반 성인", 
        elderly: "👵 고령자 (60세 이상)", 
        pregnant: "🤰 임산부", 
        disabled: "♿ 장애인/교통약자" 
    };
    const companionTexts = { 
        alone: "🙋‍♂️ 1인 대피", 
        with_child: "👶 아동 동반", 
        with_elderly: "👵 노약자 동반", 
        with_pet: "🐶 반려동물 동반" 
    };
    const transportTexts = { 
        foot: "🚶 도보 대피", 
        car: "🚗 차량 대피", 
        wheelchair: "👩‍🦽 휠체어/보행기" 
    };

    document.getElementById("summary-condition").innerText = `대상: ${conditionTexts[userProfile.condition] || ""}`;
    document.getElementById("summary-companion").innerText = `동행: ${companionTexts[userProfile.companion] || ""}`;
    document.getElementById("summary-transport").innerText = `이동: ${transportTexts[userProfile.transport] || ""}`;

    const recommendations = calculateRecommendations();
    selectedShelterId = recommendations[0].id;

    // Render shelter cards
    const listContainer = document.getElementById("shelter-list");
    listContainer.innerHTML = "";

    recommendations.forEach((shelter, idx) => {
        const isSelected = shelter.id === selectedShelterId;
        const rankNum = idx + 1;
        
        // Facility tags styling
        const facilityIcons = {
            wheelchair: "♿ 휠체어 램프",
            medical_center: "🏥 임시 의료진",
            pet_friendly: "🐾 반려동물 수용",
            infant_care: "🍼 영유아실"
        };
        const facilityTagsHTML = shelter.facilities.map(fac => {
            const hasRequirement = 
                (fac === "wheelchair" && (userProfile.transport === "wheelchair" || userProfile.condition === "disabled")) ||
                (fac === "pet_friendly" && userProfile.companion === "with_pet") ||
                (fac === "infant_care" && (userProfile.companion === "with_child" || userProfile.condition === "child" || userProfile.condition === "pregnant")) ||
                (fac === "medical_center" && (userProfile.companion === "with_elderly" || userProfile.condition === "elderly" || userProfile.condition === "pregnant"));
                
            return `<span class="facility-tag ${hasRequirement ? 'highlight' : ''}">${facilityIcons[fac] || fac}</span>`;
        }).join("");

        // Congestion styles
        let barColorClass = "bar-green";
        let crowdText = "여유";
        if (shelter.occupancyRate >= 85) {
            barColorClass = "bar-red";
            crowdText = "혼잡 (만원 직전)";
        } else if (shelter.occupancyRate >= 55) {
            barColorClass = "bar-orange";
            crowdText = "보통";
        }

        const isUnusable = shelter.distance > 900; // Flood underground flag

        const card = document.createElement("div");
        card.className = `shelter-card ${isSelected ? 'selected' : ''} ${isUnusable ? 'shelter-unusable' : ''}`;
        card.setAttribute("data-id", shelter.id);
        card.innerHTML = `
            <div class="shelter-card-header">
                <span class="shelter-rank-tag rank-${rankNum}">${isUnusable ? '대피 불가' : rankNum + '순위 추천'}</span>
                <span class="shelter-match-score" style="${isUnusable ? 'color:var(--primary-red); background:rgba(239,68,68,0.1);':''}">${isUnusable ? '위험 등급' : shelter.finalScore + '점 적합'}</span>
            </div>
            <h3 class="shelter-name" style="${isUnusable ? 'color:var(--text-muted); text-decoration:line-through;':''}">${shelter.name}</h3>
            <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:8px;">${shelter.desc}</p>
            
            ${isUnusable ? `
                <div style="font-size:0.85rem; color:var(--primary-red); font-weight:bold; margin-top:8px;">
                    ⚠️ 지하 대피구역 침수 봉쇄로 절대 진입 금지 대상입니다.
                </div>
            ` : `
                <div class="shelter-stats">
                    <div class="stat-item">
                        <span>거리:</span>
                        <span class="stat-value-bold">${shelter.distance}m</span>
                    </div>
                    <div class="stat-item">
                        <span>총 정원:</span>
                        <span class="stat-value-bold">${shelter.capacity}인</span>
                    </div>
                </div>

                <div class="occupancy-section">
                    <div class="occupancy-header">
                        <span>실시간 수용도 (${crowdText})</span>
                        <span>${shelter.occupancy} / ${shelter.capacity} 명 (${shelter.occupancyRate}%)</span>
                    </div>
                    <div class="occupancy-bar-bg">
                        <div class="occupancy-bar-fill ${barColorClass}" style="width: ${shelter.occupancyRate}%"></div>
                    </div>
                </div>

                <div class="facility-tags">
                    ${facilityTagsHTML}
                </div>
            `}
        `;

        if (!isUnusable) {
            card.addEventListener("click", () => {
                selectShelter(shelter.id);
            });
        }

        listContainer.appendChild(card);
    });

    renderSVGMap(recommendations);
    updateRouteDetails(selectedShelterId);
}

function selectShelter(shelterId) {
    selectedShelterId = shelterId;
    
    document.querySelectorAll(".shelter-card").forEach(card => {
        if (parseInt(card.getAttribute("data-id")) === shelterId) {
            card.classList.add("selected");
        } else {
            card.classList.remove("selected");
        }
    });

    updateMapSelectedRoute(shelterId);
    updateRouteDetails(shelterId);
}

// ==========================================================================
// DYNAMIC SVG NEIGHBORHOOD MAP RENDERING (HUFS Campus Localized)
// ==========================================================================

function renderSVGMap(recommendedShelters) {
    const mapWrapper = document.getElementById("svg-map-wrapper");
    
    // Current Active Hazards list
    const activeHazards = DANGER_ZONES[selectedDisaster] || [];
    
    let svgContent = `
        <svg viewBox="0 0 100 100" class="svg-map" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="hazard-stripe" width="5" height="5" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="5" stroke="#ef4444" stroke-width="2" />
                </pattern>
                
                <filter id="route-glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            
            <!-- 1. Background grid -->
            <g class="map-grid">
                ${Array.from({length: 9}, (_, i) => `<line x1="${(i+1)*10}" y1="0" x2="${(i+1)*10}" y2="100" />`).join("")}
                ${Array.from({length: 9}, (_, i) => `<line x1="0" y1="${(i+1)*10}" x2="100" y2="${(i+1)*10}" />`).join("")}
            </g>

            <!-- 2. Local Geography Landmarks (Imun-dong context) -->
            
            <!-- Mountain: Cheonjangsan (West side) -->
            <path d="M 0,0 L 25,0 L 20,20 L 5,35 L 0,40 Z" fill="#1e3a1e" opacity="0.45" />
            <text x="7" y="15" class="landmark-label">천장산 산림지대</text>

            <!-- River: Jungnangcheon (East side) -->
            <path d="M 85,0 Q 92,30 83,60 T 95,100 L 100,100 L 100,0 Z" class="map-water" />
            <text x="94" y="25" class="water-label" transform="rotate(75, 94, 25)" font-size="2.2">중랑천 위험 수역</text>

            <!-- 3. Local Roads Layout -->
            <g>
                <!-- Main road: Imun-ro (runs North-South through middle) -->
                <line x1="50" y1="0" x2="50" y2="100" class="map-road-bg" />
                <text x="52" y="8" class="landmark-label" font-size="1.8" letter-spacing="0.2">← 이문로 대로 (통행로) →</text>
                
                <!-- Campus & Residential connectors -->
                <path d="M 50,60 L 45,45 M 45,45 L 25,45 M 25,45 L 25,75 M 50,60 L 25,75" class="map-road-bg" />
                <path d="M 50,60 L 70,60 L 70,35 M 70,35 L 85,35" class="map-road-bg" />
                <path d="M 50,85 L 75,85 L 75,80" class="map-road-bg" />
                <path d="M 50,60 L 50,85" class="map-road-bg" />

                <!-- Solid Road paths -->
                <line x1="50" y1="0" x2="50" y2="100" class="map-road" />
                <path d="M 50,60 L 45,45 M 45,45 L 25,45 M 25,45 L 25,75 M 50,60 L 25,75" class="map-road" />
                <path d="M 50,60 L 70,60 L 70,35 M 70,35 L 85,35" class="map-road" />
                <path d="M 50,85 L 75,85 L 75,80" class="map-road" />
                <path d="M 50,60 L 50,85" class="map-road" />
            </g>

            <!-- Street/Subway Landmark texts -->
            <text x="53" y="93" class="landmark-label" font-size="2">외대앞역 삼거리</text>
            <text x="32" y="55" class="landmark-label" font-size="1.8">외대캠퍼스 뒷길</text>
            <text x="73" y="58" class="landmark-label" font-size="1.8">이문초입 주택가</text>

            <!-- 4. Danger Zones -->
            <g id="map-hazard-zones">
                ${activeHazards.map(z => `
                    <circle cx="${z.x}" cy="${z.y}" r="${z.r}" class="map-hazard-zone" />
                    <circle cx="${z.x}" cy="${z.y}" r="2" class="hazard-marker-glow" />
                    <circle cx="${z.x}" cy="${z.y}" r="0.8" class="hazard-marker" />
                    <text x="${z.x}" y="${z.y - z.r - 2}" fill="#ef4444" font-size="2.2" font-weight="900" text-anchor="middle">${z.name}</text>
                `).join("")}
            </g>

            <!-- 5. Active Selected Path Overlay Groups -->
            <g id="map-dynamic-routes">
                <!-- Injected dynamically on card selection -->
            </g>

            <!-- 6. Shelter Pins with Dynamic Sizing based on occupancy -->
            <g id="map-shelter-pins">
                ${SHELTER_DATABASE.map(s => {
                    const isRec = recommendedShelters.some(r => r.id === s.id);
                    const recIndex = recommendedShelters.findIndex(r => r.id === s.id) + 1;
                    
                    // Capacity scale factor (V2 upgrade)
                    const occupancyRate = s.occupancy / s.capacity;
                    let pinSize = 2.5; // low crowd (default)
                    let crowdClass = "";
                    let pinColor = "#4b5563"; // default color for generic/non-recommended
                    
                    if (isRec) {
                        if (occupancyRate >= 0.85) {
                            pinSize = 6.5; // Highly crowded (Large)
                            crowdClass = "node-shelter-crowded";
                            pinColor = "#ef4444"; // Red alarm for crowd
                        } else if (occupancyRate >= 0.50) {
                            pinSize = 4.5; // Moderately full (Medium)
                            pinColor = "#f59e0b"; // Orange warning
                        } else {
                            pinSize = 3.0; // Low crowd (Small)
                            pinColor = "#10b981"; // Emerald safe
                        }
                    }
                    
                    // If unusable in floods
                    const isUnusableInFlood = selectedDisaster === "flood" && s.id === 4;
                    if (isUnusableInFlood) {
                        pinColor = "#1e293b";
                        pinSize = 2.5;
                    }

                    return `
                        <g class="node-shelter-g" id="pin-shelter-${s.id}">
                            <circle cx="${s.x}" cy="${s.y}" r="${pinSize}" fill="${pinColor}" class="node-shelter ${crowdClass}" onclick="selectShelter(${s.id})" />
                            
                            ${isRec && !isUnusableInFlood ? `
                                <text x="${s.x}" y="${s.y + 0.8}" fill="white" font-size="2.6" font-weight="900" text-anchor="middle" pointer-events="none">${recIndex}</text>
                            ` : ''}
                            
                            ${isUnusableInFlood ? `
                                <text x="${s.x}" y="${s.y + 0.8}" fill="#ef4444" font-size="2.2" font-weight="900" text-anchor="middle">X</text>
                            ` : ''}
                            
                            <text x="${s.x}" y="${s.y - pinSize - 1.2}" fill="${isRec ? '#f8fafc' : '#64748b'}" font-size="2.2" font-weight="bold" text-anchor="middle">${s.name}</text>
                        </g>
                    `;
                }).join("")}
            </g>

            <!-- 7. User Node (HUFS Gate) -->
            <g id="map-user-pin">
                <circle cx="${USER_LOCATION.x}" cy="${USER_LOCATION.y}" r="4.0" class="node-user-pulse" />
                <circle cx="${USER_LOCATION.x}" cy="${USER_LOCATION.y}" r="2.0" class="node-user" />
                <text x="${USER_LOCATION.x}" y="${USER_LOCATION.y + 5.5}" fill="#3b82f6" font-size="2.4" font-weight="bold" text-anchor="middle">내 위치</text>
            </g>
        </svg>
    `;
    
    mapWrapper.innerHTML = svgContent;
    updateMapSelectedRoute(selectedShelterId);
}

function updateMapSelectedRoute(shelterId) {
    const routeGroup = document.getElementById("map-dynamic-routes");
    if (!routeGroup) return;

    const shelter = SHELTER_DATABASE.find(s => s.id === shelterId);
    if (!shelter) return;

    const routeData = shelter.detourRoute[selectedDisaster];
    if (!routeData) return;

    // Draw routing segment paths
    if (routeData.blocked && routeData.blocked !== "") {
        routeGroup.innerHTML = `
            <!-- Blocked direct segment -->
            <path d="${routeData.blocked}" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1.5 2.5" opacity="0.8" />
            
            <!-- Safe Detour Route flow -->
            <path d="${routeData.path}" class="map-route-glow" />
            <path d="${routeData.path}" class="map-route" />
        `;
    } else {
        routeGroup.innerHTML = `
            <!-- Direct Safe path -->
            <path d="${routeData.path}" class="map-route-glow" />
            <path d="${routeData.path}" class="map-route" />
        `;
    }

    // Update active highlight classes on pins
    document.querySelectorAll(".node-shelter").forEach(el => {
        el.classList.remove("node-shelter-selected");
    });
    
    const activeCircle = document.querySelector(`#pin-shelter-${shelterId} circle`);
    if (activeCircle) {
        activeCircle.classList.add("node-shelter-selected");
    }
}

function updateRouteDetails(shelterId) {
    const shelter = SHELTER_DATABASE.find(s => s.id === shelterId);
    if (!shelter) return;

    const routeData = shelter.detourRoute[selectedDisaster];
    if (!routeData) return;

    // Compute demographic speed modifiers
    let speedFactor = 1.0;
    let speedLabel = "도보 대피";

    if (userProfile.condition === "disabled") {
        speedFactor = 2.0;
        speedLabel = "교통약자 도보 보행 (속도 지연)";
    } else if (userProfile.condition === "pregnant") {
        speedFactor = 1.6;
        speedLabel = "임산부 서행 대피 (휴식 권장)";
    } else if (userProfile.condition === "elderly") {
        speedFactor = 1.5;
        speedLabel = "고령자 대피 서행";
    } else if (userProfile.condition === "child") {
        speedFactor = 1.3;
        speedLabel = "아동 보행 서행";
    }

    let minutes = routeData.timeFoot;
    if (userProfile.transport === "car") {
        minutes = routeData.timeCar;
        speedLabel = "차량 긴급 피난";
    } else {
        // Multiply pedestrian speed factor
        minutes = Math.round(minutes * speedFactor);
    }

    if (userProfile.transport === "wheelchair") {
        // override if wheelchair selected
        minutes = Math.round(routeData.timeWheelchair * (userProfile.condition === "disabled" ? 1.2 : 1.0));
        speedLabel = "보행 보조 수단/휠체어 이동";
    }

    // Set time text
    document.getElementById("route-est-time").innerText = `예상 대피 시간: 약 ${minutes}분 (${speedLabel})`;
    
    // Render text directions
    const guidanceDiv = document.getElementById("route-instructions");
    guidanceDiv.innerHTML = `
        <p style="font-weight:700; margin-bottom:4px; color:var(--text-main);">안전한 이동 경로 안내:</p>
        <p>${routeData.instructions}</p>
    `;

    // Render warning panel
    const alertDiv = document.getElementById("route-safety-alert");
    if (routeData.warning) {
        alertDiv.className = "route-safety-alert visible";
        alertDiv.innerHTML = `
            <span style="font-size:1.1rem;">⚠️</span>
            <span><strong>위험 지대 근접 알림:</strong> ${routeData.warning}</span>
        `;
    } else {
        alertDiv.className = "route-safety-alert";
    }
}

// ==========================================================================
// DISASTER SWITCHER & CONTROLLER
// ==========================================================================

function setDisaster(disasterType) {
    selectedDisaster = disasterType;
    
    // Update container attribute for CSS selectors
    document.querySelector(".app-container").setAttribute("data-disaster", disasterType);
    
    // Update Active class in tab UI
    document.querySelectorAll(".disaster-tab").forEach(tab => {
        if (tab.getAttribute("data-disaster") === disasterType) {
            tab.classList.add("active");
        } else {
            tab.classList.remove("active");
        }
    });

    const preset = DISASTER_PRESETS[disasterType];
    if (!preset) return;

    // Update Alert Screen copy
    document.getElementById("alert-badge-text").innerText = preset.badgeText;
    document.getElementById("alert-main-title").innerText = preset.mainTitle;
    document.getElementById("alert-main-desc").innerText = preset.mainDesc;

    // Update Weather simulator grid
    const simGrid = document.getElementById("sim-status-grid");
    simGrid.innerHTML = `
        <div class="sim-item">
            <span class="sim-label">${preset.weatherTitle}</span>
            <span class="sim-value text-red">${preset.weatherVal}</span>
        </div>
        <div class="sim-item" style="border-left-color: var(--primary-red);">
            <span class="sim-label">${preset.blockTitle}</span>
            <span class="sim-value text-orange">${preset.blockVal}</span>
        </div>
    `;

    // Update Checklist tips
    document.getElementById("emergency-tip-1").innerText = preset.tips[0];
    document.getElementById("emergency-tip-2").innerText = preset.tips[1];
    document.getElementById("emergency-tip-3").innerText = preset.tips[2];
}

// ==========================================================================
// SYSTEM UTILITIES & EVENT BINDINGS
// ==========================================================================

function updateTime() {
    const timeSpan = document.getElementById("live-time");
    if (!timeSpan) return;
    
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    timeSpan.innerText = `${hours}:${minutes}:${seconds} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
}

document.addEventListener("DOMContentLoaded", () => {
    // Clock
    updateTime();
    setInterval(updateTime, 1000);

    // Initial disaster setup (flood by default)
    setDisaster("flood");

    // Bind Disaster toggles in Alert screen
    document.querySelectorAll(".disaster-tab").forEach(tab => {
        tab.addEventListener("click", () => {
            const disasterType = tab.getAttribute("data-disaster");
            setDisaster(disasterType);
        });
    });

    // Start Chatbot trigger
    const btnStart = document.getElementById("btn-start");
    if (btnStart) {
        btnStart.addEventListener("click", startChatbot);
    }

    // Resets
    const btnResetHeader = document.getElementById("btn-reset-header");
    if (btnResetHeader) {
        btnResetHeader.addEventListener("click", () => {
            if (confirm("대피 가이드를 리셋하고 재난 상황 선택 단계로 돌아가시겠습니까?")) {
                changeScreen("screen-alert");
                setDisaster(selectedDisaster); // restore active disaster alert text
            }
        });
    }

    const btnResetResults = document.getElementById("btn-reset-results");
    if (btnResetResults) {
        btnResetResults.addEventListener("click", () => {
            changeScreen("screen-alert");
            setDisaster(selectedDisaster);
        });
    }

    const btnRestartAll = document.getElementById("btn-restart-all");
    if (btnRestartAll) {
        btnRestartAll.addEventListener("click", () => {
            changeScreen("screen-alert");
            setDisaster(selectedDisaster);
        });
    }
});

// Window context exposing
window.selectShelter = selectShelter;
window.startChatbot = startChatbot;
