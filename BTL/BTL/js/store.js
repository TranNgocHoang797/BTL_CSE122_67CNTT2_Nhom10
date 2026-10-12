/**
 * SmartShelf RetailTech OS - Quản lý trạng thái và dữ liệu (Store Manager)
 * Lưu trữ bền vững qua LocalStorage, cung cấp CRUD và các tiện ích nghiệp vụ
 */
(function() {
  'use strict';

  const STORAGE_KEY = 'SMARTSHELF_DB_2026_V1';
  const ROLE_KEY = 'SMARTSHELF_CURRENT_ROLE';
  const USER_KEY = 'SMARTSHELF_CURRENT_USER';
  const LEGACY_PRODUCT_IMAGES = {
    'SKU-1001': ['photo-1586201375761-83865001e31c', '20250706153131_686a3463a3d29.png'],
    'SKU-1002': ['photo-1612927601601-6638404737ce', 'Five_packs_of_shrimp', 'sku-1002-noodles.jpg'],
    'SKU-1003': ['photo-1472476443507-c7a5948772fc', 'Lao_fish_sauce.jpg', 'sku-1003-fish-sauce.jpg'],
    'SKU-1004': ['photo-1474979266404-7eaacbcd87c5'],
    'SKU-1005': ['photo-1558961363-fa8fdf82db35'],
    'SKU-1006': ['photo-1514432324607-a09d9b4aefdd'],
    'SKU-1007': ['photo-1556679343-c7306c1976bc'],
    'SKU-1008': ['photo-1602143407151-7111542de6e8', 'photo-1550583724-b2692b85b150', 'photo-1559591937-e1045fb9633e', 'photo-1548839140-29a749e1bc4e'],
    'SKU-1009': ['photo-1563636619-e9143da7973b', 'photo-1550583724-b2692b85b150', 'Milk_carton.jpg'],
    'SKU-1010': ['photo-1608270586620-248524c67de9', 'Tiger_-_Asian_Lager'],
    'SKU-1011': ['photo-1535585209827-a15fcdbc4c2d'],
    'SKU-1012': ['photo-1522337360788-8b13dee7a37e'],
    'SKU-1013': ['photo-1588776814546-1ffcf47267a5'],
    'SKU-1014': ['photo-1584556812952-905ffd0c611a'],
    'SKU-1015': ['photo-1585832770485-e68a5dbfad52'],
    'SKU-1016': ['photo-1610557892470-55d9e80c0bce'],
    'SKU-1017': ['photo-1474979266404-7eaacbcd87c5', '2022_sunflower_oil'],
    'SKU-1018': ['photo-1474979266404-7eaacbcd87c5'],
    'SKU-1019': ['photo-1499636136210-6f4ee915583e'],
    'SKU-1020': ['photo-1558961363-fa8fdf82db35']
  };
  const LEGACY_PRODUCT_NAMES = {
    'SKU-1001': ['Gạo ST25 Ông Cua Túi 5kg'],
    'SKU-1002': ['Mì Tôm Hảo Hảo Chua Cay Thùng 30 Gói'],
    'SKU-1003': ['Nước Mắm Nam Ngư Cá Hồi 500ml'],
    'SKU-1005': ['Bánh Quy Bơ Cosy Marie Kinh Đô 288g'],
    'SKU-1006': ['Cà Phê Hòa Tan G7 3in1 Hộp 50 Gói'],
    'SKU-1007': ['Trà Xanh Không Độ Chai 500ml'],
    'SKU-1009': ['Sữa Tươi Tiệt Trùng TH True Milk 1L'],
    'SKU-1010': ['Bia Tiger Crystal Lon 330ml Thùng 24'],
    'SKU-1011': ['Dầu Gội Sạch Gàu Clear Men Bạc Hà 630g'],
    'SKU-1012': ['Sữa Tắm Dưỡng Ẩm Chuyên Sâu Dove 500g'],
    'SKU-1013': ['Kem Đánh Răng P/S Bảo Vệ 123 Than Hoạt Tính 230g'],
    'SKU-1014': ['Khăn Giấy Lụa Bless You Lốc 10 Cuộn'],
    'SKU-1015': ['Nước Rửa Chén Sunlight Chanh Chai 750g'],
    'SKU-1016': ['Nước Giặt OMO Matic Cửa Trên Túi 3.6kg'],
    'SKU-1017': ['Dầu Ăn Hướng Dương Nga Kubanochka Chai 1L'],
    'SKU-1018': ['Dầu Thực Vật Tinh Luyện Neptune Gold 1L'],
    'SKU-1020': ['Bánh Quy AFC Dinh Dưỡng Vị Rau Cải 200g']
  };

  class SmartShelfStore {
    constructor() {
      this.init();
    }

    init() {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (!existing) {
        this.resetToSeed();
      } else {
        try {
          this.data = JSON.parse(existing);
          // Chỉ cập nhật ảnh mẫu cũ đã biết, giữ nguyên ảnh người dùng tự chọn.
          if (this.data && Array.isArray(this.data.products)) {
            let changed = false;
            const seedProducts = window.SMARTSHELF_SEED && window.SMARTSHELF_SEED.products || [];
            this.data.products.forEach(product => {
              const oldImageIds = LEGACY_PRODUCT_IMAGES[product.sku] || [];
              const oldNames = LEGACY_PRODUCT_NAMES[product.sku] || [];
              const seedProduct = seedProducts.find(item => item.sku === product.sku);
              if (seedProduct && product.image && oldImageIds.some(imageId => product.image.includes(imageId))) {
                product.image = seedProduct.image;
                changed = true;
              }
              if (seedProduct && oldNames.includes(product.name)) {
                product.name = seedProduct.name;
                product.brand = seedProduct.brand;
                changed = true;
              }
            });
            if (Array.isArray(this.data.restockTasks)) {
              this.data.restockTasks.forEach(task => {
                const oldImageIds = LEGACY_PRODUCT_IMAGES[task.sku] || [];
                const oldNames = LEGACY_PRODUCT_NAMES[task.sku] || [];
                const seedProduct = seedProducts.find(item => item.sku === task.sku);
                if (seedProduct && (!task.productImage || oldImageIds.some(imageId => task.productImage.includes(imageId)))) {
                  task.productImage = seedProduct.image;
                  changed = true;
                }
                if (seedProduct && oldNames.includes(task.productName)) {
                  task.productName = seedProduct.name;
                  changed = true;
                }
              });
            }
            ['shelfChecks', 'anomalies'].forEach(collection => {
              if (!Array.isArray(this.data[collection])) return;
              this.data[collection].forEach(record => {
                const oldNames = LEGACY_PRODUCT_NAMES[record.sku] || [];
                const seedProduct = seedProducts.find(item => item.sku === record.sku);
                if (seedProduct && oldNames.includes(record.productName)) {
                  record.productName = seedProduct.name;
                  changed = true;
                }
              });
            });
            if (changed) this.save();
          }
        } catch (e) {
          console.error('Lỗi khi tải dữ liệu LocalStorage, nạp lại dữ liệu mẫu:', e);
          this.resetToSeed();
        }
      }

      // Khởi tạo vai trò mặc định nếu chưa có
      if (!localStorage.getItem(ROLE_KEY)) {
        localStorage.setItem(ROLE_KEY, 'manager'); // Mặc định Quản lý để xem toàn cảnh hệ thống
      }

      // Khởi tạo người dùng đăng nhập hiện tại
      if (!localStorage.getItem(USER_KEY)) {
        const defaultUser = this.data.users.find(u => u.role === 'manager') || this.data.users[0];
        localStorage.setItem(USER_KEY, JSON.stringify(defaultUser));
      }
    }

    save() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        window.dispatchEvent(new CustomEvent('smartshelf:data-change', { detail: { data: this.data } }));
      } catch (e) {
        console.error('Lỗi khi lưu vào LocalStorage:', e);
      }
    }

    resetToSeed() {
      this.data = JSON.parse(JSON.stringify(window.SMARTSHELF_SEED || {}));
      this.save();
      console.log('SmartShelf: Đã khôi phục dữ liệu mẫu thành công.');
    }

    // Role & Session management
    getCurrentRole() {
      return localStorage.getItem(ROLE_KEY) || 'manager';
    }

    setCurrentRole(role) {
      localStorage.setItem(ROLE_KEY, role);
      // Tìm người dùng đại diện cho role này
      const user = this.data.users.find(u => u.role === role) || this.data.users[0];
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }
      window.dispatchEvent(new CustomEvent('smartshelf:role-change', { detail: { role, user } }));
    }

    getCurrentUser() {
      try {
        return JSON.parse(localStorage.getItem(USER_KEY)) || this.data.users[0];
      } catch (e) {
        return this.data.users[0];
      }
    }

    setCurrentUser(user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      if (user && user.role) {
        localStorage.setItem(ROLE_KEY, user.role);
      }
      window.dispatchEvent(new CustomEvent('smartshelf:role-change', { detail: { role: user.role, user } }));
    }

    // Generic CRUD
    all(collection) {
      return this.data[collection] || [];
    }

    find(collection, predicate) {
      const items = this.all(collection);
      return items.find(predicate);
    }

    filter(collection, predicate) {
      const items = this.all(collection);
      return items.filter(predicate);
    }

    getById(collection, id) {
      return (this.data[collection] || []).find(item => item.id === id);
    }

    insert(collection, item) {
      if (!this.data[collection]) {
        this.data[collection] = [];
      }
      if (!item.id) {
        const prefix = collection.substring(0, 3).toUpperCase();
        const baseId = `${prefix}-${Date.now().toString(36)}`;
        let candidateId = baseId;
        let suffix = 1;
        while (this.data[collection].some(existing => existing.id === candidateId)) {
          candidateId = `${baseId}-${suffix++}`;
        }
        item.id = candidateId;
      }
      this.data[collection].unshift(item);
      this.save();
      return item;
    }

    update(collection, id, updates) {
      if (!this.data[collection]) return null;
      const index = this.data[collection].findIndex(item => item.id === id);
      if (index === -1) return null;

      this.data[collection][index] = { ...this.data[collection][index], ...updates };
      this.save();
      return this.data[collection][index];
    }

    remove(collection, id) {
      if (!this.data[collection]) return false;
      const initialLength = this.data[collection].length;
      this.data[collection] = this.data[collection].filter(item => item.id !== id);
      const changed = this.data[collection].length !== initialLength;
      if (changed) this.save();
      return changed;
    }

    archive(collection, id) {
      return this.update(collection, id, { status: 'archived', archivedAt: new Date().toISOString() });
    }

    completeRestockTask(id) {
      const task = this.getById('restockTasks', id);
      if (!task) return false;
      if (task.stockApplied) {
        this.update('restockTasks', id, { status: 'completed', statusLabel: 'Hoàn thành' });
        return true;
      }
      if (task.status === 'completed') return true;

      const product = this.find('products', item => item.sku === task.sku);
      if (!product) return false;

      const quantity = Math.max(0, Number(task.neededQty) || 0);
      const newStock = product.stock + quantity;
      this.update('products', product.id, {
        stock: newStock,
        status: newStock === 0 ? 'out_of_stock' : newStock <= product.minStock ? 'low_stock' : 'in_stock'
      });

      const shelf = this.find('shelves', item => item.code === task.shelfCode);
      if (shelf) {
        const currentItems = Math.min(shelf.capacity, (shelf.currentItems || 0) + quantity);
        const fillRate = currentItems / (shelf.capacity || 1);
        this.update('shelves', shelf.id, {
          currentItems,
          status: currentItems === 0 ? 'empty' : fillRate <= 0.2 ? 'critical' : fillRate <= 0.4 ? 'low' : 'normal',
          lastCheckedAt: new Date().toISOString()
        });
      }

      this.update('restockTasks', id, {
        status: 'completed',
        statusLabel: 'Hoàn thành',
        currentQty: newStock,
        stockApplied: true,
        completedAt: new Date().toISOString()
      });
      return true;
    }

    // Business Queries & Analytics Helpers
    getMetrics() {
      const products = this.all('products');
      const restockTasks = this.all('restockTasks');
      const shelves = this.all('shelves');
      const zones = this.all('zones');
      const anomalies = this.all('anomalies');

      const totalProducts = products.length;
      const lowStockProducts = products.filter(p => p.status === 'low_stock').length;
      const outOfStockProducts = products.filter(p => p.status === 'out_of_stock' || p.stock === 0).length;
      const inStockProducts = products.filter(p => p.status === 'in_stock' && p.stock > 0).length;

      const activeTasks = restockTasks.filter(t => ['pending', 'high_priority', 'in_progress', 'on_hold'].includes(t.status)).length;
      const completedTasks = restockTasks.filter(t => t.status === 'completed').length;
      const rejectedTasks = restockTasks.filter(t => ['rejected', 'cancelled'].includes(t.status)).length;

      const problemShelves = shelves.filter(s => s.status === 'empty' || s.status === 'critical' || s.status === 'low').length;
      const emptyShelves = shelves.filter(s => s.status === 'empty' || s.currentItems === 0).length;
      
      const activeAnomalies = anomalies.filter(a => a.status === 'active').length;

      // Tính trung bình On-shelf availability %
      const avgAvailability = Math.round(
        zones.reduce((acc, z) => acc + (z.currentAvailability || 90), 0) / (zones.length || 1)
      );

      return {
        totalProducts,
        lowStockProducts,
        outOfStockProducts,
        inStockProducts,
        activeTasks,
        completedTasks,
        rejectedTasks,
        problemShelves,
        emptyShelves,
        activeAnomalies,
        avgAvailability
      };
    }

    // Lấy thông tin chi tiết một sản phẩm theo SKU hoặc ID kèm thông tin Kệ và Khu vực
    getProductDetail(skuOrId) {
      const p = this.find('products', item => item.sku === skuOrId || item.id === skuOrId);
      if (!p) return null;

      const shelf = this.find('shelves', s => s.code === p.shelfCode);
      const zone = this.find('zones', z => z.id === p.zoneId);

      return {
        ...p,
        shelfDetail: shelf,
        zoneDetail: zone
      };
    }

    // Tìm kiếm và lọc sản phẩm cho Khách mua sắm
    searchProducts(options = {}) {
      let list = this.all('products').filter(product => product.status !== 'archived');
      const { query, category, brand, stock, zoneId, minPrice, maxPrice, sortBy } = options;

      if (query && query.trim()) {
        const q = query.trim().toLowerCase();
        list = list.filter(p => 
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.shelfCode && p.shelfCode.toLowerCase().includes(q))
        );
      }

      if (category && category !== 'all') {
        list = list.filter(p => p.category === category);
      }

      if (brand && brand !== 'all') {
        list = list.filter(p => p.brand === brand);
      }

      if (stock && stock !== 'all') {
        list = list.filter(p => p.status === stock);
      }

      if (zoneId && zoneId !== 'all') {
        list = list.filter(p => p.zoneId === zoneId);
      }

      if (minPrice !== undefined && minPrice !== '') {
        list = list.filter(p => p.price >= Number(minPrice));
      }

      if (maxPrice !== undefined && maxPrice !== '') {
        list = list.filter(p => p.price <= Number(maxPrice));
      }

      // Sắp xếp
      if (sortBy === 'price_asc') {
        list.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price_desc') {
        list.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'name_asc') {
        list.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
      } else if (sortBy === 'stock_desc') {
        list.sort((a, b) => b.stock - a.stock);
      }

      return list;
    }

    // Thêm thông báo mới
    addNotification(notif) {
      return this.insert('notifications', {
        id: 'NOTIF-' + Date.now().toString(36),
        time: 'Vừa xong',
        read: false,
        targetRole: ['all'],
        ...notif
      });
    }

    markAllNotificationsAsRead() {
      if (!this.data.notifications) return;
      this.data.notifications.forEach(n => { n.read = true; });
      this.save();
    }
  }

  window.SS_Store = new SmartShelfStore();
})();
