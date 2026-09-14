import { CONSTANTS } from '../config/constants.js';
import { mountMission01 } from './mission-01.js';
import { mountMission03 } from './mission-03.js';
import { mountMission05 } from './mission-05.js';
import { mountMission07 } from './mission-07.js';
import { mountMission09 } from './mission-09.js';
import { mountMission10 } from './mission-10.js';
import { mountMission11 } from './mission-11.js';
import { mountMission12 } from './mission-12.js';
import { mountMission13 } from './mission-13.js';
import { mountMission14 } from './mission-14.js';
import { mountMission15 } from './mission-15.js';

const future = (id, title) => ({
  id,
  unlockAt: CONSTANTS.releaseDates[id],
  title,
  kicker: 'ENTREGA SELADA',
  subtitle: 'Esta missÃ£o ainda nÃ£o estÃ¡ disponÃ­vel.',
  implemented: false
});

export const MISSIONS = Object.freeze([
  { id: 1, unlockAt: CONSTANTS.releaseDates[1], title: 'Auditoria do inventÃ¡rio', kicker: 'REGISTRO 01', subtitle: 'Classifique o conjunto sem atribuir nomes ao que ainda nÃ£o foi entregue.', implemented: true, mount: mountMission01, hints: ['Elimine as classes que violam pelo menos uma regra.', 'Compare participaÃ§Ã£o, encerramento apÃ³s o uso e o que permanece depois.'] },
  { id: 3, unlockAt: CONSTANTS.releaseDates[3], title: 'Manifesto poliglota', kicker: 'REGISTRO 03', subtitle: 'Quatro definiÃ§Ãµes, quatro idiomas e quatro letras.', implemented: true, mount: mountMission03, hints: ['Responda corretamente cada definiÃ§Ã£o apresentada.', 'O valor no Ã­ndice inicial de cada resposta forma a palavra final se combinados na ordem correta.'] },
  { id: 5, unlockAt: CONSTANTS.releaseDates[5], title: 'Quatro lÃ­nguas, quatro grades', kicker: 'REGISTRO 05', subtitle: 'Resolva os quadros e descubra a palavra que falta ao inventÃ¡rio.', implemented: true, mount: mountMission05, hints: ['Use o padrÃ£o verde/amarelo/cinza como no Termo.', 'Os Ã­ndices aparecem apenas depois das quatro palavras corretas.'] },
  { id: 7, unlockAt: CONSTANTS.releaseDates[7], title: 'OperaÃ§Ã£o Ãºltima milha', kicker: 'REGISTRO 07', subtitle: 'Organize a rota sem perder nenhuma janela de entrega.', implemented: true, mount: mountMission07, hints: ['Procure a primeira parada que ainda permite cumprir as janelas seguintes.', 'A rota correta respeita as janelas em ordem; nÃ£o confunda os dois nÃ³s O.'] },
  { id: 9, unlockAt: CONSTANTS.releaseDates[9], title: 'Flagle personalizado', kicker: 'REGISTRO 09', subtitle: 'Descubra as bandeiras escondidas e descubra o vale atravÃ©s da charada.', implemented: true, mount: mountMission09, hints: [] },
  { id: 10, unlockAt: CONSTANTS.releaseDates[10], title: 'O corte perdido', kicker: 'REGISTRO 10', subtitle: 'Reconstrua a sessÃ£o certa e devolva seis etiquetas Ã  ordem da cena.', implemented: true, mount: mountMission10, hints: ['Leia as notas como um conjunto; o horÃ¡rio tambÃ©m elimina cÃ³pias.', 'As faixas nÃ£o estÃ£o na ordem da cena. Deixe os timecodes ordenar o corte.'] },
  { id: 11, unlockAt: CONSTANTS.releaseDates[11], title: 'A volta incompleta', kicker: 'REGISTRO 11', subtitle: 'Converta os deslocamentos e siga o ponteiro pelas sete chegadas.', implemented: true, mount: mountMission11, hints: [] },
  { id: 12, unlockAt: CONSTANTS.releaseDates[12], title: 'Dois conjuntos', kicker: 'REGISTRO 12', subtitle: 'Leia a mesa, encontre os dois SETs e guarde as sílabas.', implemented: true, mount: mountMission12, hints: ['Em cada atributo, não pode haver apenas duas cartas iguais.', 'Os dois SETs soletram dois nomes quando você lê as sílabas.'] },
  { id: 13, unlockAt: CONSTANTS.releaseDates[13], title: 'O golpe da vitrine', kicker: 'REGISTRO 13', subtitle: 'Desarme os sensores, calibre os discos e abra o cofre.', implemented: true, mount: mountMission13, hints: ['Comece pelas linhas e colunas; use as áreas para desempatar.', 'Configure corretamente e utilize os valores encontrados no disco.'] },
  { id: 14, unlockAt: CONSTANTS.releaseDates[14], title: 'A entrega perdida', kicker: 'REGISTRO 14', subtitle: 'Lance o dado e conduza a entrega até a última casa.', implemented: true, mount: mountMission14, hints: ['A resposta não veio das casas. Observe a legenda.', 'Leia a primeira letra de cada selo, de cima para baixo.'] },
  { id: 15, unlockAt: CONSTANTS.releaseDates[15], title: 'Última milha', kicker: 'REGISTRO 15', subtitle: 'Depois de tantos desafios, resta apenas decifrar a última charada.', implemented: true, mount: mountMission15, hints: [] }
]);

export function getMission(id) {
  return MISSIONS.find((mission) => mission.id === Number(id));
}
