// 구매 아이템을 처리하는 함수
function purchaseItem(liElement) {
    // 클릭된 li 요소 내의 첫 번째 이미지의 데이터 속성 가져오기
    const imgElement = liElement.querySelector('img');
    const itemName = imgElement.getAttribute('data-name');
    const itemSrc = imgElement.getAttribute('data-src');

    // 사용자 로그인 상태 확인
    checkLoginStatus(itemName, itemSrc);
}

// 사용자 로그인 상태를 확인하는 함수
function checkLoginStatus(itemName, itemSrc) {
    // 세션 스토리지에서 사용자 토큰 확인 (실제 구현에 맞게 수정 필요)
    const isLoggedIn = sessionStorage.getItem('userToken') !== null;

    if (!isLoggedIn) {
        alert("로그인해주세요.");
        window.location.href = "login_logout.html";
    } else {
        // 포인트 확인 단계로 이동
        checkUserPoints(itemName, itemSrc);
    }
}

// 사용자의 포인트를 확인하는 함수
function checkUserPoints(itemName, itemSrc) {
    const userPoints = getUserPoints(); // 사용자 포인트 가져오기
    const itemCost = getItemCost(itemName); // 아이템 비용 가져오기

    if (userPoints >= itemCost) {
        // 포인트가 충분하면 구매 확인
        confirmPurchase(itemName, itemSrc, itemCost);
    } else {
        alert("포인트가 부족합니다.");
    }
}

// 구매를 확인하는 함수
function confirmPurchase(itemName, itemSrc, itemCost) {
    const userConfirmation = confirm(`${itemName}을(를) ${itemCost} 포인트에 구매하시겠습니까?`);

    if (userConfirmation) {
        // 확인되면 구매 처리
        processPurchase(itemName, itemSrc, itemCost);
    } else {
        alert("구매가 취소되었습니다.");
    }
}

// 구매를 처리하는 함수
function processPurchase(itemName, itemSrc, itemCost) {
    const csrfToken = getCsrfToken(); // CSRF 토큰 가져오기

    // 전송할 데이터 준비
    const data = {
        name: itemName,
        src: itemSrc,
        cost: itemCost
    };

    fetch('/purchase', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken // CSRF 토큰 헤더에 포함
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("구매가 완료되었습니다.");
            updateUserPoints(data.remainingPoints); // 사용자 포인트 업데이트
        } else {
            alert("구매에 실패했습니다.");
        }
    })
    .catch(error => {
        console.error('오류:', error);
        alert("오류가 발생했습니다.");
    });
}

// 사용자 포인트를 가져오는 헬퍼 함수 (예시 구현)
function getUserPoints() {
    // 실제 구현에 맞게 사용자 포인트를 가져오는 로직 작성
    // 예를 들어, API 호출을 통해 가져올 수 있음
    return parseInt(sessionStorage.getItem('userPoints')) || 0;
}

// 아이템의 비용을 반환하는 헬퍼 함수 (예시 구현)
function getItemCost(itemName) {
    const itemCosts = {
        "겨울방한 캡쮸리": 10,
        "붕어빵 캡쮸리": 15,
        "디소공과 캡쮸리": 20,
        "화학전공 캡쮸리": 20,
        "덕우당 한복 캡쮸리": 20,
        "시각디자인과 캡쮸리": 20,
        "대학 졸업 캡쮸리": 110,
        "덕성여대 캡쮸리": 100,
        "과천 사과 캡쮸리": 150,
        "해남 고구마 캡쮸리": 200,
        "양양 서핑 캡쮸리": 250,
        "청양 고추빵 캡쮸리": 250,
        "영흥 하늘 고래 스카이워크 캡쮸리": 260,
        "양구 지명 유래 해안 캡쮸리": 260,
        "해남 해남이크누스 캡쮸리": 260
    };
    return itemCosts[itemName] || 0;
}

// CSRF 토큰을 가져오는 헬퍼 함수 (Django 템플릿 내에 CSRF 토큰이 포함되어 있다고 가정)
function getCsrfToken() {
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
    return csrfToken;
}

// 사용자 포인트를 업데이트하는 헬퍼 함수 (예시 구현)
function updateUserPoints(newPoints) {
    // 실제 구현에 맞게 사용자 포인트를 업데이트하는 로직 작성
    sessionStorage.setItem('userPoints', newPoints);
}
