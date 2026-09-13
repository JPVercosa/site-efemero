import { createMissionShell } from '../components/mission-shell.js';
import { matchesAnswer } from '../core/normalize.js';

export const MISSION_14_ANSWER = 'CARTA';
export const MISSION_14_MAX_REROLLS = 2;
export const MISSION_14_RETURNS_DISABLED_AT = 45;
export const MISSION_14_BOARD_ORDER = Object.freeze([
  64, 63, 62, 61, 60, 59, 58, 57,
  49, 50, 51, 52, 53, 54, 55, 56,
  48, 47, 46, 45, 44, 43, 42, 41,
  33, 34, 35, 36, 37, 38, 39, 40,
  32, 31, 30, 29, 28, 27, 26, 25,
  17, 18, 19, 20, 21, 22, 23, 24,
  16, 15, 14, 13, 12, 11, 10, 9,
  1, 2, 3, 4, 5, 6, 7, 8
]);
export const MISSION_14_SPECIALS = Object.freeze({
  4: Object.freeze({ type: 'atalho', destination: 12, label: 'Bicicleta expressa' }),
  6: Object.freeze({ type: 'transito', label: 'Trânsito no centro' }),
  8: Object.freeze({ type: 'retorno', destination: 2, label: 'Número incorreto' }),
  9: Object.freeze({ type: 'atalho', destination: 20, label: 'Metrô direto' }),
  11: Object.freeze({ type: 'retorno', destination: 5, label: 'Etiqueta ilegível' }),
  14: Object.freeze({ type: 'abrigo', label: 'Centro de distribuição' }),
  15: Object.freeze({ type: 'retorno', destination: 7, label: 'Endereço incompleto' }),
  19: Object.freeze({ type: 'transito', label: 'Trânsito na avenida' }),
  22: Object.freeze({ type: 'retorno', destination: 12, label: 'Rota cancelada' }),
  24: Object.freeze({ type: 'retorno', destination: 13, label: 'Encomenda devolvida' }),
  26: Object.freeze({ type: 'transito', label: 'Trânsito no túnel' }),
  28: Object.freeze({ type: 'atalho', destination: 39, label: 'Trem noturno' }),
  31: Object.freeze({ type: 'retorno', destination: 21, label: 'Endereço divergente' }),
  33: Object.freeze({ type: 'transito', label: 'Trânsito na ponte' }),
  35: Object.freeze({ type: 'retorno', destination: 22, label: 'Rota interditada' }),
  40: Object.freeze({ type: 'retorno', destination: 28, label: 'Ponte interditada' }),
  44: Object.freeze({ type: 'transito', label: 'Congestionamento' }),
  46: Object.freeze({ type: 'retorno', destination: 31, label: 'Triagem incorreta' }),
  48: Object.freeze({ type: 'atalho', destination: 59, label: 'Voo direto' }),
  51: Object.freeze({ type: 'transito', label: 'Trânsito na alfândega' }),
  53: Object.freeze({ type: 'retorno', destination: 42, label: 'Fiscalização pendente' }),
  54: Object.freeze({ type: 'transito', label: 'Trânsito no aeroporto' }),
  55: Object.freeze({ type: 'abrigo', label: 'Depósito alfandegário' }),
  57: Object.freeze({ type: 'retorno', destination: 43, label: 'Documento ausente' }),
  60: Object.freeze({ type: 'retorno', destination: 49, label: 'Última conferência' }),
  62: Object.freeze({ type: 'retorno', destination: 52, label: 'Destinatário ausente' }),
  64: Object.freeze({ type: 'destino', label: 'Destino final' })
});
export const MISSION_14_LEGEND = Object.freeze([
  Object.freeze({ name: 'Caminho', description: 'casa comum, sem efeito' }),
  Object.freeze({ name: 'Atalho', description: 'avance até a casa indicada' }),
  Object.freeze({ name: 'Retorno', description: 'volte até a casa indicada' }),
  Object.freeze({ name: 'Trânsito', description: 'volte ao início da jogada' }),
  Object.freeze({ name: 'Abrigo', description: 'protege contra um retorno' })
]);

export function rollMission14Die(random = Math.random) {
  const value = Number(random());
  const safe = Number.isFinite(value) ? Math.max(0, Math.min(0.999999999999, value)) : 0;
  return Math.floor(safe * 6) + 1;
}

