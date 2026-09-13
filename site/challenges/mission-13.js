import { createMissionShell } from '../components/mission-shell.js';
import { matchesAnswer, normalizeText } from '../core/normalize.js';

export const MISSION_13_REGIONS = Object.freeze([
  Object.freeze(['esmeralda', 'ambar', 'rubi', 'rubi']),
  Object.freeze(['esmeralda', 'ambar', 'rubi', 'rubi']),
  Object.freeze(['esmeralda', 'esmeralda', 'safira', 'rubi']),
  Object.freeze(['esmeralda', 'safira', 'safira', 'safira'])
]);
export const MISSION_13_SOLUTION_COLUMNS = Object.freeze([1, 3, 0, 2]);
export const MISSION_13_CIPHER = Object.freeze(['X', 'X', 'X', 'X']);
export const MISSION_13_MOVEMENTS = Object.freeze([12, 3, -15, -9]);
export const MISSION_13_ANSWER = 'JOIA';
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const REGION_LABELS = Object.freeze({ esmeralda: 'Esmeralda', ambar: 'Âmbar', rubi: 'Rubi', safira: 'Safira' });
// Ordem visual da segunda etapa: código 0, 1, 2 e 3.
// Os índices apontam para as linhas originais do tabuleiro/cifra.
const DIAL_ORDER = Object.freeze([2, 0, 3, 1]);
const STAGES = Object.freeze(['intro', 'vitrine', 'discos', 'anagrama', 'success']);

export function decodeMission13Letter(letter, offset) {
  const index = ALPHABET.indexOf(String(letter).toUpperCase());
  if (index < 0 || !Number.isInteger(Number(offset))) return '';
  return ALPHABET[(index - Number(offset) % 26 + 26) % 26];
}

export function getMission13Decoded(movements = MISSION_13_MOVEMENTS) {
  return MISSION_13_CIPHER.map((letter, index) => moveMission13Letter(letter, movements[index]));
}

export function moveMission13Letter(letter, movement) {
  const index = ALPHABET.indexOf(String(letter).toUpperCase());
  if (index < 0 || !Number.isInteger(Number(movement))) return '';
  return ALPHABET[(index + Number(movement) % 26 + 26) % 26];
}

export function validateMission13Placement(cellIds) {
  if (!Array.isArray(cellIds) || cellIds.length !== 4 || new Set(cellIds).size !== 4) return false;
  const positions = cellIds.map((id) => /^r([1-4])c([1-4])$/.exec(id)).filter(Boolean)
    .map((match) => ({ row: Number(match[1]) - 1, column: Number(match[2]) - 1 }));
  if (positions.length !== 4) return false;
  if (new Set(positions.map(({ row }) => row)).size !== 4 || new Set(positions.map(({ column }) => column)).size !== 4) return false;
  if (new Set(positions.map(({ row, column }) => MISSION_13_REGIONS[row][column])).size !== 4) return false;
  return positions.every((position, index) => positions.slice(index + 1).every((other) => (
    Math.abs(position.row - other.row) > 1 || Math.abs(position.column - other.column) > 1
  )));
}

export function enumerateMission13Placements() {
  const results = [];
  const visit = (columns = [], available = [0, 1, 2, 3]) => {
    if (columns.length === 4) {
      const ids = columns.map((column, row) => `r${row + 1}c${column + 1}`);
      if (validateMission13Placement(ids)) results.push(columns.slice());
      return;
    }
    available.forEach((column) => visit([...columns, column], available.filter((value) => value !== column)));
  };
  visit();
  return results;
}

