import { createMissionShell } from '../components/mission-shell.js';
import { matchesAnswer } from '../core/normalize.js';

/**
 * Fonte única do tabuleiro. Para alterar uma carta, edite somente esta lista.
 * Um SET tem três cartas cujos quatro atributos são, em cada atributo,
 * todos iguais ou todos diferentes.
 */
export const MISSION_12_CARDS = Object.freeze([
  Object.freeze({ id: 'ka', symbol: 'estrela', number: 1, color: 'vermelho', fill: 'sólido', syllable: 'KA' }),
  Object.freeze({ id: 'fi', symbol: 'oval', number: 3, color: 'azul', fill: 'listrado', syllable: 'FI' }),
  Object.freeze({ id: 'yu', symbol: 'estrela', number: 1, color: 'verde', fill: 'vazado', syllable: 'YU' }),
  Object.freeze({ id: 'nu', symbol: 'losango', number: 1, color: 'verde', fill: 'vazado', syllable: 'NU' }),
  Object.freeze({ id: 'la', symbol: 'losango', number: 2, color: 'verde', fill: 'sólido', syllable: 'LA' }),
  Object.freeze({ id: 'zu', symbol: 'oval', number: 2, color: 'verde', fill: 'listrado', syllable: 'ZU' }),
  Object.freeze({ id: 'ki', symbol: 'oval', number: 2, color: 'azul', fill: 'sólido', syllable: 'KI' }),
  Object.freeze({ id: 'he', symbol: 'losango', number: 3, color: 'verde', fill: 'vazado', syllable: 'HE' }),
  Object.freeze({ id: 'mi', symbol: 'losango', number: 3, color: 'azul', fill: 'vazado', syllable: 'MI' }),
  Object.freeze({ id: 'ma', symbol: 'oval', number: 3, color: 'vermelho', fill: 'listrado', syllable: 'MA' }),
  Object.freeze({ id: 'do', symbol: 'losango', number: 3, color: 'vermelho', fill: 'listrado', syllable: 'DO' }),
  Object.freeze({ id: 'ya', symbol: 'losango', number: 2, color: 'verde', fill: 'listrado', syllable: 'YA' })
]);

export const MISSION_12_TARGET_WORDS = Object.freeze(['KAZUMI', 'YUKIDO']);
export const MISSION_12_ACCEPTED_ANSWERS = Object.freeze(['JAPONÊS', 'JAPONESES']);
const SET_ATTRIBUTES = Object.freeze(['symbol', 'number', 'color', 'fill']);

export function isMission12Set(cards) {
  return Array.isArray(cards)
    && cards.length === 3
    && SET_ATTRIBUTES.every((attribute) => new Set(cards.map((card) => card?.[attribute])).size !== 2);
}

export function getMission12Sets(cards = MISSION_12_CARDS) {
  const sets = [];
  for (let first = 0; first < cards.length - 2; first += 1) {
    for (let second = first + 1; second < cards.length - 1; second += 1) {
      for (let third = second + 1; third < cards.length; third += 1) {
        if (isMission12Set([cards[first], cards[second], cards[third]])) sets.push([cards[first], cards[second], cards[third]]);
      }
    }
  }
  return sets;
}

export function getMission12SetWords(cards = MISSION_12_CARDS) {
  return getMission12Sets(cards).map((set) => set.map((card) => card.syllable).join(''));
}

