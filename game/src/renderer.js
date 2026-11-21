import { drawBottomControlStrip, drawCountdownPressureGlow, drawTopHudBar } from './hud.js';

export function computeViewportLayout() {
  return {
    width: 1280,
    height: 720,
    hudHeight: 74,
    localWidth: 600,
    localHeight: 540,
    leftPanel: { x: 28, y: 112, w: 596, h: 536 },
    rightPanel: { x: 656, y: 112, w: 596, h: 536 },
  };
}

export function screenToPanelCoords(x, y, layout) {
  const panels = [
    { name: 'left', rect: layout.leftPanel },
    { name: 'right', rect: layout.rightPanel },
  ];
  for (const p of panels) {
    if (x >= p.rect.x && x <= p.rect.x + p.rect.w && y >= p.rect.y && y <= p.rect.y + p.rect.h) {
      const lx = ((x - p.rect.x) / p.rect.w) * layout.localWidth;
      const ly = ((y - p.rect.y) / p.rect.h) * layout.localHeight;
      return { panel: p.name, lx, ly };
    }
  }
  return null;
}

function drawPanelContent(ctx, scene, side) {
  scene.drawBase(ctx);
  for (const diff of scene.differences) {
    ctx.save();
    if (side === 'left') diff.drawLeft(ctx);
    else diff.drawRight(ctx);
    ctx.restore();
  }
}