function sanitizeState(saved = {}) {
  const stage = STAGES.includes(saved.stage) ? saved.stage : 'intro';
  const validCell = (id) => /^r[1-4]c[1-4]$/.test(id);
  const queens = Array.isArray(saved.queens) ? [...new Set(saved.queens.filter(validCell))].slice(0, 4) : [];
  const marks = Array.isArray(saved.marks) ? [...new Set(saved.marks.filter(validCell))].filter((id) => !queens.includes(id)) : [];
  const dialMoves = Array.from({ length: 4 }, (_, index) => {
    const value = Number(saved.dialMoves?.[index]);
    return Number.isInteger(value) && value >= -25 && value <= 25 ? value : 0;
  });
  const sourceLetters = getMission13Decoded();
  const candidate = Array.isArray(saved.anagram) ? saved.anagram.map((letter) => normalizeText(letter)).filter((letter) => letter.length === 1) : [];
  const anagram = candidate.length === 4 && candidate.slice().sort().join('') === sourceLetters.slice().sort().join('') ? candidate : sourceLetters;
  return { stage, queens, marks, dialMoves, anagram };
}

function stageReached(stage, target) {
  return STAGES.indexOf(stage) >= STAGES.indexOf(target);
}

export function mountMission13(host, context) {
  const view = createMissionShell({ mission: context.mission, ...context });
  const saved = sanitizeState(view.saved.stageData);
  let { stage, queens, marks, dialMoves, anagram } = saved;
  let selectedAnagram = null;
  let message = '';
  let messageType = '';
  const completed = view.saved.completed === true;
  if (completed) stage = 'success';

  const save = () => view.saveData({ stage, queens, marks, dialMoves, anagram });
  const reset = () => { context.store.clear(context.mission.id); mountMission13(host, context); };
  const announce = (text, type = '') => { message = text; messageType = type; };

  const renderBoard = (interactive) => `<div class="mission-13-board-wrap">
    <div>
      <div class="mission-13-code-scale" aria-label="Código das posições, da esquerda para a direita: zero, um, dois, três">${[0, 1, 2, 3].map((value) => `<span>${value}</span>`).join('')}</div>
      <div class="mission-13-board" role="grid" aria-label="Vitrine com posições de código de zero a três">
      ${MISSION_13_REGIONS.flatMap((regions, row) => regions.map((region, column) => {
        const id = `r${row + 1}c${column + 1}`;
        const state = queens.includes(id) ? 'queen' : marks.includes(id) ? 'mark' : 'empty';
        const stateLabel = state === 'queen' ? 'peça posicionada' : state === 'mark' ? 'descartada' : 'vazia';
        return `<button class="mission-13-cell region-${region} state-${state}" role="gridcell" type="button" data-cell="${id}" aria-label="Linha ${row + 1}, código ${column}, área ${REGION_LABELS[region]}, ${stateLabel}" ${interactive ? '' : 'disabled'}><span aria-hidden="true">${state === 'queen' ? '◆' : state === 'mark' ? '×' : ''}</span></button>`;
      })).join('')}
      </div>
    </div>
    <ul class="mission-13-legend" aria-label="Legenda das áreas">${Object.entries(REGION_LABELS).map(([id, label]) => `<li><span class="region-${id}" aria-hidden="true"></span>${label}</li>`).join('')}</ul>
  </div>`;

  const renderCalibration = () => `<div class="mission-13-key-explanation">
    <p>Os códigos identificam as pedras, mas não dizem quanto girar. Resolva a função de cada cartão: resultado positivo avança no alfabeto; resultado negativo volta.</p>
    <ol class="mission-13-calibration" aria-label="Código encontrado para cada peça">${DIAL_ORDER.map((rowIndex) => {
      const code = MISSION_13_SOLUTION_COLUMNS[rowIndex];
      const region = MISSION_13_REGIONS[rowIndex][code];
      const calculations = [
        {
          input: 2,
          formula: `<math display="block" aria-label="f de x é igual à derivada de t ao cubo em relação a t, avaliada em t igual a x">
            <mi>f</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>=</mo>
            <msub>
              <mrow><mfrac><mi mathvariant="normal">d</mi><mrow><mi mathvariant="normal">d</mi><mi>t</mi></mrow></mfrac><mo>(</mo><msup><mi>t</mi><mn>3</mn></msup><mo>)</mo></mrow>
              <mrow><mi>t</mi><mo>=</mo><mi>x</mi></mrow>
            </msub>
          </math>`
        },
        {
          input: 0,
          formula: `<math display="block" aria-label="f de x é igual à integral de x até 3 de dois t sobre três, em relação a t">
            <mi>f</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>=</mo>
            <msubsup><mo>∫</mo><mi>x</mi><mn>3</mn></msubsup>
            <mfrac><mrow><mn>2</mn><mi>t</mi></mrow><mn>3</mn></mfrac>
            <mi mathvariant="normal">d</mi><mi>t</mi>
          </math>`
        },
        {
          input: 3,
          formula: `<math display="block" aria-label="f de x é igual a x ao quadrado menos oito x">
            <mi>f</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>=</mo>
            <msup><mi>x</mi><mn>2</mn></msup><mo>−</mo><mn>8</mn><mi>x</mi>
          </math>`
        },
        {
          input: 1,
          formula: `<math display="block" aria-label="f de x é igual a fatorial de x mais dois, menos quinze">
            <mi>f</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>=</mo>
            <mrow><mo>(</mo><mi>x</mi><mo>+</mo><mn>2</mn><mo>)</mo><mo>!</mo></mrow>
            <mo>−</mo><mn>15</mn>
          </math>`
        }
      ];
      const calculation = calculations[code];
      return `<li><span>Código ${code} · ${REGION_LABELS[region]}</span><strong>x = ${calculation.input}</strong>${calculation.formula}</li>`;
    }).join('')}</ol>
  </div>`;

  const render = () => {
    const disabled = view.blocked || completed;
    view.content.innerHTML = `<div class="mission-flow mission-13-flow">
      <div class="mission-actions"><button class="button ghost" type="button" data-reset>Reiniciar missão</button></div>
      <section class="mission-13-intro" ${stage === 'intro' ? '' : 'hidden'}>
        <p class="eyebrow">OPERAÇÃO VITRINE</p><h2>O golpe começa agora</h2>
        <p>A vitrine fechou com quatro peças dentro e o alarme apagou a senha. É sua hora de ficar rica: posicione as peças valiosas sem cruzar os sensores e use as casas certas para calibrar o cofre.</p>
        <button class="button primary" type="button" data-start>Iniciar o golpe</button>
      </section>
      <section class="mission-13-vitrine" ${stageReached(stage, 'vitrine') ? '' : 'hidden'}>
        <div><p class="eyebrow">ETAPA 1 · SENSORES</p><h2>Desarme a vitrine</h2><p>Coloque uma peça em cada linha, posição vertical e área. Duas peças não podem se tocar, nem pela diagonal. Os códigos no alto serão usados depois.</p></div>
        ${renderBoard(stage === 'vitrine' && !disabled)}
        <button class="button primary" type="button" data-check-board ${stage !== 'vitrine' || queens.length !== 4 || disabled ? 'disabled' : ''}>Verificar vitrine</button>
      </section>
      <section class="mission-13-disks" ${stageReached(stage, 'discos') ? '' : 'hidden'}>
        <div><p class="eyebrow">ETAPA 2 · COFRE</p><h2>Calcule o giro de cada pedra</h2><p>Cada código aponta para a pedra encontrada na vitrine. Resolva sua conta e aplique o resultado a partir da letra X.</p></div>
        ${renderCalibration()}
        <div class="mission-13-dials">${DIAL_ORDER.map((rowIndex) => {
          const code = MISSION_13_SOLUTION_COLUMNS[rowIndex];
          const letter = MISSION_13_CIPHER[code];
          const movement = dialMoves[code];
          const current = moveMission13Letter(letter, movement);
          const region = REGION_LABELS[MISSION_13_REGIONS[rowIndex][code]];
          const direction = movement === 0 ? 'posição inicial' : movement > 0 ? `${movement} para frente` : `${Math.abs(movement)} para trás`;
          return `<div class="mission-13-dial" role="group" data-dial="${code}" tabindex="${stage === 'discos' && !disabled ? '0' : '-1'}" aria-label="Disco ${region}, código ${code}, letra ${current}, ${direction}">
            <span>Código ${code} · ${region}</span><small>Início: ${letter}</small><strong aria-hidden="true">${current}</strong><small>${direction}</small>
            <div><button type="button" data-turn="back" data-index="${code}" aria-label="Girar disco ${region} uma letra para trás" ${stage === 'discos' && !disabled ? '' : 'disabled'}>−1</button><button type="button" data-turn="forward" data-index="${code}" aria-label="Girar disco ${region} uma letra para frente" ${stage === 'discos' && !disabled ? '' : 'disabled'}>+1</button></div>
          </div>`;
        }).join('')}</div>
        <button class="button primary" type="button" data-check-dials ${stage !== 'discos' || disabled ? 'disabled' : ''}>Testar combinação</button>
      </section>
      <section class="mission-13-anagram" ${stageReached(stage, 'anagrama') ? '' : 'hidden'}>
        <div><p class="eyebrow">ETAPA 3 · BANCADA</p><h2>As letras caíram fora do lugar</h2><p>Não sou o metal, nem a pedra sozinha. Sou aquilo que alguém escolhe, usa e guarda numa caixinha. O que sou?</p></div>
        <div class="mission-13-tiles" role="group" aria-label="Letras do anagrama">${anagram.map((letter, index) => `<button class="mission-13-tile${selectedAnagram === index ? ' is-selected' : ''}" type="button" data-tile="${index}" draggable="${stage === 'anagrama' && !disabled}" aria-pressed="${selectedAnagram === index}" ${stage === 'anagrama' && !disabled ? '' : 'disabled'}>${letter}</button>`).join('')}</div>
        <p class="mission-13-anagram-help">Selecione uma ficha e depois outra para trocá-las. Com o teclado, use Espaço e as setas.</p>
        <label class="mission-13-text-answer">Resposta em texto <input data-answer maxlength="20" autocomplete="off" spellcheck="false" value="${stage === 'anagrama' ? anagram.join('') : ''}" ${stage === 'anagrama' && !disabled ? '' : 'disabled'}></label>
        <button class="button primary" type="button" data-open ${stage !== 'anagrama' || disabled ? 'disabled' : ''}>Abrir o cofre</button>
      </section>
      <p class="mission-13-message" data-type="${messageType}" aria-live="polite">${message}</p>
      <section class="mission-13-success" ${stage === 'success' ? '' : 'hidden'}>
        <p class="eyebrow">COFRE ABERTO</p><h2>O vale é JOIA</h2><p>O alarme apagou. A riqueza agora é escolher a próxima.</p>
        <div class="mission-13-memories"><h3>Arquivo da vitrine</h3><p>Recordações, não pistas:</p><ul><li>Anel de Veneza</li><li>Anel com estrela da Disney</li><li>Colar com foto gravada</li><li>Brincos dourados</li><li>Qual será a próxima joia?</li></ul></div>
      </section>
    </div>`;
    bind();
  };

  const turnDial = (index, direction, restoreFocus = false) => {
    if (stage !== 'discos' || view.blocked || completed) return;
    dialMoves[index] = Math.max(-25, Math.min(25, dialMoves[index] + direction));
    save(); render();
    if (restoreFocus) view.content.querySelector(`[data-dial="${index}"]`)?.focus();
  };
  const swapTiles = (first, second, restoreFocus = false) => {
    [anagram[first], anagram[second]] = [anagram[second], anagram[first]];
    selectedAnagram = null; save(); render();
    if (restoreFocus) view.content.querySelector(`[data-tile="${second}"]`)?.focus();
  };
  const fail = (text = 'O alarme continua ligado.') => { announce(text, 'error'); view.fail(text); render(); };

  const bind = () => {
    view.content.querySelector('[data-reset]').addEventListener('click', reset);
    view.content.querySelector('[data-start]')?.addEventListener('click', () => { stage = 'vitrine'; save(); render(); });
    view.content.querySelectorAll('[data-cell]').forEach((cell) => cell.addEventListener('click', () => {
      const id = cell.dataset.cell;
      if (queens.includes(id)) { queens = queens.filter((value) => value !== id); marks.push(id); }
      else if (marks.includes(id)) marks = marks.filter((value) => value !== id);
      else if (queens.length < 4) queens.push(id);
      else { announce('Remova uma das quatro peças antes de escolher outra casa.', 'error'); }
      save(); render();
    }));
    view.content.querySelector('[data-check-board]')?.addEventListener('click', () => {
      if (!validateMission13Placement(queens)) return fail();
      stage = 'discos'; announce('Vitrine desarmada. As quatro linhas revelaram a calibragem.', 'success'); save(); render();
    });
    view.content.querySelectorAll('[data-turn]').forEach((button) => button.addEventListener('click', () => turnDial(Number(button.dataset.index), button.dataset.turn === 'back' ? -1 : 1)));
    view.content.querySelectorAll('[data-dial]').forEach((dial) => dial.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') { event.preventDefault(); turnDial(Number(dial.dataset.dial), -1, true); }
      if (event.key === 'ArrowRight' || event.key === 'ArrowUp') { event.preventDefault(); turnDial(Number(dial.dataset.dial), 1, true); }
    }));
    view.content.querySelector('[data-check-dials]')?.addEventListener('click', () => {
      if (!dialMoves.every((movement, index) => movement === MISSION_13_MOVEMENTS[index])) return fail();
      stage = 'anagrama'; anagram = getMission13Decoded(); announce('Combinação aceita. Quatro fichas caíram na bancada.', 'success'); save(); render();
    });
    let draggedTile = null;
    view.content.querySelectorAll('[data-tile]').forEach((tile) => {
      const index = Number(tile.dataset.tile);
      tile.addEventListener('dragstart', (event) => { draggedTile = index; event.dataTransfer?.setData('text/plain', String(index)); });
      tile.addEventListener('dragover', (event) => event.preventDefault());
      tile.addEventListener('drop', (event) => {
        event.preventDefault();
        const source = draggedTile ?? Number(event.dataTransfer?.getData('text/plain'));
        draggedTile = null;
        if (Number.isInteger(source) && source !== index) swapTiles(source, index, true);
      });
      tile.addEventListener('click', () => {
        if (selectedAnagram === null) { selectedAnagram = index; render(); view.content.querySelector(`[data-tile="${index}"]`)?.focus(); }
        else if (selectedAnagram === index) { selectedAnagram = null; render(); }
        else swapTiles(selectedAnagram, index);
      });
      tile.addEventListener('keydown', (event) => {
        if (event.key === ' ' || event.key === 'Enter') return;
        const delta = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0;
        if (!delta) return;
        event.preventDefault();
        const target = Math.max(0, Math.min(3, index + delta));
        if (target !== index) swapTiles(index, target, true);
      });
    });
    view.content.querySelector('[data-answer]')?.addEventListener('input', (event) => {
      const letters = [...normalizeText(event.target.value)];
      const expected = getMission13Decoded().slice().sort().join('');
      if (letters.length === 4 && letters.slice().sort().join('') === expected) { anagram = letters; save(); render(); view.content.querySelector('[data-answer]')?.focus(); }
    });
    view.content.querySelector('[data-open]')?.addEventListener('click', () => {
      const submitted = view.content.querySelector('[data-answer]')?.value ?? anagram.join('');
      if (!matchesAnswer(submitted, [MISSION_13_ANSWER])) return fail();
      stage = 'success'; save(); view.success('Cofre aberto. A última palavra estava na ordem certa.'); render();
    });
  };

  render();
  host.replaceChildren(view.root);
}
