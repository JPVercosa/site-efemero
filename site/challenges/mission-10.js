import { matchesAnswer } from '../core/normalize.js';
import { createMissionShell } from '../components/mission-shell.js';

export const MISSION_10_SCHEDULE = Object.freeze([
  Object.freeze({ id: 'odyssey', time: '17:10', title: 'The Odyssey', language: 'VO', subtitles: 'Básica', audience: 'Solo', reel: 'A' }),
  Object.freeze({ id: 'mare', time: '18:20', title: 'Linha de Maré', language: 'VOSTFR', subtitles: 'Baixa', audience: 'Casal', reel: 'B' }),
  Object.freeze({ id: 'red', time: '19:10', title: 'Noite em Vermelho', language: 'VOSTFR', subtitles: 'Média', audience: 'Casal', reel: 'C' }),
  Object.freeze({ id: 'obsession', time: '20:40', title: 'Obsession', language: 'VF', subtitles: 'Alta', audience: 'Grupo', reel: 'D' }),
  Object.freeze({ id: 'fold', time: '22:15', title: 'Última Dobra', language: 'VOSTFR', subtitles: 'Média', audience: 'Solo', reel: 'E' })
]);

export const MISSION_10_NOTES = Object.freeze([
  'A cópia procurada é legendada em francês; não é dublada.',
  'A legenda foi marcada como média pela cabine.',
  'É uma sessão para duas pessoas, não uma sessão solo ou de grupo.',
  'Ela entra depois da travessia e antes da sessão dublada.'
]);

// The scene cards are deliberately shuffled. Audio is the clue; the choices
// keep the extraction mechanic explicit without revealing an answer in prose.
export const MISSION_10_SOUNDS = Object.freeze([
  Object.freeze({ id: 'applause', scene: 'Cena A', timecode: '00:42', asset: 'applause-4.mp3', options: ['Passos', 'Porta', 'Aplauso'], answer: 'Aplauso', letter: 'A' }),
  Object.freeze({ id: 'echo', scene: 'Cena B', timecode: '00:25', asset: 'eco.mp3', options: ['Ruído', 'Eco', 'Silêncio'], answer: 'Eco', letter: 'E' }),
  Object.freeze({ id: 'chorus', scene: 'Cena C', timecode: '00:07', asset: 'coro.mp3', options: ['Coro', 'Solo', 'Sopro'], answer: 'Coro', letter: 'C' }),
  Object.freeze({ id: 'metronome', scene: 'Cena D', timecode: '00:33', asset: 'metronome.mp3', options: ['Chuva', 'Marcha', 'Metrônomo'], answer: 'Metrônomo', letter: 'M' }),
  Object.freeze({ id: 'ship', scene: 'Cena E', timecode: '00:19', asset: 'navio.mp3', options: ['Navio', 'Trem', 'Vento'], answer: 'Navio', letter: 'N' }),
  Object.freeze({ id: 'impact', scene: 'Cena F', timecode: '00:13', asset: 'impact.mp3', options: ['Ritmo', 'Impacto', 'Eco'], answer: 'Impacto', letter: 'I' })
]);

export const MISSION_10_TARGET_ID = 'red';
export const MISSION_10_ACCEPTED = Object.freeze(['CINEMA']);

function isTargetSession(session) {
  return session?.id === MISSION_10_TARGET_ID
    && session.language === 'VOSTFR'
    && session.subtitles === 'Média'
    && session.audience === 'Casal'
    && session.time > '18:20'
    && session.time < '20:40';
}

export function getMission10Timeline(answers = {}) {
  // Aceita a lista na ordem das cenas para manter a validação reutilizável em testes,
  // sem alterar o formato persistido pela interface (objeto por id).
  const answersById = Array.isArray(answers)
    ? Object.fromEntries(MISSION_10_SOUNDS.map((sound, index) => [sound.id, answers[index]]))
    : answers;
  return [...MISSION_10_SOUNDS]
    .sort((left, right) => left.timecode.localeCompare(right.timecode))
    .map((sound) => ({ ...sound, resolved: answersById[sound.id] === sound.answer }));
}

export function validateMission10Session(sessionId, answers = {}) {
  const timeline = getMission10Timeline(answers);
  const validSounds = timeline.every((sound) => sound.resolved);
  const validSession = isTargetSession(MISSION_10_SCHEDULE.find((item) => item.id === sessionId));
  return {
    validSession,
    validSounds,
    valid: validSession && validSounds,
    code: timeline.map((sound) => sound.letter).join(''),
    timeline
  };
}

