/**
 * .NET Learning Site - Main Application JavaScript
 * SPA Navigation and Interactive Features
 */

class LearningApp {
    constructor() {
        this.currentPage = 'introduction';
        this.pages = [
            'introduction', 'dotnet-basics', 'csharp-basics', 'aspnet-core',
            'mvc-pattern', 'entity-framework', 'database', 'authentication',
            'ecommerce-project', 'deployment', 'advanced-topics'
        ];
        this.completedPages = JSON.parse(localStorage.getItem('completedPages') || '["introduction"]');
        this.currentPageIndex = 0;
        this.theme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupTheme();
        this.loadInitialPage();
        this.updateProgress();
        this.initializeTooltips();
        this.setupKeyboardNavigation();
    }
    
    setupEventListeners() {
        // Navigation links
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-page]')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.navigateToPage(page);
            }
        });
        
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.navigatePrevious();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.navigateNext();
                        break;
                }
            }
        });
        
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.navigateToPage(e.state.page, false);
            }
        });
    }
    
    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = this.theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
        }
    }
    
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.setupTheme();
        
        // Add smooth transition effect
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
    
    async loadInitialPage() {
        const hash = window.location.hash.substring(1);
        const page = hash || 'introduction';
        await this.navigateToPage(page, false);
    }
    
    async navigateToPage(page, updateHistory = true) {
        if (!this.pages.includes(page)) {
            page = 'introduction';
        }
        
        this.showLoadingState();
        
        try {
            const content = await this.loadPageContent(page);
            this.renderPage(content, page);
            this.updateActiveNavigation(page);
            this.currentPage = page;
            this.currentPageIndex = this.pages.indexOf(page);
            
            if (updateHistory) {
                history.pushState({ page }, '', `#${page}`);
            }
            
            // Mark page as viewed
            if (!this.completedPages.includes(page)) {
                this.markPageAsViewed(page);
            }
            
            this.updateProgress();
            this.scrollToTop();
            
        } catch (error) {
            console.error('Error loading page:', error);
            this.showErrorMessage('ページの読み込みに失敗しました。');
        } finally {
            this.hideLoadingState();
        }
    }
    
    async loadPageContent(page) {
        try {
            const response = await fetch(`pages/${page}.html`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            // Fallback to default content if page doesn't exist
            console.warn(`Page ${page}.html not found, using default content`);
            return this.getDefaultPageContent(page);
        }
    }
    
    getDefaultPageContent(page) {
        const pageInfo = {
            'introduction': {
                title: 'はじめに',
                description: '.NETとC#を使用してECサイトを構築しながら学習するコースです。',
                content: `
                    <div class="learning-objectives">
                        <h3><i class="bi bi-target"></i> 学習目標</h3>
                        <ul>
                            <li>.NET Frameworkと.NET Coreの基本概念を理解する</li>
                            <li>C#の基本文法をマスターする</li>
                            <li>ASP.NET CoreでMVCアプリケーションを構築する</li>
                            <li>Entity Frameworkを使用したデータベース操作</li>
                            <li>実践的なECサイトの構築</li>
                        </ul>
                    </div>
                    <div class="alert alert-info">
                        <h5><i class="bi bi-info-circle"></i> 前提知識</h5>
                        <ul class="mb-0">
                            <li>基本的なプログラミング概念</li>
                            <li>HTML/CSSの基礎知識</li>
                            <li>データベースの基本概念</li>
                        </ul>
                    </div>
                `
            },
            'dotnet-basics': {
                title: '.NET基礎',
                description: '.NETプラットフォームの基本概念と開発環境について学習します。',
                content: `
                    <div class="row">
                        <div class="col-md-6">
                            <div class="card learning-card">
                                <div class="card-body">
                                    <h5 class="card-title"><i class="bi bi-cpu"></i> .NETとは</h5>
                                    <p class="card-text">.NETは、Microsoftが開発したオープンソースの開発プラットフォームです。</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card learning-card">
                                <div class="card-body">
                                    <h5 class="card-title"><i class="bi bi-layers"></i> .NET Framework vs .NET Core</h5>
                                    <p class="card-text">従来の.NET Frameworkと現代の.NET Core/.NET 5+の違いを理解します。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            }
        };
        
        const info = pageInfo[page] || pageInfo['introduction'];
        return `
            <div class="section-header">
                <h1>${info.title}</h1>
                <p>${info.description}</p>
            </div>
            ${info.content}
            <div class="mt-4">
                <button class="btn btn-success me-2" onclick="app.markPageAsCompleted('${page}')">
                    <i class="bi bi-check-circle"></i> 完了としてマーク
                </button>
                <button class="btn btn-primary" onclick="app.navigateNext()">
                    <i class="bi bi-arrow-right"></i> 次へ
                </button>
            </div>
        `;
    }
    
    renderPage(content, page) {
        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.innerHTML = content;
            contentArea.className = 'py-4 fade-in';
            
            // Initialize syntax highlighting for code blocks
            this.initializeSyntaxHighlighting();
            
            // Initialize any interactive elements
            this.initializePageElements();
        }
    }
    
    initializeSyntaxHighlighting() {
        // Initialize Prism.js for code highlighting
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }
    }
    
    initializePageElements() {
        // Initialize tooltips for newly loaded content
        this.initializeTooltips();
        
        // Initialize any other interactive elements
        const copyButtons = document.querySelectorAll('.copy-code-btn');
        copyButtons.forEach(btn => {
            btn.addEventListener('click', this.copyCode.bind(this));
        });
    }
    
    initializeTooltips() {
        // Initialize Bootstrap tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    updateActiveNavigation(page) {
        // Update main navigation
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === page) {
                link.classList.add('active');
            }
        });
        
        // Update sidebar navigation
        document.querySelectorAll('#courseMenu .nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === page) {
                link.classList.add('active');
            }
        });
    }
    
    markPageAsCompleted(page) {
        if (!this.completedPages.includes(page)) {
            this.completedPages.push(page);
            localStorage.setItem('completedPages', JSON.stringify(this.completedPages));
            this.updateProgress();
            this.showSuccessMessage('ページを完了としてマークしました！');
            this.updatePageBadges();
        }
    }
    
    markPageAsViewed(page) {
        // Add to viewed pages (different from completed)
        const viewedPages = JSON.parse(localStorage.getItem('viewedPages') || '[]');
        if (!viewedPages.includes(page)) {
            viewedPages.push(page);
            localStorage.setItem('viewedPages', JSON.stringify(viewedPages));
        }
    }
    
    updateProgress() {
        const totalPages = this.pages.length;
        const completedCount = this.completedPages.length;
        const percentage = Math.round((completedCount / totalPages) * 100);
        
        // Update progress bar
        const progressBar = document.getElementById('progressBar');
        const progressPercent = document.getElementById('progressPercent');
        
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
            progressBar.setAttribute('aria-valuenow', percentage);
        }
        
        if (progressPercent) {
            progressPercent.textContent = percentage;
        }
        
        this.updatePageBadges();
    }
    
    updatePageBadges() {
        document.querySelectorAll('#courseMenu .nav-link').forEach(link => {
            const page = link.getAttribute('data-page');
            const badge = link.querySelector('.badge');
            const icon = link.querySelector('i');
            
            if (this.completedPages.includes(page)) {
                if (badge) {
                    badge.className = 'badge bg-success ms-auto';
                    badge.textContent = '完了';
                }
                if (icon) {
                    icon.className = 'bi bi-check-circle-fill me-2';
                }
                link.classList.add('completed');
            } else if (page === this.currentPage) {
                if (badge) {
                    badge.className = 'badge bg-primary ms-auto';
                    badge.textContent = '学習中';
                }
                if (icon) {
                    icon.className = 'bi bi-play-circle-fill me-2';
                }
            }
        });
    }
    
    navigateNext() {
        if (this.currentPageIndex < this.pages.length - 1) {
            const nextPage = this.pages[this.currentPageIndex + 1];
            this.navigateToPage(nextPage);
        }
    }
    
    navigatePrevious() {
        if (this.currentPageIndex > 0) {
            const prevPage = this.pages[this.currentPageIndex - 1];
            this.navigateToPage(prevPage);
        }
    }
    
    setupKeyboardNavigation() {
        // Add keyboard navigation hints
        const navHints = document.createElement('div');
        navHints.className = 'position-fixed bottom-0 end-0 p-3';
        navHints.style.fontSize = '0.75rem';
        navHints.style.opacity = '0.7';
        navHints.innerHTML = `
            <div class="bg-dark text-light px-2 py-1 rounded">
                <small>Ctrl+← 前へ | Ctrl+→ 次へ</small>
            </div>
        `;
        document.body.appendChild(navHints);
        
        // Hide after 5 seconds
        setTimeout(() => {
            navHints.style.transition = 'opacity 0.5s';
            navHints.style.opacity = '0';
            setTimeout(() => navHints.remove(), 500);
        }, 5000);
    }
    
    showLoadingState() {
        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.innerHTML = `
                <div class="d-flex justify-content-center align-items-center" style="min-height: 200px;">
                    <div class="text-center">
                        <div class="loading mb-3"></div>
                        <p class="text-muted">読み込み中...</p>
                    </div>
                </div>
            `;
        }
    }
    
    hideLoadingState() {
        // Loading state is hidden when content is rendered
    }
    
    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }
    
    showErrorMessage(message) {
        this.showNotification(message, 'danger');
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.top = '80px';
        notification.style.right = '20px';
        notification.style.zIndex = '9999';
        notification.style.minWidth = '300px';
        
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    copyCode(event) {
        const button = event.target;
        const codeBlock = button.nextElementSibling.querySelector('code');
        
        if (codeBlock) {
            navigator.clipboard.writeText(codeBlock.textContent).then(() => {
                button.innerHTML = '<i class="bi bi-check"></i> コピー済み';
                setTimeout(() => {
                    button.innerHTML = '<i class="bi bi-clipboard"></i> コピー';
                }, 2000);
            }).catch(() => {
                this.showErrorMessage('コピーに失敗しました');
            });
        }
    }
    
    // Search functionality
    search(query) {
        if (!query.trim()) return;
        
        // Implement search functionality
        console.log('Searching for:', query);
        this.showNotification('検索機能は開発中です', 'info');
    }
    
    // Export progress data
    exportProgress() {
        const data = {
            completedPages: this.completedPages,
            viewedPages: JSON.parse(localStorage.getItem('viewedPages') || '[]'),
            theme: this.theme,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'learning-progress.json';
        a.click();
        URL.revokeObjectURL(url);
    }
    
    // Import progress data
    importProgress(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.completedPages) {
                    this.completedPages = data.completedPages;
                    localStorage.setItem('completedPages', JSON.stringify(this.completedPages));
                }
                if (data.viewedPages) {
                    localStorage.setItem('viewedPages', JSON.stringify(data.viewedPages));
                }
                if (data.theme) {
                    this.theme = data.theme;
                    localStorage.setItem('theme', this.theme);
                    this.setupTheme();
                }
                this.updateProgress();
                this.showSuccessMessage('進捗データをインポートしました');
            } catch (error) {
                this.showErrorMessage('ファイルの読み込みに失敗しました');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new LearningApp();
});

// Service Worker registration for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Add global utility functions
window.utils = {
    formatDate: (date) => {
        return new Intl.DateTimeFormat('ja-JP').format(new Date(date));
    },
    
    formatTime: (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}時間 ${minutes}分`;
    },
    
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Add some Easter eggs for engaged learners
const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.keyCode === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            window.app.showNotification('🎉 隠しコマンド発見！開発者モードが有効になりました', 'success');
            document.body.classList.add('developer-mode');
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});