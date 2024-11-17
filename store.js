function purchaseItem(element) {
    const itemName = element.getAttribute('data-name');
    const itemSrc = element.getAttribute('data-src');

    // 로그인 여부 확인
    const isLoggedIn = localStorage.getItem('loggedIn');
    if (!isLoggedIn) {
        alert('로그인 후 이용해주세요!');
        window.location.href = 'login.html'; // 로그인 페이지로 이동
        return;
    }

    // 서버로 데이터 전송
    fetch('/api/purchase', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}` // 예시로 토큰 전달
        },
        body: JSON.stringify({
            name: itemName,
            image: itemSrc
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('구매에 실패했습니다.');
        }
        return response.json();
    })
    .then(data => {
        alert(`"${itemName}" 구매했습니다!`);
        console.log(data); // 성공 데이터 확인
    })
    .catch(error => {
        console.error('Error:', error);
        alert('구매 중 문제가 발생했습니다.');
    });
}
