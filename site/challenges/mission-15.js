import { matchesAnswer } from '../core/normalize.js';
import { createMissionShell } from '../components/mission-shell.js';

export const MISSION_15_ANSWER = 'CAIXA DE CORREIOS';

export const MISSION_15_STANZAS = Object.freeze([
  Object.freeze([
    'Tenho boca, mas calada; tenho porta, sem entrar,',
    'engulo o que vem de longe sem jamais me alimentar.',
    'Não sou quarto, nem armário, mas sei bem acomodar',
    'pequenas coisas que alguém manda o mundo atravessar.'
  ]),
  Object.freeze([
    'Guardo nomes e destinos sem a rota percorrer;',
    'quem me visita traz volumes, quem me abre vai receber.',
    'Roupinhas chegam amiúde, quase sempre ao meu abrigo,',
    'e o mais óbvio dos lugares fez-se o melhor esconderijo.'
  ]),
  Object.freeze([
    'Antes da segunda entrada, onde o prédio é de todos,',
    'perto do que leva embora o que já não serve a nós,',
    'muitas portas bem iguais fazem fila, lado a lado;',
    'procure abaixo, pelo doze, o pequeno reservado.'
  ]),
  Object.freeze([
    'Meu nome junta mais palavras — eis uma pista, não a sorte —,',
    'trago recados sem falar e fico imóvel no transporte.',
    'Se por fora nada surge, olhe dentro com cuidado:',
    'o segredo, muito discreto, pode estar ali colado.'
  ]),
  Object.freeze([
    'Não o puxe com violência, dê-lhe tempo ao retirar;',
    'papel rasgado perde versos que ainda querem te encontrar.',
    'E, se mesmo procurando o paradeiro se ocultar,',
    'ele está onde a resposta diz: com o autor deves falar.'
  ])
]);

export function isMission15Answer(value) {
  return matchesAnswer(value, [MISSION_15_ANSWER]);
}

function renderRiddle() {
  return MISSION_15_STANZAS
    .map((lines) => `<p>${lines.join('<br>')}</p>`)
    .join('');
}

export function mountMission15(host, context) {
  const view = createMissionShell({
    mission: context.mission,
    ...context,
    persistAttempts: false
  });
  const saved = view.saved.stageData ?? {};
  let stage = view.saved.completed || saved.stage === 'success' ? 'success' : saved.stage === 'charada' ? 'charada' : 'intro';
  let errors = Number.isInteger(saved.errors) && saved.errors >= 0 ? saved.errors : 0;

  view.content.innerHTML = `
    <div class="mission-flow mission-15-flow">
      <div class="mission-actions"><button class="button ghost" type="button" data-reset>Reiniciar missão</button></div>
      <section class="mission-15-intro" data-stage="intro" ${stage === 'intro' ? '' : 'hidden'}>
        <p class="eyebrow">A ÚLTIMA ENTREGA</p>
        <h2>Só resta uma charada</h2>
        <p>Depois de tantos desafios, o último caminho cabe em alguns versos.</p>
        <button class="button primary" type="button" data-start>Ler a charada</button>
      </section>
      <section class="mission-15-riddle" data-stage="charada" ${stage === 'charada' ? '' : 'hidden'}>
        <header><p class="eyebrow">ÚLTIMA MILHA</p><h2>Onde está a carta?</h2></header>
        <blockquote class="mission-15-poem">${renderRiddle()}</blockquote>
        <form class="answer-form mission-15-answer" data-form novalidate>
          <label for="mission-15-answer">Qual é a resposta da charada?</label>
          <div><input id="mission-15-answer" name="answer" autocomplete="off" spellcheck="false"><button class="button primary" type="submit">Enviar resposta</button></div>
        </form>
        <p class="mission-15-message" data-message aria-live="polite"></p>
      </section>
      <section class="mission-15-success" data-stage="success" ${stage === 'success' ? '' : 'hidden'}>
        <p class="eyebrow">ROTA ENCONTRADA</p>
        <h2>Última rota encontrada.</h2>
        <p>Agora procure a carta no lugar revelado.</p>
      </section>
    </div>`;

  const stages = [...view.content.querySelectorAll('[data-stage]')];
  const message = view.content.querySelector('[data-message]');
  const save = () => view.saveData({ stage, errors });
  const showStage = (next) => {
    stage = next;
    stages.forEach((element) => { element.hidden = element.dataset.stage !== stage; });
    save();
  };

  view.content.querySelector('[data-start]').addEventListener('click', () => {
    showStage('charada');
    view.content.querySelector('#mission-15-answer').focus();
  });

  view.content.querySelector('[data-reset]').addEventListener('click', () => {
    context.store.clear(context.mission.id);
    mountMission15(host, context);
  });

  view.content.querySelector('[data-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = event.currentTarget.elements.answer;
    if (!input.value.trim()) {
      message.dataset.type = 'error';
      message.textContent = 'Escreva uma resposta antes de enviar.';
      input.focus();
      return;
    }
    if (!isMission15Answer(input.value)) {
      errors += 1;
      save();
      message.dataset.type = 'error';
      message.textContent = 'Ainda não. Releia a charada e tente outra vez.';
      input.select();
      return;
    }
    showStage('success');
    view.success('A última rota foi encontrada. Agora procure a carta no lugar revelado.');
  });

  host.replaceChildren(view.root);
}
