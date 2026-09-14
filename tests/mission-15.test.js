import test from 'node:test';
import assert from 'node:assert/strict';
import { MISSIONS } from '../site/challenges/registry.js';
import {
  MISSION_15_ANSWER,
  MISSION_15_STANZAS,
  isMission15Answer
} from '../site/challenges/mission-15.js';

test('registro libera a missão 15 sem dicas', () => {
  const mission = MISSIONS.find(({ id }) => id === 15);
  assert.equal(mission?.implemented, true);
  assert.equal(typeof mission?.mount, 'function');
  assert.deepEqual(mission?.hints, []);
});

test('charada preserva cinco estrofes de quatro versos', () => {
  assert.equal(MISSION_15_STANZAS.length, 5);
  assert.equal(MISSION_15_STANZAS.every((stanza) => stanza.length === 4), true);
  assert.equal(MISSION_15_STANZAS.flat().length, 20);
});

test('aceita somente a resposta composta normalizada', () => {
  assert.equal(MISSION_15_ANSWER, 'CAIXA DE CORREIOS');
  assert.equal(isMission15Answer('caixa de correios'), true);
  assert.equal(isMission15Answer(' CAIXA-DE-CORREIOS! '), true);
  assert.equal(isMission15Answer('Caíxa de Corrêios'), true);
  for (const answer of ['', 'caixa', 'correio', 'correios', 'caixa postal', 'hall', '35A86']) {
    assert.equal(isMission15Answer(answer), false);
  }
});
