# Desafio 13 — Vale-Joia

## Contrato da missão

Missão isolada em três travas: selecionar material, resolver uma grade lógica e decifrar um criptograma. A resposta final é `JOIA`.

| Campo | Valor |
|---|---|
| Data | 2026-09-13 |
| Dificuldade | Muito alta |
| Duração | 25–35 min |
| Resposta | `JOIA` |

## Fluxo fechado

`intro → material → logic-grid → cipher → success`. Cada trava tem um controle de confirmação; a seguinte permanece bloqueada até a anterior estar correta. Persistir `{ stage, errors, material, grid, completed }` durante a sessão; `Reiniciar` limpa. Erros de qualquer trava compartilham `errors` e seguem os limiares 3/7/12.

## Dados fixos e trava 1 — material

Mostrar todos os dados abaixo e pedir simultaneamente número atômico 79, densidade 19,3 g/cm³ e aparência amarela metálica, tudo isso através de charadas.

| ID | Símbolo | Número atômico | Densidade | Aparência |
|---|---|---:|---:|---|
| M1 | Ag | 47 | 10,5 | branca-prateada |
| M2 | Au | 79 | 19,3 | amarela metálica |
| M3 | Pt | 78 | 21,5 | branca-prateada |
| M4 | Cu | 29 | 8,9 | avermelhada |
| M5 | Fe | 26 | 7,9 | cinza |

Somente M2 é válida. Ao confirmar, a chave interna é `AU`; não mostrar o nome “ouro” antes do acerto.

## Trava 2 — grade lógica

Entidades fixas: posições 1–5; peças `anel de Veneza`, `anel estrela da Disney`, `colar com foto gravada`, `brincos dourados`, `pulseira de cristais`; origens `Veneza`, `Disney`, `Pandora`, `Swarovski`, `Monte Carlo`; propriedades `aro fino`, `com estrela`, `gravado com foto`, `com cristais`, `fecho de pressão`.

Exibir estas pistas, na ordem indicada:

1. Veneza está em uma extremidade e antes de Disney.
2. O colar está imediatamente antes dos brincos.
3. Monte Carlo está imediatamente entre Pandora e Swarovski, nessa ordem.
4. A peça com cristais está imediatamente antes da peça com estrela.
5. A peça com foto está na posição 2 e veio de Pandora.
6. A pulseira veio de Swarovski.
7. Os brincos têm fecho de pressão e não vieram de Disney.
8. O aro fino pertence a Veneza.
9. Disney é um anel, mas não o anel de Veneza.

A interface deve permitir preencher a grade por seleção; confirmar somente quando cada entidade ocupar uma posição única. Um enumerador deve encontrar exatamente uma atribuição:

| Posição | Peça | Origem | Propriedade | Cifra |
|---:|---|---|---|---|
| 1 | anel de Veneza | Veneza | aro fino | J |
| 2 | colar com foto gravada | Pandora | gravado com foto | I |
| 3 | brincos dourados | Monte Carlo | fecho de pressão | X |
| 4 | pulseira de cristais | Swarovski | com cristais | U |
| 5 | anel estrela da Disney | Disney | com estrela | I |

## Mecânica, trava 3 e solução — Vigenère

Depois da grade, ordenar apenas as origens `Veneza → Disney → Pandora → Swarovski`; Monte Carlo é decoy e não entra. Os caracteres são `J,I,I,U`, portanto o criptograma é `JIIU`. Repetir a chave `AU` como `AUAU`. Usar `A=0...Z=25` e decifrar `P=(C−K) mod 26`: `J−A=J`, `I−U=O`, `I−A=I`, `U−U=A`. Resultado: `JOIA`.

A resposta final só é validada após as três travas. Normalizar NFD, remover acentos, pontuação e espaços externos, converter para maiúsculas; aceitar `JOIA`, `JÓIA`, `joia`; rejeitar qualquer outra palavra.

## Ajuda, acessibilidade e critérios de teste

- erro 3: `Escolha a linha que satisfaz os três requisitos ao mesmo tempo.`
- erro 7: `Fixe a posição 2, use as adjacências e só depois faça a subtração modular.`
- erro 12: deixar somente `Recorrer ao criador`, sem revelar `JOIA` ou a grade completa.

Usar controles de teclado e toque `44×44px`, foco visível, textos equivalentes para a grade e nenhuma dependência de cor/arraste. Testar cada trava isoladamente, atribuições duplicadas, grade incompleta, chave/alfabeto, ordem de extração, normalização, recarga/reset, erros 3/7/12 e viewport 360px.

## Bônus

Após sucesso, mostrar a galeria fixa de joias e fatos afetivos confirmados. O bloco é decorativo, não altera estado e não é reutilizado.


## Critérios de aceite e testes

- M2/Au é a única seleção material válida.
- A grade lógica tem exatamente uma atribuição e produz `JIIU` na ordem de origens definida.
- Vigenère com `AUAU` produz `JOIA`; a resposta final não funciona antes da terceira trava.
- Testar alternativas erradas, grade incompleta, decoy Monte Carlo, chave/alfabeto, normalização, recarga, reset, dicas 3/7/12, teclado, leitor de tela e viewport 360px.

## Assets obrigatórios

Usar cartões locais para material, grade lógica, cifra e bônus. Imagens são decorativas; todas as entidades, relações, caracteres e estados devem existir em texto/controles acessíveis.
