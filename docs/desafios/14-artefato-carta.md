# Desafio 14 — A entrega perdida

## Contrato da missão

Missão isolada em formato de jogo de tabuleiro. A jogadora conduz uma entrega por
64 casas usando um dado, atalhos e retornos. Ao alcançar o destino, descobre que
a informação procurada estava na legenda desde o começo. A resposta final é
`CARTA`.

| Campo | Valor |
|---|---|
| Data | 2026-09-14 |
| Dificuldade | Média |
| Duração | 15–30 min |
| Resposta | `CARTA` |

O antigo código `35A86` e as definições multilíngues não participam mais da
solução. O código pode aparecer somente depois da vitória, como anotação
decorativa no verso do artefato.

## Premissa visível

> Uma entrega sem remetente apareceu no centro de distribuição. O endereço final
> ainda está legível, mas a rota foi apagada. Lance o dado, atravesse os
> imprevistos e leve o pacote até a casa 64.

Fluxo fechado:

`intro → board → arrival → answer → success`

O tabuleiro é o minijogo principal e precisa ser concluído. Entretanto, ele é
também uma distração narrativa: nenhuma casa entrega letras ou fragmentos da
resposta. A pista necessária permanece visível na legenda durante toda a partida.

## Estado e persistência

Persistir durante a sessão:

```js
{
  stage: "intro" | "board" | "arrival" | "answer" | "success",
  position: 1,
  countedRolls: 0,
  pendingRoll: null,
  rerollsLeft: 2,
  shelter: false,
  returnsDisabled: false,
  history: [],
  errors: 0,
  completed: false
}
```

`Reiniciar missão` apaga todo o estado e volta à introdução. Recarregar restaura
a casa atual, histórico, fichas, proteção, espera e eventual dado ainda não
aceito. A sequência pseudoaleatória não precisa sobreviver à recarga.

## Tabuleiro

Usar uma grade 8 × 8 numerada de 1 a 64 em percurso serpentino:

```text
64 63 62 61 60 59 58 57
49 50 51 52 53 54 55 56
48 47 46 45 44 43 42 41
33 34 35 36 37 38 39 40
32 31 30 29 28 27 26 25
17 18 19 20 21 22 23 24
16 15 14 13 12 11 10 09
01 02 03 04 05 06 07 08
```

A peça começa na casa 1. Alcançar ou ultrapassar 64 encerra a viagem; não é
necessário obter um valor exato. A casa 64 sempre recebe a peça visualmente.

### Casas especiais

| Casa | Tipo | Efeito |
|---:|---|---|
| 4 | Atalho | avançar imediatamente para 12 |
| 6 | Trânsito | voltar para a casa ocupada no início da jogada |
| 8 | Retorno | voltar imediatamente para 2 |
| 9 | Atalho | avançar imediatamente para 20 |
| 11 | Retorno | voltar imediatamente para 5 |
| 14 | Abrigo | proteger contra o próximo Retorno encontrado |
| 15 | Retorno | voltar imediatamente para 7 |
| 19 | Trânsito | voltar para a casa ocupada no início da jogada |
| 22 | Retorno | voltar imediatamente para 12 |
| 24 | Retorno | voltar imediatamente para 13 |
| 26 | Trânsito | voltar para a casa ocupada no início da jogada |
| 28 | Atalho | avançar imediatamente para 39 |
| 31 | Retorno | voltar imediatamente para 21 |
| 33 | Trânsito | voltar para a casa ocupada no início da jogada |
| 35 | Retorno | voltar imediatamente para 22 |
| 40 | Retorno | voltar imediatamente para 28 |
| 44 | Trânsito | voltar para a casa ocupada no início da jogada |
| 46 | Retorno | voltar imediatamente para 31 |
| 48 | Atalho | avançar imediatamente para 59 |
| 51 | Trânsito | voltar para a casa ocupada no início da jogada |
| 53 | Retorno | voltar imediatamente para 42 |
| 54 | Trânsito | voltar para a casa ocupada no início da jogada |
| 55 | Abrigo | proteger contra o próximo Retorno encontrado |
| 57 | Retorno | voltar imediatamente para 43 |
| 60 | Retorno | voltar imediatamente para 49 |
| 62 | Retorno | voltar imediatamente para 52 |
| 64 | Destino | concluir o tabuleiro |

Atalhos e Retornos acontecem uma vez por movimento; a casa de destino não
dispara uma segunda casa especial na mesma jogada. Se `shelter` estiver ativo ao
cair em um Retorno, cancelar esse retorno, consumir a proteção e permanecer na
casa. Cair em Abrigo quando já existe proteção apenas mantém `shelter: true`.

