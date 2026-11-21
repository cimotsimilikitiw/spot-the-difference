import { createSoundEngine } from './audio.js';
import {
  advanceMatchTimers,
  computeStarRating,
  createMatchState,
  evaluatePanelClick,
  triggerRadarHint,
} from './differences.js';
import { hitTestHudButton } from './hud.js';
import {
  computeViewportLayout,
  hitTestStageCard,
  renderGameFrame,
  screenToPanelCoords,
} from './renderer.js';
import { buildScene, SCENE_CATALOG } from './scenes.js';
import { loadProgress, saveSceneResult } from './storage.js';

function announce(text) {
  const el = document.getElementById('liveStatus');
  if (el) el.textContent = text;
}

function getQuerySceneMode() {
  const params = new URLSearchParams(window.location.search);
  return params.get('scene') || params.get('shot') || '';
}

export function stageDeterministicScene(mode) {
  if (mode === 'play-workshop') {
    const scene = buildScene('workshop');
    const state = createMatchState(scene);
    for (const id of ['ws-moon', 'ws-shelf-jar', 'ws-cat-collar', 'ws-pocketwatch']) {
      state.foundIds.add(id);
      state.foundOrder.push(id);
    }
    state.score = 450;
    state.streak = 2;
    state.timeLeft = 84;
    state.lastFoundLabel = 'Pocket watch on bench';
    state.loupeEnabled = true;
    state.loupePos = { x: 455, y: 102, panel: 'right' };
    return { scene, state, staged: true, progressOverride: null };
  }

  if (mode === 'hint-market') {
    const scene = buildScene('market');
    const state = createMatchState(scene);
    for (const id of ['mk-moon', 'mk-tower-clock', 'mk-spice-jars', 'mk-fish-sign', 'mk-pier-post', 'mk-crates']) {
      state.foundIds.add(id);
      state.foundOrder.push(id);
    }
    state.score = 850;
    state.streak = 3;
    state.hintsRemaining = 2;
    state.timeLeft = 58;
    state.lastFoundLabel = 'Pier cargo crate';
    state.activeHint = { diffId: 'mk-center-lantern', x: 300, y: 140, life: 1.5, maxLife: 2.4 };
    return { scene, state, staged: true, progressOverride: null };
  }

  if (mode === 'observatory-streak') {
    const scene = buildScene('observatory');
    const state = createMatchState(scene);
    for (const diff of scene.differences.slice(0, 8)) {
      state.foundIds.add(diff.id);
      state.foundOrder.push(diff.id);
    }
    state.score = 1350;
    state.streak = 4;
    state.timeLeft = 16;
    state.elapsed = 1.1;
    state.lastFoundLabel = 'Stacked star almanacs';
    return { scene, state, staged: true, progressOverride: null };
  }

  if (mode === 'stage-select') {
    const scene = buildScene('conservatory');
    const state = createMatchState(scene);
    state.status = 'stage_select';
    const progressOverride = {
      scenes: {
        workshop: { bestScore: 1840, bestTimeLeft: 62, stars: 3, completed: true },
        market: { bestScore: 1520, bestTimeLeft: 38, stars: 2, completed: true },
        conservatory: { bestScore: 1210, bestTimeLeft: 19, stars: 1, completed: true },
        observatory: { bestScore: 0, bestTimeLeft: 0, stars: 0, completed: false },
      },
    };
    return { scene, state, staged: true, progressOverride };
  }

  return null;
}

