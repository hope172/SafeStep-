import math
import random

# ==========================================================================
# SAFESTEP V2 ALGORITHM SIMULATOR (PYTHON PORT)
# ==========================================================================

# Starting Location: Hankuk University of Foreign Studies Main Gate (외대 정문)
USER_LOCATION = {"x": 50, "y": 60, "name": "한국외대 정문"}

# Shelter Database
SHELTER_DATABASE = [
    {
        "id": 1,
        "name": "한국외대 오바마홀",
        "x": 45, "y": 45,
        "capacity": 500,
        "occupancy": 280,
        "facilities": ["wheelchair", "medical_center"],
        "desc": "한국외대 서울캠퍼스 대형 실내체육시설.",
        "time_foot": 3, "time_car": 1, "time_wheelchair": 5,
        "instructions": "외대 정문에서 본관을 경유하는 고지대 안전 루트."
    },
    {
        "id": 2,
        "name": "이문초등학교 체육관",
        "x": 70, "y": 35,
        "capacity": 300,
        "occupancy": 288,  # Congested (96%)
        "facilities": ["wheelchair", "infant_care"],
        "desc": "이문초등학교 실내 강당.",
        "time_foot": 10, "time_car": 3, "time_wheelchair": 15,
        "instructions": "이문로28길 방향으로 우회하는 경로 (중랑천 인근 범람 회피)."
    },
    {
        "id": 3,
        "name": "이문1동 주민센터",
        "x": 25, "y": 75,
        "capacity": 200,
        "occupancy": 88,
        "facilities": ["pet_friendly", "infant_care"],
        "desc": "이문로 안쪽 주택가 내부 위치.",
        "time_foot": 9, "time_car": 2, "time_wheelchair": 14,
        "instructions": "외대앞역 지하차도를 피해 서쪽 주택가 골목길로 진입."
    },
    {
        "id": 4,
        "name": "이문동 쌍용아파트 지하대피소",
        "x": 75, "y": 80,
        "capacity": 400,
        "occupancy": 160,
        "facilities": ["wheelchair", "pet_friendly"],
        "desc": "민방위 지정 지하주차장 대피 시설.",
        "time_foot": 8, "time_car": 2, "time_wheelchair": 12,
        "instructions": "외대앞역 삼거리 낙하물 구역을 피해 아파트 상가 사잇길로 진입."
    }
]

def calculate_recommendations(disaster, condition, companion, transport):
    results = []
    
    for s in SHELTER_DATABASE:
        score = 100
        match_details = []
        is_blocked = False
        
        # 1. Proximity Calculation (Euclidean distance)
        dx = s["x"] - USER_LOCATION["x"]
        dy = s["y"] - USER_LOCATION["y"]
        distance = math.sqrt(dx*dx + dy*dy)
        dist_meters = round(distance * 11) # simulated meters
        
        dist_penalty = distance * 0.9
        score -= dist_penalty
        
        # 2. Congestion Penalty & Load Balancing
        occupancy_rate = s["occupancy"] / s["capacity"]
        if occupancy_rate >= 0.98:
            score -= 100
            match_details.append("정원 마감 임박 감점 (-100)")
        elif occupancy_rate >= 0.85:
            score -= 35
            match_details.append("혼잡도 임계 감점 (-35)")
        elif occupancy_rate < 0.45:
            score += 15
            match_details.append("여유 수용 가점 (+15)")

        # 3. Disaster Specific Rules
        if disaster == "flood":
            if s["id"] == 4: # Underground
                score -= 120
                is_blocked = True
                match_details.append("지하 주차장 침수 위험 차단 (-120)")
            if s["id"] == 2: # Near stream
                score -= 25
                match_details.append("중랑천 인근 하천 감점 (-25)")
            if s["id"] in [1, 3]: # High ground
                score += 15
                match_details.append("고지대 대피 안전 가점 (+15)")
                
        elif disaster == "earthquake":
            if s["id"] == 1:
                score += 25
                match_details.append("내진 우수 오바마홀 가점 (+25)")
            if s["id"] == 4:
                score += 20
                match_details.append("철골조 지하주차장 방패 가점 (+20)")
            if s["id"] == 3:
                score -= 20
                match_details.append("천장산 절개지 낙석 위험 감점 (-20)")
                
        elif disaster == "wildfire":
            if s["id"] == 3: # Near west mountain forest fire
                score -= 110
                is_blocked = True
                match_details.append("산불 확산 인접 위험 차단 (-110)")
            if s["id"] in [2, 4]:
                score += 20
                match_details.append("동편 대피 안심 지대 가점 (+20)")
                
        elif disaster == "snow":
            if s["id"] in [1, 3]:
                score += 15
                match_details.append("따뜻한 실내 가온 시설 가점 (+15)")
            if s["id"] == 4:
                score -= 20
                match_details.append("경사 램프 진입로 빙판 감점 (-20)")

        # 4. Demographic Modifiers
        speed_factor = 1.0
        
        # Condition Modifiers
        if condition == "disabled":
            speed_factor = 2.0
            if "wheelchair" in s["facilities"]:
                score += 50
                match_details.append("휠체어 경사 시설 완비 (+50)")
            else:
                score -= 60
                match_details.append("경사판 미설치 감점 (-60)")
        elif condition == "pregnant":
            speed_factor = 1.6
            if "medical_center" in s["facilities"]:
                score += 30
                match_details.append("상주 의료지원 가점 (+30)")
            if "infant_care" in s["facilities"]:
                score += 20
                match_details.append("임산부/수유 공간 가점 (+20)")
        elif condition == "elderly":
            speed_factor = 1.5
            if "medical_center" in s["facilities"]:
                score += 25
                match_details.append("실버 진료 가점 (+25)")
        elif condition == "child":
            speed_factor = 1.3
            if "infant_care" in s["facilities"]:
                score += 25
                match_details.append("아동 물품 지원 가점 (+25)")

        # Companion Modifiers
        if companion == "with_pet":
            if "pet_friendly" in s["facilities"]:
                score += 40
                match_details.append("반려동물 시설 동반 가점 (+40)")
            else:
                score -= 30
                match_details.append("반려동물 출입 제약 감점 (-30)")

        # 5. Speed and Duration Calculation
        base_time = s["time_foot"]
        if transport == "car":
            base_time = s["time_car"]
        elif transport == "wheelchair":
            base_time = s["time_wheelchair"]
            
        # Apply speed multiplier for pedestrian
        if transport != "car" and transport != "wheelchair":
            est_minutes = round(base_time * speed_factor)
        else:
            est_minutes = base_time

        final_score = max(0, round(score))
        
        results.append({
            "name": s["name"],
            "distance": dist_meters,
            "occupancy_rate": f"{round(occupancy_rate*100)}%",
            "est_minutes": est_minutes,
            "final_score": final_score,
            "blocked": is_blocked,
            "details": ", ".join(match_details),
            "instructions": s["instructions"]
        })

    # Sort results
    results.sort(key=lambda x: x["final_score"], reverse=True)
    return results