Nos dois primeiros lançamentos aceitos, casas de Retorno ficam dormentes e são
tratadas como Caminho. Isso evita uma punição antes de a jogadora compreender o
tabuleiro.

## Legenda — informação escondida à vista

Mostrar ao lado do tabuleiro, desde `board`, cinco selos nesta ordem fixa:

1. **Caminho** — casa comum, sem efeito;
2. **Atalho** — avance até a casa indicada;
3. **Retorno** — volte até a casa indicada;
4. **Trânsito** — volte ao início da jogada;
5. **Abrigo** — protege contra um retorno.

Os cinco nomes precisam aparecer exatamente assim e na mesma ordem. Seus
ícones devem repetir o mesmo fundo e padrão das casas correspondentes no
tabuleiro: verde para Atalho, listras vermelhas para Retorno, listras amarelas
para Trânsito, azul para Abrigo e o fundo neutro para Caminho. Não numerar os
selos de 1 a 5. Os padrões e descrições tornam a legenda útil durante o jogo. Não destacar
as iniciais, não separar a primeira letra e não sugerir leitura vertical antes
de `arrival`.

Desenhar sobre o tabuleiro setas curvas finas e discretas entre cada
Atalho/Retorno e sua casa de destino. Atalhos usam seta verde e Retornos usam seta vermelha; ambos também
mostram dentro da casa um indicador textual como `↗ 14` ou `↩ 10`. As setas são
decorativas (`aria-hidden`), pois o destino completo continua no rótulo acessível
da casa.

As iniciais formam `CARTA`. Essa informação está deliberadamente disponível
desde o começo, mas a resposta final só pode ser enviada depois da chegada.

## Dado e controle da sorte

### Fluxo de uma rodada

1. `Lançar dado` gera um inteiro uniforme de 1 a 6.
2. O resultado usa o SVG local correspondente em `site/assets/dice/` e também
   possui texto alternativo acessível; não mostrar apenas um algarismo.
3. Antes de mover, a jogadora escolhe `Usar resultado` ou, se possuir ficha,
   `Lançar novamente`.
4. Usar o resultado incrementa `countedRolls`, move a peça e resolve a casa.
5. Lançar novamente consome uma ficha, substitui `pendingRoll` por um novo valor
   e obriga a usar o segundo resultado; não oferecer uma terceira escolha.

A função de sorte deve receber um gerador injetável para testes:

```js
rollDie(random = Math.random) {
  return Math.floor(random() * 6) + 1
}
```

### Proteção contra partidas longas

- A jogadora começa com duas fichas de nova tentativa.
- Ao aceitar o 45º lançamento, definir `returnsDisabled: true` antes de resolver
  a casa de destino. A partir desse momento, todas as casas de Retorno passam a
  funcionar como Caminho até o fim da partida.
- Mostrar persistentemente acima do tabuleiro: `45 jogadas concluídas: os
  Retornos foram desativados.` Não levar a peça automaticamente ao destino.
- Lançamentos descartados por ficha não alteram `countedRolls`.

Essa proteção reduz ciclos demorados sem retirar a sorte nem garantir uma
chegada artificial. Testes usam um gerador determinístico; produção usa
`Math.random`.

## Movimento e interação

Ao aceitar o dado, animar a peça casa por casa, com aproximadamente 180 ms entre
posições, e somente depois resolver o efeito especial. Por exemplo, da casa 7
com resultado 4, destacar sucessivamente 8, 9, 10 e 11. Atalhos e Retornos pulam
diretamente da casa de entrada para o destino, sem percorrer as casas intermediárias.
Durante o movimento, bloquear dado, reset e demais ações para evitar duplo clique.
Com `prefers-reduced-motion`, atualizar diretamente a posição e anunciar origem,
resultado, destino e efeito.

O histórico mantém no máximo as seis jogadas mais recentes, sempre em ordem
decrescente: a jogada mais nova aparece no topo e a mais antiga embaixo. Exemplo:

```text
Tirou 4: casa 5 → casa 9.
Atalho: casa 8 → casa 14.
Abrigo impediu o retorno da casa 18.
```

Colorir cada entrada de acordo com seu efeito, repetindo a linguagem do
tabuleiro: verde para Atalho, vermelho para Retorno, amarelo para Trânsito, azul
para Abrigo e neutro para movimento comum. Manter texto e borda diferenciados
para que cor nunca seja o único indicador.

Mensagens não podem depender somente da animação ou da cor.

## Chegada e reviravolta

Ao alcançar a casa 64, bloquear o dado, mover para `arrival` e mostrar uma caixa
aberta e vazia:

> Você completou toda a viagem, mas a informação nunca esteve no destino.
> Ela estava na legenda desde o primeiro lançamento.

