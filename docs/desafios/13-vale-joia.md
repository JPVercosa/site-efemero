# Desafio 13 — O golpe da vitrine

## Contrato da missão

Uma missão em formato de pequeno assalto de filme: primeiro a jogadora desarma uma vitrine posicionando quatro joias; depois usa essas posições como chave de uma cifra de César; por fim reorganiza as letras recuperadas. A resposta do vale é `JOIA`.

| Campo | Valor |
|---|---|
| Data | 2026-09-13 |
| Dificuldade | Média-alta |
| Duração | 15–25 min |
| Resposta | `JOIA` |

O desafio não exige reconhecer presentes, lugares ou fatos do casal. Essas lembranças aparecem somente depois da vitória, como conteúdo afetivo. Sempre vamos evitar de usar a palavra JOIA até o final do desafio.

## Premissa e fluxo

> A vitrine fechou com quatro peças dentro e o alarme apagou a senha. E sua hora de ficar rica chegou! Posicione as peças valiosas sem cruzar os sensores. As casas escolhidas calibram os discos do cofre. O cofre não entrega a palavra — apenas quatro letras fora do lugar.

`intro → vitrine → discos → anagrama → success`

A etapa seguinte permanece bloqueada até a anterior estar correta. Persistir durante a sessão:

```js
{
  stage: "vitrine" | "discos" | "anagrama" | "success",
  queens: ["r1c2", "r2c4", "r3c1", "r4c3"],
  dialMoves: [0, 0, 0, 0],
  anagram: ["J", "A", "I", "O"],
  errors: 0,
  completed: false
}
```

`Reiniciar missão` apaga esse estado e volta à introdução. Recarregar restaura a etapa, as marcações do tabuleiro, os discos e a ordem atual das letras.

## Minijogo 1 — a vitrine de sensores

Usar um tabuleiro 4 × 4 inspirado no jogo diário **Queens**. Cada casa pertence a uma das quatro áreas da vitrine: âmbar, rubi, safira ou esmeralda. A jogadora alterna cada casa entre vazia, marcada com `×` e ocupada por uma joia.

É preciso colocar exatamente quatro joias obedecendo simultaneamente:

1. uma joia em cada linha;
2. uma joia em cada coluna;
3. uma joia em cada área;
4. duas joias não podem se tocar, nem mesmo pela diagonal.

As áreas são dados fixos:

| Linha | Coluna 1 | Coluna 2 | Coluna 3 | Coluna 4 |
|---:|---|---|---|---|
| 1 | Esmeralda | Âmbar | Rubi | Rubi |
| 2 | Esmeralda | Âmbar | Rubi | Rubi |
| 3 | Esmeralda | Esmeralda | Safira | Rubi |
| 4 | Esmeralda | Safira | Safira | Safira |

Pode usar a cor dessas pedras preciosas, e colocar uma legenda indicando.

As áreas devem ser diferenciadas por padrão e rótulo, além de cor. `Verificar vitrine` só fica habilitado com quatro joias. Uma tentativa incorreta mantém as marcações e incrementa `errors`; o jogo nunca identifica qual peça está errada.

### Solução e prova de unicidade

| Linha | Coluna | Área |
|---:|---:|---|
| 1 | 2 | Âmbar |
| 2 | 4 | Rubi |
| 3 | 1 | Esmeralda |
| 4 | 3 | Safira |

Com uma peça por linha e coluna e sem contato diagonal entre linhas vizinhas, existem somente duas permutações candidatas: `2,4,1,3` e `3,1,4,2`. A segunda ocupa Rubi duas vezes e nenhuma vez Âmbar. Portanto apenas `2,4,1,3` também satisfaz a regra das áreas.

Acima das quatro posições verticais, mostrar diretamente `Código 0`, `Código 1`, `Código 2` e `Código 3`. Não nomear as linhas com tipos de acessórios. A área colorida da casa escolhida identifica a pedra ligada a cada código:

```text
código:  0           1       2       3
pedra:   Esmeralda   Âmbar   Safira  Rubi
```

## Minijogo 2 — os quatro discos do cofre

Exibir quatro discos na ordem dos códigos `0, 1, 2, 3`. Todos começam em `X` e podem girar nos dois sentidos. O alfabeto é `ABCDEFGHIJKLMNOPQRSTUVWXYZ`, circular: depois de `Z` vem `A` e antes de `A` vem `Z`. Resultado positivo avança; resultado negativo volta.

| Código | Pedra | Entrada | Função | Resultado | Movimento desde X | Letra recuperada |
|---:|---|---:|---|---:|---:|---:|
| 0 | Esmeralda | `x = 2` | `f(x) = d(t³)/dt`, em `t = x` | `+12` | avançar 12 | J |
| 1 | Âmbar | `x = 0` | `f(x) = ∫ₓ³ (2t/3) dt` | `+3` | avançar 3 | A |
| 2 | Safira | `x = 3` | `f(x) = x² − 8x` | `−15` | voltar 15 | I |
| 3 | Rubi | `x = 1` | `f(x) = (x + 2)! − 15` | `−9` | voltar 9 | O |

As quatro funções devem ser renderizadas com MathML nativo para manter expoentes,
frações, limites, derivadas e fatoriais visualmente consistentes. Cada bloco
`math` deve ter um `aria-label` em português com a leitura completa da expressão.
A integral, por exemplo, usa integral com limites, fração vertical e diferencial
separado:

