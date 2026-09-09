import { matchesAnswer, normalizeText } from '../core/normalize.js';
import { createMissionShell } from '../components/mission-shell.js';

export const MISSION_09_GRID = Object.freeze({
  columns: 18,
  rows: 9,
  squares: 162
});

export const MISSION_09_MAX_ATTEMPTS = 7;
export const MISSION_09_FINAL_ANSWER = Object.freeze(['PRAIA', 'A PRAIA']);

export const MISSION_09_FLAGS = Object.freeze([
  Object.freeze({ country: 'Brasil', src: './assets/flags/br.svg' }),
  Object.freeze({ country: 'Grécia', src: './assets/flags/gr.svg' }),
  Object.freeze({ country: 'Croácia', src: './assets/flags/hr.svg' })
]);

// Lista baseada nos topônimos em português recomendados pela FUNAG/Itamaraty.
// Fonte editorial: https://funag.gov.br/manual/index.php?title=Top%C3%B4nimos_e_gent%C3%ADlicos
export const MISSION_09_COUNTRIES = Object.freeze([
  'Afeganistão', 'África do Sul', 'Albânia', 'Alemanha', 'Andorra', 'Angola',
  'Antígua e Barbuda', 'Arábia Saudita', 'Argélia', 'Argentina', 'Armênia',
  'Austrália', 'Áustria', 'Azerbaijão', 'Bahamas', 'Bahrein', 'Bangladesh',
  'Barbados', 'Belarus', 'Bélgica', 'Belize', 'Benin', 'Bolívia',
  'Bósnia e Herzegovina', 'Botsuana', 'Brasil', 'Brunei', 'Bulgária',
  'Burkina Faso', 'Burundi', 'Butão', 'Cabo Verde', 'Camarões', 'Camboja',
  'Canadá', 'Catar', 'Cazaquistão', 'Chade', 'Chile', 'China', 'Chipre',
  'Colômbia', 'Comores', 'Congo', 'Coreia do Norte', 'Coreia do Sul',
  'Costa do Marfim', 'Costa Rica', 'Croácia', 'Cuba', 'Dinamarca', 'Djibuti',
  'Dominica', 'Egito', 'El Salvador', 'Emirados Árabes Unidos', 'Equador',
  'Eritreia', 'Eslováquia', 'Eslovênia', 'Espanha', 'Essuatíni', 'Estados Unidos',
  'Estônia', 'Etiópia', 'Fiji', 'Filipinas', 'Finlândia', 'França', 'Gabão',
  'Gâmbia', 'Gana', 'Geórgia', 'Granada', 'Grécia', 'Guatemala', 'Guiana',
  'Guiné', 'Guiné-Bissau', 'Guiné Equatorial', 'Haiti', 'Honduras', 'Hungria',
  'Iêmen', 'Ilhas Marshall', 'Ilhas Salomão', 'Índia', 'Indonésia', 'Irã',
  'Iraque', 'Irlanda', 'Islândia', 'Israel', 'Itália', 'Jamaica', 'Japão',
  'Jordânia', 'Kiribati', 'Kuwait', 'Laos', 'Lesoto', 'Letônia', 'Líbano',
  'Libéria', 'Líbia', 'Liechtenstein', 'Lituânia', 'Luxemburgo', 'Macedônia do Norte',
  'Madagascar', 'Malásia', 'Malaui', 'Maldivas', 'Mali', 'Malta', 'Marrocos',
  'Maurício', 'Mauritânia', 'México', 'Mianmar', 'Micronésia', 'Moçambique',
  'Moldova', 'Mônaco', 'Mongólia', 'Montenegro', 'Namíbia', 'Nauru', 'Nepal',
  'Nicarágua', 'Níger', 'Nigéria', 'Noruega', 'Nova Zelândia', 'Omã',
  'Países Baixos', 'Palau', 'Palestina', 'Panamá', 'Papua-Nova Guiné', 'Paquistão',
  'Paraguai', 'Peru', 'Polônia', 'Portugal', 'Quênia', 'Quirguistão', 'Reino Unido',
  'República Centro-Africana', 'República Democrática do Congo', 'República Dominicana',
  'República Tcheca', 'Romênia', 'Ruanda', 'Rússia', 'Samoa', 'São Cristóvão e Névis', 'São Marino',
  'São Tomé e Príncipe', 'São Vicente e Granadinas', 'Santa Lúcia', 'Senegal', 'Sérvia',
  'Serra Leoa', 'Seychelles', 'Singapura', 'Síria', 'Somália', 'Sri Lanka',
  'Sudão', 'Sudão do Sul', 'Suécia', 'Suíça', 'Suriname', 'Tailândia', 'Tajiquistão',
  'Tanzânia', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad e Tobago', 'Tunísia',
  'Turcomenistão', 'Turquia', 'Tuvalu', 'Ucrânia', 'Uganda', 'Uruguai',
  'Uzbequistão', 'Vanuatu', 'Vaticano', 'Venezuela', 'Vietnã', 'Zâmbia', 'Zimbábue'
]);

