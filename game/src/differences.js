const COMBO_WINDOW_SEC = 8.0;
const MISS_PENALTY_SEC = 5.0;
const HINT_DURATION_SEC = 2.4;
const PARTICLE_COLORS = ['#f7d060', '#fff1b8', '#38bdf8', '#f59e0b'];

export function createMatchState(scene) {
  return {
    sceneId: scene.id,
    foundIds: new Set(),
    foundOrder: [],
    streak: 0,
    bestStreak: 0,
    lastFindElapsed: -99,
    lastFoundLabel: '',
    score: 0,
    timeLeft: scene.timeLimitSec,
    totalTime: scene.timeLimitSec,
    hintsRemaining: 3,
    activeHint: null,
    particles: [],
    missMarkers: [],
    shakeTimer: 0,
    status: 'playing',
    loupeEnabled: false,
    loupePos: { x: 300, y: 270, panel: null },
    keyboardCursor: { x: 300, y: 270, panel: 'left', active: false },
    elapsed: 0,
    lastTickSecond: Math.ceil(scene.timeLimitSec),
  };
}

export function spawnFindParticles(state, lx, ly) {
  for (let i = 0; i < 14; i++) {
    const angle = (Math.PI * 2 * i) / 14 + (i % 2) * 0.18;
    const speed = 55 + (i % 4) * 28;
    state.particles.push({
      x: lx,
      y: ly,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.65,
      maxLife: 0.65,
      size: 2.5 + (i % 3) * 1.4,
      color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
    });
  }
}

export function computeStarRating(state) {
  if (state.status !== 'won') return 0;
  const ratio = state.timeLeft / Math.max(1, state.totalTime);
  if (ratio >= 0.45 && state.hintsRemaining >= 2) return 3;
  if (ratio >= 0.2) return 2;
  return 1;
}

export function evaluatePanelClick(state, scene, lx, ly, panel) {
  if (state.status !== 'playing') {
    return { hit: false, ignored: true };
  }
  for (const diff of scene.differences) {
    if (state.foundIds.has(diff.id)) continue;
    const dx = lx - diff.x;
    const dy = ly - diff.y;
    if (dx * dx + dy * dy <= diff.r * diff.r) {
      state.foundIds.add(diff.id);
      state.foundOrder.push(diff.id);
      state.lastFoundLabel = diff.label;
      if (state.elapsed - state.lastFindElapsed <= COMBO_WINDOW_SEC) {
        state.streak += 1;
      } else {
        state.streak = 1;
      }
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      state.lastFindElapsed = state.elapsed;
      state.score += 100 + (state.streak - 1) * 50;
      if (state.activeHint && state.activeHint.diffId === diff.id) {
        state.activeHint = null;
      }
      spawnFindParticles(state, diff.x, diff.y);
      const completed = state.foundIds.size >= scene.differences.length;
      if (completed) {
        state.status = 'won';
        state.score += Math.round(state.timeLeft * 10);
      }
      return { hit: true, diff, completed, streak: state.streak };
    }
  }
  state.streak = 0;
  state.timeLeft = Math.max(0, state.timeLeft - MISS_PENALTY_SEC);
  state.shakeTimer = 0.28;
  state.missMarkers.push({ x: lx, y: ly, panel, life: 0.75 });
  if (state.timeLeft <= 0) {
    state.status = 'lost';
  }
  return { hit: false, diff: null, completed: false };
}

export function triggerRadarHint(state, scene) {
  if (state.status !== 'playing' || state.hintsRemaining <= 0) {
    return null;
  }
  const remaining = scene.differences.filter((d) => !state.foundIds.has(d.id));
  if (remaining.length === 0) return null;
  const target = remaining[0];
  state.hintsRemaining -= 1;
  state.activeHint = {
    diffId: target.id,
    x: target.x,
    y: target.y,
    life: HINT_DURATION_SEC,
    maxLife: HINT_DURATION_SEC,
  };
  return target;
}

export function advanceMatchTimers(state, dt) {
  if (dt <= 0) return { urgentTick: false, timedOut: false };
  const clampedDt = Math.min(dt, 0.1);
  let urgentTick = false;
  let timedOut = false;

  if (state.status === 'playing') {
    state.elapsed += clampedDt;
    state.timeLeft = Math.max(0, state.timeLeft - clampedDt);
    const wholeSec = Math.ceil(state.timeLeft);
    if (wholeSec < state.lastTickSecond) {
      state.lastTickSecond = wholeSec;
      if (wholeSec > 0 && wholeSec <= 20) {
        urgentTick = true;
      }
    }
    if (state.timeLeft <= 0) {
      state.status = 'lost';
      timedOut = true;
    }
  }

  if (state.shakeTimer > 0) {
    state.shakeTimer = Math.max(0, state.shakeTimer - clampedDt);
  }

  if (state.activeHint) {
    state.activeHint.life -= clampedDt;
    if (state.activeHint.life <= 0) {
      state.activeHint = null;
    }
  }

  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];
    p.x += p.vx * clampedDt;
    p.y += p.vy * clampedDt;
    p.vx *= 0.94;
    p.vy *= 0.94;
    p.life -= clampedDt;
    if (p.life <= 0) {
      state.particles.splice(i, 1);
    }
  }

  for (let i = state.missMarkers.length - 1; i >= 0; i--) {
    state.missMarkers[i].life -= clampedDt;
    if (state.missMarkers[i].life <= 0) {
      state.missMarkers.splice(i, 1);
    }
  }

  return { urgentTick, timedOut };
}
