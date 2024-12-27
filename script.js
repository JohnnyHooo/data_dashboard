const questions = [
    {
        question: "2025年去哪跨年？",
        options: [
            { text: "成都", type: "normal" },
            { text: "北上广深", type: "moving" }
        ]
    },
    {
        question: "去成都哪里跨年？",
        options: [
            { text: "Livehouse", type: "normal" },
            { text: "3环外放烟花", type: "avoiding" }
        ]
    },
    {
        question: "去哪家Livehouse？",
        options: [
            { text: "空瓶子", type: "normal" },
            { text: "OC", type: "disappearing" }
        ]
    },
    {
        question: "我确定并且报名参加！",
        options: [
            { text: "我要参加", type: "normal" },
            { text: "我不参加", type: "hiding" }
        ]
    },
    {
        question: "缴纳押金",
        options: [
            { text: "微信支付", type: "normal" },
            { text: "不交", type: "shattering" }
        ]
    }
];

let currentQuestion = 0;

function updateQuestion() {
    const container = document.getElementById('question-container');
    const question = questions[currentQuestion];
    
    container.innerHTML = `
        <h1>${question.question}</h1>
        <div id="options" class="options">
            ${question.options.map((option, index) => `
                <button class="option ${option.type === 'normal' ? 'normal' : 'tricky'}" 
                        data-option="${index === 0 ? 'A' : 'B'}"
                        data-type="${option.type}">
                    ${option.text}
                </button>
            `).join('')}
        </div>
    `;

    setupEventListeners();
}

function setupEventListeners() {
    const options = document.querySelectorAll('.option');
    
    options.forEach(option => {
        const type = option.dataset.type;
        
        switch(type) {
            case 'moving':
                option.addEventListener('mouseover', moveRandomly);
                break;
            case 'avoiding':
                option.addEventListener('mousemove', avoid);
                break;
            case 'disappearing':
                option.addEventListener('click', disappear);
                break;
            case 'hiding':
                option.addEventListener('click', hide);
                break;
            case 'shattering':
                option.addEventListener('click', shatter);
                break;
            case 'normal':
                option.addEventListener('click', nextQuestion);
                break;
        }
    });
}

function moveRandomly(e) {
    const button = e.target;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // 防止多次点击创建多个定时器
    if (button.dataset.moving === 'true') return;
    button.dataset.moving = 'true';
    
    // 设置初始位置
    button.style.position = 'fixed';
    button.style.transition = 'all 0.1s linear';
    
    // 创建连续移动的动画
    function moveButton() {
        const maxX = windowWidth - button.offsetWidth;
        const maxY = windowHeight - button.offsetHeight;
        
        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;
        
        button.style.left = `${randomX}px`;
        button.style.top = `${randomY}px`;
    }
    
    // 每100ms移动一次
    moveButton();
    button.moveInterval = setInterval(moveButton, 100);
}

function avoid(e) {
    const button = e.target;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const buttonRect = button.getBoundingClientRect();
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;
    
    // 获取当前的缩放比例
    const currentScale = button.style.transform ? 
        parseFloat(button.style.transform.match(/scale\((.*?)\)/)?.[1] || 1) : 1;
    
    // 每次移动缩小10%
    const newScale = Math.max(0.1, currentScale - 0.1);
    
    // 如果太小就隐藏按钮
    if (newScale <= 0.1) {
        button.style.opacity = '0';
        button.style.pointerEvents = 'none';
        return;
    }
    
    const angle = Math.atan2(mouseY - buttonCenterY, mouseX - buttonCenterX);
    const distance = 150 + (1 - newScale) * 100; // 距离随着缩小而增加
    
    const newX = buttonCenterX - Math.cos(angle) * distance;
    const newY = buttonCenterY - Math.sin(angle) * distance;
    
    button.style.position = 'fixed';
    button.style.transition = 'all 0.3s ease';
    button.style.transform = `scale(${newScale})`;
    button.style.left = `${newX - buttonRect.width / 2}px`;
    button.style.top = `${newY - buttonRect.height / 2}px`;
    
    // 添加缩小时的动画效果
    button.style.opacity = (1 - ((1 - newScale) * 0.5)).toString();
}

function disappear(e) {
    e.target.classList.add('hide');
}

function hide(e) {
    const button = e.target;
    const normalButton = document.querySelector('.normal');
    
    button.style.position = 'absolute';
    button.style.left = `${normalButton.offsetLeft}px`;
    button.style.top = `${normalButton.offsetTop + 10}px`;
    button.style.zIndex = '-1';
}

function shatter(e) {
    e.target.classList.add('shatter');
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        updateQuestion();
    } else {
        showQRCode();
    }
}

function showQRCode() {
    const container = document.getElementById('question-container');
    container.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 2rem;">
            <div>
                <h1 style="margin-bottom: 1.5rem;">恭喜你完成报名！</h1>
                <h2 style="color: #ff69b4; font-size: 1.5rem;">
                    我宣誓2025在成都的空瓶子Livehouse跨年！
                </h2>
            </div>
            <img src="qr_code.jpg" 
                 alt="支付二维码" 
                 style="max-width: 300px; display: block;">
        </div>
    `;
}

// 初始化第一个问题
updateQuestion();