export function initGame() {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const layout = computeViewportLayout();
  const sound = createSoundEngine();
  let progress = loadProgress();

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = layout.width * dpr;
  canvas.height = layout.height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const mode = getQuerySceneMode();
  const staged = stageDeterministicScene(mode);
  let scene = staged ? staged.scene : buildScene('workshop');
  let state = staged ? staged.state : createMatchState(scene);
  if (staged && staged.progressOverride) {
    progress = staged.progressOverride;
  }
  const isStagedMode = Boolean(staged);

  function loadSceneById(sceneId) {
    scene = buildScene(sceneId);
    state = createMatchState(scene);
    announce(`Loaded ${scene.title}. ${scene.differences.length} differences to find.`);
  }

  function canvasCoordsFromEvent(ev) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((ev.clientX - rect.left) / rect.width) * layout.width,
      y: ((ev.clientY - rect.top) / rect.height) * layout.height,
    };
  }

  function applyPanelAction(lx, ly, panel) {
    const result = evaluatePanelClick(state, scene, lx, ly, panel);
    if (result.ignored) return;
    if (result.hit) {
      sound.playFindChime(result.streak);
      const remaining = scene.differences.length - state.foundIds.size;
      announce(`Found ${result.diff.label}. ${remaining} remaining.`);
      if (result.completed) {
        sound.playVictoryFanfare();
        const stars = computeStarRating(state);
        progress = saveSceneResult(scene.id, stars, state.score, state.timeLeft);
        announce(`${scene.title} complete! Score ${state.score}, ${stars} stars.`);
      }
    } else {
      sound.playMissThud();
      announce('Miss. 5 second penalty.');
    }
  }

  function triggerHintAction() {
    const target = triggerRadarHint(state, scene);
    if (target) {
      sound.playHintPulse();
      announce(`Hint illuminating ${target.label}.`);
    }
  }

  canvas.addEventListener('pointermove', (ev) => {
    const pt = canvasCoordsFromEvent(ev);
    const mapped = screenToPanelCoords(pt.x, pt.y, layout);
    if (mapped) {
      state.loupePos = { x: mapped.lx, y: mapped.ly, panel: mapped.panel };
    } else {
      state.loupePos.panel = null;
    }
  });

  canvas.addEventListener('contextmenu', (ev) => {
    ev.preventDefault();
    sound.unlock();
    state.loupeEnabled = !state.loupeEnabled;
  });

  canvas.addEventListener('pointerdown', (ev) => {
    sound.unlock();
    if (ev.button === 2) return;
    const pt = canvasCoordsFromEvent(ev);

    if (state.status === 'stage_select' || state.status === 'won' || state.status === 'lost') {
      const cardId = hitTestStageCard(pt.x, pt.y, SCENE_CATALOG);
      if (cardId) {
        loadSceneById(cardId);
        return;
      }
    }

    const hudBtn = hitTestHudButton(pt.x, pt.y);
    if (hudBtn === 'hint') {
      triggerHintAction();
      return;
    }
    if (hudBtn === 'loupe') {
      state.loupeEnabled = !state.loupeEnabled;
      return;
    }
    if (hudBtn === 'mute') {
      sound.toggleMute();
      return;
    }
    if (hudBtn === 'stages') {
      state.status = state.status === 'stage_select' ? 'playing' : 'stage_select';
      return;
    }

    const mapped = screenToPanelCoords(pt.x, pt.y, layout);
    if (mapped && state.status === 'playing') {
      applyPanelAction(mapped.lx, mapped.ly, mapped.panel);
    }
  });

  window.addEventListener('keydown', (ev) => {
    sound.unlock();
    const key = ev.key.toLowerCase();

    if (key === 'escape') {
      state.status = state.status === 'stage_select' ? 'playing' : 'stage_select';
      return;
    }
    if (key === 'r') {
      loadSceneById(scene.id);
      return;
    }
    if (key === 'h') {
      triggerHintAction();
      return;
    }
    if (key === 'm' || key === 'z' || ev.key === 'Shift') {
      state.loupeEnabled = !state.loupeEnabled;
      if (state.loupeEnabled && !state.loupePos.panel) {
        state.loupePos = {
          x: state.keyboardCursor.x,
          y: state.keyboardCursor.y,
          panel: state.keyboardCursor.panel,
        };
      }
      return;
    }
    if (key === 'v') {
      sound.toggleMute();
      return;
    }

    const step = ev.shiftKey ? 28 : 16;
    if (ev.key === 'ArrowLeft' || key === 'a') {
      state.keyboardCursor.active = true;
      state.keyboardCursor.x = Math.max(16, state.keyboardCursor.x - step);
    } else if (ev.key === 'ArrowRight' || key === 'd') {
      state.keyboardCursor.active = true;
      state.keyboardCursor.x = Math.min(584, state.keyboardCursor.x + step);
    } else if (ev.key === 'ArrowUp' || key === 'w') {
      state.keyboardCursor.active = true;
      state.keyboardCursor.y = Math.max(16, state.keyboardCursor.y - step);
    } else if (ev.key === 'ArrowDown' || key === 's') {
      state.keyboardCursor.active = true;
      state.keyboardCursor.y = Math.min(524, state.keyboardCursor.y + step);
    } else if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      if (state.status === 'playing') {
        state.keyboardCursor.active = true;
        applyPanelAction(state.keyboardCursor.x, state.keyboardCursor.y, state.keyboardCursor.panel);
      }
      return;
    }

    if (state.keyboardCursor.active && state.loupeEnabled) {
      state.loupePos = {
        x: state.keyboardCursor.x,
        y: state.keyboardCursor.y,
        panel: state.keyboardCursor.panel,
      };
    }
  });

  let lastTs = 0;
  function frame(ts) {
    const dt = lastTs === 0 ? 0 : (ts - lastTs) / 1000;
    lastTs = ts;
    if (!isStagedMode) {
      const tickResult = advanceMatchTimers(state, dt);
      if (tickResult.urgentTick) sound.playUrgentTick();
      if (tickResult.timedOut) announce('Time expired. Press R to retry.');
    }
    renderGameFrame(ctx, layout, scene, state, SCENE_CATALOG, progress, sound.isMuted());
    window.requestAnimationFrame(frame);
  }

  renderGameFrame(ctx, layout, scene, state, SCENE_CATALOG, progress, sound.isMuted());
  if (!isStagedMode) {
    window.requestAnimationFrame(frame);
  }
}

initGame();