```html
<math display="block" aria-label="f de x é igual à integral de x até 3 de dois t sobre três, em relação a t">
  <mi>f</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>=</mo>
  <msubsup><mo>∫</mo><mi>x</mi><mn>3</mn></msubsup>
  <mfrac><mrow><mn>2</mn><mi>t</mi></mrow><mn>3</mn></mfrac>
  <mi mathvariant="normal">d</mi><mi>t</mi>
</math>
```

O conteúdo visível mostra apenas código, pedra, entrada e função. Explica: “resolva a função de cada cartão; resultado positivo avança no alfabeto e resultado negativo volta”. Manter a vitrine visível para comparação. Não mostrar `Resultado`, `Movimento`, `Letra recuperada` nem escrever `JAIO` antes da validação.

Cada disco possui botões `−1` e `+1`, responde às setas quando tem foco e anuncia letra, direção e quantidade atuais. `Testar combinação` compara os movimentos assinados com `[12, 3, -15, -9]`. Erro mantém os discos e incrementa `errors`; nenhuma letra é confirmada isoladamente. O acerto trava os discos e solta as fichas `J`, `A`, `I`, `O` na mesa.

```js
alphabetIndex = char => "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(char)
move = (char, amount) => alphabet[(alphabetIndex(char) + amount + 26) % 26]
decoded = ["X", "X", "X", "X"].map((char, i) => move(char, [12, 3, -15, -9][i]))
// decoded === ["J", "A", "I", "O"]
```

## Final — anagrama na bancada

As fichas aparecem obrigatoriamente em `J A I O`. A jogadora as reorganiza para responder:

> Não sou o metal, nem a pedra sozinha. Sou aquilo que alguém escolhe, usa e guarda numa caixinha. O que sou?

Permitir ordenar por arraste, clique em uma ficha seguido da posição de destino e teclado (`Espaço` seleciona; setas movem). Oferecer também campo de texto equivalente para tecnologia assistiva. `Abrir o cofre` compara apenas as quatro letras completas.

Normalizar em Unicode NFD, remover marcas diacríticas, pontuação e espaços e converter para maiúsculas. Aceitar `JOIA`, `JÓIA`, `joia` e fichas em `J,O,I,A`; rejeitar palavras diferentes, letras repetidas, letras ausentes e `JAIO`. Erro incrementa `errors` e preserva a ordem.

No acerto, marcar a missão como concluída e exibir:

> **Cofre aberto. O vale é JOIA.**

## Ajuda progressiva

A contagem é compartilhada pelas três validações.

- erros 1–2: `O alarme continua ligado.`
- erro 3: `Comece pelas linhas e colunas; use as áreas para desempatar.`
- erro 7: `Configure corretamente e utilize os valores encontrados no disco.`
- erro 12: esconder as dicas e deixar somente `Recorrer ao criador`, sem revelar posições, letras ou resposta.

Entradas incompletas não incrementam `errors`; apenas informam o que falta.

## Memórias e presentes passados

Somente após `success`, abrir uma gaveta decorativa chamada **Arquivo da vitrine**. Ela representa os dados da versão anterior como lembranças de presentes passados:

- anel de Veneza;
- anel com estrela da Disney;
- colar com foto gravada;
- brincos dourados;
- Qual será a próxima joia?

Esses cartões não têm seleção, código, ordem, letra escondida nem efeito no estado. O texto explicita que são recordações, não pistas. Imagens usam `alt=""`; os nomes permanecem em texto.

## Acessibilidade e responsividade

- Tabuleiro como grade semântica com linha, coluna, área e estado de cada casa; nunca depender apenas de cor.
- Foco visível, alvos mínimos de 44 × 44 px e alternativa completa a arraste.
- Mudanças de etapa e resultados em `aria-live`, sem roubar foco.
- Com `prefers-reduced-motion`, discos e fichas mudam sem giro ou transição.
- Em 360 px, não há rolagem horizontal; os discos formam uma grade 2 × 2.
- Os padrões do tabuleiro permanecem distinguíveis em alto contraste forçado.

## Critérios de aceite e testes obrigatórios

- Enumerar as `4!` posições com uma joia por linha e coluna e provar que apenas `2,4,1,3` satisfaz áreas e contato.
- Rejeitar linha, coluna, área ou contato inválido; não validar menos ou mais de quatro joias.
- Associar os códigos às pedras, calcular `[12, 3, -15, -9]` pelas quatro funções e mover `XXXX` para `JAIO`; testar retorno circular nos dois sentidos.
- Não liberar discos antes da vitrine nem anagrama antes dos discos.
- Aceitar somente variantes normalizadas de `JOIA` e somente quatro fichas válidas.
- Verificar persistência e reset por etapa, erros 3/7/12, recarga, teclado, leitor de tela, movimento reduzido e viewport de 360 px.
- Confirmar que memórias não participam do cálculo e não existem no DOM antes de `success`.

## Assets obrigatórios

Tabuleiro, joias, discos e fichas devem ser HTML/CSS ou SVG local. Nenhum asset pode conter `JOIA`, `JAIO`, a solução ou os resultados das funções no nome, texto alternativo ou metadado visível antes da etapa correta.