function getCardShape(card) {
  const shape = `<span class="mission-12-shape ${card.symbol} ${card.fill}" aria-hidden="true">${card.symbol === 'estrela' ? '★' : ''}</span>`;
  return Array.from({ length: card.number }, () => shape).join('');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

function sanitiseSavedState(saved = {}) {
  const validIds = new Set(MISSION_12_CARDS.map((card) => card.id));
  const usedIds = Array.isArray(saved.usedIds) ? saved.usedIds.filter((id) => validIds.has(id)) : [];
  return {
    usedIds: [...new Set(usedIds)],
    answer: typeof saved.answer === 'string' ? saved.answer.slice(0, 80) : ''
  };
}

export function mountMission12(host, context) {
  const view = createMissionShell({ mission: context.mission, ...context });
  const saved = sanitiseSavedState(view.saved.stageData);
  let usedIds = saved.usedIds;
  let answer = saved.answer;
  let selectedIds = [];
  let completed = view.saved.completed === true;
  const save = () => view.saveData({ usedIds, answer });

  const reset = () => {
    context.store.clear(context.mission.id);
    mountMission12(host, context);
  };

  const render = () => {
    const disabled = view.blocked || completed;
    view.content.innerHTML = `
      <div class="mission-flow mission-12-flow">
        <div class="mission-actions"><button class="button ghost" type="button" data-reset>Reiniciar missão</button></div>
        <section class="mission-12-brief">
          <div><p class="eyebrow">MESA DE TRIAGEM</p><h2>Encontre os dois SETs</h2><p>Escolha três cartas. Para cada atributo — forma, quantidade, cor e preenchimento — os valores devem ser <strong>todos iguais ou todos diferentes</strong>.</p></div>
          <p class="mission-12-counter" aria-live="polite"><strong>${usedIds.length / 3}</strong> de 2 SETs registrados</p>
        </section>
        <section class="mission-12-table" aria-label="Doze cartas sobre a mesa">
          ${MISSION_12_CARDS.map((card) => {
            const used = usedIds.includes(card.id);
            const selected = selectedIds.includes(card.id);
            return `<button class="mission-12-card color-${card.color}${selected ? ' is-selected' : ''}${used ? ' is-used' : ''}" type="button" data-card-id="${card.id}" aria-pressed="${selected}" ${disabled || used ? 'disabled' : ''}>
              <span class="mission-12-symbols fill-${card.fill}">${getCardShape(card)}</span>
              <span class="mission-12-syllable">${card.syllable}</span>
              ${used ? '<span class="mission-12-used-mark">SET usado</span>' : ''}
            </button>`;
          }).join('')}
        </section>
        <div class="mission-12-controls"><p aria-live="polite">${selectedIds.length === 3 ? 'Trio pronto para conferir.' : `Selecione ${3 - selectedIds.length} carta${3 - selectedIds.length === 1 ? '' : 's'} para formar um trio.`}</p><button class="button primary" type="button" data-check ${selectedIds.length !== 3 || disabled ? 'disabled' : ''}>Conferir SET</button></div>
        <section class="mission-12-result" data-result hidden aria-live="polite"></section>
        <section class="mission-12-answer" ${usedIds.length === 6 && !completed ? '' : 'hidden'}>
          <p class="eyebrow">LEITURA DOS SETS</p><h2>Seis sílabas, dois nomes, lembranças culinárias</h2><p>Com as três sílabas de cada SET, forme dois nomes de locais que visitávamos sempre que podíamos em Paris. O que eles têm em comum?</p>
          <form data-final-answer><label for="mission-12-answer">Resposta para o vale</label><div class="mission-12-answer-row"><input id="mission-12-answer" data-final-input type="text" value="${escapeHtml(answer)}" autocomplete="off" spellcheck="false"><button class="button primary" type="submit">Validar resposta</button></div><small>Use uma palavra para identificar o tipo de restaurante.</small></form>
        </section>
        <section class="mission-12-complete" ${completed ? '' : 'hidden'}><p class="eyebrow">LEITURA CONCLUÍDA</p><h2>A resposta para o vale é JAPONÊS</h2><p>KAZUMI e YUKIDO guardavam a lembrança certa.</p></section>
      </div>`;
    view.content.querySelector('[data-reset]').addEventListener('click', reset);
    view.content.querySelectorAll('[data-card-id]').forEach((card) => card.addEventListener('click', () => {
      const id = card.dataset.cardId;
      selectedIds = selectedIds.includes(id)
        ? selectedIds.filter((selectedId) => selectedId !== id)
        : selectedIds.length < 3 ? [...selectedIds, id] : selectedIds;
      render();
    }));
    view.content.querySelector('[data-check]')?.addEventListener('click', checkSelection);
    view.content.querySelector('[data-final-answer]')?.addEventListener('submit', checkAnswer);
  };

  const announce = (message, type) => {
    const result = view.content.querySelector('[data-result]');
    result.textContent = message;
    result.dataset.type = type;
    result.hidden = false;
  };

  const checkSelection = () => {
    if (view.blocked || completed || selectedIds.length !== 3) return;
    const selectedCards = selectedIds.map((id) => MISSION_12_CARDS.find((card) => card.id === id));
    if (!isMission12Set(selectedCards)) {
      selectedIds = [];
      render();
      announce('Essas três cartas não formam um SET: algum atributo ficou com dois valores iguais e um diferente.', 'error');
      view.fail('O trio não passou na regra do SET.');
      return;
    }
    usedIds = [...usedIds, ...selectedIds];
    selectedIds = [];
    save();
    const word = selectedCards.map((card) => card.syllable).join('');
    render();
    announce(`SET confirmado. Estas cartas não podem mais ser usadas.`, 'success');
  };

  const checkAnswer = (event) => {
    event.preventDefault();
    if (view.blocked || completed || usedIds.length !== 6) return;
    answer = view.content.querySelector('[data-final-input]').value;
    save();
    if (!matchesAnswer(answer, MISSION_12_ACCEPTED_ANSWERS)) {
      view.fail('Ainda não. Releia os dois nomes e o que eles têm em comum.');
      return;
    }
    completed = true;
    view.success('Os dois SETs levaram à resposta certa para o vale.');
    render();
  };
  render();
  host.replaceChildren(view.root);
}


