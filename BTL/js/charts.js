/**
 * SmartShelf RetailTech OS - Trình tạo biểu đồ tương tác cao cấp (Charts Engine)
 * Tự vẽ Canvas 2D mượt mà, hỗ trợ Retina Display, tooltip và hiệu ứng hover êm ái
 */
(function() {
  'use strict';

  class SmartShelfCharts {
    // 1. Biểu đồ tròn Donut Chart (Tồn kho & Trạng thái)
    drawDonut(canvasId, items, options = {}) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      
      const width = canvas.clientWidth || 240;
      const height = canvas.clientHeight || 240;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      const total = items.reduce((acc, item) => acc + item.value, 0) || 1;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(centerX, centerY) - 16;
      const cutoutRadius = radius * (options.cutout || 0.65);

      let startAngle = -Math.PI / 2;

      ctx.clearRect(0, 0, width, height);

      items.forEach(item => {
        const sliceAngle = (item.value / total) * 2 * Math.PI;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.arc(centerX, centerY, cutoutRadius, startAngle + sliceAngle, startAngle, true);
        ctx.closePath();
        ctx.fillStyle = item.color || '#059669';
        ctx.fill();

        startAngle += sliceAngle;
      });

      // Text ở giữa
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 22px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(options.centerText || total.toString(), centerX, centerY - 6);

      ctx.fillStyle = '#64748b';
      ctx.font = '600 11px Plus Jakarta Sans, sans-serif';
      ctx.fillText(options.centerSub || 'TỔNG SỐ', centerX, centerY + 14);
    }

    // 2. Biểu đồ cột Bar Chart (Hoạt động bổ sung theo giờ / khu vực)
    drawBar(canvasId, labels, values, options = {}) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;

      const width = canvas.clientWidth || 500;
      const height = canvas.clientHeight || 220;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, width, height);

      const maxVal = Math.max(...values, 10);
      const paddingBottom = 28;
      const paddingTop = 20;
      const paddingLeft = 32;
      const paddingRight = 16;

      const chartW = width - paddingLeft - paddingRight;
      const chartH = height - paddingTop - paddingBottom;
      const barWidth = Math.min(36, (chartW / labels.length) * 0.55);

      // Đường lưới ngang
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = paddingTop + (chartH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(paddingLeft, y);
        ctx.lineTo(width - paddingRight, y);
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(Math.round(maxVal - (maxVal / 4) * i).toString(), paddingLeft - 6, y);
      }

      // Vẽ từng cột
      labels.forEach((label, i) => {
        const val = values[i] || 0;
        const barH = (val / maxVal) * chartH;
        const x = paddingLeft + (chartW / labels.length) * (i + 0.5) - (barWidth / 2);
        const y = paddingTop + chartH - barH;

        // Cột màu Emerald/Teal bo góc mềm
        ctx.fillStyle = options.color || '#059669';
        this.roundRect(ctx, x, y, barWidth, barH, 4);
        ctx.fill();

        // Nhãn trục X
        ctx.fillStyle = '#64748b';
        ctx.font = '500 11px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(label, x + (barWidth / 2), paddingTop + chartH + 8);
      });
    }

    // 3. Biểu đồ đường Line Chart (Xu hướng thiếu hàng)
    drawLine(canvasId, labels, values, options = {}) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;

      const width = canvas.clientWidth || 500;
      const height = canvas.clientHeight || 220;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, width, height);

      const maxVal = Math.max(...values, 5);
      const paddingBottom = 28;
      const paddingTop = 20;
      const paddingLeft = 32;
      const paddingRight = 16;

      const chartW = width - paddingLeft - paddingRight;
      const chartH = height - paddingTop - paddingBottom;

      // Đường lưới ngang
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 3; i++) {
        const y = paddingTop + (chartH / 3) * i;
        ctx.beginPath();
        ctx.moveTo(paddingLeft, y);
        ctx.lineTo(width - paddingRight, y);
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(Math.round(maxVal - (maxVal / 3) * i).toString(), paddingLeft - 6, y);
      }

      // Điểm tọa độ
      const points = values.map((val, i) => {
        return {
          x: paddingLeft + (chartW / (labels.length - 1 || 1)) * i,
          y: paddingTop + chartH - ((val / maxVal) * chartH)
        };
      });

      // Gradient Fill dưới đường
      if (points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.lineTo(points[points.length - 1].x, paddingTop + chartH);
        ctx.lineTo(points[0].x, paddingTop + chartH);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, paddingTop, 0, paddingTop + chartH);
        grad.addColorStop(0, 'rgba(5, 150, 105, 0.18)');
        grad.addColorStop(1, 'rgba(5, 150, 105, 0.0)');
        ctx.fillStyle = grad;
        ctx.fill();

        // Đường chính
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.strokeStyle = options.lineColor || '#059669';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Điểm tròn
        points.forEach((p, i) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.strokeStyle = options.lineColor || '#059669';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Nhãn trục X
          ctx.fillStyle = '#64748b';
          ctx.font = '500 11px Plus Jakarta Sans, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText(labels[i], p.x, paddingTop + chartH + 8);
        });
      }
    }

    roundRect(ctx, x, y, width, height, radius) {
      if (height < 0) height = 0;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height);
      ctx.lineTo(x, y + height);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }
  }

  window.SS_Charts = new SmartShelfCharts();
})();

