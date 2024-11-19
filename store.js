function purchaseItem(element) {
    const itemName = element.getAttribute('data-name');
    const itemSrc = element.getAttribute('data-src');
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    const authToken = localStorage.getItem('authToken');

    if (!isLoggedIn || !authToken) {
        alert('로그인 후 이용해주세요!');
        window.location.href = 'login_logout.html'; // 로그인 페이지로 이동
        return;
    }

    const confirmPurchase = confirm(`"${itemName}"를 구매하시겠습니까?`);
    if (!confirmPurchase) {
        alert('구매를 취소했습니다.');
        return;
    }

    // 서버로 데이터 전송 - 포인트 확인 및 구매 요청
    fetch('/api/check-points', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
            name: itemName
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('포인트 확인 실패');
        }
        return response.json();
    })
    .then(data => {
        if (!data.hasEnoughPoints) {
            alert('포인트가 부족합니다.');
            return;
        }

        // 포인트가 충분하면 구매 요청 진행
        return fetch('/api/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                name: itemName,
                image: itemSrc
            })
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('구매에 실패했습니다.');
        }
        return response.json();
    })
    .then(data => {
        alert(`"${itemName}" 구매했습니다!`);
        console.log(data); 
    })
    .catch(error => {
        console.error('Error:', error);
        alert('구매 중 문제가 발생했습니다.');
    });
}
