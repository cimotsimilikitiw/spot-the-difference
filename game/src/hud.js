export const HUD_BUTTONS = [
  { id: 'hint', label: 'Hint (H)', x: 854, y: 18, w: 94, h: 36 },
  { id: 'loupe', label: 'Loupe (M)', x: 956, y: 18, w: 102, h: 36 },
  { id: 'mute', label: 'Sound (V)', x: 1066, y: 18, w: 92, h: 36 },
  { id: 'stages', label: 'Stages', x: 1166, y: 18, w: 88, h: 36 },
];

export function hitTestHudButton(x, y) {
  for (const btn of HUD_BUTTONS) {
    if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
      return btn.id;
    }
  }
  return null;
}

function drawRoundedPanel(ctx, x, y, w, h, r) {
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

function formatClock(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  const mins = Math.floor(s / 60);
  const rem = s % 60;
  return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
}

export function drawTopHudBar(ctx, layout, scene, state, isMuted) {
  const grad = ctx.createLinearGradient(0, 0, 0, layout.hudHeight);
  grad.addColorStop(0, '#141c2b');
  grad.addColorStop(1, '#0d131f');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, layout.width, layout.hudHeight);

  ctx.fillStyle = 'rgba(245, 197, 66, 0.25)';
  ctx.fillRect(0, layout.hudHeight - 1, layout.width, 1);

  ctx.fillStyle = '#f8fafc';
  ctx.font = '700 18px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(scene.title, 28, 30);

  const stars = '★'.repeat(scene.difficulty) + '☆'.repeat(3 - scene.difficulty);
  ctx.fillStyle = '#f5c542';
  ctx.font = '600 12px system-ui, -apple-system, sans-serif';
  ctx.fillText(`${stars}  •  ${scene.subtitle}`, 28, 51);

  const total = scene.differences.length;
  const found = state.foundIds.size;
  const remaining = Math.max(0, total - found);

  drawRoundedPanel(ctx, 358, 12, 244, 48, 8);
  ctx.fillStyle = '#1b263b';
  ctx.fill();
  ctx.strokeStyle = remaining <= 2 ? '#f59e0b' : 'rgba(245, 197, 66, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#f5c542';
  ctx.font = '800 15px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`FOUND ${found} / ${total} — ${remaining} REMAINING`, 480, 32);

  const dotStart = 480 - ((total - 1) * 14) / 2;
  for (let i = 0; i < total; i++) {
    ctx.beginPath();
    ctx.arc(dotStart + i * 14, 48, 3.6, 0, Math.PI * 2);
    ctx.fillStyle = i < found ? '#f5c542' : '#334155';
    ctx.fill();
  }

  const ratio = Math.max(0, Math.min(1, state.timeLeft / Math.max(1, state.totalTime)));
  const urgent = state.timeLeft <= 22;
  const timerColor = ratio > 0.45 ? '#34d399' : ratio > 0.22 ? '#f59e0b' : '#ef4444';

  ctx.textAlign = 'left';
  ctx.fillStyle = urgent ? '#fca5a5' : '#e2e8f0';
  ctx.font = '700 15px ui-monospace, SFMono-Regular, monospace';
  ctx.fillText(formatClock(state.timeLeft), 620, 29);

  if (state.streak >= 2) {
    drawRoundedPanel(ctx, 682, 13, 100, 22, 6);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.font = '800 12px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`COMBO x${state.streak}`, 732, 28);
  } else {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 12px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`SCORE ${state.score}`, 828, 28);
  }

  drawRoundedPanel(ctx, 620, 41, 208, 12, 6);
  ctx.fillStyle = '#1e293b';
  ctx.fill();
  if (ratio > 0) {
    drawRoundedPanel(ctx, 620, 41, Math.max(10, 208 * ratio), 12, 6);
    ctx.fillStyle = timerColor;
    ctx.fill();
  }

  for (const btn of HUD_BUTTONS) {
    const active =
      (btn.id === 'loupe' && state.loupeEnabled) ||
      (btn.id === 'hint' && state.activeHint !== null);
    const disabled = btn.id === 'hint' && state.hintsRemaining <= 0;

    drawRoundedPanel(ctx, btn.x, btn.y, btn.w, btn.h, 7);
    ctx.fillStyle = active ? '#b45309' : disabled ? '#151d2b' : '#1e293b';
    ctx.fill();
    ctx.strokeStyle = active ? '#fbbf24' : disabled ? '#263244' : '#3b4a63';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    let label = btn.label;
    if (btn.id === 'hint') label = `Hint (${state.hintsRemaining})`;
    if (btn.id === 'mute') label = isMuted ? 'Muted' : 'Sound';

    ctx.fillStyle = disabled ? '#64748b' : '#f8fafc';
    ctx.font = '600 12px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, btn.x + btn.w / 2, btn.y + 22);
  }
}

export function drawBottomControlStrip(ctx, layout, scene, state) {
  const y = layout.height - 46;
  ctx.fillStyle = '#0b1019';
  ctx.fillRect(0, y, layout.width, 46);
  ctx.fillStyle = 'rgba(148, 163, 184, 0.16)';
  ctx.fillRect(0, y, layout.width, 1);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 13px system-ui, -apple-system, sans-serif';
  ctx.fillText(
    'Click differences on either panel  •  H: Hint  •  M / Shift: 2.2x Magnifier Loupe  •  Arrows + Enter: Keyboard  •  R: Restart  •  Esc: Stages',
    28,
    y + 27,
  );

  ctx.textAlign = 'right';
  if (state.lastFoundLabel) {
    ctx.fillStyle = '#fde047';
    ctx.font = '600 13px system-ui, -apple-system, sans-serif';
    ctx.fillText(`Spotted: ${state.lastFoundLabel}  •  Score ${state.score}`, layout.width - 28, y + 27);
  } else {
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 13px system-ui, -apple-system, sans-serif';
    ctx.fillText(`Score ${state.score}  •  ${scene.differences.length} Differences`, layout.width - 28, y + 27);
  }
}

export function drawCountdownPressureGlow(ctx, layout, state) {
  if (state.status !== 'playing' || state.timeLeft > 22) return;
  const pulse = 0.45 + 0.35 * Math.sin(state.elapsed * 6.5);
  const color = state.timeLeft <= 10 ? `rgba(239, 68, 68, ${pulse * 0.6})` : `rgba(245, 158, 11, ${pulse * 0.55})`;
  ctx.save();
  ctx.lineWidth = 14;
  ctx.strokeStyle = color;
  ctx.strokeRect(7, layout.hudHeight + 7, layout.width - 14, layout.height - layout.hudHeight - 53);
  ctx.restore();
}
