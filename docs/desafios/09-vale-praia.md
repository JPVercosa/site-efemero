# Desafio 09 — Vale-praia

## Contrato da missão

Missão de chutes inspirada no Termo da missão 05. A jogadora deve descobrir
três bandeiras de viagens e relacioná-las ao verão e à praia.

| Campo | Valor |
|---|---|
| Data | 2026-09-09 |
| Dificuldade | Média |
| Duração | 10–15 min |
| Bandeiras | Brasil, Grécia e Croácia |
| Resposta da charada | `PRAIA` |

## Fluxo do jogo

1. As três bandeiras ficam em paralelo no topo da página, completamente
   cobertas por uma grade de 162 quadrados.
2. Cada grade tem 18 colunas × 9 linhas. A grade cobre toda a imagem, sem
   margem ou espaçamento entre células; o SVG é esticado para ocupar toda a
   área da grade e cada quadrado aberto deixa aparecer exatamente o fragmento
   correspondente.
3. Existem sete chutes de países. O primeiro é um chute cego: nenhuma dica
   visual aparece antes do envio.
4. Em um chute errado, um quadrado aleatório ainda fechado de cada bandeira é
   revelado.
5. Em um chute certo, a bandeira correspondente é revelada inteira e um
   quadrado aleatório é revelado em cada uma das outras bandeiras que ainda não
   estiverem completas.
6. Depois que as três bandeiras forem acertadas, aparece a charada:

   > Três bandeiras, três histórias de viagem e uma estação quente. O que reúne
   > areia nos pés, água salgada e vontade de ficar mais um pouco?

   A resposta aceita é `PRAIA` ou `A PRAIA`, sem diferença de caixa, acentos,
   pontuação ou espaços externos.

## Estado e reinício

Chutes, quadrados abertos e resposta da charada vivem apenas na memória da
página. Atualizar a página começa uma nova partida e sorteia novas posições de
revelação; nada disso é salvo no armazenamento local. O botão **Reiniciar
jogo** também limpa a conclusão local e recarrega a missão.

## Validação

- O input aceita sugestões de países em português do Brasil por meio de um
  `datalist`.
- Só é possível registrar um chute que corresponda a um país dessa lista;
  texto livre ou país inexistente não consome tentativa.
- Acima do input há sete espaços de histórico. Cada país válido enviado ocupa
  o próximo espaço, até o limite de sete chutes.
- Países válidos para as três bandeiras: `BRASIL`, `GRÉCIA`/`GRECIA` e
  `CROÁCIA`/`CROACIA`.
- Um país diferente não identifica nenhuma bandeira e consome um chute.
- Tentar novamente uma bandeira já descoberta não consome chute.
- Com sete chutes sem descobrir as três, o jogo é encerrado e a página pode
  ser atualizada para uma nova tentativa.
- O progresso visível não depende apenas de cor: cada cartão informa quantos
  quadrados foram revelados e se a bandeira foi descoberta.

## Acessibilidade e responsividade

As imagens têm texto alternativo equivalente, as bandeiras têm rótulos
acessíveis, o status usa `aria-live`, e os controles mantêm pelo menos 44 px de
altura. Em telas estreitas, os cartões empilham e os inputs permanecem
utilizáveis.

## Fonte da lista de países

A lista de sugestões foi montada a partir dos topônimos em português
recomendados no [Manual de Revisão da FUNAG/Itamaraty](https://funag.gov.br/manual/index.php?title=Top%C3%B4nimos_e_gent%C3%ADlicos),
que consolida a grafia brasileira dos países reconhecidos pela ONU.

## Assets

- `site/assets/flags/br.svg`
- `site/assets/flags/gr.svg`
- `site/assets/flags/hr.svg`

As bandeiras são assets locais. A cobertura é uma camada opaca de `div/span`
sobre cada imagem; não há necessidade de esconder respostas no HTML para o
funcionamento do jogo.
