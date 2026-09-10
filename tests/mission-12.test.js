import test from 'node:test';
import assert from 'node:assert/strict';
import { MISSIONS } from '../site/challenges/registry.js';
import { matchesAnswer } from '../site/core/normalize.js';
import {
  MISSION_12_ACCEPTED_ANSWERS,
  MISSION_12_CARDS,
  MISSION_12_TARGET_WORDS,
  getMission12Sets,
  getMission12SetWords,
  isMission12Set
} from '../site/challenges/mission-12.js';

test('registro libera a missão 12', () => {
  assert.equal(MISSIONS.find((mission) => mission.id === 12)?.implemented, true);
});

test('missão 12 tem doze cartas editáveis e exatamente os dois SETs pretendidos', () => {
  const sets = getMission12Sets();

  assert.equal(MISSION_12_CARDS.length, 12);
  assert.equal(Object.isFrozen(MISSION_12_CARDS), true);
  assert.equal(MISSION_12_CARDS.every(Object.isFrozen), true);
  assert.equal(MISSION_12_CARDS.every((card) => ['symbol', 'number', 'color', 'fill', 'syllable'].every((key) => key in card)), true);
  assert.equal(sets.length, 2);
  assert.deepEqual(getMission12SetWords(), MISSION_12_TARGET_WORDS);
  assert.equal(sets.every(isMission12Set), true);
  assert.equal(isMission12Set([MISSION_12_CARDS[0], MISSION_12_CARDS[1], MISSION_12_CARDS[2]]), false);
});

test('missão 12 só aceita a resposta japonesa depois dos dois SETs', () => {
  assert.equal(['JAPONÊS', 'JAPONES', 'JAPONESES'].every((answer) => matchesAnswer(answer, MISSION_12_ACCEPTED_ANSWERS)), true);
  assert.equal(matchesAnswer('ITALIANO', MISSION_12_ACCEPTED_ANSWERS), false);
});