const NORMALIZED_FLAG_COUNTRIES = MISSION_09_FLAGS.map(({ country }) => normalizeText(country));
const NORMALIZED_COUNTRIES = new Map(MISSION_09_COUNTRIES.map((country) => [normalizeText(country), country]));

export function identifyMission09Flag(value = '') {
  return NORMALIZED_FLAG_COUNTRIES.indexOf(normalizeText(value));
}

export function getValidMission09Country(value = '') {
  return NORMALIZED_COUNTRIES.get(normalizeText(value)) ?? null;
}

function randomIndex(length, random) {
  const candidate = typeof random === 'function' ? random() : Math.random();
  const value = Number.isFinite(candidate) ? candidate : 0;
  return Math.max(0, Math.min(length - 1, Math.floor(value * length)));
}

function unrevealedCells(cells) {
  const revealed = new Set(cells);
  return Array.from({ length: MISSION_09_GRID.squares }, (_, index) => index)
    .filter((index) => !revealed.has(index));
}

export function revealOneSquare(revealed, random = Math.random) {
  return revealed.map((cells) => {
    const remaining = unrevealedCells(cells);
    if (!remaining.length) return [...cells];
    return [...cells, remaining[randomIndex(remaining.length, random)]];
  });
}

export function revealCorrectFlag(revealed, flagIndex, random = Math.random) {
  return revealed.map((cells, index) => {
    if (index === flagIndex) return Array.from({ length: MISSION_09_GRID.squares }, (_, cell) => cell);
    const remaining = unrevealedCells(cells);
    if (!remaining.length) return [...cells];
    return [...cells, remaining[randomIndex(remaining.length, random)]];
  });
}

function renderCells(flagIndex, revealed) {
  const cells = new Set(revealed);
  return Array.from({ length: MISSION_09_GRID.squares }, (_, index) => `
    <span class="mission-09-cover-cell${cells.has(index) ? ' is-open' : ''}" data-flag="${flagIndex}" data-cell="${index}" aria-hidden="true"></span>
  `).join('');
}

function renderFlag(flag, index, revealed) {
  const count = revealed[index].length;
  const solved = count === MISSION_09_GRID.squares;
  const accessibleName = solved
    ? `Bandeira ${index + 1} revelada: ${flag.country}.`
    : `Bandeira ${index + 1}, coberta. ${count} de ${MISSION_09_GRID.squares} quadrados revelados.`;
  const imageAlt = solved
    ? `Bandeira ${flag.country}.`
    : `Bandeira ${index + 1}, parcialmente coberta por uma grade de ${MISSION_09_GRID.squares} quadrados.`;
  return `
    <figure class="mission-09-flag-card${solved ? ' is-solved' : ''}" data-flag-card="${index}">
      <div class="mission-09-flag-frame" data-flag-frame="${index}" role="img" aria-label="${accessibleName}">
        <img src="${flag.src}" alt="${imageAlt}" />
        <div class="mission-09-cover-grid">${renderCells(index, revealed[index])}</div>
      </div>
      <figcaption>
        <span class="mission-09-flag-label">Bandeira ${index + 1}</span>
        <strong data-flag-name>${solved ? flag.country : 'Ainda escondida'}</strong>
        <span data-flag-count>${solved ? 'Bandeira descoberta' : `${count} / ${MISSION_09_GRID.squares} quadrados revelados`}</span>
      </figcaption>
    </figure>`;
}