function drawFoundMarkers(ctx, scene, state) {
  for (const diff of scene.differences) {
    if (!state.foundIds.has(diff.id)) continue;
    ctx.save();
    ctx.beginPath();
    ctx.arc(diff.x, diff.y, diff.r + 3, 0, Math.PI * 2);
    ctx.strokeStyle = '#f5c542';
    ctx.lineWidth = 3.2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(diff.x, diff.y, diff.r - 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(245, 197, 66, 0.14)';
    ctx.fill();

    const bx = diff.x + diff.r * 0.68;
    const by = diff.y - diff.r * 0.68;
    ctx.beginPath();
    ctx.arc(bx, by, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#f5c542';
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(bx - 4, by);
    ctx.lineTo(bx - 1, by + 3.5);
    ctx.lineTo(bx + 4.5, by - 3.5);
    ctx.stroke();
    ctx.restore();
  }
}

function drawHintPulse(ctx, state) {
  if (!state.activeHint) return;
  const h = state.activeHint;
  const progress = 1 - h.life / h.maxLife;
  const ringR = 16 + ((progress * 2.2) % 1) * 34;

  ctx.save();
  ctx.beginPath();
  ctx.arc(h.x, h.y, ringR, 0, Math.PI * 2);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(h.x, h.y, 24, 0, Math.PI * 2);
  ctx.strokeStyle = '#f5c542';
  ctx.lineWidth = 2.4;
  ctx.setLineDash([6, 4]);
  ctx.stroke();
  ctx.restore();
}

function drawParticlesAndMisses(ctx, state, side) {
  for (const p of state.particles) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  for (const m of state.missMarkers) {
    if (m.panel !== side) continue;
    ctx.save();
    ctx.globalAlpha = Math.max(0, m.life / 0.75);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(m.x - 10, m.y - 10);
    ctx.lineTo(m.x + 10, m.y + 10);
    ctx.moveTo(m.x + 10, m.y - 10);
    ctx.lineTo(m.x - 10, m.y + 10);
    ctx.stroke();
    ctx.restore();
  }
}

function drawPanelFrame(ctx, rect, title, badgeColor, shakeOffset) {
  ctx.save();
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(rect.x + shakeOffset - 2, rect.y - 26, 128, 22);
  ctx.fillStyle = badgeColor;
  ctx.font = '700 12px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(title, rect.x + shakeOffset + 8, rect.y - 11);

  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.strokeRect(rect.x + shakeOffset - 1, rect.y - 1, rect.w + 2, rect.h + 2);
  ctx.restore();
}

export function renderMagnifierLoupe(ctx, layout, scene, state) {
  if (!state.loupeEnabled || !state.loupePos.panel) return;
  const activeSide = state.loupePos.panel;
  const otherSide = activeSide === 'left' ? 'right' : 'left';
  const activeRect = activeSide === 'left' ? layout.leftPanel : layout.rightPanel;
  const otherRect = otherSide === 'left' ? layout.leftPanel : layout.rightPanel;

  const lx = state.loupePos.x;
  const ly = state.loupePos.y;
  const sx = activeRect.x + (lx / layout.localWidth) * activeRect.w;
  const sy = activeRect.y + (ly / layout.localHeight) * activeRect.h;
  const ox = otherRect.x + (lx / layout.localWidth) * otherRect.w;
  const oy = otherRect.y + (ly / layout.localHeight) * otherRect.h;

  const radius = 64;
  const zoom = 2.2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(sx, sy, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = '#090d14';
  ctx.fillRect(sx - radius, sy - radius, radius * 2, radius * 2);
  ctx.translate(sx - lx * zoom, sy - ly * zoom);
  ctx.scale(zoom, zoom);
  drawPanelContent(ctx, scene, activeSide);
  drawFoundMarkers(ctx, scene, state);
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(sx + radius * 0.72, sy + radius * 0.72);
  ctx.lineTo(sx + radius * 1.15, sy + radius * 1.15);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(sx, sy, radius, 0, Math.PI * 2);
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#d4a346';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(sx, sy, radius + 3, 0, Math.PI * 2);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#fef08a';
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(sx - 20, sy + radius - 12, 40, 16);
  ctx.fillStyle = '#f5c542';
  ctx.font = '700 10px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('2.2x', sx, sy + radius);

  ctx.beginPath();
  ctx.arc(ox, oy, 22, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.stroke();
  ctx.restore();
}

export function renderStageSelectOverlay(ctx, layout, catalog, progress, state) {
  ctx.save();
  ctx.fillStyle = 'rgba(7, 11, 20, 0.84)';
  ctx.fillRect(0, layout.hudHeight, layout.width, layout.height - layout.hudHeight - 46);

  const modalW = 920;
  const modalH = 470;
  const mx = (layout.width - modalW) / 2;
  const my = 128;

  ctx.fillStyle = '#111827';
  ctx.fillRect(mx, my, modalW, modalH);
  ctx.strokeStyle = '#d4a346';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(mx, my, modalW, modalH);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#f5c542';
  ctx.font = '800 24px system-ui, -apple-system, sans-serif';
  if (state.status === 'won') {
    ctx.fillText('CASE SOLVED — DIORAMA COMPLETE', layout.width / 2, my + 44);
  } else if (state.status === 'lost') {
    ctx.fillText('TIME EXPIRED — CASE INCOMPLETE', layout.width / 2, my + 44);
  } else {
    ctx.fillText('CASE DOSSIER — SELECT A DIORAMA', layout.width / 2, my + 44);
  }

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 14px system-ui, -apple-system, sans-serif';
  ctx.fillText('Click any diorama card below to play or press Esc to resume', layout.width / 2, my + 70);

  const cardW = 410;
  const cardH = 148;
  for (let i = 0; i < catalog.length; i++) {
    const item = catalog[i];
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = mx + 36 + col * (cardW + 28);
    const cy = my + 96 + row * (cardH + 22);
    const saved = progress.scenes[item.id] || { stars: 0, bestScore: 0, bestTimeLeft: 0, completed: false };
    const isCurrent = item.id === state.sceneId;

    ctx.fillStyle = isCurrent ? '#1e293b' : '#162032';
    ctx.fillRect(cx, cy, cardW, cardH);
    ctx.strokeStyle = isCurrent ? item.accent : '#334155';
    ctx.lineWidth = isCurrent ? 2.5 : 1.5;
    ctx.strokeRect(cx, cy, cardW, cardH);

    ctx.fillStyle = item.accent;
    ctx.fillRect(cx, cy, 8, cardH);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 17px system-ui, -apple-system, sans-serif';
    ctx.fillText(item.title, cx + 22, cy + 32);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 13px system-ui, -apple-system, sans-serif';
    ctx.fillText(item.subtitle, cx + 22, cy + 54);

    const diffStars = '★'.repeat(item.difficulty) + '☆'.repeat(3 - item.difficulty);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 13px system-ui, -apple-system, sans-serif';
    ctx.fillText(`Difficulty: ${diffStars}   •   ${item.differences.length} Differences`, cx + 22, cy + 84);

    const earned = '★'.repeat(saved.stars) + '☆'.repeat(3 - saved.stars);
    ctx.fillStyle = '#f5c542';
    ctx.font = '700 14px system-ui, -apple-system, sans-serif';
    const bestText = saved.completed ? `Best: ${saved.bestScore} pts (${saved.bestTimeLeft}s left)` : 'Not solved yet';
    ctx.fillText(`${earned}   ${bestText}`, cx + 22, cy + 118);
  }
  ctx.restore();
}

export function hitTestStageCard(x, y, catalog) {
  const modalW = 920;
  const mx = (1280 - modalW) / 2;
  const my = 128;
  const cardW = 410;
  const cardH = 148;
  for (let i = 0; i < catalog.length; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = mx + 36 + col * (cardW + 28);
    const cy = my + 96 + row * (cardH + 22);
    if (x >= cx && x <= cx + cardW && y >= cy && y <= cy + cardH) {
      return catalog[i].id;
    }
  }
  return null;
}

export function renderGameFrame(ctx, layout, scene, state, catalog, progress, isMuted) {
  ctx.clearRect(0, 0, layout.width, layout.height);
  ctx.fillStyle = '#0b1019';
  ctx.fillRect(0, 0, layout.width, layout.height);

  drawTopHudBar(ctx, layout, scene, state, isMuted);

  const shakeOffset = state.shakeTimer > 0 ? Math.sin(state.shakeTimer * 55) * 6 : 0;

  drawPanelFrame(ctx, layout.leftPanel, 'ORIGINAL', '#cbd5e1', shakeOffset);
  drawPanelFrame(ctx, layout.rightPanel, 'MODIFIED', '#f5c542', shakeOffset);

  const panels = [
    { side: 'left', rect: layout.leftPanel },
    { side: 'right', rect: layout.rightPanel },
  ];

  for (const p of panels) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(p.rect.x + shakeOffset, p.rect.y, p.rect.w, p.rect.h);
    ctx.clip();
    ctx.translate(p.rect.x + shakeOffset, p.rect.y);
    ctx.scale(p.rect.w / layout.localWidth, p.rect.h / layout.localHeight);

    drawPanelContent(ctx, scene, p.side);
    drawFoundMarkers(ctx, scene, state);
    drawHintPulse(ctx, state);
    drawParticlesAndMisses(ctx, state, p.side);

    if (state.keyboardCursor.active && state.keyboardCursor.panel === p.side) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(state.keyboardCursor.x, state.keyboardCursor.y, 14, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  renderMagnifierLoupe(ctx, layout, scene, state);
  drawCountdownPressureGlow(ctx, layout, state);
  drawBottomControlStrip(ctx, layout, scene, state);

  if (state.status === 'stage_select' || state.status === 'won' || state.status === 'lost') {
    renderStageSelectOverlay(ctx, layout, catalog, progress, state);
  }
}
