import test from 'node:test';
import assert from 'node:assert/strict';
import { MISSIONS } from '../site/challenges/registry.js';
import { matchesAnswer } from '../site/core/normalize.js';
import {
  MISSION_13_ANSWER,
  MISSION_13_CIPHER,
  MISSION_13_MOVEMENTS,
  MISSION_13_REGIONS,
  MISSION_13_SOLUTION_COLUMNS,
  decodeMission13Letter,
  enumerateMission13Placements,
  getMission13Decoded,
  moveMission13Letter,
  validateMission13Placement
} from '../site/challenges/mission-13.js';

test('registro libera a missão 13', () => {
  const mission = MISSIONS.find(({ id }) => id === 13);
  assert.equal(mission?.implemented, true);
  assert.equal(typeof mission?.mount, 'function');
});

test('vitrine possui uma única solução válida entre as 24 permutações', () => {
  assert.equal(MISSION_13_REGIONS.length, 4);
  assert.equal(MISSION_13_REGIONS.every((row) => row.length === 4), true);
  assert.deepEqual(enumerateMission13Placements(), [MISSION_13_SOLUTION_COLUMNS]);
  assert.equal(validateMission13Placement(['r1c2', 'r2c4', 'r3c1', 'r4c3']), true);
  assert.equal(validateMission13Placement(['r1c3', 'r2c1', 'r3c4', 'r4c2']), false);
  assert.equal(validateMission13Placement(['r1c2', 'r1c4', 'r3c1', 'r4c3']), false);
  assert.equal(validateMission13Placement(['r1c2', 'r2c2', 'r3c1', 'r4c3']), false);
  assert.equal(validateMission13Placement(['r1c2', 'r2c3', 'r3c1', 'r4c4']), false);
  assert.equal(validateMission13Placement(['r1c2', 'r2c4', 'r3c1']), false);
});

test('discos partem de X e aplicam os quatro resultados matemáticos', () => {
  assert.deepEqual(MISSION_13_CIPHER, ['X', 'X', 'X', 'X']);
  assert.deepEqual(MISSION_13_SOLUTION_COLUMNS, [1, 3, 0, 2]);
  assert.deepEqual(MISSION_13_MOVEMENTS, [12, 3, -15, -9]);
  assert.deepEqual(getMission13Decoded(), ['J', 'A', 'I', 'O']);
  assert.equal(moveMission13Letter('X', 12), 'J');
  assert.equal(moveMission13Letter('X', 3), 'A');
  assert.equal(moveMission13Letter('X', -15), 'I');
  assert.equal(moveMission13Letter('X', -9), 'O');
  assert.equal(decodeMission13Letter('A', 1), 'Z');
  assert.equal(decodeMission13Letter('A', 27), 'Z');
  assert.equal(decodeMission13Letter('?', 1), '');
});

test('anagrama aceita somente a resposta final normalizada', () => {
  assert.equal(['JOIA', 'JÓIA', 'joia'].every((answer) => matchesAnswer(answer, [MISSION_13_ANSWER])), true);
  assert.equal(matchesAnswer('IAOJ', [MISSION_13_ANSWER]), false);
  assert.equal(matchesAnswer('OURO', [MISSION_13_ANSWER]), false);
});
