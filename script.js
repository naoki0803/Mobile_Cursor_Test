// ナビゲーション機能の実装
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    // ナビゲーションリンクのクリック処理
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // アクティブクラスを削除
            navLinks.forEach(nl => nl.classList.remove('active'));
            
            // クリックされたリンクにアクティブクラスを追加
            this.classList.add('active');
            
            // 対象のセクションを取得
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // スムーズスクロール
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // スクロール位置に基づいてアクティブなナビゲーションを更新
    function updateActiveNavigation() {
        let currentSection = '';
        
        contentSections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // オフセット調整
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // スクロールイベントリスナー
    window.addEventListener('scroll', updateActiveNavigation);
    
    // 初期化時にアクティブなナビゲーションを設定
    updateActiveNavigation();
    
    // コードブロックのシンタックスハイライト風効果
    function enhanceCodeBlocks() {
        const codeBlocks = document.querySelectorAll('.code-block pre');
        
        codeBlocks.forEach(block => {
            const code = block.textContent;
            
            // 基本的なキーワードのハイライト
            let highlightedCode = code
                .replace(/\b(public|private|protected|static|class|interface|namespace|using|var|int|string|decimal|bool|DateTime|if|else|for|foreach|while|return|new|this|base|override|virtual|abstract|async|await|try|catch|finally|throw)\b/g, '<span style="color: #c678dd;">$1</span>')
                .replace(/\b(true|false|null)\b/g, '<span style="color: #d19a66;">$1</span>')
                .replace(/"([^"]*)"/g, '<span style="color: #98c379;">"$1"</span>')
                .replace(/\/\/.*$/gm, '<span style="color: #5c6370; font-style: italic;">$&</span>')
                .replace(/\/\*[\s\S]*?\*\//g, '<span style="color: #5c6370; font-style: italic;">$&</span>');
            
            block.innerHTML = highlightedCode;
        });
    }
    
    // ページ読み込み時にコードブロックを強化
    enhanceCodeBlocks();
    
    // プログレスバーの実装
    function createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            z-index: 9999;
            transition: width 0.3s ease;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
    
    // プログレスバーを作成
    createProgressBar();
    
    // 検索機能（将来的な拡張用）
    function initializeSearch() {
        // 検索機能の初期化コード
        // 将来的に検索ボックスを追加する場合の準備
    }
    
    // モバイルメニューの切り替え機能
    function initializeMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        
        function handleMediaQuery(e) {
            if (e.matches) {
                // モバイル表示の場合の処理
                sidebar.classList.add('mobile-sidebar');
            } else {
                // デスクトップ表示の場合の処理
                sidebar.classList.remove('mobile-sidebar');
            }
        }
        
        mediaQuery.addListener(handleMediaQuery);
        handleMediaQuery(mediaQuery);
    }
    
    // モバイルメニューを初期化
    initializeMobileMenu();
    
    // スムーズなページ読み込みアニメーション
    function initializePageAnimations() {
        const sections = document.querySelectorAll('.content-section');
        
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1
        });
        
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    }
    
    // ページアニメーションを初期化
    initializePageAnimations();
    
    // コードブロックのコピー機能
    function addCopyButtons() {
        const codeBlocks = document.querySelectorAll('.code-block');
        
        codeBlocks.forEach(block => {
            const button = document.createElement('button');
            button.textContent = 'コピー';
            button.style.cssText = `
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border: none;
                padding: 0.3rem 0.8rem;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.8rem;
                transition: background 0.3s ease;
            `;
            
            button.addEventListener('mouseenter', () => {
                button.style.background = 'rgba(255, 255, 255, 0.3)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.background = 'rgba(255, 255, 255, 0.2)';
            });
            
            button.addEventListener('click', () => {
                const code = block.querySelector('pre').textContent;
                navigator.clipboard.writeText(code).then(() => {
                    button.textContent = 'コピー済み';
                    setTimeout(() => {
                        button.textContent = 'コピー';
                    }, 2000);
                });
            });
            
            block.style.position = 'relative';
            block.appendChild(button);
        });
    }
    
    // コピーボタンを追加
    addCopyButtons();
    
    // キーボードショートカット
    document.addEventListener('keydown', function(e) {
        // Ctrl + F で検索機能を開く（将来的な実装）
        if (e.ctrlKey && e.key === 'f') {
            // 検索機能の実装
        }
        
        // ESC キーでメニューを閉じる（モバイル）
        if (e.key === 'Escape') {
            // モバイルメニューを閉じる処理
        }
    });
    
    console.log('.NET 学習サイトが正常に読み込まれました。');
});