if __name__ == "__main__":
    print("==================================================")
    print(" 🛡️  SafeStep v2 Python Algorithmic Simulation")
    print("==================================================")
    
    # 1. Input Disaster Type
    print("\n[Step 0] 재난 종류를 선택하십시오:")
    print(" 1. 호우/침수 (flood)\n 2. 지진 (earthquake)\n 3. 산불 (wildfire)\n 4. 대설 (snow)")
    dis_opt = input("번호 입력 (1-4): ").strip()
    dis_map = {"1": "flood", "2": "earthquake", "3": "wildfire", "4": "snow"}
    disaster = dis_map.get(dis_opt, "flood")
    
    # 2. Input Demographic Profile
    print("\n[Step 1] 대피자 조건을 선택하십시오:")
    print(" 1. 아동 (child)\n 2. 일반 성인 (adult)\n 3. 고령자 (elderly)\n 4. 임산부 (pregnant)\n 5. 장애인/교통약자 (disabled)")
    cond_opt = input("번호 입력 (1-5): ").strip()
    cond_map = {"1": "child", "2": "adult", "3": "elderly", "4": "pregnant", "5": "disabled"}
    condition = cond_map.get(cond_opt, "adult")
    
    # 3. Input Companion Status
    print("\n[Step 2] 동행자 여부를 선택하십시오:")
    print(" 1. 혼자 (alone)\n 2. 아동 동반 (with_child)\n 3. 고령인 동반 (with_elderly)\n 4. 반려동물 동반 (with_pet)")
    comp_opt = input("번호 입력 (1-4): ").strip()
    comp_map = {"1": "alone", "2": "with_child", "3": "with_elderly", "4": "with_pet"}
    companion = comp_map.get(comp_opt, "alone")
    
    # 4. Input Transport
    print("\n[Step 3] 대피 이동 수단을 선택하십시오:")
    print(" 1. 도보 (foot)\n 2. 차량 (car)\n 3. 휠체어/보행기 (wheelchair)")
    trans_opt = input("번호 입력 (1-3): ").strip()
    trans_map = {"1": "foot", "2": "car", "3": "wheelchair"}
    transport = trans_map.get(trans_opt, "foot")
    
    print("\n" + "="*60)
    print(f" ▶ 분석 결과 (재난: {disaster.upper()} | 상태: {condition} | 동행: {companion} | 수단: {transport})")
    print("="*60)
    
    recommendations = calculate_recommendations(disaster, condition, companion, transport)
    
    for i, r in enumerate(recommendations):
        rank = i + 1
        status = "❌ [대피 차단/위험]" if r["blocked"] else f"🏆 [{rank}순위]"
        print(f"\n {status} {r['name']}")
        print(f"   - 최종 적합도 점수: {r['final_score']}점")
        print(f"   - 외대 정문 기준 거리: {r['distance']}m")
        print(f"   - 예상 소요 시간: 약 {r['est_minutes']}분")
        print(f"   - 실시간 혼잡도: {r['occupancy_rate']}")
        print(f"   - AI 판정 내역: {r['details']}")
        print(f"   - 대피 경로 가이드: {r['instructions']}")
        
    print("\n==================================================")