export function mountMission09(host, context) {
  const view = createMissionShell({
    mission: context.mission,
    ...context,
    persistAttempts: false
  });
  view.root.classList.add('mission-vale-praia');

  let attempts = 0;
  let revealed = MISSION_09_FLAGS.map(() => []);
  let solved = MISSION_09_FLAGS.map(() => false);
  let finished = false;
  let guessHistory = [];

  view.content.innerHTML = `
    <div class="mission-09-game">
      <div class="mission-09-actions">
        <button class="button secondary" data-reset type="button">Reiniciar jogo</button>
      </div>
      <section class="mission-09-brief" aria-labelledby="mission-09-how-to-play">
        <div>
          <h2 id="mission-09-how-to-play">Adivinhe as três bandeiras</h2>
          <p>As imagens estão cobertas por ${MISSION_09_GRID.squares} quadradinhos. O primeiro chute é totalmente no escuro; cada erro abre um quadradinho de cada bandeira.</p>
        </div>
        <p class="mission-09-attempts" data-attempts aria-live="polite"></p>
      </section>
      <div class="mission-09-flags" data-flags aria-label="Três bandeiras cobertas"></div>
      <p class="mission-09-message" data-message aria-live="polite"></p>
      <ol class="mission-09-guess-grid" data-guess-grid aria-label="Histórico dos sete chutes"></ol>
      <form class="mission-09-answer-form" data-country-form>
        <label for="mission-09-country">Qual país você reconhece?</label>
        <div class="mission-09-input-row">
          <input id="mission-09-country" name="country" list="mission-09-country-list" autocomplete="off" autocapitalize="words" spellcheck="false" placeholder="Digite um país" required />
          <button class="button primary" type="submit">Dar chute</button>
        </div>
        <datalist id="mission-09-country-list">${MISSION_09_COUNTRIES.map((country) => `<option value="${country}"></option>`).join('')}</datalist>
        <small>As sugestões seguem a grafia em português do Brasil.</small>
      </form>
      <section class="mission-09-riddle" data-riddle hidden aria-labelledby="mission-09-riddle-title">
        <p class="eyebrow">ÚLTIMA PISTA</p>
        <h2 id="mission-09-riddle-title">A charada da saudade</h2>
        <p>No Brasil, é paisagem. Na França, é saudade. <br>
        Na Grécia e na Croácia foi destino. <br>
        A primeira bandeira guarda aquilo que um dia foi cotidiano. <br>
        As outras duas, de onde fomos buscá-la outra vez. <br>
        Na França, ela sempre fez falta. <br></p>
        
        <form class="mission-09-answer-form" data-riddle-form>
          <label for="mission-09-riddle-answer">Qual palavra responde a charada?</label>
          <div class="mission-09-input-row">
            <input id="mission-09-riddle-answer" name="riddle-answer" autocomplete="off" placeholder="Uma palavra" required />
            <button class="button primary" type="submit">Fechar a charada</button>
          </div>
        </form>
      </section>
      <section class="mission-09-bonus" data-bonus hidden>
        <h2>Vale-praia desbloqueado</h2>
        <p>As bandeiras apontam para as viagens, o verão e aquele lugar onde toda lembrança fica mais ensolarada.</p>
      </section>
    </div>`;

  const flagsElement = view.content.querySelector('[data-flags]');
  const attemptsElement = view.content.querySelector('[data-attempts]');
  const messageElement = view.content.querySelector('[data-message]');
  const guessGridElement = view.content.querySelector('[data-guess-grid]');
  const countryForm = view.content.querySelector('[data-country-form]');
  const countryInput = view.content.querySelector('#mission-09-country');
  const riddle = view.content.querySelector('[data-riddle]');
  const riddleForm = view.content.querySelector('[data-riddle-form]');
  const riddleInput = view.content.querySelector('#mission-09-riddle-answer');
  const bonus = view.content.querySelector('[data-bonus]');

  function render() {
    flagsElement.innerHTML = MISSION_09_FLAGS.map((flag, index) => renderFlag(flag, index, revealed)).join('');
    const next = Math.min(attempts + 1, MISSION_09_MAX_ATTEMPTS);
    attemptsElement.textContent = attempts < MISSION_09_MAX_ATTEMPTS
      ? `${next} de ${MISSION_09_MAX_ATTEMPTS} chutes${attempts === 0 ? ' · chute cego' : ''}`
      : 'Chutes encerrados';
    guessGridElement.innerHTML = Array.from({ length: MISSION_09_MAX_ATTEMPTS }, (_, index) => {
      const guess = guessHistory[index];
      return `<li class="mission-09-guess-slot${guess ? ' is-filled' : ''}" aria-label="${guess ? `Chute ${index + 1}: ${guess}` : `Chute ${index + 1}: vazio`}">${guess ?? '—'}</li>`;
    }).join('');
  }

  function setMessage(text, type = '') {
    messageElement.textContent = text;
    messageElement.dataset.type = type;
  }

  function endCountryRound() {
    countryInput.disabled = true;
    countryForm.querySelector('button').disabled = true;
  }

  function showRiddle() {
    riddle.hidden = false;
    countryInput.disabled = true;
    countryForm.querySelector('button').disabled = true;
    setMessage('As três bandeiras foram descobertas. Agora falta relacionar as viagens.', 'success');
    riddleInput.focus();
  }

  countryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (finished || attempts >= MISSION_09_MAX_ATTEMPTS) return;

    const flagIndex = identifyMission09Flag(countryInput.value);
    const validCountry = getValidMission09Country(countryInput.value);
    if (!validCountry) {
      setMessage('Escolha um país da lista de sugestões para registrar o chute.', 'error');
      countryInput.select();
      return;
    }

    if (flagIndex !== -1 && solved[flagIndex]) {
      setMessage('Essa bandeira já foi descoberta. Tente outro país.', 'error');
      countryInput.select();
      return;
    }

    attempts += 1;
    guessHistory.push(validCountry);
    if (flagIndex === -1) {
      revealed = revealOneSquare(revealed);
      setMessage('Ainda não. Um quadradinho de cada bandeira foi aberto.', 'error');
    } else {
      solved = solved.map((value, index) => value || index === flagIndex);
      revealed = revealCorrectFlag(revealed, flagIndex);
      setMessage(`Acertou ${MISSION_09_FLAGS[flagIndex].country}! Essa bandeira foi revelada inteira.`, 'success');
    }

    countryInput.value = '';
    render();
    if (solved.every(Boolean)) {
      showRiddle();
    } else if (attempts >= MISSION_09_MAX_ATTEMPTS) {
      endCountryRound();
      setMessage('Os sete chutes acabaram. Atualize a página para embaralhar novas aberturas.', 'error');
    } else {
      countryInput.focus();
    }
  });

  riddleForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!solved.every(Boolean) || finished) return;
    if (!matchesAnswer(riddleInput.value, MISSION_09_FINAL_ANSWER)) {
      setMessage('Quase. Pense no lugar que une o verão, e a aquilo que sentimos saudade em Paris.', 'error');
      riddleInput.select();
      return;
    }
    finished = true;
    bonus.hidden = false;
    riddleInput.disabled = true;
    riddleForm.querySelector('button').disabled = true;
    view.success('As bandeiras e a charada formaram a memória certa.');
  });

  view.content.querySelector('[data-reset]').addEventListener('click', () => {
    context.store.clear(context.mission.id);
    window.location.reload();
  });

  render();
  host.replaceChildren(view.root);
}
