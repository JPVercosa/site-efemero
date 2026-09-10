import { matchesAnswer } from '../core/normalize.js';
import { createMissionShell } from '../components/mission-shell.js';

export const MISSION_11_START_HOUR = 0; // 0 representa 12 h.
export const MISSION_11_CLOCK_LETTERS = Object.freeze(['I', 'Q', 'R', 'B', 'O', 'X', 'D', 'U', 'L', 'Z', 'V', 'M']);
export const MISSION_11_INSTRUCTIONS = Object.freeze([
  Object.freeze({ label: '+2 h', deltaHours: 2 }),
  Object.freeze({ label: '+π/3 rad', deltaHours: 2 }),
  Object.freeze({ label: '+1 h + π/6 rad', deltaHours: 2 }),
  Object.freeze({ label: '−π rad', deltaHours: -6 }),
  Object.freeze({ label: '−1 h 30 min − π/4 rad', deltaHours: -3 }),
  Object.freeze({ label: '−3π/2 rad', deltaHours: -9 }),
  Object.freeze({ label: '+5 h − π/6 rad', deltaHours: 4 })
]);

export function normalizeClockHour(value) {
  const hour = Number(value);
  if (!Number.isInteger(hour)) return null;
  return ((hour % 12) + 12) % 12;
}

export function displayClockHour(hour) {
  return normalizeClockHour(hour) === 0 ? 12 : normalizeClockHour(hour);
}

export function getMission11Destination(currentHour, step) {
  const origin = normalizeClockHour(currentHour);
  const instruction = MISSION_11_INSTRUCTIONS[step];
  if (origin === null || !instruction) return null;
  return normalizeClockHour(origin + instruction.deltaHours);
}

export function getMission11Arrivals() {
  let currentHour = MISSION_11_START_HOUR;
  return MISSION_11_INSTRUCTIONS.map((_, step) => {
    currentHour = getMission11Destination(currentHour, step);
    return currentHour;
  });
}

export function getMission11Answer() {
  return getMission11Arrivals().map((hour) => MISSION_11_CLOCK_LETTERS[hour]).join('');
}