export function resolveMission14Move({ position, roll, countedRolls, shelter = false, returnsDisabled = false }) {
  const nextRollCount = countedRolls + 1;
  const disabledNow = returnsDisabled || nextRollCount >= MISSION_14_RETURNS_DISABLED_AT;
  const landing = Math.min(64, position + roll);
  const special = MISSION_14_SPECIALS[landing];
  const result = {
    position: landing,
    countedRolls: nextRollCount,
    shelter,
    returnsDisabled: disabledNow,
    waitingInTraffic: false,
    completed: landing === 64,
    effect: 'caminho'
  };
  if (!special || result.completed) return { ...result, effect: result.completed ? 'destino' : 'caminho' };
  if (special.type === 'atalho') return { ...result, position: special.destination, effect: 'atalho' };
  if (special.type === 'transito') return { ...result, position, effect: 'transito' };
  if (special.type === 'abrigo') return { ...result, shelter: true, effect: 'abrigo' };
  if (special.type === 'retorno') {
    if (disabledNow || nextRollCount <= 2) return { ...result, effect: 'retorno-inativo' };
    if (shelter) return { ...result, shelter: false, effect: 'retorno-protegido' };
    return { ...result, position: special.destination, effect: 'retorno' };
  }
  return result;
}

function sanitizeState(saved = {}) {
  const stages = ['intro', 'board', 'arrival', 'answer', 'success'];
  const position = Number.isInteger(saved.position) ? Math.max(1, Math.min(64, saved.position)) : 1;
  const countedRolls = Number.isInteger(saved.countedRolls) ? Math.max(0, saved.countedRolls) : 0;
  const pendingRoll = Number.isInteger(saved.pendingRoll) && saved.pendingRoll >= 1 && saved.pendingRoll <= 6 ? saved.pendingRoll : null;
  return {
    stage: stages.includes(saved.stage) ? saved.stage : 'intro',
    position,
    countedRolls,
    pendingRoll,
    pendingWasRerolled: saved.pendingWasRerolled === true,
    rerollsLeft: Number.isInteger(saved.rerollsLeft) ? Math.max(0, Math.min(2, saved.rerollsLeft)) : MISSION_14_MAX_REROLLS,
    shelter: saved.shelter === true,
    returnsDisabled: saved.returnsDisabled === true || countedRolls >= MISSION_14_RETURNS_DISABLED_AT,
    waitingInTraffic: false,
    history: Array.isArray(saved.history) ? saved.history.filter((item) => typeof item === 'string').slice(-6) : []
  };
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

function describeCell(number) {
  const special = MISSION_14_SPECIALS[number];
  if (!special) return 'Caminho';
  if (special.destination) return `${special.label}: ${special.type === 'atalho' ? 'avance' : 'volte'} para ${special.destination}`;
  return special.label;
}

export function mountMission14(host, context) {
  const view = createMissionShell({ mission: context.mission, ...context });
  let state = sanitizeState(view.saved.stageData);
  if (view.saved.completed === true) state.stage = 'success';
  let message = '';
  let messageType = '';
  let moving = false;
  let displayPosition = state.position;
  const random = typeof context.random === 'function' ? context.random : Math.random;
  const save = () => view.saveData(state);
  const reset = () => { context.store.clear(context.mission.id); mountMission14(host, context); };
  const addHistory = (...entries) => { state.history = [...state.history, ...entries].slice(-6); };
  const renderDie = (value) => `<img class="mission-14-die" src="./assets/dice/${value}.svg" alt="Resultado do dado: ${value}" width="64" height="64">`;

  const renderLegend = () => `<ol class="mission-14-legend" aria-label="Legenda dos cinco selos">${MISSION_14_LEGEND.map((item) => {
    const type = item.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const name = state.stage === 'answer' || state.stage === 'success'
      ? `<strong><mark>${item.name[0]}</mark>${item.name.slice(1)}</strong>`
      : `<strong>${item.name}</strong>`;
    const symbol = ({ caminho: '•', atalho: '↗', retorno: '↩', transito: 'Ⅱ', abrigo: '◆' })[type];
    return `<li class="legend-${type}"><span class="mission-14-stamp stamp-${type}" aria-hidden="true">${symbol}</span><div>${name}<small>${item.description}</small></div></li>`;
  }).join('')}</ol>`;

  const cellCenter = (number) => {
    const index = MISSION_14_BOARD_ORDER.indexOf(number);
    return { x: index % 8 * 62.5 + 31.25, y: Math.floor(index / 8) * 62.5 + 31.25 };
  };
  const renderArrows = () => `<svg class="mission-14-board-arrows" viewBox="0 0 500 500" preserveAspectRatio="none" aria-hidden="true">
    <defs><marker id="mission-14-arrow-up" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" /></marker><marker id="mission-14-arrow-back" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" /></marker></defs>
    ${Object.entries(MISSION_14_SPECIALS).filter(([, special]) => special.destination).map(([from, special]) => {
      const start = cellCenter(Number(from));
      const end = cellCenter(special.destination);
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.hypot(dx, dy) || 1;
      const bend = special.type === 'atalho' ? 27 : -27;
      const cx = (start.x + end.x) / 2 - dy / length * bend;
      const cy = (start.y + end.y) / 2 + dx / length * bend;
      return `<path class="arrow-${special.type}" d="M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}" marker-end="url(#mission-14-arrow-${special.type === 'atalho' ? 'up' : 'back'})" />`;
    }).join('')}
  </svg>`;

  const renderBoard = () => `<div class="mission-14-board" role="grid" aria-label="Tabuleiro serpentino de 64 casas">${renderArrows()}${MISSION_14_BOARD_ORDER.map((number) => {
    const special = MISSION_14_SPECIALS[number];
    const type = special?.type ?? 'caminho';
    const occupied = displayPosition === number;
    const destination = special?.destination ? `<em aria-hidden="true">${special.type === 'atalho' ? '↗' : '↩'} ${special.destination}</em>` : '';
    return `<div class="mission-14-cell cell-${type}${occupied ? ' is-current' : ''}" role="gridcell" aria-label="Casa ${number}, ${describeCell(number)}${occupied ? ', peça nesta casa' : ''}"><span>${number}</span>${special ? `<small>${type}</small>` : ''}${destination}${occupied ? '<b aria-hidden="true">✉</b>' : ''}</div>`;
  }).join('')}</div>`;

  const historyClass = (entry) => {
    if (entry.startsWith('Atalho')) return 'history-atalho';
    if (entry.startsWith('Retorno')) return 'history-retorno';
    if (entry.startsWith('Trânsito')) return 'history-transito';
    if (entry.startsWith('Abrigo') || entry.includes('Abrigo')) return 'history-abrigo';
    return 'history-caminho';
  };

  const render = () => {
    const completed = state.stage === 'success';
    const disabled = view.blocked || completed || moving;
    const onBoard = state.stage === 'board';
    view.content.innerHTML = `<div class="mission-flow mission-14-flow">
      <div class="mission-actions"><button class="button ghost" type="button" data-reset ${moving ? 'disabled' : ''}>Reiniciar missão</button></div>
      <section class="mission-14-intro" ${state.stage === 'intro' ? '' : 'hidden'}><p class="eyebrow">CENTRO DE DISTRIBUIÇÃO</p><h2>A entrega perdida</h2><p>Uma entrega sem remetente apareceu. Lance o dado, atravesse os imprevistos e leve o pacote até a casa 64.</p><button class="button primary" type="button" data-start>Começar a entrega</button></section>
      <section class="mission-14-game" ${state.stage === 'intro' ? 'hidden' : ''}>
        <div class="mission-14-status"><div><p class="eyebrow">ROTA POSTAL</p><h2>Casa ${displayPosition} de 64</h2></div><div><span>${state.countedRolls} jogadas</span><span>${state.rerollsLeft} novas tentativas</span>${state.shelter ? '<span>Abrigo ativo</span>' : ''}</div></div>
        ${state.returnsDisabled ? '<p class="mission-14-no-returns" role="status">45 jogadas concluídas: os Retornos foram desativados.</p>' : ''}
        <div class="mission-14-layout"><div>${renderBoard()}</div><aside><h3>Legenda dos selos</h3>${renderLegend()}</aside></div>
        <div class="mission-14-controls" ${onBoard ? '' : 'hidden'}>
          ${moving ? '<p class="mission-14-moving" role="status">A entrega está avançando…</p>' : state.pendingRoll === null ? '<button class="button primary" type="button" data-roll>Lançar dado</button>' : `${renderDie(state.pendingRoll)}<p>O dado mostrou <strong>${state.pendingRoll}</strong>.</p><div><button class="button primary" type="button" data-use>Usar resultado</button><button class="button secondary" type="button" data-reroll ${state.rerollsLeft === 0 || state.pendingWasRerolled ? 'disabled' : ''}>Lançar novamente</button></div>`}
        </div>
        <ol class="mission-14-history" aria-label="Últimas jogadas, da mais recente para a mais antiga">${state.history.slice().reverse().map((item) => `<li class="${historyClass(item)}">${escapeHtml(item)}</li>`).join('')}</ol>
      </section>
      <section class="mission-14-arrival" ${state.stage === 'arrival' ? '' : 'hidden'}><p class="eyebrow">DESTINO ALCANÇADO</p><h2>A caixa está vazia</h2><p>Você completou toda a viagem, mas a informação nunca esteve no destino. Ela estava na legenda desde o primeiro lançamento.</p><button class="button primary" type="button" data-examine>Examinar a legenda</button></section>
      <section class="mission-14-answer" ${state.stage === 'answer' ? '' : 'hidden'}><p class="eyebrow">ÚLTIMA INSPEÇÃO</p><h2>Leia o início dos cinco selos</h2><p>Use a ordem em que aparecem na legenda.</p><form data-answer-form><label>O que estava escondido? <input data-answer autocomplete="off" spellcheck="false"></label><button class="button primary" type="submit" ${disabled ? 'disabled' : ''}>Abrir a entrega</button></form></section>
      <p class="mission-14-message" data-type="${messageType}" aria-live="polite">${message}</p>
      <section class="mission-14-success" ${completed ? '' : 'hidden'}><p class="eyebrow">ENTREGA ABERTA</p><h2>O artefato é uma CARTA</h2><p>A rota era só parte da história. A resposta acompanhou você o tempo inteiro.</p><div class="mission-14-memory"><h3>Anotação no verso</h3><code>35A86</code><p>Um código de uma memória antiga, sem relação com a solução.</p></div></section>
    </div>`;
    bind();
  };

  const acceptRoll = async () => {
    const origin = state.position;
    const roll = state.pendingRoll;
    const landing = Math.min(64, origin + roll);
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
    moving = true;
    render();
    if (!reducedMotion) {
      for (let position = origin + 1; position <= landing; position += 1) {
        await new Promise((resolve) => setTimeout(resolve, 180));
        displayPosition = position;
        render();
      }
    } else {
      displayPosition = landing;
    }
    const outcome = resolveMission14Move({ ...state, roll });
    const returnNotice = !state.returnsDisabled && outcome.returnsDisabled;
    state = { ...state, ...outcome, pendingRoll: null, pendingWasRerolled: false };
    addHistory(`Tirou ${roll}: casa ${origin} → casa ${Math.min(64, origin + roll)}.`);
    if (outcome.effect === 'atalho') addHistory(`Atalho: avance para a casa ${outcome.position}.`);
    if (outcome.effect === 'retorno') addHistory(`Retorno: volte para a casa ${outcome.position}.`);
    if (outcome.effect === 'retorno-protegido') addHistory('O Abrigo impediu o Retorno.');
    if (outcome.effect === 'retorno-inativo') addHistory('O Retorno estava desativado.');
    if (outcome.effect === 'transito') addHistory(`Trânsito: volte para a casa ${origin}.`);
    if (outcome.effect === 'abrigo') addHistory('Abrigo ativado contra o próximo Retorno.');
    if (returnNotice) { message = '45 jogadas concluídas: os Retornos foram desativados.'; messageType = 'success'; }
    if (outcome.completed) state.stage = 'arrival';
    displayPosition = state.position;
    moving = false;
    save(); render();
  };

  const bind = () => {
    view.content.querySelector('[data-reset]').addEventListener('click', reset);
    view.content.querySelector('[data-start]')?.addEventListener('click', () => { state.stage = 'board'; save(); render(); });
    view.content.querySelector('[data-roll]')?.addEventListener('click', () => { state.pendingRoll = rollMission14Die(random); state.pendingWasRerolled = false; save(); render(); });
    view.content.querySelector('[data-reroll]')?.addEventListener('click', () => { if (state.rerollsLeft < 1 || state.pendingWasRerolled) return; state.rerollsLeft -= 1; state.pendingRoll = rollMission14Die(random); state.pendingWasRerolled = true; save(); render(); });
    view.content.querySelector('[data-use]')?.addEventListener('click', acceptRoll);
    view.content.querySelector('[data-examine]')?.addEventListener('click', () => { state.stage = 'answer'; save(); render(); view.content.querySelector('[data-answer]')?.focus(); });
    view.content.querySelector('[data-answer-form]')?.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!matchesAnswer(view.content.querySelector('[data-answer]').value, [MISSION_14_ANSWER])) { message = 'A entrega continua fechada.'; messageType = 'error'; view.fail(message); render(); return; }
      state.stage = 'success'; save(); view.success('A informação esteve na legenda durante toda a viagem.'); render();
    });
  };

  render();
  host.replaceChildren(view.root);
}