function normalizeAnswers(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(MISSION_10_SOUNDS
    .filter((sound) => value[sound.id] === sound.answer)
    .map((sound) => [sound.id, sound.answer]));
}

function renderSceneCard(sound, answer) {
  const solved = answer === sound.answer;
  return `<article class="mission-10-sound-card${solved ? ' is-selected' : ''}" data-sound-card="${sound.id}">
    <header><span class="mission-10-timecode">${sound.timecode}</span><span>${sound.scene}</span></header>
    <audio controls preload="metadata" aria-label="Áudio da ${sound.scene}"><source src="assets/sounds/${sound.asset}" type="audio/mpeg">Seu navegador não consegue reproduzir este áudio.</audio>
    <div class="choice-list" role="group" aria-label="Escolhas para ${sound.scene}">
      ${sound.options.map((option) => `<button class="button ghost" type="button" data-sound-id="${sound.id}" data-sound-option="${option}" aria-pressed="${answer === option ? 'true' : 'false'}" ${solved ? 'disabled' : ''}>${option}</button>`).join('')}
    </div>
    <p class="sound-result">${solved ? 'Cena identificada.' : 'Ouça a cena e escolha o som que ela contém.'}</p>
  </article>`;
}

export function mountMission10(host, context) {
  const view = createMissionShell({ mission: context.mission, ...context });
  const saved = view.saved.stageData ?? {};
  let stage = ['intro', 'briefing', 'mix', 'answer', 'completed'].includes(saved.stage) ? saved.stage : 'intro';
  let sessionId = MISSION_10_SCHEDULE.some((session) => session.id === saved.sessionId) ? saved.sessionId : '';
  let soundAnswers = normalizeAnswers(saved.soundAnswers);
  if (stage === 'answer' && !validateMission10Session(sessionId, soundAnswers).valid) stage = 'mix';

  view.content.innerHTML = `
    <div class="mission-flow mission-10-flow">
      <div class="mission-actions"><button class="button ghost" type="button" data-reset>Reiniciar missão</button></div>
      <section data-stage="intro" ${stage === 'intro' ? '' : 'hidden'}>
        <p class="mission-10-logline">Uma cópia sem identificação chegou à cabine com seis cenas sonoras fora de ordem. Descubra a sessão certa e restaure o corte antes de a luz apagar.</p>
        <button class="button primary" type="button" data-start>Abrir arquivo da cabine</button>
      </section>
      <section data-stage="briefing" ${stage === 'briefing' ? '' : 'hidden'}>
        <div class="mission-10-briefing"><div><p class="eyebrow">NOTAS DO PROJECIONISTA</p><h2>Qual cópia entra na cabine?</h2></div><ol>${MISSION_10_NOTES.map((note) => `<li>${note}</li>`).join('')}</ol></div>
        <div class="table-wrap"><table class="data-table mission-schedule-table"><caption>Programação fictícia — escolha a cópia descrita pelas notas</caption><thead><tr><th>Escolher</th><th>Hora</th><th>Título</th><th>Idioma</th><th>Legenda</th><th>Público</th><th>Rolo</th></tr></thead><tbody>
          ${MISSION_10_SCHEDULE.map((item) => `<tr><td><input type="radio" name="session" value="${item.id}" ${item.id === sessionId ? 'checked' : ''} aria-label="Selecionar ${item.title}"></td><th scope="row">${item.time}</th><td>${item.title}</td><td>${item.language}</td><td>${item.subtitles}</td><td>${item.audience}</td><td>${item.reel}</td></tr>`).join('')}
        </tbody></table></div>
        <button class="button primary" type="button" data-confirm-session>Levar cópia à mesa de som</button>
      </section>
      <section data-stage="mix" ${stage === 'mix' ? '' : 'hidden'}>
        <div class="mission-10-mix-head"><div><p class="eyebrow">MESA DE MONTAGEM</p><h2>Identifique as cenas</h2><p>Os trechos chegaram fora de ordem. Ouça cada cena, escolha o som correto e use os timecodes para remontar a sequência.</p></div><p class="mission-10-progress" data-progress aria-live="polite"></p></div>
        <div class="mission-10-sound-grid" data-sound-grid>${MISSION_10_SOUNDS.map((sound) => renderSceneCard(sound, soundAnswers[sound.id])).join('')}</div>
        <button class="button primary" type="button" data-build-cut disabled>Montar corte recuperado</button>
      </section>
      <section data-stage="answer" ${stage === 'answer' ? '' : 'hidden'}>
        <div class="mission-10-mix-head"><div><p class="eyebrow">CORTE RECUPERADO</p><h2>Leia a claquete final</h2><p> Você já organizou a ordem. Agora resta ouvir o que cada escolha diz antes de começar.</p></div></div>
        <ol class="mission-10-timeline" data-timeline></ol>
        <form class="answer-form" data-form><label for="mission-10-answer">Qual palavra a claquete revela?</label><input id="mission-10-answer" name="answer" autocomplete="off" required><button class="button primary" type="submit">Validar senha</button></form>
      </section>
      <section data-stage="completed" ${stage === 'completed' ? '' : 'hidden'}><h2>Luzes, memória, ação</h2><p>O corte voltou à ordem original. Senha confirmada: <strong>CINEMA</strong>.</p></section>
      <section class="mission-bonus" data-bonus hidden><h2>Memória desbloqueada</h2><p>Cinemas franceses, filmes ganhadores do óscar, terror assustador, viagens intermináveis e muitas outras histórias que ainda estão por ser assistidas.</p></section>
    </div>`;

  const stages = [...view.content.querySelectorAll('[data-stage]')];
  const save = () => view.saveData({ stage, sessionId, soundAnswers });
  const showStage = (next) => {
    stage = next;
    stages.forEach((element) => { element.hidden = element.dataset.stage !== stage; });
    save();
  };
  const updateMix = () => {
    const resolved = Object.keys(soundAnswers).length;
    view.content.querySelector('[data-progress]').textContent = `${resolved} de ${MISSION_10_SOUNDS.length} cenas identificadas`;
    view.content.querySelector('[data-build-cut]').disabled = resolved !== MISSION_10_SOUNDS.length;
  };
  const renderTimeline = () => {
    const timeline = getMission10Timeline(soundAnswers);
    view.content.querySelector('[data-timeline]').innerHTML = timeline.map((sound, index) => `<li><span>${String(index + 1).padStart(2, '0')} · ${sound.timecode}</span><strong>${sound.answer}</strong></li>`).join('');
  };
  const bindOptions = () => {
    view.content.querySelectorAll('[data-sound-option]').forEach((button) => button.addEventListener('click', () => {
      if (view.blocked) return;
      const sound = MISSION_10_SOUNDS.find((item) => item.id === button.dataset.soundId);
      if (button.dataset.soundOption !== sound.answer) {
        view.fail('Essa escolha não corresponde ao que se ouve na cena.');
        return;
      }
      soundAnswers[sound.id] = sound.answer;
      view.content.querySelector(`[data-sound-card="${sound.id}"]`).outerHTML = renderSceneCard(sound, sound.answer);
      save();
      updateMix();
    }));
  };

  view.content.querySelector('[data-start]').addEventListener('click', () => showStage('briefing'));
  view.content.querySelector('[data-reset]').addEventListener('click', () => {
    context.store.clear(context.mission.id);
    mountMission10(host, context);
  });
  view.content.querySelector('[data-confirm-session]').addEventListener('click', () => {
    if (view.blocked) return;
    sessionId = view.content.querySelector('input[name="session"]:checked')?.value ?? '';
    const selected = MISSION_10_SCHEDULE.find((item) => item.id === sessionId);
    if (!validateMission10Session(sessionId).validSession) {
      save();
      view.fail(selected ? 'Essa cópia contradiz pelo menos uma nota da cabine.' : 'Escolha uma cópia antes de continuar.');
      return;
    }
    showStage('mix');
  });
  bindOptions();
  view.content.querySelector('[data-build-cut]').addEventListener('click', () => {
    if (view.blocked || !validateMission10Session(sessionId, soundAnswers).validSounds) return;
    renderTimeline();
    showStage('answer');
  });
  view.content.querySelector('[data-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    if (view.blocked) return;
    const result = validateMission10Session(sessionId, soundAnswers);
    if (!result.valid || !matchesAnswer(event.currentTarget.answer.value, MISSION_10_ACCEPTED)) {
      view.fail('A claquete ainda não confere com o corte restaurado.');
      return;
    }
    showStage('completed');
    view.success('A sessão certa e a sequência sonora revelaram a memória.');
    view.content.querySelector('[data-bonus]').hidden = false;
  });

  updateMix();
  if (stage === 'answer') renderTimeline();
  if (view.saved.completed) {
    showStage('completed');
    view.content.querySelector('[data-bonus]').hidden = false;
  }
  host.replaceChildren(view.root);
}
