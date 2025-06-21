console.log('🚀 ScriptWriter Pro carregado!');

// Estado da aplicação
let currentUser = null;
let currentScript = null;
let userScripts = [];

// Navegação - CORRIGIDO para páginas separadas
function showHome() {
    console.log('🏠 Navegando para página inicial');
    window.location.href = 'index.html';
}

function showLogin() {
    console.log('🔑 Mostrando formulário de login');
    // Se estamos na página index.html
    const homePage = document.getElementById('home-page');
    const authPage = document.getElementById('auth-page');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (homePage && authPage) {
        homePage.classList.add('hidden');
        authPage.classList.remove('hidden');
        if (loginForm) loginForm.classList.remove('hidden');
        if (signupForm) signupForm.classList.add('hidden');
    }
}

function showSignup() {
    console.log('👤 Mostrando formulário de cadastro');
    // Se estamos na página index.html
    const homePage = document.getElementById('home-page');
    const authPage = document.getElementById('auth-page');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (homePage && authPage) {
        homePage.classList.add('hidden');
        authPage.classList.remove('hidden');
        if (loginForm) loginForm.classList.add('hidden');
        if (signupForm) signupForm.classList.remove('hidden');
    }
}

function showEditor() {
    console.log('✏️ Navegando para o editor');
    // Salvar estado do usuário
    if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    // Redirecionar para página do editor
    window.location.href = 'pged.html';
}

function toggleToSignup() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (loginForm && signupForm) {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    }
}

function toggleToLogin() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (loginForm && signupForm) {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    }
}

// Autenticação
function handleLogin(event) {
    event.preventDefault();
    console.log('🔓 Fazendo login...');
    
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    
    if (!emailInput || !passwordInput) {
        console.error('❌ Campos de login não encontrados!');
        showNotification('Erro nos campos de login!', 'error');
        return;
    }
    
    const email = emailInput.value;
    const password = passwordInput.value;

    if (email && password.length >= 8) {
        currentUser = { name: email.split('@')[0], email: email };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showNotification('Login realizado com sucesso!', 'success');
        setTimeout(() => showEditor(), 1000);
    } else {
        showNotification('Preencha todos os campos corretamente!', 'error');
    }
}

function handleSignup(event) {
    event.preventDefault();
    console.log('📝 Fazendo cadastro...');
    
    const nameInput = document.getElementById('signup-name');
    const emailInput = document.getElementById('signup-email');
    const passwordInput = document.getElementById('signup-password');
    
    if (!nameInput || !emailInput || !passwordInput) {
        console.error('❌ Campos de cadastro não encontrados!');
        showNotification('Erro nos campos de cadastro!', 'error');
        return;
    }
    
    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    if (name && email && password.length >= 8) {
        currentUser = { name: name, email: email };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showNotification('Cadastro realizado com sucesso!', 'success');
        setTimeout(() => showEditor(), 1000);
    } else {
        showNotification('Preencha todos os campos corretamente!', 'error');
    }
}

function logout() {
    console.log('👋 Fazendo logout');
    currentUser = null;
    currentScript = null;
    localStorage.removeItem('currentUser');
    showNotification('Logout realizado!', 'success');
    setTimeout(() => showHome(), 1000);
}

// Formatação de roteiro - Só funciona na página do editor
function formatText(type) {
    console.log('🎨 Formatando como:', type);
    
    const textarea = document.getElementById('screenplay-editor');
    if (!textarea) {
        console.error('❌ Editor não encontrado!');
        return;
    }
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    if (!selectedText) {
        showNotification('Selecione o texto que deseja formatar!', 'error');
        return;
    }

    let formattedText = '';

    switch (type) {
        case 'scene':
            formattedText = selectedText.toUpperCase();
            break;
        case 'character':
            formattedText = '                    ' + selectedText.toUpperCase();
            break;
        case 'dialogue':
            formattedText = '          ' + selectedText;
            break;
        case 'parenthetical':
            formattedText = '                    (' + selectedText.toLowerCase() + ')';
            break;
        case 'transition':
            formattedText = '                              ' + selectedText.toUpperCase();
            break;
        case 'action':
        default:
            formattedText = selectedText;
            break;
    }

    // Substituir texto
    const newValue = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    textarea.value = newValue;
    
    // Reposicionar cursor
    textarea.selectionStart = start;
    textarea.selectionEnd = start + formattedText.length;
    textarea.focus();

    showNotification(`Formatação "${type}" aplicada!`, 'success');
    updateWordCount();
    
    // Atualizar botões ativos
    const formatItems = document.querySelectorAll('.format-item');
    formatItems.forEach(btn => btn.classList.remove('active'));
    formatItems.forEach(btn => {
        if (btn.textContent.includes(type.toUpperCase())) {
            btn.classList.add('active');
        }
    });
}

