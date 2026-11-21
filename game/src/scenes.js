function drawGear(ctx, cx, cy, outerR, innerR, teeth, fill, stroke, rot = 0) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.beginPath();
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a0 = i * step;
    const a1 = a0 + step * 0.22;
    const a2 = a0 + step * 0.5;
    const a3 = a0 + step * 0.72;
    if (i === 0) ctx.moveTo(Math.cos(a0) * innerR, Math.sin(a0) * innerR);
    else ctx.lineTo(Math.cos(a0) * innerR, Math.sin(a0) * innerR);
    ctx.lineTo(Math.cos(a1) * outerR, Math.sin(a1) * outerR);
    ctx.lineTo(Math.cos(a2) * outerR, Math.sin(a2) * outerR);
    ctx.lineTo(Math.cos(a3) * innerR, Math.sin(a3) * innerR);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = 1.6;
  ctx.strokeStyle = stroke;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, innerR * 0.38, 0, Math.PI * 2);
  ctx.fillStyle = '#1b1614';
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function drawWorkshopBase(ctx) {
  const bg = ctx.createLinearGradient(0, 0, 0, 540);
  bg.addColorStop(0, '#18141c');
  bg.addColorStop(0.65, '#261c18');
  bg.addColorStop(1, '#140f0d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 600, 540);

  ctx.fillStyle = '#2d211b';
  for (let x = 0; x < 600; x += 60) {
    ctx.fillRect(x, 0, 2, 370);
  }

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(46, 210);
  ctx.lineTo(46, 98);
  ctx.arc(106, 98, 60, Math.PI, 0);
  ctx.lineTo(166, 210);
  ctx.closePath();
  const winGrad = ctx.createLinearGradient(0, 38, 0, 210);
  winGrad.addColorStop(0, '#0d1b38');
  winGrad.addColorStop(1, '#1d345c');
  ctx.fillStyle = winGrad;
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#3b2920';
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(106, 38);
  ctx.lineTo(106, 210);
  ctx.moveTo(46, 134);
  ctx.lineTo(166, 134);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#3b2920';
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = '#fef3c7';
  for (const [sx, sy] of [[68, 86], [85, 62], [134, 72], [148, 108]]) {
    ctx.beginPath();
    ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#3d2a20';
  ctx.fillRect(205, 118, 360, 14);
  ctx.fillRect(225, 132, 12, 16);
  ctx.fillRect(530, 132, 12, 16);

  ctx.fillStyle = '#4f3527';
  ctx.fillRect(205, 224, 360, 14);
  ctx.fillRect(225, 238, 12, 16);
  ctx.fillRect(530, 238, 12, 16);

  const books = [
    [220, 74, 16, 44, '#7f1d1d'],
    [238, 80, 14, 38, '#1e3a8a'],
    [254, 70, 18, 48, '#14532d'],
    [274, 82, 15, 36, '#78350f'],
  ];
  for (const [bx, by, bw, bh, bc] of books) {
    ctx.fillStyle = bc;
    ctx.fillRect(bx, by, bw, bh);
    ctx.fillStyle = '#e5c158';
    ctx.fillRect(bx + 2, by + 6, bw - 4, 2);
  }

  ctx.fillStyle = '#2a1d17';
  drawRoundedRect(ctx, 412, 46, 86, 116, 12);
  ctx.fill();
  ctx.strokeStyle = '#b78938';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(455, 102, 32, 0, Math.PI * 2);
  ctx.fillStyle = '#f5ecd7';
  ctx.fill();
  ctx.strokeStyle = '#926724';
  ctx.lineWidth = 3;
  ctx.stroke();
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    ctx.beginPath();
    ctx.moveTo(455 + Math.cos(a) * 24, 102 + Math.sin(a) * 24);
    ctx.lineTo(455 + Math.cos(a) * 28, 102 + Math.sin(a) * 28);
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = '#292018';
    ctx.stroke();
  }

  drawGear(ctx, 294, 186, 26, 20, 10, '#c89b42', '#71511b', 0.2);
  drawGear(ctx, 336, 198, 18, 13, 8, '#a1752c', '#5b3f13', 0.5);

  const benchGrad = ctx.createLinearGradient(0, 355, 0, 540);
  benchGrad.addColorStop(0, '#5a3c2b');
  benchGrad.addColorStop(0.15, '#422a1d');
  benchGrad.addColorStop(1, '#1d120c');
  ctx.fillStyle = benchGrad;
  ctx.fillRect(0, 355, 600, 185);
  ctx.fillStyle = '#734d37';
  ctx.fillRect(0, 355, 600, 8);

  const glow = ctx.createRadialGradient(502, 296, 8, 502, 296, 145);
  glow.addColorStop(0, 'rgba(255, 214, 120, 0.42)');
  glow.addColorStop(1, 'rgba(255, 180, 60, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(340, 150, 260, 260);

  ctx.fillStyle = '#332924';
  ctx.fillRect(486, 342, 34, 14);
  ctx.fillStyle = '#9e7631';
  ctx.fillRect(499, 286, 8, 56);
  ctx.beginPath();
  ctx.moveTo(476, 286);
  ctx.lineTo(528, 286);
  ctx.lineTo(516, 256);
  ctx.lineTo(488, 256);
  ctx.closePath();
  ctx.fillStyle = '#d97706';
  ctx.fill();
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#dcd4c0';
  ctx.save();
  ctx.translate(220, 412);
  ctx.rotate(-0.08);
  ctx.fillRect(0, 0, 138, 86);
  ctx.strokeStyle = '#9a8f7a';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(0, 0, 138, 86);
  ctx.strokeStyle = '#475569';
  ctx.beginPath();
  ctx.arc(46, 42, 22, 0, Math.PI * 2);
  ctx.arc(94, 48, 14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = '#64748b';
  ctx.fillRect(88, 416, 46, 8);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(60, 413, 30, 14);

  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(398, 404, 14, 44);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(394, 448, 22, 26);

  ctx.fillStyle = '#1f2937';
  ctx.beginPath();
  ctx.ellipse(122, 346, 28, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(96, 338, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(86, 330);
  ctx.lineTo(90, 318);
  ctx.lineTo(96, 328);
  ctx.moveTo(98, 328);
  ctx.lineTo(104, 318);
  ctx.lineTo(107, 330);
  ctx.fill();
  ctx.strokeStyle = '#1f2937';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(146, 346, 12, 0, Math.PI);
  ctx.stroke();
}

const WORKSHOP_DIFFS = [
  {
    id: 'ws-moon',
    x: 132,
    y: 84,
    r: 24,
    label: 'Crescent moon phase',
    drawLeft(ctx) {
      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.arc(132, 84, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f2042';
      ctx.beginPath();
      ctx.arc(137, 81, 10, 0, Math.PI * 2);
      ctx.fill();
    },
    drawRight(ctx) {
      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.arc(132, 84, 12, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: 'ws-clock-hands',
    x: 455,
    y: 102,
    r: 26,
    label: 'Clock hand angle',
    drawLeft(ctx) {
      ctx.strokeStyle = '#1f1712';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(455, 102);
      ctx.lineTo(455, 81);
      ctx.moveTo(455, 102);
      ctx.lineTo(473, 102);
      ctx.stroke();
    },
    drawRight(ctx) {
      ctx.strokeStyle = '#1f1712';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(455, 102);
      ctx.lineTo(438, 88);
      ctx.moveTo(455, 102);
      ctx.lineTo(455, 122);
      ctx.stroke();
    },
  },
  {
    id: 'ws-pendulum',
    x: 455,
    y: 186,
    r: 24,
    label: 'Brass pendulum bob',
    drawLeft(ctx) {
      ctx.strokeStyle = '#d4a346';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(455, 162);
      ctx.lineTo(455, 192);
      ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(455, 196, 9, 0, Math.PI * 2);
      ctx.fill();
    },
    drawRight(ctx) {
      ctx.strokeStyle = '#d4a346';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(455, 162);
      ctx.lineTo(466, 190);
      ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(467, 195, 9, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: 'ws-shelf-jar',
    x: 344,
    y: 96,
    r: 24,
    label: 'Emerald apothecary vial',
    drawLeft(ctx) {
      ctx.fillStyle = '#10b981';
      ctx.fillRect(334, 84, 20, 32);
      ctx.fillStyle = '#92400e';
      ctx.fillRect(338, 78, 12, 6);
    },
    drawRight(ctx) {
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(334, 84, 20, 32);
      ctx.fillStyle = '#92400e';
      ctx.fillRect(338, 78, 12, 6);
    },
  },
  {
    id: 'ws-gear-gem',
    x: 242,
    y: 202,
    r: 24,
    label: 'Extra cogwheel on shelf',
    drawLeft(ctx) {
      drawGear(ctx, 242, 202, 16, 11, 8, '#eab308', '#713f12', 0.1);
    },
    drawRight(ctx) {
      ctx.fillStyle = '#3d2a20';
      ctx.fillRect(232, 212, 20, 8);
    },
  },
  {
    id: 'ws-lamp-finial',
    x: 502,
    y: 248,
    r: 22,
    label: 'Lamp top finial',
    drawLeft(ctx) {
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(502, 250, 6, 0, Math.PI * 2);
      ctx.fill();
    },
    drawRight(ctx) {
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(502, 238);
      ctx.lineTo(508, 254);
      ctx.lineTo(496, 254);
      ctx.closePath();
      ctx.fill();
    },
  },
  {
    id: 'ws-cat-collar',
    x: 102,
    y: 344,
    r: 24,
    label: 'Cat ribbon collar',
    drawLeft(ctx) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(90, 344);
      ctx.lineTo(108, 347);
      ctx.stroke();
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(98, 349, 3.5, 0, Math.PI * 2);
      ctx.fill();
    },
    drawRight(ctx) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(90, 344);
      ctx.lineTo(108, 347);
      ctx.stroke();
    },
  },
  {
    id: 'ws-blueprint-pin',
    x: 288,
    y: 446,
    r: 24,
    label: 'Blueprint compass & ink',
    drawLeft(ctx) {
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(288, 446, 7, 0, Math.PI * 2);
      ctx.fill();
    },
    drawRight(ctx) {
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(276, 436);
      ctx.lineTo(300, 456);
      ctx.moveTo(300, 436);
      ctx.lineTo(276, 456);
      ctx.stroke();
    },
  },
  {
    id: 'ws-mug',
    x: 472,
    y: 432,
    r: 24,
    label: 'Steaming tea mug',
    drawLeft(ctx) {
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(458, 424, 24, 26);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(482, 437, 7, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
    },
    drawRight(ctx) {
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(458, 424, 24, 26);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(458, 437, 7, Math.PI / 2, -Math.PI / 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(466, 418);
      ctx.quadraticCurveTo(472, 410, 466, 402);
      ctx.stroke();
    },
  },
  {
    id: 'ws-pocketwatch',
    x: 162,
    y: 468,
    r: 24,
    label: 'Pocket watch on bench',
    drawLeft(ctx) {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(162, 468, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.arc(162, 468, 10, 0, Math.PI * 2);
      ctx.fill();
    },
    drawRight(ctx) {
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(162, 468, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(162, 468, 10, 0, Math.PI * 2);
      ctx.fill();
    },
  },
];

export function drawMarketBase(ctx) {
  const sky = ctx.createLinearGradient(0, 0, 0, 310);
  sky.addColorStop(0, '#091428');
  sky.addColorStop(0.55, '#152b4f');
  sky.addColorStop(1, '#263f66');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 600, 310);

  const water = ctx.createLinearGradient(0, 310, 0, 540);
  water.addColorStop(0, '#0f243d');
  water.addColorStop(1, '#06111f');
  ctx.fillStyle = water;
  ctx.fillRect(0, 310, 600, 230);

  ctx.fillStyle = '#f8fafc';
  for (const [sx, sy] of [[42, 44], [116, 30], [220, 52], [312, 28], [418, 48], [548, 62]]) {
    ctx.beginPath();
    ctx.arc(sx, sy, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#1b263b';
  ctx.fillRect(18, 150, 120, 160);
  ctx.fillRect(146, 126, 95, 184);
  ctx.fillRect(250, 162, 130, 148);
  ctx.fillRect(390, 136, 110, 174);
  ctx.fillRect(508, 170, 78, 140);

  ctx.fillStyle = '#fbbf24';
  for (const [wx, wy] of [[40, 178], [76, 178], [166, 156], [198, 198], [414, 166], [452, 206]]) {
    ctx.fillRect(wx, wy, 16, 22);
  }

  ctx.fillStyle = '#3b2820';
  ctx.fillRect(0, 294, 600, 22);
  ctx.fillStyle = '#5c3f31';
  ctx.fillRect(0, 290, 600, 6);

  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 92);
  ctx.quadraticCurveTo(300, 138, 600, 92);
  ctx.stroke();

  const lanterns = [
    [92, 108, '#ef4444'],
    [194, 120, '#f59e0b'],
    [300, 128, '#ec4899'],
    [406, 120, '#f59e0b'],
    [508, 108, '#ef4444'],
  ];
  for (const [lx, ly, lc] of lanterns) {
    ctx.fillStyle = lc;
    ctx.beginPath();
    ctx.ellipse(lx, ly + 12, 11, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(lx - 5, ly - 3, 10, 4);
  }

  ctx.fillStyle = '#7c2d12';
  ctx.fillRect(42, 232, 134, 58);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#dc2626' : '#f8fafc';
    ctx.fillRect(36 + i * 24, 214, 24, 20);
  }

  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(410, 234, 146, 56);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#0284c7' : '#fef3c7';
    ctx.fillRect(406 + i * 26, 214, 26, 20);
  }

  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.moveTo(116, 404);
  ctx.lineTo(256, 404);
  ctx.lineTo(234, 432);
  ctx.lineTo(138, 432);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#451a03';
  ctx.fillRect(184, 336, 4, 68);

  ctx.strokeStyle = 'rgba(251, 191, 36, 0.25)';
  ctx.lineWidth = 2;
  for (let y = 340; y < 510; y += 22) {
    ctx.beginPath();
    ctx.moveTo(40 + (y % 44), y);
    ctx.lineTo(140 + (y % 44), y);
    ctx.stroke();
  }
}

const MARKET_DIFFS = [
  {
    id: 'mk-moon',
    x: 492,
    y: 56,
    r: 24,
    label: 'Harbor moon glow',
    drawLeft(ctx) {
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(492, 56, 15, 0, Math.PI * 2);
      ctx.fill();
    },
    drawRight(ctx) {
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(492, 56, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0c1a32';
      ctx.beginPath();
      ctx.arc(499, 52, 12, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: 'mk-tower-clock',
    x: 194,
    y: 148,
    r: 22,
    label: 'Harbor tower clock face',
    drawLeft(ctx) {
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.arc(194, 148, 10, 0, Math.PI * 2);
      ctx.fill();
    },
    drawRight(ctx) {
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(194, 148, 10, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: 'mk-center-lantern',
    x: 300,
    y: 140,
    r: 24,
    label: 'Center lantern tassel',
    drawLeft(ctx) {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(300, 154);
      ctx.lineTo(300, 174);
      ctx.stroke();
    },
    drawRight(ctx) {
      ctx.fillStyle = '#22d3ee';
      ctx.beginPath();
      ctx.arc(300, 140, 6, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: 'mk-spice-jars',
    x: 108,
    y: 274,
    r: 24,
    label: 'Spice stall bowls',
    drawLeft(ctx) {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(92, 276, 8, 0, Math.PI);
      ctx.fill();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(118, 276, 8, 0, Math.PI);
      ctx.fill();
    },
    drawRight(ctx) {
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(92, 276, 8, 0, Math.PI);
      ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(118, 276, 8, 0, Math.PI);
      ctx.fill();
    },
  },
  {
    id: 'mk-fish-sign',
    x: 484,
    y: 266,
    r: 24,
    label: 'Fish stall banner',
    drawLeft(ctx) {
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.ellipse(484, 266, 14, 7, 0, 0, Math.PI * 2);
      ctx.fill();
    },
    drawRight(ctx) {
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.ellipse(484, 266, 14, 7, 0, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: 'mk-boat-sail',
    x: 204,
    y: 368,
    r: 24,
    label: 'Moored boat sail',
    drawLeft(ctx) {
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.moveTo(188, 340);
      ctx.lineTo(222, 392);
      ctx.lineTo(188, 392);
      ctx.closePath();
      ctx.fill();
    },
    drawRight(ctx) {
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(188, 340);
      ctx.lineTo(222, 392);
      ctx.lineTo(188, 392);
      ctx.closePath();
      ctx.fill();
    },
  },
  {
    id: 'mk-buoy',
    x: 342,
    y: 422,
    r: 24,
    label: 'Harbor channel buoy',
    drawLeft(ctx) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(342, 422, 10, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(340, 404, 4, 10);
    },
    drawRight(ctx) {
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(342, 422, 10, Math.PI, 0);
      ctx.fill();
    },
  },
  {
    id: 'mk-paper-boat',
    x: 452,
    y: 458,
    r: 24,
    label: 'Floating paper lantern',
    drawLeft(ctx) {
      ctx.fillStyle = '#fb7185';
      ctx.fillRect(442, 450, 20, 16);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(448, 454, 8, 8);
    },
    drawRight(ctx) {
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(442, 450, 20, 16);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(448, 454, 8, 8);
    },
  },
  {
    id: 'mk-pier-post',
    x: 56,
    y: 356,
    r: 24,
    label: 'Dockside bollard',
    drawLeft(ctx) {
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(48, 342, 16, 26);
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(56, 342, 8, 0, Math.PI * 2);
      ctx.fill();
    },
    drawRight(ctx) {
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(48, 342, 16, 26);
    },
  },
  {
    id: 'mk-crates',
    x: 298,
    y: 274,
    r: 24,
    label: 'Pier cargo crate',
    drawLeft(ctx) {
      ctx.fillStyle = '#a16207';
      ctx.fillRect(284, 260, 28, 28);
      ctx.strokeStyle = '#713f12';
      ctx.lineWidth = 2;
      ctx.strokeRect(284, 260, 28, 28);
    },
    drawRight(ctx) {
      ctx.fillStyle = '#0f766e';
      ctx.beginPath();
      ctx.arc(298, 274, 14, 0, Math.PI * 2);
      ctx.fill();
    },
  },
];

export function drawConservatoryBase(ctx) {
  const sky = ctx.createLinearGradient(0, 0, 0, 540);
  sky.addColorStop(0, '#0f2922');
  sky.addColorStop(0.55, '#193d33');
  sky.addColorStop(1, '#0b1d18');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 600, 540);

  ctx.strokeStyle = '#6ee7b7';
  ctx.globalAlpha = 0.25;
  ctx.lineWidth = 3;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(75 + i * 150, 160, 75, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(i * 150, 160);
    ctx.lineTo(i * 150, 390);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#134e4a';
  ctx.beginPath();
  ctx.arc(140, 340, 88, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#065f46';
  ctx.beginPath();
  ctx.arc(460, 340, 96, Math.PI, 0);
  ctx.fill();

  ctx.fillStyle = '#292524';
  ctx.fillRect(0, 376, 600, 164);
  ctx.fillStyle = '#44403c';
  ctx.fillRect(0, 372, 600, 10);

  ctx.fillStyle = '#0e7490';
  ctx.beginPath();
  ctx.ellipse(300, 456, 134, 48, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#78716c';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.fillStyle = '#16a34a';
  for (const [lx, ly] of [[248, 450], [344, 466]]) {
    ctx.beginPath();
    ctx.ellipse(lx, ly, 18, 9, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#b45309';
  ctx.fillRect(62, 316, 48, 56);
  ctx.fillRect(490, 316, 48, 56);
}

const CONSERVATORY_DIFFS = [
  {
    id: 'cv-sunbeam',
    x: 300,
    y: 72,
    r: 24,
    label: 'Glasshouse skylight',
    drawLeft(ctx) {
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(300, 72, 16, 0, Math.PI * 2);
      ctx.fill();
    },
    drawRight(ctx) {
      ctx.fillStyle = '#a7f3d0';
      ctx.beginPath();
      ctx.arc(300, 72, 16, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: 'cv-hanging-fern',
    x: 148,
    y: 122,
    r: 24,
    label: 'Hanging basket bloom',
    drawLeft(ctx) {
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(148, 122, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(148, 122, 6, 0, Math.PI * 2);
      ctx.fill();
    },
    drawRight(ctx) {
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(148, 122, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(148, 122, 6, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: 'cv-orchid',
    x: 452,
    y: 132,
    r: 24,
    label: 'Hanging orchid cluster',
    drawLeft(ctx) {
      ctx.fillStyle = '#c084fc';
      ctx.beginPath();
      ctx.arc(444, 132, 8, 0, Math.PI * 2);
      ctx.arc(460, 132, 8, 0, Math.PI * 2);
      ctx.fill();
    },
    drawRight(ctx) {
      ctx.fillStyle = '#fb7185';
      ctx.beginPath();
      ctx.arc(444, 132, 8, 0, Math.PI * 2);
      ctx.arc(460, 132, 8, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: 'cv-butterfly',
    x: 242,
    y: 224,
    r: 24,
    label: 'Morpho butterfly',
    drawLeft(ctx) {
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.ellipse(235, 224, 9, 6, -0.4, 0, Math.PI * 2);
      ctx.ellipse(249, 224, 9, 6, 0.4, 0, Math.PI * 2);
      ctx.fill();
    },
    drawRight(ctx) {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.ellipse(235, 224, 9, 6, -0.4, 0, Math.PI * 2);
      ctx.ellipse(249, 224, 9, 6, 0.4, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: 'cv-fountain-bird',
    x: 374,
    y: 260,
    r: 24,
    label: 'Hummingbird on branch',
    drawLeft(ctx) {
      ctx.fillStyle = '#2dd4bf';
      ctx.beginPath();
      ctx.arc(374, 260, 9, 0, Math.PI * 2);
      ctx.fill();
    },
    drawRight(ctx) {
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.arc(374, 260, 9, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: 'cv-left-pot-flower',
    x: 86,
    y: 294,
    r: 24,
    label: 'Left terracotta cactus',
    drawLeft(ctx) {
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(78, 274, 16, 42);
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(86, 272, 6, 0, Math.PI * 2);
      ctx.fill();
    },
    drawRight(ctx) {
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(78, 274, 16, 42);
    },
  },
  {
    id: 'cv-right-pot-flower',
    x: 514,
    y: 294,
    r: 24,
    label: 'Right palm frond',
    drawLeft(ctx) {
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.ellipse(514, 294, 18, 8, -0.3, 0, Math.PI * 2);
      ctx.fill();
    },
    drawRight(ctx) {
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.ellipse(514, 294, 18, 8, 0.3, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: 'cv-koi',
    x: 300,
    y: 454,
    r: 24,
    label: 'Koi fish in pond',
    drawLeft(ctx) {
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.ellipse(300, 454, 14, 6, 0.2, 0, Math.PI * 2);
      ctx.fill();
    },
    drawRight(ctx) {
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.ellipse(300, 454, 14, 6, -0.2, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: 'cv-watering-can',
    x: 118,
    y: 448,
    r: 24,
    label: 'Brass watering can',
    drawLeft(ctx) {
      ctx.fillStyle = '#eab308';
      ctx.fillRect(102, 438, 28, 24);
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(130, 452);
      ctx.lineTo(144, 438);
      ctx.stroke();
    },
    drawRight(ctx) {
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(102, 438, 28, 24);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(130, 452);
      ctx.lineTo(144, 438);
      ctx.stroke();
    },
  },
  {
    id: 'cv-stepping-stone',
    x: 492,
    y: 448,
    r: 24,
    label: 'Garden lantern stone',
    drawLeft(ctx) {
      ctx.fillStyle = '#a8a29e';
      ctx.fillRect(480, 430, 24, 34);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(486, 438, 12, 10);
    },
    drawRight(ctx) {
      ctx.fillStyle = '#a8a29e';
      ctx.fillRect(480, 430, 24, 34);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(486, 438, 12, 10);
    },
  },
];

export function drawObservatoryBase(ctx) {
  const bg = ctx.createLinearGradient(0, 0, 0, 540);
  bg.addColorStop(0, '#070b1a');
  bg.addColorStop(0.6, '#121b38');
  bg.addColorStop(1, '#1d1826');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 600, 540);

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(300, 280, 250, Math.PI, 0);
  ctx.lineTo(550, 380);
  ctx.lineTo(50, 380);
  ctx.closePath();
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(220, 36);
  ctx.lineTo(380, 36);
  ctx.lineTo(430, 290);
  ctx.lineTo(170, 290);
  ctx.closePath();
  const slitGrad = ctx.createLinearGradient(0, 36, 0, 290);
  slitGrad.addColorStop(0, '#030712');
  slitGrad.addColorStop(1, '#172554');
  ctx.fillStyle = slitGrad;
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = '#f8fafc';
  for (const [sx, sy] of [[248, 72], [292, 58], [344, 84], [268, 134], [322, 146], [362, 118]]) {
    ctx.beginPath();
    ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#312520';
  ctx.fillRect(0, 378, 600, 162);
  ctx.fillStyle = '#47362e';
  ctx.fillRect(0, 374, 600, 8);

  ctx.save();
  ctx.translate(296, 260);
  ctx.rotate(-0.46);
  ctx.fillStyle = '#b4822c';
  ctx.fillRect(-104, -18, 210, 36);
  ctx.fillStyle = '#eab308';
  ctx.fillRect(88, -22, 24, 44);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(108, -16, 6, 32);
  ctx.restore();

  ctx.fillStyle = '#475569';
  ctx.fillRect(284, 276, 24, 102);
  ctx.beginPath();
  ctx.moveTo(246, 378);
  ctx.lineTo(346, 378);
  ctx.lineTo(316, 344);
  ctx.lineTo(276, 344);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#4b3629';
  ctx.fillRect(36, 404, 152, 92);
  ctx.fillRect(412, 404, 152, 92);
}

const OBSERVATORY_DIFFS = [
  {
    id: 'ob-comet',
    x: 332,
    y: 78,
    r: 24,
    label: 'Comet in sky slit',
    drawLeft(ctx) {
      ctx.fillStyle = '#7dd3fc';
      ctx.beginPath();
      ctx.arc(332, 78, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.7)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(332, 78);
      ctx.lineTo(360, 56);
      ctx.stroke();
    },
    drawRight(ctx) {
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(332, 78, 6, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: 'ob-saturn',
    x: 248,
    y: 120,
    r: 24,
    label: 'Ringed planet tilt',
    drawLeft(ctx) {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(248, 120, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fde68a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(248, 120, 20, 6, -0.35, 0, Math.PI * 2);
      ctx.stroke();
    },
    drawRight(ctx) {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(248, 120, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fde68a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(248, 120, 20, 6, 0.35, 0, Math.PI * 2);
      ctx.stroke();
    },
  },
  {
    id: 'ob-constellation',
    x: 112,
    y: 190,
    r: 24,
    label: 'Wall star chart',
    drawLeft(ctx) {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(82, 162, 60, 56);
      ctx.strokeStyle = '#d4a346';
      ctx.strokeRect(82, 162, 60, 56);
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(100, 180, 3, 0, Math.PI * 2);
      ctx.arc(124, 198, 3, 0, Math.PI * 2);
      ctx.fill();
    },
    drawRight(ctx) {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(82, 162, 60, 56);
      ctx.strokeStyle = '#d4a346';
      ctx.strokeRect(82, 162, 60, 56);
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(112, 190, 10, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: 'ob-astrolabe',
    x: 488,
    y: 190,
    r: 24,
    label: 'Wall astrolabe',
    drawLeft(ctx) {
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(488, 190, 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(488, 190, 5, 0, Math.PI * 2);
      ctx.fill();
    },
    drawRight(ctx) {
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(488, 190, 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(488, 190, 5, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: 'ob-scope-band',
    x: 296,
    y: 260,
    r: 24,
    label: 'Telescope brass collar',
    drawLeft(ctx) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(296, 260, 8, 0, Math.PI * 2);
      ctx.fill();
    },
    drawRight(ctx) {
      ctx.fillStyle = '#22d3ee';
      ctx.beginPath();
      ctx.arc(296, 260, 8, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: 'ob-orrery',
    x: 112,
    y: 382,
    r: 24,
    label: 'Desk orrery sun',
    drawLeft(ctx) {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(112, 378, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(136, 378, 5, 0, Math.PI * 2);
      ctx.fill();
    },
    drawRight(ctx) {
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(112, 378, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(88, 378, 5, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: 'ob-globe',
    x: 488,
    y: 380,
    r: 24,
    label: 'Celestial globe',
    drawLeft(ctx) {
      ctx.fillStyle = '#1d4ed8';
      ctx.beginPath();
      ctx.arc(488, 378, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(488, 378, 19, -0.5, 2.6);
      ctx.stroke();
    },
    drawRight(ctx) {
      ctx.fillStyle = '#0f766e';
      ctx.beginPath();
      ctx.arc(488, 378, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(488, 378, 19, -0.5, 2.6);
      ctx.stroke();
    },
  },
  {
    id: 'ob-books-left',
    x: 78,
    y: 454,
    r: 24,
    label: 'Stacked star almanacs',
    drawLeft(ctx) {
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(54, 444, 48, 12);
      ctx.fillStyle = '#1e40af';
      ctx.fillRect(58, 432, 40, 12);
    },
    drawRight(ctx) {
      ctx.fillStyle = '#065f46';
      ctx.fillRect(54, 444, 48, 12);
      ctx.fillStyle = '#92400e';
      ctx.fillRect(58, 432, 40, 12);
    },
  },
  {
    id: 'ob-compass',
    x: 518,
    y: 454,
    r: 24,
    label: 'Navigation compass',
    drawLeft(ctx) {
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(518, 454, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(518, 444);
      ctx.lineTo(522, 454);
      ctx.lineTo(514, 454);
      ctx.closePath();
      ctx.fill();
    },
    drawRight(ctx) {
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(518, 454, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(518, 464);
      ctx.lineTo(522, 454);
      ctx.lineTo(514, 454);
      ctx.closePath();
      ctx.fill();
    },
  },
  {
    id: 'ob-owl',
    x: 382,
    y: 344,
    r: 24,
    label: 'Observatory brass owl',
    drawLeft(ctx) {
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.ellipse(382, 348, 10, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(378, 340, 2.5, 0, Math.PI * 2);
      ctx.arc(386, 340, 2.5, 0, Math.PI * 2);
      ctx.fill();
    },
    drawRight(ctx) {
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.ellipse(382, 348, 10, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(378, 340, 2.5, 0, Math.PI * 2);
      ctx.arc(386, 340, 2.5, 0, Math.PI * 2);
      ctx.fill();
    },
  },
];

export const SCENE_CATALOG = [
  {
    id: 'workshop',
    title: "Midnight Clockmaker's Workshop",
    subtitle: 'Case I — Gears, Pendulums & Candlelight',
    difficulty: 1,
    timeLimitSec: 120,
    accent: '#f59e0b',
    drawBase: drawWorkshopBase,
    differences: WORKSHOP_DIFFS,
  },
  {
    id: 'market',
    title: 'Harbor Night Market',
    subtitle: 'Case II — Lanterns, Spices & Moored Boats',
    difficulty: 2,
    timeLimitSec: 110,
    accent: '#38bdf8',
    drawBase: drawMarketBase,
    differences: MARKET_DIFFS,
  },
  {
    id: 'conservatory',
    title: 'Botanical Conservatory',
    subtitle: 'Case III — Glasshouse Arches & Koi Pond',
    difficulty: 2,
    timeLimitSec: 110,
    accent: '#34d399',
    drawBase: drawConservatoryBase,
    differences: CONSERVATORY_DIFFS,
  },
  {
    id: 'observatory',
    title: 'Grand Observatory',
    subtitle: 'Case IV — Starlight Dome & Brass Orrery',
    difficulty: 3,
    timeLimitSec: 100,
    accent: '#a78bfa',
    drawBase: drawObservatoryBase,
    differences: OBSERVATORY_DIFFS,
  },
];

export function buildScene(sceneId) {
  return SCENE_CATALOG.find((s) => s.id === sceneId) || SCENE_CATALOG[0];
}
