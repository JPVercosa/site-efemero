import test from 'node:test';
import assert from 'node:assert/strict';
import { MISSIONS } from '../site/challenges/registry.js';
import { matchesAnswer } from '../site/core/normalize.js';
import {
  MISSION_14_ANSWER,
  MISSION_14_BOARD_ORDER,
  MISSION_14_LEGEND,
  MISSION_14_RETURNS_DISABLED_AT,
  MISSION_14_SPECIALS,
  resolveMission14Move,
  rollMission14Die
} from '../site/challenges/mission-14.js';

test('registro libera a missão 14 e a legenda guarda a resposta', () => {
  assert.equal(MISSIONS.find(({ id }) => id === 14)?.implemented, true);
  assert.equal(MISSION_14_LEGEND.map(({ name }) => name[0]).join(''), MISSION_14_ANSWER);
  assert.equal(matchesAnswer('c a r t a', [MISSION_14_ANSWER]), true);
  assert.equal(matchesAnswer('35A86', [MISSION_14_ANSWER]), false);
});

test('tabuleiro tem 64 casas em percurso serpentino', () => {
  assert.equal(MISSION_14_BOARD_ORDER.length, 64);
  assert.equal(new Set(MISSION_14_BOARD_ORDER).size, 64);
  assert.deepEqual(MISSION_14_BOARD_ORDER.slice(0, 8), [64, 63, 62, 61, 60, 59, 58, 57]);
  assert.deepEqual(MISSION_14_BOARD_ORDER.slice(-8), [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.equal(MISSION_14_RETURNS_DISABLED_AT, 45);
  assert.deepEqual(
    Object.entries(MISSION_14_SPECIALS).filter(([, special]) => special.type === 'retorno').map(([house]) => Number(house)),
    [8, 11, 15, 22, 24, 31, 35, 40, 46, 53, 57, 60, 62]
  );
});

test('dado injetável cobre os limites 1 e 6', () => {
  assert.equal(rollMission14Die(() => 0), 1);
  assert.equal(rollMission14Die(() => 0.999999), 6);
  assert.equal(rollMission14Die(() => -1), 1);
  assert.equal(rollMission14Die(() => 1), 6);
});

test('atalhos, trânsito e abrigo resolvem uma única vez', () => {
  assert.deepEqual(resolveMission14Move({ position: 2, roll: 2, countedRolls: 2 }).position, 12);
  const traffic = resolveMission14Move({ position: 3, roll: 3, countedRolls: 3 });
  assert.equal(traffic.position, 3);
  assert.equal(traffic.effect, 'transito');
  assert.equal(resolveMission14Move({ position: 11, roll: 3, countedRolls: 4 }).shelter, true);
  const shortcut = resolveMission14Move({ position: 26, roll: 2, countedRolls: 4 });
  assert.equal(shortcut.position, 39);
  assert.equal(shortcut.effect, 'atalho');
});

test('retornos respeitam início protegido, abrigo e desativação na jogada 45', () => {
  const early = resolveMission14Move({ position: 9, roll: 6, countedRolls: 0 });
  assert.equal(early.position, 15);
  assert.equal(early.effect, 'retorno-inativo');

  const active = resolveMission14Move({ position: 9, roll: 6, countedRolls: 2 });
  assert.equal(active.position, 7);
  assert.equal(active.effect, 'retorno');

  const protectedMove = resolveMission14Move({ position: 18, roll: 6, countedRolls: 4, shelter: true });
  assert.equal(protectedMove.position, 24);
  assert.equal(protectedMove.shelter, false);
  assert.equal(protectedMove.effect, 'retorno-protegido');

  const twentieth = resolveMission14Move({ position: 9, roll: 6, countedRolls: MISSION_14_RETURNS_DISABLED_AT - 1 });
  assert.equal(twentieth.countedRolls, 45);
  assert.equal(twentieth.returnsDisabled, true);
  assert.equal(twentieth.position, 15);
  assert.equal(twentieth.effect, 'retorno-inativo');
  assert.equal(twentieth.completed, false);
});

test('chegada aceita alcançar ou ultrapassar a casa 64', () => {
  const exact = resolveMission14Move({ position: 60, roll: 4, countedRolls: 3 });
  const beyond = resolveMission14Move({ position: 63, roll: 6, countedRolls: 3 });
  assert.equal(exact.position, 64);
  assert.equal(exact.completed, true);
  assert.equal(beyond.position, 64);
  assert.equal(beyond.completed, true);
});
