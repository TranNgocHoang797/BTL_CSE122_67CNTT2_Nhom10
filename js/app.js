/**
 * SmartShelf RetailTech OS - Trình điều khiển giao diện toàn cục (App Framework)
 * Render tự động Sidebar điều hướng, Header, Role Switcher, Notifications, Toasts, Modals
 */
(function() {
  'use strict';

  class SmartShelfApp {
    constructor() {
      this.theme = localStorage.getItem('SMARTSHELF_THEME') === 'dark' ? 'dark' : 'light';
      document.documentElement.dataset.theme = this.theme;
      this.init();
    }

    init() {
      document.addEventListener('DOMContentLoaded', () => {
        this.renderLayoutChrome();
        this.bindGlobalEvents();
        this.updateNotificationBadge();
      });

      // Lắng nghe sự kiện thay đổi dữ liệu hoặc vai trò
      window.addEventListener('smartshelf:role-change', (e) => {
        this.onRoleChanged(e.detail.role);
      });
      window.addEventListener('smartshelf:data-change', () => {
        this.updateNotificationBadge();
      });
    }

    // Xác định trang hiện tại từ URL pathname
    getCurrentPageFile() {
      const path = window.location.pathname;
      const file = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
      return file;
    }

    // Render Sidebar và Header nếu trang có chứa thẻ #sidebar-slot và #header-slot
    renderLayoutChrome() {
      const currentFile = this.getCurrentPageFile();
      const currentRole = SS_Store.getCurrentRole();
      const currentUser = SS_Store.getCurrentUser();

      // 1. Render Sidebar
      const sidebarSlot = document.getElementById('sidebar-slot');
      if (sidebarSlot) {
        sidebarSlot.outerHTML = this.getSidebarHtml(currentFile, currentRole, currentUser);
      }

      // 2. Render Header
      const headerSlot = document.getElementById('header-slot');
      if (headerSlot) {
        headerSlot.outerHTML = this.getHeaderHtml(currentFile, currentRole, currentUser);
      }

      // 3. Render Toast Container nếu chưa có
      if (!document.getElementById('toast-container')) {
        const toastDiv = document.createElement('div');
        toastDiv.id = 'toast-container';
        toastDiv.className = 'toast-container';
        document.body.appendChild(toastDiv);
      }

      // 4. Render Global Modal Slot
      if (!document.getElementById('global-modal-slot')) {
        const modalSlot = document.createElement('div');
        modalSlot.id = 'global-modal-slot';
        document.body.appendChild(modalSlot);
      }

      // 5. Render Mobile Backdrop
      if (!document.getElementById('sidebar-backdrop')) {
        const backdrop = document.createElement('div');
        backdrop.id = 'sidebar-backdrop';
        backdrop.className = 'ss-sidebar-backdrop';
        backdrop.onclick = () => this.toggleMobileSidebar(false);
        document.body.appendChild(backdrop);
      }
    }

    getRoleNavigationHtml(currentFile, currentRole, metrics) {
      const navigationByRole = {
        shopper: {
          title: 'Khách mua sắm',
          items: [
            { file: 'shopper-product-search.html', icon: '🔍', label: 'Tìm sản phẩm' },
            { file: 'shopper-product-location.html', icon: '📍', label: 'Vị trí & Bản đồ kệ' },
            { file: 'shopper-product-alternatives.html', icon: '✨', label: 'Gợi ý thay thế AI', badge: 'AI-2', badgeClass: 'badge-success' }
          ]
        },
        associate: {
          title: 'Nhân viên cửa hàng',
          items: [
            { file: 'associate-zone-view.html', icon: '🏬', label: 'Khu vực & Kệ hàng' },
            { file: 'associate-shelf-check.html', icon: '📋', label: 'Kiểm kê kệ hàng' },
            { file: 'associate-restock-task.html', icon: '⚡', label: 'Nhiệm vụ bổ sung', badge: metrics.activeTasks, badgeClass: 'badge-warning' }
          ]
        },
        manager: {
          title: 'Quản lý cửa hàng',
          items: [
            { file: 'manager-store-dashboard.html', icon: '📊', label: 'Bảng điều hành' },
            { file: 'manager-restock-board.html', icon: '📑', label: 'Kanban bổ sung hàng' },
            { file: 'manager-retail-insights.html', icon: '💡', label: 'Phân tích & AI Insight', badge: 'AI-3', badgeClass: 'badge-danger' }
          ]
        },
        admin: {
          title: 'Quản trị viên',
          items: [
            { file: 'admin-product-management.html', icon: '📦', label: 'Quản lý sản phẩm' },
            { file: 'admin-zone-management.html', icon: '🗺️', label: 'Quản lý khu vực' },
            { file: 'admin-user-management.html', icon: '👥', label: 'Quản lý người dùng' }
          ]
        }
      };
      const roleNavigation = navigationByRole[currentRole];

      if (!roleNavigation) return '';

      const itemsHtml = roleNavigation.items.map(item => `
        <li class="nav-item">
          <a href="${item.file}" class="${currentFile === item.file ? 'active' : ''}">
            <span class="nav-icon">${item.icon}</span>
            <span class="sidebar-text">${item.label}</span>
            ${item.badge !== undefined ? `<span class="nav-badge ${item.badgeClass}">${item.badge}</span>` : ''}
          </a>
        </li>
      `).join('');

      return `
        <div class="nav-group">
          <div class="nav-group-title">${roleNavigation.title}</div>
          <ul class="nav-list">${itemsHtml}</ul>
        </div>
      `;
    }

    getSidebarHtml(currentFile, currentRole, currentUser) {
      const metrics = SS_Store.getMetrics();

      return `
        <aside id="main-sidebar" class="ss-sidebar">
          <div class="ss-sidebar-header">
            <a href="index.html" class="ss-brand">
              <div class="ss-brand-icon">🛒</div>
              <div class="ss-logo-text">
                <span class="ss-logo-title">SmartShelf</span>
                <span class="ss-logo-subtitle">RetailTech OS</span>
              </div>
            </a>
            <button class="sidebar-collapse-btn" onclick="SS_App.toggleSidebarCollapse()" title="Thu gọn menu" aria-label="Thu gọn menu" aria-expanded="true">
              ☰
            </button>
          </div>

          <nav class="ss-sidebar-nav">
            ${this.getRoleNavigationHtml(currentFile, currentRole, metrics)}

            <!-- Phím tắt hệ thống -->
            <div class="nav-group" style="margin-top:auto">
              <div class="nav-group-title">Hệ thống</div>
              <ul class="nav-list">
                <li class="nav-item">
                  <a href="notifications.html" class="${currentFile === 'notifications.html' ? 'active' : ''}">
                    <span class="nav-icon">🔔</span>
                    <span class="sidebar-text">Thông báo</span>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="settings.html" class="${currentFile === 'settings.html' ? 'active' : ''}">
                    <span class="nav-icon">⚙️</span>
                    <span class="sidebar-text">Cài đặt & Dữ liệu</span>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="index.html" class="${currentFile === 'index.html' ? 'active' : ''}">
                    <span class="nav-icon">🌐</span>
                    <span class="sidebar-text">Cổng tổng quan</span>
                  </a>
                </li>
              </ul>
            </div>
          </nav>

          <div class="ss-sidebar-footer">
            <div class="current-role-card">
              <img src="${currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}" alt="Avatar" class="role-avatar">
              <div class="role-info">
                <div class="role-name">${currentUser.name}</div>
                <div class="role-tag">${currentUser.roleLabel || 'Quản lý'}</div>
              </div>
            </div>
          </div>
        </aside>
      `;
    }

    getHeaderHtml(currentFile, currentRole, currentUser) {
      const pageTitles = {
        'index.html': 'Cổng tổng quan hệ thống',
        'shopper-product-search.html': 'Tìm kiếm sản phẩm',
        'shopper-product-location.html': 'Vị trí sản phẩm & Bản đồ kệ',
        'shopper-product-alternatives.html': 'Gợi ý sản phẩm thay thế AI',
        'associate-zone-view.html': 'Khu vực phụ trách & Tình trạng kệ',
        'associate-shelf-check.html': 'Kiểm kê kệ hàng thực tế',
        'associate-restock-task.html': 'Nhiệm vụ bổ sung hàng',
        'manager-store-dashboard.html': 'Bảng điều hành trung tâm',
        'manager-restock-board.html': 'Kanban điều phối bổ sung hàng',
        'manager-retail-insights.html': 'Phân tích dữ liệu bán lẻ & AI',
        'admin-product-management.html': 'Quản lý danh mục sản phẩm',
        'admin-zone-management.html': 'Quản lý khu vực & Mặt bằng',
        'admin-user-management.html': 'Quản lý người dùng & Phân quyền',
        'notifications.html': 'Trung tâm thông báo & Cảnh báo',
        'settings.html': 'Cài đặt hệ thống & Dữ liệu'
      };

      const title = pageTitles[currentFile] || 'SmartShelf OS';

      return `
        <header class="ss-header">
          <div class="ss-header-left">
            <button class="mobile-menu-btn" onclick="SS_App.toggleMobileSidebar(true)" title="Menu">
              ☰
            </button>
            <div class="ss-breadcrumb">
              <span>SmartShelf</span>
              <span>/</span>
              <span class="current">${title}</span>
            </div>
          </div>

          <div class="ss-header-search">
            <div class="search-input-box">
              <span>🔍</span>
              <input type="text" id="global-search-input" placeholder="Tìm sản phẩm, vị trí kệ, mã SKU, nhiệm vụ..." autocomplete="off">
              <span class="search-shortcut">Ctrl+K</span>
            </div>
            <!-- Global search results popup -->
            <div id="global-search-results" class="role-menu-popup" style="width: 100%; top: calc(100% + 6px);"></div>
          </div>

          <div class="ss-header-right">
            <div class="store-live-status">
              <span class="live-dot"></span>
              <span>SmartShelf Mart · Cầu Giấy, Hà Nội</span>
            </div>

            <button class="theme-toggle-btn" type="button" onclick="SS_App.toggleTheme()" id="theme-toggle-btn" aria-label="Chuyển sang giao diện tối" aria-pressed="${this.theme === 'dark'}" title="${this.theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}">
              <span id="theme-toggle-icon" aria-hidden="true">${this.theme === 'dark' ? '☀️' : '🌙'}</span>
              <span id="theme-toggle-label">${this.theme === 'dark' ? 'Sáng' : 'Tối'}</span>
            </button>

            <!-- Role Switcher -->
            <div class="role-switcher-dropdown">
              <button class="role-switcher-btn" onclick="SS_App.toggleRoleMenu()" id="role-menu-trigger">
                <span>🎭</span>
                <span id="role-btn-label">${this.getRoleVietnameseName(currentRole)}</span>
                <span style="font-size:0.7rem">▼</span>
              </button>
              <div class="role-menu-popup" id="role-menu-popup">
                <div class="role-menu-header">Chuyển đổi vai trò trải nghiệm</div>
                <div class="role-option-item ${currentRole === 'shopper' ? 'active' : ''}" onclick="SS_App.switchRole('shopper')">
                  <span>🛍️ Khách mua sắm</span>
                  ${currentRole === 'shopper' ? '✓' : ''}
                </div>
                <div class="role-option-item ${currentRole === 'associate' ? 'active' : ''}" onclick="SS_App.switchRole('associate')">
                  <span>🧑‍💼 Nhân viên cửa hàng</span>
                  ${currentRole === 'associate' ? '✓' : ''}
                </div>
                <div class="role-option-item ${currentRole === 'manager' ? 'active' : ''}" onclick="SS_App.switchRole('manager')">
                  <span>📊 Quản lý cửa hàng</span>
                  ${currentRole === 'manager' ? '✓' : ''}
                </div>
                <div class="role-option-item ${currentRole === 'admin' ? 'active' : ''}" onclick="SS_App.switchRole('admin')">
                  <span>⚙️ Quản trị viên</span>
                  ${currentRole === 'admin' ? '✓' : ''}
                </div>
              </div>
            </div>

            <!-- Notifications Bell -->
            <div class="notification-container">
              <button class="notif-btn" onclick="SS_App.toggleNotifFlyout()" id="notif-trigger-btn" title="Thông báo hệ thống">
                🔔
                <span class="notif-badge-count" id="header-notif-count">2</span>
              </button>
              <div class="notif-flyout" id="notif-flyout">
                <div class="notif-flyout-header">
                  <strong>Thông báo & Cảnh báo</strong>
                  <a href="notifications.html" style="font-size:0.75rem;font-weight:600">Xem tất cả</a>
                </div>
                <div class="notif-flyout-list" id="notif-flyout-list">
                  <!-- Populated by JS -->
                </div>
              </div>
            </div>

            <!-- User Avatar & Link to profile/settings -->
            <a href="settings.html" style="display:flex;align-items:center" title="Hồ sơ & Cài đặt">
              <img src="${currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}" alt="User" class="role-avatar" style="border: 2px solid var(--primary-border)">
            </a>
          </div>
        </header>
      `;
    }

    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = this.theme;
      localStorage.setItem('SMARTSHELF_THEME', this.theme);

      const isDark = this.theme === 'dark';
      const button = document.getElementById('theme-toggle-btn');
      if (button) {
        button.setAttribute('aria-label', `Chuyển sang giao diện ${isDark ? 'sáng' : 'tối'}`);
        button.setAttribute('aria-pressed', String(isDark));
        button.title = `Chuyển sang giao diện ${isDark ? 'sáng' : 'tối'}`;
      }
      const icon = document.getElementById('theme-toggle-icon');
      if (icon) icon.textContent = isDark ? '☀️' : '🌙';
      const label = document.getElementById('theme-toggle-label');
      if (label) label.textContent = isDark ? 'Sáng' : 'Tối';
    }

    getRoleVietnameseName(role) {
      switch(role) {
        case 'shopper': return 'Khách mua sắm';
        case 'associate': return 'Nhân viên';
        case 'manager': return 'Quản lý';
        case 'admin': return 'Quản trị viên';
        default: return 'Quản lý';
      }
    }

    // Role switching handler
    switchRole(role) {
      SS_Store.setCurrentRole(role);
      this.toast(`Đã chuyển sang vai trò: ${this.getRoleVietnameseName(role)}`, 'info');

      // Tự động chuyển đến màn hình đặc trưng của role nếu đang ở trang không phù hợp
      const currentFile = this.getCurrentPageFile();
      const roleHomePages = {
        shopper: 'shopper-product-search.html',
        associate: 'associate-zone-view.html',
        manager: 'manager-store-dashboard.html',
        admin: 'admin-product-management.html'
      };

      if (currentFile.startsWith('shopper-') && role !== 'shopper') {
        window.location.href = roleHomePages[role];
      } else if (currentFile.startsWith('associate-') && role !== 'associate') {
        window.location.href = roleHomePages[role];
      } else if (currentFile.startsWith('manager-') && role !== 'manager') {
        window.location.href = roleHomePages[role];
      } else if (currentFile.startsWith('admin-') && role !== 'admin') {
        window.location.href = roleHomePages[role];
      } else {
        window.location.reload();
      }
    }

    onRoleChanged(role) {
      const label = document.getElementById('role-btn-label');
      if (label) label.textContent = this.getRoleVietnameseName(role);
    }

    // Toggle menu dropdowns
    toggleRoleMenu() {
      const popup = document.getElementById('role-menu-popup');
      if (popup) {
        popup.classList.toggle('show');
        const notif = document.getElementById('notif-flyout');
        if (notif) notif.classList.remove('show');
      }
    }

    toggleNotifFlyout() {
      const flyout = document.getElementById('notif-flyout');
      if (flyout) {
        flyout.classList.toggle('show');
        const role = document.getElementById('role-menu-popup');
        if (role) role.classList.remove('show');
        if (flyout.classList.contains('show')) {
          this.renderNotifList();
        }
      }
    }

    renderNotifList() {
      const listContainer = document.getElementById('notif-flyout-list');
      if (!listContainer) return;
      const notifications = SS_Store.all('notifications') || [];

      if (!notifications.length) {
        listContainer.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:0.85rem">Không có thông báo mới.</div>';
        return;
      }

      listContainer.innerHTML = notifications.slice(0, 5).map(n => `
        <div class="notif-item ${!n.read ? 'unread' : ''}" onclick="window.location.href='${n.actionUrl || 'notifications.html'}'">
          <div class="notif-item-icon" style="background-color:${n.type === 'ai_alert' ? '#fef2f2' : n.type === 'restock' ? '#fffbeb' : '#ecfdf5'}">
            ${n.type === 'ai_alert' ? '🚨' : n.type === 'restock' ? '📦' : '✓'}
          </div>
          <div class="notif-item-body">
            <div class="notif-item-title">${n.title}</div>
            <div class="notif-item-desc">${n.content}</div>
            <div class="notif-item-time">${n.time}</div>
          </div>
        </div>
      `).join('');
    }

    updateNotificationBadge() {
      const countBadge = document.getElementById('header-notif-count');
      if (!countBadge) return;
      const unreadCount = (SS_Store.all('notifications') || []).filter(n => !n.read).length;
      countBadge.textContent = unreadCount;
      countBadge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
    }

    toggleSidebarCollapse() {
      const sidebar = document.getElementById('main-sidebar');
      if (sidebar) {
        if (window.matchMedia('(max-width: 768px)').matches) {
          this.toggleMobileSidebar(false);
          return;
        }

        const collapsed = sidebar.classList.toggle('collapsed');
        const button = sidebar.querySelector('.sidebar-collapse-btn');
        if (button) {
          button.title = collapsed ? 'Mở rộng menu' : 'Thu gọn menu';
          button.setAttribute('aria-label', button.title);
          button.setAttribute('aria-expanded', String(!collapsed));
        }
      }
    }

    toggleMobileSidebar(open) {
      const sidebar = document.getElementById('main-sidebar');
      const backdrop = document.getElementById('sidebar-backdrop');
      if (sidebar && backdrop) {
        if (open) {
          sidebar.classList.add('mobile-open');
          backdrop.classList.add('show');
        } else {
          sidebar.classList.remove('mobile-open');
          backdrop.classList.remove('show');
        }
      }
    }

    // Toast Notifications
    toast(message, type = 'success', duration = 3500) {
      const container = document.getElementById('toast-container');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      
      const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
      };

      toast.innerHTML = `
        <span style="font-size:1.1rem">${icons[type] || '🔔'}</span>
        <div style="flex:1">
          <div style="font-size:0.85rem;font-weight:600;color:var(--text-main)">${message}</div>
        </div>
        <button style="background:none;border:none;cursor:pointer;color:var(--text-muted);font-size:0.9rem" onclick="this.parentElement.remove()">✕</button>
      `;

      container.appendChild(toast);

      setTimeout(() => {
        if (toast.parentElement) {
          toast.style.opacity = '0';
          toast.style.transform = 'translateY(10px)';
          toast.style.transition = 'all 0.25s ease';
          setTimeout(() => toast.remove(), 250);
        }
      }, duration);
    }

    // Modal Manager
    showModal({ title, body, footer, size = '' }) {
      const slot = document.getElementById('global-modal-slot');
      if (!slot) return;

      slot.innerHTML = `
        <div class="modal-backdrop show" id="global-modal-backdrop" onclick="if(event.target===this) SS_App.closeModal()">
          <div class="modal-dialog ${size === 'lg' ? 'modal-lg' : ''}">
            <div class="modal-header">
              <div class="modal-title">${title}</div>
              <button class="modal-close-btn" onclick="SS_App.closeModal()">✕</button>
            </div>
            <div class="modal-body">${body}</div>
            ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
          </div>
        </div>
      `;
    }

    closeModal() {
      const slot = document.getElementById('global-modal-slot');
      if (slot) slot.innerHTML = '';
    }

    confirm({ title, message, confirmText = 'Xác nhận', cancelText = 'Hủy bỏ', onConfirm }) {
      this.showModal({
        title: title || 'Xác nhận thao tác',
        body: `<p style="font-size:0.95rem;color:var(--text-secondary)">${message}</p>`,
        footer: `
          <button class="btn btn-secondary" onclick="SS_App.closeModal()">${cancelText}</button>
          <button class="btn btn-primary" id="modal-confirm-btn">${confirmText}</button>
        `
      });

      document.getElementById('modal-confirm-btn').onclick = () => {
        this.closeModal();
        if (typeof onConfirm === 'function') onConfirm();
      };
    }

    // Global Event Listeners
    bindGlobalEvents() {
      // Đóng dropdown khi click ra ngoài
      document.addEventListener('click', (e) => {
        const roleTrigger = document.getElementById('role-menu-trigger');
        const rolePopup = document.getElementById('role-menu-popup');
        if (roleTrigger && rolePopup && !roleTrigger.contains(e.target) && !rolePopup.contains(e.target)) {
          rolePopup.classList.remove('show');
        }

        const notifBtn = document.getElementById('notif-trigger-btn');
        const notifFlyout = document.getElementById('notif-flyout');
        if (notifBtn && notifFlyout && !notifBtn.contains(e.target) && !notifFlyout.contains(e.target)) {
          notifFlyout.classList.remove('show');
        }

        const searchBox = document.querySelector('.ss-header-search');
        const searchResults = document.getElementById('global-search-results');
        if (searchBox && searchResults && !searchBox.contains(e.target)) {
          searchResults.classList.remove('show');
        }
      });

      // Phím tắt Ctrl + K để focus search
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          const searchInput = document.getElementById('global-search-input');
          if (searchInput) searchInput.focus();
        }
      });

      // Xử lý ô tìm kiếm toàn cục
      const searchInput = document.getElementById('global-search-input');
      const searchResults = document.getElementById('global-search-results');
      if (searchInput && searchResults) {
        searchInput.addEventListener('input', (e) => {
          const val = e.target.value.trim().toLowerCase();
          if (!val) {
            searchResults.classList.remove('show');
            return;
          }

          const matchedProducts = SS_Store.searchProducts({ query: val }).slice(0, 4);
          const matchedShelves = SS_Store.all('shelves').filter(s => s.code.toLowerCase().includes(val)).slice(0, 2);
          const matchedTasks = SS_Store.all('restockTasks').filter(task =>
            ['pending', 'high_priority', 'in_progress', 'on_hold'].includes(task.status) &&
            [task.code, task.productName, task.shelfCode].some(value => value && value.toLowerCase().includes(val))
          ).slice(0, 3);

          if (!matchedProducts.length && !matchedShelves.length && !matchedTasks.length) {
            searchResults.innerHTML = '<div style="padding:10px;text-align:center;color:var(--text-muted);font-size:0.82rem">Không tìm thấy kết quả phù hợp.</div>';
            searchResults.classList.add('show');
            return;
          }

          let html = '';
          if (matchedProducts.length) {
            html += '<div class="role-menu-header">Sản phẩm tìm thấy</div>';
            matchedProducts.forEach(p => {
              html += `
                <div class="role-option-item" onclick="window.location.href='shopper-product-location.html?sku=${p.sku}'">
                  <div>
                    <strong>${p.name}</strong>
                    <div style="font-size:0.75rem;color:var(--text-muted)">${p.sku} · Kệ ${p.shelfCode} · ${p.price.toLocaleString('vi-VN')} đ</div>
                  </div>
                  <span class="badge ${p.stock > 0 ? 'badge-success' : 'badge-danger'}">${p.stock > 0 ? 'Còn hàng' : 'Hết hàng'}</span>
                </div>
              `;
            });
          }

          if (matchedShelves.length) {
            html += '<div class="role-menu-header">Kệ hàng</div>';
            matchedShelves.forEach(s => {
              html += `
                <div class="role-option-item" onclick="window.location.href='associate-shelf-check.html?shelf=${s.code}'">
                  <div>
                    <strong>Kệ ${s.code}</strong> (${s.zoneName})
                    <div style="font-size:0.75rem;color:var(--text-muted)">Sức chứa: ${s.currentItems}/${s.capacity} món</div>
                  </div>
                  <span class="badge badge-info">Kiểm kê</span>
                </div>
              `;
            });
          }

          if (matchedTasks.length) {
            html += '<div class="role-menu-header">Nhiệm vụ bổ sung</div>';
            matchedTasks.forEach(task => {
              html += `
                <div class="role-option-item" onclick="window.location.href='associate-restock-task.html'">
                  <div>
                    <strong>${task.code} · ${task.productName}</strong>
                    <div style="font-size:0.75rem;color:var(--text-muted)">Kệ ${task.shelfCode} · ${task.statusLabel || task.status}</div>
                  </div>
                  <span class="badge badge-warning">Mở việc</span>
                </div>
              `;
            });
          }

          searchResults.innerHTML = html;
          searchResults.classList.add('show');
        });
      }
    }

    // Helper formatters
    formatMoney(amount) {
      return (Number(amount) || 0).toLocaleString('vi-VN') + ' đ';
    }

    formatDate(isoString) {
      if (!isoString) return '—';
      const d = new Date(isoString);
      return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} ${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    }

    downloadCsv(filename, headers, rows) {
      const escapeCell = value => {
        const text = value === null || value === undefined ? '' : String(value);
        const safeText = /^[\t\r\n ]*[=+@-]/.test(text) ? `'${text}` : text;
        return `"${safeText.replace(/"/g, '""')}"`;
      };
      const csv = [headers, ...rows].map(row => row.map(escapeCell).join(',')).join('\r\n');
      const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      this.toast(`Đã tải báo cáo ${filename}.`, 'success');
    }
  }

  window.SS_App = new SmartShelfApp();
})();
