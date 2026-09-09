import { createAttemptController } from '../core/attempts.js';

export function createMissionShell({ mission, onBack, onComplete, onContact, store, persistAttempts = true }) {
  const root = document.createElement('section');
  root.className = 'mission card';
  root.innerHTML = `
    <div class="mission-nav"><button class="button ghost" data-back type="button">← Inventário</button><span>MISSÃO ${String(mission.id).padStart(2, '0')}</span></div>
    <div class="eyebrow">${mission.kicker}</div>
    <h1>${mission.title}</h1>
    <p class="lead">${mission.subtitle}</p>
    <div class="mission-content"></div>
    <div class="mission-feedback" aria-live="polite">
      <p class="form-message" data-feedback hidden></p>
      <div class="hint-box" data-hint hidden></div>
      <button class="button secondary" data-contact type="button" hidden>Recorrer ao criador</button>
    </div>`;
  const content = root.querySelector('.mission-content');
  const feedback = root.querySelector('[data-feedback]');
  const hint = root.querySelector('[data-hint]');
  const contact = root.querySelector('[data-contact]');
  const saved = store.read(mission.id);
  let blocked = false;
  const attempts = createAttemptController({
    hints: mission.hints,
    initialCount: persistAttempts ? saved.attempts ?? 0 : 0,
    onHint(value) {
      hint.textContent = value;
      hint.hidden = false;
    },
    onContact() {
      blocked = true;
      contact.hidden = false;
      feedback.textContent = 'O arquivo não vai facilitar mais. Se quiser, peça ajuda ao criador.';
      feedback.hidden = false;
    },
    onChange(count) {
      if (!persistAttempts) return;
      store.write(mission.id, { ...store.read(mission.id), version: 1, attempts: count });
    }
  });

  if (persistAttempts && saved.attempts >= 7) {
    hint.textContent = mission.hints[1];
    hint.hidden = false;
  } else if (persistAttempts && saved.attempts >= 3) {
    hint.textContent = mission.hints[0];
    hint.hidden = false;
  }
  if (persistAttempts && saved.attempts >= 12) {
    blocked = true;
    contact.hidden = false;
    feedback.textContent = 'O arquivo não vai facilitar mais. Se quiser, peça ajuda ao criador.';
    feedback.hidden = false;
  }

  root.querySelector('[data-back]').addEventListener('click', onBack);
  contact.addEventListener('click', onContact);

  return {
    root,
    content,
    saved,
    attempts,
    get blocked() { return blocked; },
    fail(message = 'Ainda não. Reavalie os dados da missão.') {
      if (blocked) return;
      feedback.textContent = message;
      feedback.hidden = false;
      attempts.wrong();
    },
    success(bonus) {
      blocked = true;
      store.write(mission.id, { ...store.read(mission.id), version: 1, completed: true, bonusSeen: true });
      feedback.className = 'mission-feedback success';
      feedback.innerHTML = `<p class="success-title">Missão concluída.</p><p>${bonus}</p>`;
      feedback.hidden = false;
      onComplete(mission.id);
    },
    saveData(data) {
      store.write(mission.id, { ...store.read(mission.id), version: 1, stageData: data });
    }
  };
}