// Gerenciamento de roteiros
function newScript() {
    console.log('📄 Novo roteiro');
    
    currentScript = {
        id: Date.now(),
        title: 'Novo Roteiro',
        content: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    
    const titleInput = document.getElementById('script-title');
    const editorTextarea = document.getElementById('screenplay-editor');
    
    if (titleInput) titleInput.value = currentScript.title;
    if (editorTextarea) editorTextarea.value = '';
    
    updateWordCount();
    showNotification('Novo roteiro criado!', 'success');
}

function saveScript() {
    console.log('💾 Salvando roteiro');
    
    if (!currentScript) {
        newScript();
    }

    const titleInput = document.getElementById('script-title');
    const editorTextarea = document.getElementById('screenplay-editor');
    
    if (!titleInput || !editorTextarea) {
        console.error('❌ Elementos do editor não encontrados!');
        return;
    }

    const title = titleInput.value || 'Roteiro sem título';
    const content = editorTextarea.value;

    currentScript.title = title;
    currentScript.content = content;
    currentScript.updated_at = new Date().toISOString();

    // Salvar na lista
    const existingIndex = userScripts.findIndex(s => s.id === currentScript.id);
    if (existingIndex >= 0) {
        userScripts[existingIndex] = currentScript;
    } else {
        userScripts.push(currentScript);
    }

    localStorage.setItem('userScripts', JSON.stringify(userScripts));
    updateScriptsList();
    
    showNotification('Roteiro salvo com sucesso!', 'success');
}

function loadScript(scriptId) {
    console.log('📂 Carregando roteiro:', scriptId);
    
    const script = userScripts.find(s => s.id === scriptId);
    if (script) {
        currentScript = script;
        
        const titleInput = document.getElementById('script-title');
        const editorTextarea = document.getElementById('screenplay-editor');
        
        if (titleInput) titleInput.value = script.title;
        if (editorTextarea) editorTextarea.value = script.content || '';
        
        updateWordCount();
        showNotification('Roteiro carregado!', 'success');
    }
}

function exportPDF() {
    showNotification('Exportação PDF será implementada em breve!', 'error');
}

// Funções auxiliares
function loadUserScripts() {
    try {
        const saved = localStorage.getItem('userScripts');
        userScripts = saved ? JSON.parse(saved) : [];
        updateScriptsList();
    } catch (error) {
        console.error('Erro ao carregar roteiros:', error);
        userScripts = [];
    }
}

function updateScriptsList() {
    const container = document.getElementById('scripts-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (userScripts.length === 0) {
        container.innerHTML = '<div style="color: #6c757d; font-style: italic; font-size: 11px; text-align: center;">Nenhum roteiro salvo</div>';
        return;
    }
    
    userScripts.forEach(script => {
        const div = document.createElement('div');
        div.className = 'script-item';
        div.onclick = () => loadScript(script.id);
        
        const date = new Date(script.updated_at).toLocaleDateString('pt-BR');
        
        div.innerHTML = `
            <div class="script-title">${script.title}</div>
            <div class="script-date">${date}</div>
        `;
        
        container.appendChild(div);
    });
}

function updateWordCount() {
    const editorTextarea = document.getElementById('screenplay-editor');
    const wordCountElement = document.getElementById('word-count');
    const charCountElement = document.getElementById('char-count');
    
    if (!editorTextarea || !wordCountElement || !charCountElement) return;
    
    const text = editorTextarea.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    
    wordCountElement.textContent = `Palavras: ${words}`;
    charCountElement.textContent = `Caracteres: ${chars}`;
}

// Tabs da sidebar
function showEditorTab() {
    const sidebarIcons = document.querySelectorAll('.sidebar-icon');
    sidebarIcons.forEach(icon => icon.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
}

function showFormatTab() {
    const sidebarIcons = document.querySelectorAll('.sidebar-icon');
    sidebarIcons.forEach(icon => icon.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
}

function showNavTab() {
    const sidebarIcons = document.querySelectorAll('.sidebar-icon');
    sidebarIcons.forEach(icon => icon.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
}

function showSettingsTab() {
    const sidebarIcons = document.querySelectorAll('.sidebar-icon');
    sidebarIcons.forEach(icon => icon.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
}

// Notificações
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) {
        console.log(`📢 ${message}`);
        return;
    }
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.style.display = 'none';
        }, 300);
    }, 3000);
}

// Carregar estado do usuário
function loadUserState() {
    try {
        const saved = localStorage.getItem('currentUser');
        if (saved) {
            currentUser = JSON.parse(saved);
            const currentUserElement = document.getElementById('current-user');
            if (currentUserElement && currentUser) {
                currentUserElement.textContent = `👤 ${currentUser.name}`;
            }
        }
    } catch (error) {
        console.error('Erro ao carregar estado do usuário:', error);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM carregado');

    // Se estivermos na página do editor, torná-la visível
    initEditorPage();
    
    // Carregar estado do usuário
    loadUserState();
    
    // Verificar se estamos na página do editor
    const editorPage = document.getElementById('editor-page');
    if (editorPage) {
        console.log('📝 Página do editor detectada');
        
        // Carregar roteiros e configurar editor
        loadUserScripts();
        updateWordCount();
        
        // Contador de palavras em tempo real
        const editor = document.getElementById('screenplay-editor');
        if (editor) {
            editor.addEventListener('input', updateWordCount);
            editor.addEventListener('keyup', updateWordCount);
        }
        
        // Auto-save a cada 30 segundos
        setInterval(() => {
            const editorTextarea = document.getElementById('screenplay-editor');
            if (currentScript && editorTextarea && editorTextarea.value) {
                saveScript();
            }
        }, 30000);
    }
});

// Atalhos de teclado
document.addEventListener('keydown', function(e) {
    // Ctrl+S para salvar
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveScript();
    }
    
    // Ctrl+N para novo
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        newScript();
    }
    
    // Ctrl+E para exportar
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        exportPDF();
    }
});

console.log('🎯 ScriptWriter Pro totalmente carregado!');