Um botão `Examinar a legenda` move para `answer`, mantém tabuleiro e legenda
visíveis e acrescenta:

> Leia o início dos cinco selos, na ordem em que aparecem.

Somente nesse momento destacar visualmente a inicial de cada nome, sem montar a
palavra automaticamente.

## Resposta final

Exibir um campo livre e o botão `Abrir a entrega`. Normalizar em Unicode NFD,
remover diacríticos, pontuação e espaços e converter para maiúsculas. Aceitar
somente `CARTA`; aceitar caixa baixa e caracteres separados, como `c a r t a`;
rejeitar `35A86`, palavras parciais e qualquer outra resposta.

No acerto, marcar `completed: true`, mover para `success` e exibir:

> **Entrega aberta. O artefato é uma CARTA.**

## Erros e ajuda

Somente respostas finais incorretas incrementam `errors`. Resultados do dado,
retornos, falta de ficha e ações incompletas não são erros.

- erros 1–2: `A entrega continua fechada.`
- erro 3: `A resposta não veio das casas. Observe a legenda.`
- erro 7: `Leia a primeira letra de cada selo, de cima para baixo.`
- erro 12: esconder as dicas anteriores e deixar somente
  `Recorrer ao criador`, sem escrever a resposta.

## Epílogo e memória

Somente depois de `success`, mostrar o conteúdo afetivo do artefato:

- linha do tempo fixa definida para a missão;
- uma anotação decorativa no verso: `35A86`;
- texto explicando que o código pertence à memória, não à solução do tabuleiro.

O epílogo não possui controles, caracteres extraíveis ou efeito no estado de
outras missões.

## Acessibilidade e responsividade

- Tabuleiro implementado como lista/grade semântica; cada casa anuncia número,
  tipo, destino especial e presença da peça.
- Dado possui resultado textual em `aria-live`; o desenho dos pontos é
  decorativo.
- Atalhos e Retornos usam ícone, padrão e texto, nunca apenas cor.
- As setas não capturam ponteiro e não encobrem o número nem a peça da casa.
- Todos os controles possuem foco visível e alvo mínimo de 44 × 44 px.
- Movimento por animação não é necessário para compreender ou operar o jogo.
- Em 360 px, tabuleiro mantém as oito colunas sem rolagem horizontal; legenda e
  histórico aparecem abaixo.
- As 64 casas usam oito linhas de altura fixa; texto, ícone ou passagem da peça
  nunca pode expandir uma linha ou deformar a grade quadrada.
- Com movimento reduzido, não usar transições entre casas.
- Durante animações, usar `aria-busy="true"` e impedir comandos concorrentes.

## Critérios de aceite e testes obrigatórios

- Confirmar percurso serpentino visual e numeração lógica de 1 a 64.
- Testar dado com geradores que produzam exatamente 1 e 6.
- Testar aceitar resultado, usar as duas fichas, tentativa sem ficha e recarga
  com `pendingRoll`.
- Testar todos os Atalhos, Retornos, Trânsitos e Abrigo, incluindo consumo da
  proteção e Retornos dormentes nas duas primeiras jogadas. Confirmar que cair
  em Trânsito devolve à posição anterior e que repetir o mesmo dado pode manter
  a peça parada por várias jogadas.
- Confirmar que cada Atalho e Retorno possui seta e destino textual equivalentes.
- Confirmar que os cinco selos repetem os estilos das casas e não exibem números.
- Demonstrar que o 45º lançamento desativa os Retornos antes de resolver a casa,
  preserva os Atalhos e não leva a peça automaticamente à casa 64.
- Confirmar que o aviso de Retornos desativados permanece visível após recarga.
- Garantir que alcançar ou ultrapassar 64 termina na casa 64.
- Confirmar que um movimento comum visita visualmente cada casa intermediária e
  que Atalhos/Retornos saltam diretamente para o destino.
- Não liberar resposta antes de `arrival` nem destacar iniciais antes de
  `answer`.
- Confirmar que `Caminho, Atalho, Retorno, Trânsito, Abrigo` produz uma única
  sequência `CARTA` na ordem fixa.
- Aceitar `CARTA`, `carta` e `c a r t a`; rejeitar `35A86` e outras palavras.
- Verificar persistência, reset, erros 3/7/12, leitor de tela, teclado, toque,
  movimento reduzido e viewport de 360 px.

## Assets obrigatórios

Tabuleiro, peça, setas, selos e pacote devem ser HTML/CSS ou SVG local. As seis
faces do dado usam obrigatoriamente `site/assets/dice/1.svg` até `6.svg`.
Nenhum nome de asset, `alt`, metadado ou texto invisível pode conter `CARTA`
antes de `success`. Os nomes da legenda permanecem texto visível porque são a
pista intencional do desafio.
