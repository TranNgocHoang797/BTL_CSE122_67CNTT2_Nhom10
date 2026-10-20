/**
 * SmartShelf RetailTech OS - Trải nghiệm AI tích hợp (AI Intelligence Engine)
 * Bao phủ 3 tính năng AI cốt lõi và 5 trạng thái:
 * 1. Đang phân tích (Analyzing)
 * 2. Kết quả (Result)
 * 3. Không đủ dữ liệu (Insufficient Data)
 * 4. Độ tin cậy thấp (Low Confidence)
 * 5. Lỗi (Error)
 * Hỗ trợ các hành vi người dùng: Chấp nhận, Chỉnh sửa, Từ chối, Thử lại, Lưu kết quả
 */
(function() {
  'use strict';

  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  class SmartShelfAI {
    constructor() {
      this.simulationMode = 'normal'; // normal | low_confidence | insufficient_data | error
    }

    setSimulationMode(mode) {
      this.simulationMode = mode;
      console.log('AI Simulation Mode changed to:', mode);
    }

    /* =========================================================================
       1. AI RESTOCK PRIORITY (Xếp hạng & Đề xuất ưu tiên bổ sung hàng)
       ========================================================================= */
    async analyzeRestockPriority(options = {}) {
      const mode = options.forceMode || this.simulationMode;
      const outOfStockWeight = options.outOfStockWeight ?? 3;
      const prioritizePeakHours = options.prioritizePeakHours ?? true;
      await wait(750); // Giả lập phân tích thời gian thực

      if (mode === 'error') {
        throw new Error('Không thể kết nối đến máy chủ AI Edge Server tại trạm điều hành. Vui lòng kiểm tra kết nối mạng cục bộ.');
      }

      if (mode === 'insufficient_data') {
        return {
          status: 'insufficient_data',
          title: 'Không đủ dữ liệu lịch sử để dự báo chính xác',
          message: 'Khu vực hoặc nhóm kệ này mới đưa vào vận hành dưới 48 giờ. Thuật toán AI cần tối thiểu 15 lượt giao dịch để huấn luyện trọng số tiêu thụ.',
          fallbackAction: 'Chuyển sang chế độ lập danh sách bổ sung thủ công dựa trên số lượng tồn tối thiểu.'
        };
      }

      const products = SS_Store.all('products').filter(product => product.status !== 'archived');
      const shelves = SS_Store.all('shelves');
      const zones = SS_Store.all('zones');
      const currentTasks = SS_Store.all('restockTasks').filter(t => ['pending', 'high_priority', 'in_progress'].includes(t.status));

      // Thuật toán chấm điểm ưu tiên dựa trên:
      // Gap thiếu hụt (minStock - stock), tỷ lệ hết sạch, tốc độ bán (velocity), traffic khu vực, và thời gian kể từ lần kiểm kê cuối
      const rankedShelves = shelves.map(shelf => {
        const shelfProducts = products.filter(p => p.shelfCode === shelf.code);
        if (!shelfProducts.length) return null;

        let totalGap = 0;
        let outOfStockCount = 0;
        let avgVelocity = 0;

        shelfProducts.forEach(p => {
          const gap = Math.max(0, (p.minStock || 15) - p.stock);
          totalGap += gap;
          if (p.stock <= 0) outOfStockCount++;
          avgVelocity += (p.salesVelocity || 2);
        });

        const zone = zones.find(z => z.id === shelf.zoneId);
        const zoneTrafficWeight = zone && zone.trafficScore.includes('Rất cao') ? 1.4 : zone && zone.trafficScore.includes('Cao') ? 1.2 : 1.0;

        // Tính điểm ưu tiên (0 - 100)
        let priorityScore = Math.round(
          (totalGap * 1.8) +
          (outOfStockCount * (28 * outOfStockWeight / 3)) +
          (avgVelocity * (prioritizePeakHours ? 2.2 : 1)) * zoneTrafficWeight
        );
        priorityScore = Math.min(100, Math.max(15, priorityScore));

        let confidence = mode === 'low_confidence' ? Math.floor(Math.random() * 15 + 40) : Math.floor(Math.random() * 8 + 88);

        // Lý do XAI (Explainable AI)
        const reasons = [];
        if (outOfStockCount > 0) {
          reasons.push(`Có ${outOfStockCount} sản phẩm hết hàng hoàn toàn (0 tồn kho) gây gián đoạn mua sắm.`);
        }
        if (totalGap > 10) {
          reasons.push(`Tổng lượng thiếu hụt đạt ${totalGap} đơn vị so với ngưỡng định mức tối thiểu.`);
        }
        reasons.push(`Tốc độ tiêu thụ trung bình ${avgVelocity.toFixed(1)} món/ngày tại ${shelf.zoneName}.`);
        if (zoneTrafficWeight > 1) {
          reasons.push(`Khu vực thuộc hành lang lưu lượng khách ${zone.trafficScore}.`);
        }

        const topUrgentProduct = shelfProducts.sort((a, b) => a.stock - b.stock)[0];

        return {
          shelfId: shelf.id,
          shelfCode: shelf.code,
          zoneId: shelf.zoneId,
          zoneName: shelf.zoneName,
          priorityScore,
          confidence,
          outOfStockCount,
          totalGap,
          productCount: shelfProducts.length,
          topProduct: topUrgentProduct,
          reasons,
          hasActiveTask: currentTasks.some(t => t.shelfCode === shelf.code),
          suggestedQty: totalGap || 15,
          priorityTier: priorityScore >= 80 ? 'critical' : priorityScore >= 60 ? 'high' : priorityScore >= 40 ? 'medium' : 'low',
          priorityTierLabel: priorityScore >= 80 ? 'Khẩn cấp' : priorityScore >= 60 ? 'Ưu tiên cao' : priorityScore >= 40 ? 'Trung bình' : 'Tiêu chuẩn'
        };
      }).filter(Boolean);

      // Sắp xếp kệ có điểm số cao nhất lên đầu
      rankedShelves.sort((a, b) => b.priorityScore - a.priorityScore);

      return {
        status: mode === 'low_confidence' ? 'low_confidence' : 'success',
        confidenceScore: mode === 'low_confidence' ? 44 : 94,
        totalShelvesScanned: shelves.length,
        criticalCount: rankedShelves.filter(s => s.priorityScore >= 80).length,
        recommendations: rankedShelves.slice(0, 5),
        generatedAt: new Date().toLocaleTimeString('vi-VN')
      };
    }

    /* =========================================================================
       2. AI PRODUCT ALTERNATIVE (Gợi ý sản phẩm thay thế khi hết hàng)
       ========================================================================= */
    async findProductAlternatives(targetSku, options = {}) {
      const mode = options.forceMode || this.simulationMode;
      await wait(600);

      if (mode === 'error') {
        throw new Error('Hệ thống gợi ý sản phẩm thay thế AI đang bảo trì hoặc mất kết nối API.');
      }

      const baseProduct = SS_Store.find('products', p => p.sku === targetSku) || SS_Store.all('products')[3]; // Dầu ăn Simply làm mẫu

      if (mode === 'insufficient_data') {
        return {
          status: 'insufficient_data',
          baseProduct,
          message: `Chưa có đủ thông tin tương quan cho danh mục “${baseProduct.category}”. Hệ thống chưa thể tính toán độ phù hợp người tiêu dùng.`
        };
      }

      // Lấy các sản phẩm cùng danh mục và còn hàng
      const candidates = SS_Store.all('products').filter(p => 
        p.status !== 'archived' &&
        p.sku !== baseProduct.sku &&
        p.category === baseProduct.category &&
        p.stock > 0
      );

      // Nếu không có cùng danh mục, mở rộng sang danh mục gần
      let pool = candidates.length ? candidates : SS_Store.all('products').filter(p => p.status !== 'archived' && p.stock > 0 && p.sku !== baseProduct.sku);

      const isLowConfidence = mode === 'low_confidence';

      const results = pool.map(candidate => {
        // Tính độ tương đồng về giá
        const priceDiff = Math.abs(candidate.price - baseProduct.price);
        const priceDiffPercent = Math.round((priceDiff / (baseProduct.price || 1)) * 100);

        // Điểm thương hiệu
        const sameBrand = candidate.brand === baseProduct.brand;

        // Điểm vị trí kệ gần nhau (cùng zone)
        const sameZone = candidate.zoneId === baseProduct.zoneId;

        let matchScore = 100 - (priceDiffPercent * 0.4) + (sameBrand ? 15 : 0) + (sameZone ? 10 : 0);
        matchScore = Math.min(99, Math.max(isLowConfidence ? 38 : 55, Math.round(matchScore)));

        let confidence = isLowConfidence ? Math.floor(Math.random() * 15 + 35) : Math.floor(Math.random() * 8 + 89);

        // Lý do đề xuất minh bạch (XAI)
        const reasons = [];
        reasons.push(`Cùng phân khúc “${candidate.category}”, công dụng và chất lượng tương đương.`);
        
        if (priceDiffPercent <= 10) {
          reasons.push(`Giá bán chênh lệch chỉ ${priceDiffPercent}% (${candidate.price > baseProduct.price ? 'cao hơn' : 'tiết kiệm'} ${(priceDiff).toLocaleString('vi-VN')} đ).`);
        } else {
          reasons.push(`Giá bán ${candidate.price.toLocaleString('vi-VN')} đ (chênh lệch ${priceDiffPercent}% so với gốc).`);
        }

        if (sameZone) {
          reasons.push(`Đang có sẵn tại kệ ${candidate.shelfCode} ngay trong ${candidate.zoneName} (khách không phải đi xa).`);
        } else {
          reasons.push(`Vị trí tại kệ ${candidate.shelfCode} (${candidate.zoneName}) với ${candidate.stock} ${candidate.unit} có sẵn.`);
        }

        if (sameBrand) {
          reasons.push(`Cùng thương hiệu uy tín ${candidate.brand} được khách hàng tin dùng.`);
        } else {
          reasons.push(`Thương hiệu ${candidate.brand} được 92% người tiêu dùng đánh giá tích cực.`);
        }

        return {
          product: candidate,
          matchScore,
          confidence,
          reasons,
          distanceFromOriginal: sameZone ? 'Cùng dãy (dưới 5 mét)' : 'Cách 1 lối đi'
        };
      });

      results.sort((a, b) => b.matchScore - a.matchScore);

      return {
        status: isLowConfidence ? 'low_confidence' : 'success',
        baseProduct,
        confidenceScore: isLowConfidence ? 42 : 93,
        recommendations: results.slice(0, 3)
      };
    }

    /* =========================================================================
       3. AI SHELF ANOMALY INSIGHT (Phát hiện dị thường trên kệ hàng)
       ========================================================================= */
    async detectShelfAnomalies(options = {}) {
      const mode = options.forceMode || this.simulationMode;
      await wait(700);

      if (mode === 'error') {
        throw new Error('Lỗi đồng bộ mô hình Computer Vision / Point-of-Sale Anomaly Detector.');
      }

      if (mode === 'insufficient_data') {
        return {
          status: 'insufficient_data',
          message: 'Hệ thống kiểm toán AI cần thêm dữ liệu camera và hóa đơn POS trong ít nhất 1 ca làm việc để phân tích xu hướng bất thường.'
        };
      }

      const anomalies = SS_Store.all('anomalies').filter(anomaly => !anomaly.status || anomaly.status === 'active');
      const isLowConfidence = mode === 'low_confidence';

      return {
        status: isLowConfidence ? 'low_confidence' : 'success',
        confidenceScore: isLowConfidence ? 48 : 95,
        scanTimestamp: new Date().toLocaleTimeString('vi-VN'),
        totalScannedShelves: 12,
        anomaliesDetected: anomalies.map(a => ({
          ...a,
          confidence: isLowConfidence ? Math.floor(Math.random() * 15 + 40) : 94
        }))
      };
    }
  }

  window.SS_AI = new SmartShelfAI();
})();
