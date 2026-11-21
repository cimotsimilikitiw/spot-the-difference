const PROGRESS_KEY = 'atelier_spot_diff_progress_v1';
const MUTE_KEY = 'atelier_spot_diff_muted_v1';
const SCENE_IDS = ['workshop', 'market', 'conservatory', 'observatory'];

function createDefaultProgress() {
  const scenes = {};
  for (const id of SCENE_IDS) {
    scenes[id] = { bestScore: 0, bestTimeLeft: 0, stars: 0, completed: false };
  }
  return { scenes };
}

export function loadProgress() {
  const fallback = createDefaultProgress();
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.scenes) return fallback;
    for (const id of SCENE_IDS) {
      const entry = parsed.scenes[id];
      if (entry && typeof entry === 'object') {
        fallback.scenes[id] = {
          bestScore: Number.isFinite(entry.bestScore) ? Math.max(0, Math.floor(entry.bestScore)) : 0,
          bestTimeLeft: Number.isFinite(entry.bestTimeLeft) ? Math.max(0, Math.floor(entry.bestTimeLeft)) : 0,
          stars: Number.isFinite(entry.stars) ? Math.min(3, Math.max(0, Math.floor(entry.stars))) : 0,
          completed: Boolean(entry.completed),
        };
      }
    }
    return fallback;
  } catch {
    return fallback;
  }
}

export function saveSceneResult(sceneId, stars, score, timeLeft) {
  const progress = loadProgress();
  const prev = progress.scenes[sceneId] || { bestScore: 0, bestTimeLeft: 0, stars: 0, completed: false };
  progress.scenes[sceneId] = {
    bestScore: Math.max(prev.bestScore, Math.floor(score)),
    bestTimeLeft: Math.max(prev.bestTimeLeft, Math.floor(timeLeft)),
    stars: Math.max(prev.stars, Math.min(3, Math.floor(stars))),
    completed: true,
  };
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    return progress;
  }
  return progress;
}

export function loadAudioMuted() {
  try {
    return window.localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

export function saveAudioMuted(muted) {
  try {
    window.localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
  } catch {
    return;
  }
}
