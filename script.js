// 画面の要素を捕まえる
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

// アプリが起動した時、すでに保存されているタスクを読み込んで表示する
let todos = loadTodos();
renderTodos();

// 「追加」ボタンが押されたときの処理
addBtn.addEventListener('click', () => {
    const text = todoInput.value.trim();
    if (text !== '') {
        todos.push(text);
        saveTodos(todos); // 暗号化して保存
        renderTodos();    // 画面を更新
        todoInput.value = ''; // 入力欄を空にする
    }
});

// タスクを画面に表示する関数
function renderTodos() {
    todoList.innerHTML = ''; // 一旦リストを空にする
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${todo}</span>
            <button class="delete-btn" onclick="deleteTodo(${index})">❌</button>
        `;
        todoList.appendChild(li);
    });
}

// ❌ボタンが押されたときの削除処理
function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos(todos);
    renderTodos();
}

// --- 🔒 ここからが SkillGuardian の暗号化の仕組み 🔒 ---

// 1. 暗号化してLocalStorageに保存する関数
function saveTodos(todoArray) {
    // 配列を一度文字(JSON)に変える
    const jsonString = JSON.stringify(todoArray);
    
    // 【暗号化】日本語対応のBase64エンコード処理
    const encryptedData = btoa(unescape(encodeURIComponent(jsonString)));
    
    // ブラウザの保存スペースに「encrypted_todos」という名前で保存
    localStorage.setItem('encrypted_todos', encryptedData);
}

// 2. 保存された暗号データを読み込んで元に戻す関数
function loadTodos() {
    const encryptedData = localStorage.getItem('encrypted_todos');
    
    // もしまだデータが何もなければ、空の配列を返す
    if (!encryptedData) return [];

    try {
        // 【復号（元に戻す）】Base64デコード処理
        const decryptedData = decodeURIComponent(escape(atob(encryptedData)));
        
        // 文字から元の配列（JSON）に戻して返す
        return JSON.parse(decryptedData);
    } catch (e) {
        console.error("データの復号に失敗しました", e);
        return [];
    }
}
