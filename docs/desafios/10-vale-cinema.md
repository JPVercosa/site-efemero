# Desafio 10 — Vale-Cinema: o corte perdido

## Premissa

Uma cópia sem identificação chega à cabine com seis cenas sonoras fora de ordem.
O jogador identifica a sessão pelas notas do projecionista e escuta cada trecho
para identificar o som que ele contém. Os timecodes remontam as cenas na ordem
do filme; as iniciais das escolhas corretas formam a senha `CINEMA`.

| Campo | Valor |
|---|---|
| Data | 2026-09-10 |
| Dificuldade | Média-alta |
| Duração | 15–20 min |
| Resposta | `CINEMA` |

## Fluxo

`intro → briefing → mix → answer → success`.

1. Em **briefing**, o jogador cruza quatro notas com a programação e escolhe uma cópia.
2. Em **mix**, seis cenas chegam embaralhadas. Cada cartão inclui somente seu
   timecode, player de áudio e três escolhas — não há descrição textual do som.
3. Quando as seis cenas foram identificadas, em **answer** elas aparecem na
   ordem do timecode. As iniciais das escolhas formam a senha final.

Persistir `{ stage, sessionId, soundAnswers }`. Recarga restaura o progresso;
reiniciar apaga o estado. O bônus só aparece após a confirmação final.

## Arquivo da cabine

### Notas do projecionista

1. A cópia procurada é legendada em francês; não é dublada.
2. A legenda foi marcada como média pela cabine.
3. É uma sessão para duas pessoas, não uma sessão solo ou de grupo.
4. Ela entra depois da travessia e antes da sessão dublada.

### Programação fictícia

| Hora | Título | Idioma | Legenda | Público | Rolo |
|---|---|---|---|---|---|
| 17:10 | The Odyssey | VO | Básica | Solo | A |
| 18:20 | Linha de Maré | VOSTFR | Baixa | Casal | B |
| 19:10 | Noite em Vermelho | VOSTFR | Média | Casal | C |
| 20:40 | Obsession | VF | Alta | Grupo | D |
| 22:15 | Última Dobra | VOSTFR | Média | Solo | E |

Somente **Noite em Vermelho**, às 19:10, cumpre todas as notas.

## Cenas sonoras

Os assets abaixo substituem as antigas descrições textuais. Os nomes dos arquivos
não podem ser exibidos para o jogador; a interface usa players nativos e escolhas
textuais para cada cena.

| Cena | Timecode | Arquivo | Escolhas | Correta | Inicial |
|---|---|---|---|---|---|
| A | 00:42 | `applause-4.mp3` | Passos, Porta, Aplauso | Aplauso | A |
| B | 00:25 | `eco.mp3` | Ruído, Eco, Silêncio | Eco | E |
| C | 00:07 | `coro.mp3` | Coro, Solo, Sopro | Coro | C |
| D | 00:33 | `metronome.mp3` | Chuva, Marcha, Metrônomo | Metrônomo | M |
| E | 00:19 | `navio.mp3` | Navio, Trem, Vento | Navio | N |
| F | 00:13 | `impact.mp3` | Ritmo, Impacto, Eco | Impacto | I |

Pela ordem dos timecodes (`00:07`, `00:13`, `00:19`, `00:25`, `00:33`, `00:42`),
as escolhas são **Coro, Impacto, Navio, Eco, Metrônomo, Aplauso**: `CINEMA`.
Esta tabela é documentação de produção; as colunas de arquivo e solução não são
conteúdo visível na missão.

## Validação e acessibilidade

- Uma cópia só é válida se for a sessão de 19:10 e atender a todas as notas.
- Uma escolha errada não identifica a cena nem libera o próximo passo.
- Cada player possui rótulo acessível neutro (`Áudio da Cena A`, por exemplo) e
  fallback para navegadores sem suporte a áudio.
- Os controles de escolha são botões nativos; o progresso tem região viva e a
  sequência final é uma lista semântica.
- Erro 3: `Leia as notas como um conjunto; horário também elimina cópias.`
- Erro 7: `As cenas estão fora de ordem. Use os timecodes depois de identificá-las.`
- Erro 12: mostrar apenas `Recorrer ao criador`, sem entregar a solução.

## Critérios de aceite

- Os seis players usam exclusivamente os arquivos de `site/assets/sounds/`.
- Nenhuma descrição textual substitui os áudios como pista de identificação.
- Apenas as seis escolhas corretas liberam a linha do tempo, que extrai `CINEMA`.
- Estado, reset, teclado, leitor de tela e viewport de 360 px preservam o fluxo.
