// 右クリックを無効化
document.addEventListener('contextmenu', event => event.preventDefault());

// 特定のキー操作を無効化
document.addEventListener('keydown', event => {
    // F12
    if (event.key === 'F12') {
        event.preventDefault();
    }
    // Ctrl + Shift + I (開発者ツール)
    if (event.ctrlKey && event.shiftKey && event.key === 'I') {
        event.preventDefault();
    }
    // Ctrl + Shift + J (コンソール)
    if (event.ctrlKey && event.shiftKey && event.key === 'J') {
        event.preventDefault();
    }
    // Ctrl + Shift + C (要素の検査)
    if (event.ctrlKey && event.shiftKey && event.key === 'C') {
        event.preventDefault();
    }
    // Ctrl + U (ソースの表示)
    if (event.ctrlKey && event.key === 'u') {
        event.preventDefault();
    }
});
