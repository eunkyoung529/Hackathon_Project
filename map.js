const map = L.map('map').setView([0, 0], 2); 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// 거리 계산 함수
function calculateDistance(lat1, lon1, lat2, lon2) {
    return map.distance([lat1, lon1], [lat2, lon2]);
}


// 포획된 위치를 추적
let capturedLocations = [];

// 포인트 및 캡쮸리 데이터 POST
function postCaptureData(location, points, images) {
    fetch('/api/collect-capture', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ captureName: location, points: points, capture: images})
    })
    .then(response => response.json())
    .then(data => {
        alert(`${location} 캡쮸리를 포획하였습니다! ${points} 포인트를 획득하였습니다.`);
        capturedLocations.push(location);  // 포획한 위치 저장
    })
    .catch(error => {
        console.error("캡쮸리 데이터 전송 중 오류 발생:", error);
    });
}

// 위치 목록
const locations = [
    { name: "test", lat: 37.649331, lon: 127.0217685, image: "static/sc/붕어빵.png", capname: "붕어빵",points: 50},
    { name: "덕성여대", lat: 37.65154594469693, lon: 127.01605796794865, image: "static/sc/덕성여대.png", capname: "덕성여대",points: 30 },
    { name: "덕성여대 차미리사관", lat: 37.65297122936526, lon: 127.01637268066406, image: "static/sc/디소공.png", capname: "디소공",points: 40 },
    { name: "덕성여대 인문관", lat: 37.65327702317577, lon: 127.01498866081238, image: "static/sc/인문대.jpg", capname: "인문대", points: 10},
    { name: "덕성여대 자연관", lat: 37.651917929934775, lon: 127.01726853847504, image: "static/sc/자연대.jpg", capname: "화학전공", points: 20},
    { name: "덕성여대 예술관", lat: 37.65092336942347, lon: 127.01703608030584, image: "static/sc/예술대.jpg", capname: "시각디자인과", points: 10},
    { name: "덕성여대 약학관", lat: 37.65104724775561, lon: 127.01824486255646, image: "static/sc/약학대.jpg", capname: "약사", points: 30},
    { name: "덕성여대 덕우당", lat: 37.65030397440397, lon: 127.0155143737793, image: "static/sc/덕우당.jpg", capname: "덕우당 한복", points: 40},
    { name: "해남군", lat: 34.5735165884839, lon: 126.599270065365, image: "static/sc/해남군.jpg", capname: "해남 이크누스",points: 50 },
    { name: "해남군", lat: 34.4928221, lon: 126.494087, image: "static/sc/해남 고구마.png", capname: "해남 고구마",points: 50 },
    { name: "옹진군", lat: 37.9534650042648, lon: 124.670086072277, image: "static/sc/옹진군.jpg", capname: "옹진 영흥 하늘 고래 스카이워크",points: 50 },
    { name: "청양군", lat: 36.4592146952303, lon: 126.80220021685, image: "static/sc/청양군.jpg", capname: "청양 고추빵", points: 50 },
    { name: "양구군", lat: 38.1100012808234, lon: 127.989950629015, image: "static/sc/양구군.jpg", capname: "양구 돼지", points: 50 },
    { name: "양양군", lat: 38.073838757652, lon: 128.62280130386353, image: "static/sc/양양 서핑.png", capname: "양양 서핑",points: 50 },
    { name: "과천시", lat: 37.4292328036839, lon: 126.987720998734, image: "static/sc/과천 사과.png", capname: "과천 사과",points: 50 },
];

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        function(position) {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;

            map.setView([userLat, userLon], 15);

            // 사용자 위치
            L.marker([userLat, userLon]).addTo(map)
                .bindPopup("<b>현재 위치</b>")
                .openPopup();

            // 위치 목록 처리
            locations.forEach(loc => {
                // 포획된 위치가 아닌 경우만 마커 표시
                if (!capturedLocations.includes(loc.name)) {
                    const distance = calculateDistance(userLat, userLon, loc.lat, loc.lon);
                    if (distance <= 50) {
                        alert(`${loc.capname}의 캡쮸리를 포획하였습니다! ${loc.points} 포인트를 획득하였습니다.`);
                        postCaptureData(loc.name, loc.points, loc.image);  // 포획 데이터 전송
                    } else {
                        // 위치에 마커 추가
                        L.marker([loc.lat, loc.lon]).addTo(map)
                            .bindPopup(`
                                <div style="text-align: center;">
                                    <img src="${loc.image}" width="100" height="100" alt="${loc.name} 캡쮸리" style="display: block; margin: 0 auto;">
                                    <h3>${loc.name}</h3>
                                    <p>${loc.capname} 캡쮸리를 획득할 수 있어요!</p>
                                </div>
                            `);
                    }
                }
            });
        },
        function() {
            alert("위치를 가져올 수 없습니다.");
        }
    );
} else {
    alert("Geolocation이 이 브라우저에서 지원되지 않습니다.");
}
