// === システム変数 ===
let currentPool = [];
let currentIndex = 0;
let correctCount = 0;

// === 履歴管理 (Local Storage) ===
function getHistory() {
    // { "s1_01": true/false, ... }
    const data = localStorage.getItem('fp2_practical_master_history');
    return data ? JSON.parse(data) : {};
}

function saveHistory(id, isCorrect) {
    const history = getHistory();
    history[id] = isCorrect;
    localStorage.setItem('fp2_practical_master_history', JSON.stringify(history));
    updateMenuStatus();
}

function resetHistory() {
    if (confirm("学習履歴をリセットしますか？")) {
        localStorage.removeItem('fp2_practical_master_history');
        updateMenuStatus();
        alert("リセットしました。");
    }
}

function updateMenuStatus() {
    const history = getHistory();
    const allIds = questions.map(q => q.id);

    // 未回答数
    const unplayedCount = allIds.filter(id => !history.hasOwnProperty(id)).length;
    // 弱点（false）
    const weakCount = allIds.filter(id => history[id] === false).length;

    document.getElementById('badge-new').textContent = `残 ${unplayedCount}問`;
    document.getElementById('badge-weak').textContent = `対象 ${weakCount}問`;

    const solved = allIds.filter(id => history[id] === true).length;
    document.getElementById('history-status').textContent = `現在の進捗: ${solved} / ${allIds.length} 問正解`;
}

// === クイズロジック ===
function startQuiz(mode) {
    const history = getHistory();
    let pool = [];

    if (mode === 'random') {
        pool = shuffle(questions).slice(0, 20);
        document.getElementById('mode-display').textContent = "🎲 ランダム演習";

    } else if (mode === 'new') {
        const unplayed = questions.filter(q => !history.hasOwnProperty(q.id));
        pool = shuffle(unplayed).slice(0, 20);
        if (pool.length < 20) {
            const others = questions.filter(q => !pool.includes(q));
            pool = pool.concat(shuffle(others).slice(0, 20 - pool.length));
        }
        document.getElementById('mode-display').textContent = "🔰 未回答・新問";

    } else if (mode === 'weak') {
        const weaks = questions.filter(q => history[q.id] === false);
        // 不正解の問題のみを出題（最大20問）
        pool = shuffle(weaks).slice(0, 20);

        if (pool.length === 0) {
            // 弱点がない場合はランダム
            pool = shuffle(questions).slice(0, 20);
            alert("弱点（不正解）の問題はありません！ランダムに出題します。");
        }
        document.getElementById('mode-display').textContent = "💪 弱点克服";
    }

    currentPool = pool;
    currentIndex = 0;
    correctCount = 0;

    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-interface').style.display = 'block';
    document.getElementById('final-screen').style.display = 'none';

    showQuestion();
}

function showQuestion() {
    const qData = currentPool[currentIndex];
    document.getElementById('progress-text').textContent = `${currentIndex + 1} / ${currentPool.length} 問`;
    document.getElementById('q-source').textContent = qData.cat;
    document.getElementById('q-text').innerHTML = qData.q;

    const dataBox = document.getElementById('q-data');
    let content = "";
    if (qData.data) {
        content += qData.data;
    }
    if (qData.table) {
        content += qData.table;
    }

    if (content) {
        dataBox.innerHTML = content;
        dataBox.style.display = 'block';
    } else {
        dataBox.style.display = 'none';
        dataBox.innerHTML = '';
    }

    const optionsDiv = document.getElementById('options-area');
    optionsDiv.innerHTML = '';
    qData.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = `${index + 1}. ${opt}`;
        btn.onclick = () => checkAnswer(index);
        optionsDiv.appendChild(btn);
    });

    document.getElementById('result-feedback').style.display = 'none';
    document.getElementById('options-area').style.display = 'flex';
}

function checkAnswer(selectedIndex) {
    const qData = currentPool[currentIndex];
    const isCorrect = (selectedIndex === qData.correct);

    saveHistory(qData.id, isCorrect);

    const resultBox = document.getElementById('result-feedback');
    const title = document.getElementById('result-title');

    if (isCorrect) {
        correctCount++;
        title.textContent = "正解！";
        resultBox.className = "result-area correct-msg";
    } else {
        title.textContent = "不正解...";
        resultBox.className = "result-area incorrect-msg";
    }

    document.getElementById('result-explanation').innerHTML =
        `<strong>正解は「${qData.correct + 1}」です。</strong><br>${qData.exp}`;
    document.getElementById('result-ref').textContent = `出典: ${qData.ref}`;

    document.getElementById('options-area').style.display = 'none';
    resultBox.style.display = 'block';
    document.getElementById('next-btn').style.display = 'block';
}

function nextQuestion() {
    currentIndex++;
    if (currentIndex < currentPool.length) {
        showQuestion();
    } else {
        showFinalResult();
    }
}

function showFinalResult() {
    document.getElementById('quiz-interface').style.display = 'none';
    document.getElementById('final-screen').style.display = 'block';
    document.getElementById('final-score-display').textContent = `${correctCount} / ${currentPool.length}`;
    updateMenuStatus();
}

function shuffle(array) {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}


function quitQuiz() {
    if (confirm("クイズを中断してメニューに戻りますか？")) {
        document.getElementById('quiz-interface').style.display = 'none';
        document.getElementById('result-feedback').style.display = 'none';
        document.getElementById('start-screen').style.display = 'block';
        updateMenuStatus();
    }
}

window.onload = updateMenuStatus;
