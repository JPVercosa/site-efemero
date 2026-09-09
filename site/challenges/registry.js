import { CONSTANTS } from '../config/constants.js';
import { mountMission01 } from './mission-01.js';
import { mountMission03 } from './mission-03.js';
import { mountMission05 } from './mission-05.js';
import { mountMission07 } from './mission-07.js';
import { mountMission09 } from './mission-09.js';
import { mountMission10 } from './mission-10.js';

const future = (id, title) => ({
  id,
  unlockAt: CONSTANTS.releaseDates[id],
  title,
  kicker: 'ENTREGA SELADA',
  subtitle: 'Esta missão ainda não está disponível.',
  implemented: false
});

export const MISSIONS = Object.freeze([
  { id: 1, unlockAt: CONSTANTS.releaseDates[1], title: 'Auditoria do inventário', kicker: 'REGISTRO 01', subtitle: 'Classifique o conjunto sem atribuir nomes ao que ainda não foi entregue.', implemented: true, mount: mountMission01, hints: ['Elimine as classes que violam pelo menos uma regra.', 'Compare participação, encerramento após o uso e o que permanece depois.'] },
  { id: 3, unlockAt: CONSTANTS.releaseDates[3], title: 'Manifesto poliglota', kicker: 'REGISTRO 03', subtitle: 'Quatro definições, quatro idiomas e quatro letras.', implemented: true, mount: mountMission03, hints: ['Responda corretamente cada definição apresentada.', 'O valor no índice inicial de cada resposta forma a palavra final se combinados na ordem correta.'] },
  { id: 5, unlockAt: CONSTANTS.releaseDates[5], title: 'Quatro línguas, quatro grades', kicker: 'REGISTRO 05', subtitle: 'Resolva os quadros e descubra a palavra que falta ao inventário.', implemented: true, mount: mountMission05, hints: ['Use o padrão verde/amarelo/cinza como no Termo.', 'Os índices aparecem apenas depois das quatro palavras corretas.'] },
  { id: 7, unlockAt: CONSTANTS.releaseDates[7], title: 'Operação última milha', kicker: 'REGISTRO 07', subtitle: 'Organize a rota sem perder nenhuma janela de entrega.', implemented: true, mount: mountMission07, hints: ['Procure a primeira parada que ainda permite cumprir as janelas seguintes.', 'A rota correta respeita as janelas em ordem; não confunda os dois nós O.'] },
  { id: 9, unlockAt: CONSTANTS.releaseDates[9], title: 'Flagle personalizado', kicker: 'REGISTRO 09', subtitle: 'Descubra as bandeiras escondidas e descubra o vale através da charada.', implemented: true, mount: mountMission09, hints: [] },
  { id: 10, unlockAt: CONSTANTS.releaseDates[10], title: 'Programação VOSTFR', kicker: 'REGISTRO 10', subtitle: 'Encontre a sessão certa e leia as camadas de uma noite a dois.', implemented: true, mount: mountMission10, hints: ['Procure a sessão entre as duas referências nominais.', 'A sessão certa é a única VOSTFR de casal com legenda média.'] },
  future(11, 'Janela de serviço'),
  future(12, 'Dois conjuntos'),
  future(13, 'O cofre dourado'),
  future(14, 'A porta e as quatro línguas'),
  future(15, 'Última milha')
]);

export function getMission(id) {
  return MISSIONS.find((mission) => mission.id === Number(id));
}
