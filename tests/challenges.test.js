import test from 'node:test';
import assert from 'node:assert/strict';
import { MISSIONS } from '../site/challenges/registry.js';
import { MISSION_01_ACCEPTED } from '../site/challenges/mission-01.js';
import { MISSION_03_PANELS } from '../site/challenges/mission-03.js';
import {
  MISSION_05_EXTRACTION_INDICES,
  MISSION_05_PANELS
} from '../site/challenges/mission-05.js';
import { matchesAnswer, normalizeText } from '../site/core/normalize.js';
import {
  MISSION_07_FEASIBLE_ROUTES,
  MISSION_07_ROUTE,
  MISSION_07_NODES,
  MISSION_07_OPTIMAL,
  MISSION_07_OPTIMAL_ROUTE,
  validateMission07Route
} from '../site/challenges/mission-07.js';
import {
  MISSION_10_SCHEDULE,
  MISSION_10_SOUNDS,
  validateMission10Session
} from '../site/challenges/mission-10.js';
import {
  MISSION_09_FLAGS,
  MISSION_09_COUNTRIES,
  MISSION_09_GRID,
  MISSION_09_FINAL_ANSWER,
  MISSION_09_MAX_ATTEMPTS,
  getValidMission09Country,
  identifyMission09Flag,
  revealCorrectFlag,
  revealOneSquare
} from '../site/challenges/mission-09.js';

test('registro implementa as missões prontas para esta entrega', () => {
  assert.deepEqual(MISSIONS.filter((mission) => mission.implemented).map((mission) => mission.id), [1, 3, 5, 7, 9, 10, 11, 12]);
  assert.equal(MISSIONS.filter((mission) => !mission.implemented).length, 3);
});

test('missão 01 aceita a classificação canônica', () => {
  assert.equal(MISSION_01_ACCEPTED.some((answer) => normalizeText(answer) === 'EXPERIENCIAS'), true);
});

test('missão 03 possui quatro painéis com iniciais VALE', () => {
  assert.equal(MISSION_03_PANELS.length, 4);
  assert.equal(MISSION_03_PANELS.map((panel) => panel.letter).sort().join(''), 'AELV');
  assert.equal(MISSION_03_PANELS.every((panel) => panel.options.includes(panel.answer)), true);
});

test('missão 05 possui extração ACAI e quatro bancos fechados', () => {
  assert.equal(MISSION_05_PANELS.length, 4);
  assert.equal(MISSION_05_PANELS.map((panel) => panel.extracted).join(''), 'ACAI');
  assert.equal(MISSION_05_PANELS.every((panel) => panel.candidates.includes(panel.answer)), true);
  assert.deepEqual(MISSION_05_PANELS.map((panel) => panel.index), [6, 1, 3, 3]);
});

test('missão 05 extrai a resposta usando índices zero-based', () => {
  assert.deepEqual(MISSION_05_EXTRACTION_INDICES, [0, 1, 2, 3]);
  assert.equal(
    ['ALHO', 'IÇAR', 'CEAR', 'WIFI']
      .map((word, index) => [...word][MISSION_05_EXTRACTION_INDICES[index]])
      .join(''),
    'AÇAI'
  );
});

test('missão 05 aceita AÇAÍ com ou sem diacríticos', () => {
  const accepted = ['AÇAÍ', 'açaí', 'AÇAI', 'ACAI'];

  assert.equal(
    accepted.every((answer) => matchesAnswer(answer, ['AÇAÍ'])),
    true
  );
  assert.equal(matchesAnswer('ACAI EXTRA', ['AÇAÍ']), false);
});

test('missão 07 possui múltiplas rotas e uma única rota ótima IFOOD', () => {
  const result = validateMission07Route(MISSION_07_ROUTE);
  const detourIds = new Set(['K', 'G', 'E', 'L']);
  const detourRoutes = MISSION_07_FEASIBLE_ROUTES.filter((route) => route.route.some((id) => detourIds.has(id)));

  assert.equal(MISSION_07_NODES.length, 9);
  assert.equal(result.valid, true);
  assert.equal(result.code, 'IFOOD');
  assert.deepEqual(result.schedule.map((item) => item.serviceStart), ['08:02', '08:10', '08:18', '08:26', '08:34']);
  assert.equal(MISSION_07_FEASIBLE_ROUTES.length >= 12, true);
  assert.equal(detourRoutes.length >= 4, true);
  assert.deepEqual(MISSION_07_OPTIMAL_ROUTE, MISSION_07_ROUTE);
  assert.equal(MISSION_07_OPTIMAL.packages, 63);
  assert.equal(MISSION_07_OPTIMAL.elapsed, 38);
  assert.equal(detourRoutes.every((route) => route.packages <= MISSION_07_OPTIMAL.packages), true);
  assert.equal(Math.min(...detourRoutes.map((route) => route.elapsed)) > MISSION_07_OPTIMAL.elapsed, true);
  assert.equal(detourRoutes.every((route) => route.efficiency < MISSION_07_OPTIMAL.efficiency), true);
  assert.equal(validateMission07Route(['I', 'O1', 'F', 'O2', 'D']).valid, true);
  assert.equal(validateMission07Route(['I', 'K', 'F', 'O1', 'O2', 'D']).valid, false);
  const overdrawnRoute = validateMission07Route(['I', 'F', 'O2', 'L', 'D']);
  assert.equal(overdrawnRoute.remainingPackages, -4);
  assert.equal(overdrawnRoute.valid, false);
  assert.equal(overdrawnRoute.reason, 'O número de pacotes restantes ficou negativo (-4).');
  assert.equal(validateMission07Route(['I', 'F', 'O1', 'O2', 'D', 'G']).valid, false);
});

test('missão 10 seleciona a sessão 19:10 e extrai CINEMA', () => {
  const target = MISSION_10_SCHEDULE.find((session) => session.time === '19:10');
  const answers = MISSION_10_SOUNDS.map((sound) => sound.answer);
  const result = validateMission10Session(target.id, answers);

  assert.equal(result.valid, true);
  assert.equal(result.code, 'CINEMA');
  assert.equal(validateMission10Session('mare', answers).validSession, false);
  assert.equal(validateMission10Session(target.id, answers.slice(0, 5)).valid, false);
});

test('missão 09 usa três bandeiras em grades de 162 quadrados e sete chutes', () => {
  assert.equal(MISSION_09_FLAGS.length, 3);
  assert.equal(MISSION_09_COUNTRIES.length, 195);
  assert.deepEqual(MISSION_09_GRID, { columns: 18, rows: 9, squares: 162 });
  assert.equal(MISSION_09_MAX_ATTEMPTS, 7);
  assert.equal(identifyMission09Flag('grÉcia'), 1);
  assert.equal(identifyMission09Flag('Croacia'), 2);
  assert.equal(identifyMission09Flag('Portugal'), -1);
  assert.equal(getValidMission09Country('brasil'), 'Brasil');
  assert.equal(getValidMission09Country('País inventado'), null);
  assert.deepEqual(revealOneSquare([[], [], []], () => 0).map((cells) => cells.length), [1, 1, 1]);
  assert.equal(revealCorrectFlag([[], [], []], 1, () => 0)[1].length, 162);
  assert.equal(matchesAnswer('a praia', MISSION_09_FINAL_ANSWER), true);
});
