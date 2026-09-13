/**
 * EDITAR AQUI: configuração editorial do site.
 *
 * Este arquivo é a fonte mais simples para alterar datas, textos, contatos e
 * imagens dos ímãs quando os assets reais estiverem prontos.
 */
export const CONSTANTS = Object.freeze({
  appName: 'Baú de Afetos',
  timezone: 'Europe/Paris',
  accessPasswordHash: 'd404ea81c0e610961ae9ee0419a3e4ed5717f2f5a17729cdda1c724e713c93c7',
  creatorContactUrl: 'https://wa.me/5521992892626?text=Bububu%2C%20travei%20na%20miss%C3%A3o.', // TODO: EDITAR
  releaseDates: Object.freeze({
    1: '2026-09-01T00:00:00+02:00',
    3: '2026-09-03T00:00:00+02:00',
    5: '2026-09-05T00:00:00+02:00',
    7: '2026-09-07T00:00:00+02:00',
    9: '2026-09-09T00:00:00+02:00',
    10: '2026-09-10T00:00:00+02:00',
    11: '2026-09-11T00:00:00+02:00',
    12: '2026-09-12T00:00:00+02:00',
    13: '2026-09-13T00:00:00+02:00',
    14: '2026-09-14T00:00:00+02:00',
    15: '2026-09-15T00:00:00+02:00'
  }),
  magnetAssets: Object.freeze({
    default: Object.freeze({
      default: './assets/magnets/question.svg',
      done: './assets/magnets/question.svg',
      fullBackground: false
    }),
    1: Object.freeze({
      default: './assets/magnets/question.svg',
      done: './assets/magnets/magnet_mission_1.png',
      fullBackground: true
    }),
    3: Object.freeze({
      default: './assets/magnets/question.svg',
      done: './assets/magnets/magnet_mission_3.png',
      fullBackground: false
    }),
    5: Object.freeze({ default: './assets/magnets/question.svg', done: './assets/magnets/magnet_mission_5.png', fullBackground: true }),
    // TODO: EDITAR quando os símbolos reais forem preparados.
    7: Object.freeze({ default: './assets/magnets/question.svg', done: './assets/magnets/magnet_mission_7.png', fullBackground: false }),
    9: Object.freeze({ default: './assets/magnets/question.svg', done: './assets/magnets/magnet_mission_9.png', fullBackground: true }),
    10: Object.freeze({ default: './assets/magnets/question.svg', done: './assets/magnets/magnet_mission_10.png', fullBackground: true }),
    11: Object.freeze({ default: './assets/magnets/question.svg', done: './assets/magnets/magnet_mission_11.png', fullBackground: true }),
    12: Object.freeze({ default: './assets/magnets/question.svg', done: './assets/magnets/magnet_mission_12.png', fullBackground: false }),
    13: Object.freeze({ default: './assets/magnets/question.svg', done: './assets/magnets/magnet_mission_13.png', fullBackground: true }),
    14: Object.freeze({ default: './assets/magnets/question.svg', done: './assets/magnets/magnet_mission_14.png', fullBackground: true }),
    15: Object.freeze({ default: './assets/magnets/question.svg', done: './assets/magnets/magnet_mission_15.png', fullBackground: true })
  }),
  featureFlags: Object.freeze({ showFuturePlaceholders: true })
});