function cleanLetter(value) {
  return typeof value === 'string' ? [...value.trim().toUpperCase()][0] ?? '' : '';
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

function sanitizeSavedState(saved = {}) {
  const data = saved && typeof saved === 'object' ? saved : {};
  return {
    started: data.started === true,
    currentHour: normalizeClockHour(data.currentHour) ?? MISSION_11_START_HOUR,
    letters: Array.from({ length: MISSION_11_INSTRUCTIONS.length }, (_, index) => cleanLetter(data.letters?.[index]))
  };
}

function renderClock(currentHour, disabled) {
  return `<div class="mission-11-clock" data-clock role="group" tabindex="${disabled ? '-1' : '0'}" aria-label="Relógio de letras. Ponteiro em ${displayClockHour(currentHour)} h.">
    <div class="mission-11-clock-face" aria-hidden="true"></div>
    ${MISSION_11_CLOCK_LETTERS.map((letter, hour) => `<button class="mission-11-hour${hour === currentHour ? ' is-current' : ''}" type="button" data-hour="${hour}" style="--hour:${hour}" aria-label="Mover ponteiro para ${displayClockHour(hour)} h, letra ${letter}" ${disabled ? 'disabled' : ''}>${letter}</button>`).join('')}
    <div class="mission-11-hand" data-hand style="--hand-angle:${currentHour * 30}deg" aria-hidden="true"><span></span></div>
    <div class="mission-11-center" aria-hidden="true"></div>
  </div>`;
}

function renderInstructions(letters, disabled) {
  return `<ol class="mission-11-instructions" aria-label="Sete instruções de rotação">
    ${MISSION_11_INSTRUCTIONS.map((instruction, index) => `<li>
      <span>${String(index + 1).padStart(2, '0')}</span><code>${instruction.label}</code>
      <input data-letter-index="${index}" aria-label="Letra encontrada na etapa ${index + 1}" maxlength="1" autocapitalize="characters" autocomplete="off" spellcheck="false" value="${escapeHtml(letters[index])}" ${disabled ? 'disabled' : ''}>
    </li>`).join('')}
  </ol>`;
}

export function mountMission11(host, context) {
  const view = createMissionShell({ mission: context.mission, ...context, persistAttempts: false });
  const saved = sanitizeSavedState(view.saved.stageData);
  let started = saved.started;
  let currentHour = saved.currentHour;
  let letters = saved.letters;
  let completed = view.saved.completed === true;

  const save = () => view.saveData({ started, currentHour, letters });
  const reset = () => {
    context.store.clear(context.mission.id);
    mountMission11(host, context);
  };
  const render = () => {
    const disabled = view.blocked || completed;
    const allLettersFilled = letters.every(Boolean);
    view.content.innerHTML = `
      <div class="mission-flow mission-11-flow">
        <div class="mission-actions"><button class="button ghost" type="button" data-reset>Reiniciar missão</button></div>
        <section class="mission-11-intro" ${started ? 'hidden' : ''}>
          <p class="eyebrow">JANELA DE SERVIÇO</p><h2>A volta incompleta</h2>
          <p>Parta do <strong>I em 12 h</strong>. Siga cada deslocamento e registre, ao lado de cada instrução, a letra em que o ponteiro caiu. Valores positivos avançam no sentido horário e negativos fazem o ponteiro voltar.</p>
          <button class="button primary" type="button" data-start>Posicionar ponteiro</button>
        </section>
        <section class="mission-11-panel" ${started ? '' : 'hidden'}>
          <div class="mission-11-heading"><div><p class="eyebrow">PAINEL DE ROTAÇÃO</p><h2>Siga as chegadas</h2><p>Converta e aplique cada deslocamento no relógio. As letras que você anotar formarão a sequência.</p></div><p class="mission-11-position" data-position aria-live="polite">Ponteiro em ${displayClockHour(currentHour)} h</p></div>
          <div class="mission-11-workspace">
            <div class="mission-11-clock-wrap"><p class="mission-11-drag-note">Arraste o ponteiro, escolha uma letra ou avance uma hora.</p>${renderClock(currentHour, disabled)}<div class="mission-11-nudge-controls" aria-label="Ajustar ponteiro"><button class="button ghost" type="button" data-adjust="-1" ${disabled ? 'disabled' : ''}>−1 h</button><button class="button ghost" type="button" data-adjust="1" ${disabled ? 'disabled' : ''}>+1 h</button></div></div>
            <div class="mission-11-notes"><p class="mission-11-formula">1 h = π/6 rad<br>0 no módulo = 12 h</p>${renderInstructions(letters, disabled)}</div>
          </div>
          <form class="mission-11-sequence" data-sequence>
            <p>Quando registrar as sete letras, valide a sequência.</p><button class="button primary" type="submit" ${!allLettersFilled || disabled ? 'disabled' : ''}>Validar sequência</button>
          </form>
          <section class="mission-11-complete" ${completed ? '' : 'hidden'}><h2>Rota concluída</h2><p>As sete voltas encontraram a palavra certa.</p></section>
          <section class="mission-bonus" data-bonus ${completed ? '' : 'hidden'}><h2>Memória desbloqueada</h2><p>Rio Brasa Lagoa. Voltaremos quando?</p></section>
        </section>
      </div>`;

    view.content.querySelector('[data-reset]').addEventListener('click', reset);
    view.content.querySelector('[data-start]')?.addEventListener('click', () => { started = true; save(); render(); });
    bindPanel();
  };
  const setHour = (hour, restoreClockFocus = false) => {
    if (view.blocked || completed) return;
    currentHour = normalizeClockHour(hour);
    save();
    render();
    if (restoreClockFocus) view.content.querySelector('[data-clock]')?.focus();
  };
  const showFeedback = (message) => {
    const feedback = view.root.querySelector('[data-feedback]');
    feedback.textContent = message;
    feedback.hidden = false;
  };
  const bindPanel = () => {
    view.content.querySelectorAll('[data-hour]').forEach((button) => button.addEventListener('click', () => setHour(button.dataset.hour)));
    view.content.querySelectorAll('[data-adjust]').forEach((button) => button.addEventListener('click', () => setHour(currentHour + Number(button.dataset.adjust))));
    view.content.querySelectorAll('[data-letter-index]').forEach((input) => input.addEventListener('input', () => {
      letters[Number(input.dataset.letterIndex)] = cleanLetter(input.value);
      save();
      render();
      view.content.querySelector(`[data-letter-index="${input.dataset.letterIndex}"]`)?.focus();
    }));
    const clock = view.content.querySelector('[data-clock]');
    if (clock && !view.blocked && !completed) {
      clock.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); setHour(currentHour + 1, true); }
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); setHour(currentHour - 1, true); }
      });
      let dragging = false;
      const setFromPointer = (event) => {
        const bounds = clock.getBoundingClientRect();
        const angle = (Math.atan2(event.clientY - (bounds.top + bounds.height / 2), event.clientX - (bounds.left + bounds.width / 2)) * 180 / Math.PI + 90 + 360) % 360;
        currentHour = Math.round(angle / 30) % 12;
        clock.querySelector('[data-hand]').style.setProperty('--hand-angle', `${currentHour * 30}deg`);
        clock.querySelectorAll('[data-hour]').forEach((button) => button.classList.toggle('is-current', Number(button.dataset.hour) === currentHour));
        view.content.querySelector('[data-position]').textContent = `Ponteiro em ${displayClockHour(currentHour)} h`;
        clock.setAttribute('aria-label', `Relógio de letras. Ponteiro em ${displayClockHour(currentHour)} h.`);
        save();
      };
      clock.addEventListener('pointerdown', (event) => { dragging = true; clock.setPointerCapture?.(event.pointerId); setFromPointer(event); });
      clock.addEventListener('pointermove', (event) => { if (dragging) setFromPointer(event); });
      clock.addEventListener('pointerup', () => { dragging = false; });
      clock.addEventListener('pointercancel', () => { dragging = false; });
    }
    view.content.querySelector('[data-sequence]')?.addEventListener('submit', (event) => {
      event.preventDefault();
      if (view.blocked || completed) return;
      if (!matchesAnswer(letters.join(''), [getMission11Answer()])) {
        showFeedback('A sequência anotada ainda não corresponde às letras encontradas no relógio.');
        return;
      }
      completed = true;
      save();
      view.success('As rotações revelaram a palavra certa.');
      render();
    });
  };

  render();
  host.replaceChildren(view.root);
}
