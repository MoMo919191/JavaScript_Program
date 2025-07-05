// 警戒狀態偵測
async function fetchStatus() {
    // TODO: 之後替換成後端API
    const response = await fetch('http://localhost:8000/api/status/latest');
    const data = await response.json();

    const alertElement = document.getElementById('alert');

    if (data.status === '警戒') {
        alertElement.innerText = '⚠️ 警戒中：偵測到人員滯留 ⚠️';
        alertElement.style.backgroundColor = 'red';
        alertElement.classList.add('blink'); // 加入閃爍動畫
    } else {
        alertElement.innerText = '✅ 無警示';
        alertElement.style.backgroundColor = 'green';
        alertElement.classList.remove('blink'); // 移除閃爍動畫
    }
}

// 即時水位顯示
async function fetchWaterLevel() {
    // TODO: 之後請替換成後端API
    const response = await fetch('http://localhost:8000/api/waterlevel/latest');
    const data = await response.json();

    document.getElementById('waterLevel').innerText = `地點：${data.location}，水位：${data.water_level}`;
}

// 攝影機狀態與資料更新時間顯示
async function fetchSystemStatus() {
    // TODO: 之後請替換成後端API
    const response = await fetch('http://localhost:8000/api/system/status');
    const data = await response.json();

    document.getElementById('updateTime').innerText = `資料更新時間：${data.lastUpdateTime}`;
    document.getElementById('cameraStatus').innerText = `攝影機狀態：${data.cameraStatus}`;
}

// 歷史紀錄查詢（依日期與地點）
async function fetchHistory() {
    const selectedDate = document.getElementById('queryDate').value;
    const locationFilter = document.getElementById('locationFilter').value;

    if (!selectedDate || !locationFilter) {
        alert('請選擇日期與地點');
        return;
    }

    // TODO: 之後請替換成後端API
    const response = await fetch(`http://localhost:8000/api/logs?date=${selectedDate}`);
    const data = await response.json();

    const tableBody = document.getElementById('historyTable');
    tableBody.innerHTML = '';

    // 篩選只顯示該地點且有人
    const filteredData = data.filter(record => {
        return record.location === locationFilter && record.people !== '無人';
    });

    if (filteredData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">此條件無資料</td></tr>';
        return;
    }

    filteredData.forEach(record => {
        const row = `<tr>
            <td>${record.date}</td>
            <td>${record.time}</td>
            <td>${record.location}</td>
            <td>${record.people}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// 每 5 秒自動更新即時資料
setInterval(() => {
    fetchStatus();
    fetchWaterLevel();
    fetchSystemStatus();
}, 5000);

// 頁面載入時先抓一次
fetchStatus();
fetchWaterLevel();
fetchSystemStatus();
