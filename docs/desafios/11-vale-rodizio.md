# Desafio 11 — Vale Rodízio: a volta incompleta

## Contrato da missão

Missão isolada de aritmética modular com um relógio analógico. A jogadora move
um ponteiro a partir de 12 h, aplicando sete instruções angulares; cada chegada
correta revela uma letra do mostrador. As sete chegadas formam a senha somente
no fim. A palavra não aparece em título, metadados, tabelas, dicas ou conteúdo
visível antes de ser calculada.

| Campo | Valor |
|---|---|
| Data | 2026-09-11 |
| Dificuldade | Alta |
| Duração | 15–25 min |
| Resposta | Palavra de sete letras derivada no relógio |

## Fluxo

`intro → painel do relógio → success`.

1. Em **intro**, o bilhete diz: “Parta do I. Siga cada deslocamento; só as
   chegadas contam.” Ele explica a convenção de sinais e que o ponto inicial
   não é uma letra da senha.
2. Em **painel do relógio**, ficam simultaneamente o mostrador, o ponteiro
   manipulável, a transcrição acessível e as sete instruções. O último campo
   de cada linha é uma caixa livre para a jogadora anotar a letra em que caiu.
   Não há troca de tela entre observar, calcular, mover e registrar.
3. O relógio não confirma cálculos, horas nem letras intermediárias. A jogadora
   pode mover o ponteiro e preencher ou corrigir as sete caixas em qualquer
   momento, usando o próprio raciocínio como guia.
4. Quando as sete caixas estiverem preenchidas, o botão de validação compara a
   sequência inteira com a senha derivada. Persistir `{ currentHour, letters,
   completed }`; recarga restaura as anotações e reiniciar limpa o estado.

## Mostrador e ponto de partida

O relógio usa 12 h como origem. A jogadora começa com o ponteiro em **12 h**,
na letra **I**; essa é apenas a âncora inicial e não ocupa uma lacuna. Há uma
única ocorrência de cada letra relevante no mostrador: retornos a uma mesma
hora podem, portanto, repetir uma letra na senha sem duplicá-la no relógio.

| Hora | 12 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Letra | I | Q | R | B | O | X | D | U | L | Z | V | M |

As letras devem substituir os números na face do relógio e não formar uma
linha de leitura. O relógio mostra a posição atual do ponteiro com um rótulo
textual, como `Ponteiro em 4 h`; cor jamais é o único indicador.

## Instruções de rotação

Executar as instruções abaixo **na ordem dada**, sempre a partir da posição em
que o ponteiro terminou a instrução anterior. Não mostrar a hora de chegada,
a letra resultante nem uma tabela de respostas junto a estas instruções.

| Etapa | Deslocamento |
|---|---|
| 1 | `+2 h` |
| 2 | `+π/3 rad` |
| 3 | `+1 h + π/6 rad` |
| 4 | `−π rad` |
| 5 | `−1 h 30 min − π/4 rad` |
| 6 | `−3π/2 rad` |
| 7 | `+5 h − π/6 rad` |

O sinal positivo move o ponteiro no sentido horário; o negativo, no sentido
anti-horário. Uma hora corresponde a `π/6 rad`. A jogadora pode usar, para
cada etapa:

```text
Δh = horas + (radianos × 6 / π)
hdestino = (hatual + Δh) mod 12
```

No resultado modular, `0` representa 12 h. Todos os deslocamentos desta missão
terminam em horas inteiras; não há arredondamento. A mistura proposital de
horas e radianos exige que a jogadora converta unidades e trate deslocamentos
negativos, em vez de apenas contar posições para a frente.

## Interação, validador e acessibilidade

O ponteiro deve poder ser girado por arraste, teclado (setas avançam ou recuam
uma hora) e botões equivalentes `−1 h` e `+1 h`. Ele encaixa apenas nas doze
horas, mas seu uso é livre: não há confirmação de posição, cálculo ou etapa.
Cada instrução tem uma caixa de uma letra, editável a qualquer momento, para a
jogadora registrar a chegada que encontrou.

Com as sete caixas preenchidas, concatenar seus conteúdos na ordem das etapas
e comparar a sequência completa com a resposta derivada de `clockLetters`,
`startHour` e `instructions`. O validador não armazena a palavra em texto claro
no conteúdo renderizado. Normalizar a sequência em Unicode NFD, remover
acentos, pontuação, hífens e espaços externos e converter para maiúsculas.
Aceitar a variante sem acento quando aplicável; rejeitar sequência parcial ou
uma palavra diferente. Não há dicas, contagem de erros ou checagens
intermediárias nesta missão.
O SVG precisa ter transcrição acessível com as doze horas/letras, o ponteiro,
a posição atual, as instruções e o progresso das sete lacunas. A transcrição
mantém o mostrador como posições, nunca como uma palavra linear. Oferecer foco
visível, controles de ao menos 44×44 px, suporte completo a teclado e
`prefers-reduced-motion`. Em 360 px, empilhar relógio, controles, instrução e
transcrição sem rolagem horizontal. A rotação animada é decorativa: os botões,
o teclado e a validação funcionam sem movimento.

## Critérios de aceite e testes

- O mostrador inicial começa em 12 h na letra I, contém apenas um O e uma única
  cópia de cada letra relevante; nenhuma palavra-resposta ou ordem de leitura é
  exibida.
- As sete instruções são resolvidas sequencialmente com aritmética modular,
  incluindo instruções só em horas, só em radianos, mistas e negativas.
- Cada linha mostra a instrução e uma caixa livre de uma letra; o relógio não
  confirma nem bloqueia cálculos, posições ou anotações intermediárias.
- O botão de validação só é habilitado depois que as sete caixas forem
  preenchidas. A sequência completa é a única aceita; sua variante normalizada
  sem acento também passa.
- Testar retorno por radiano negativo, cada tipo de instrução, arraste,
  teclado, edição das caixas, recarga, reset, leitor de tela, movimento reduzido
  e viewport de 360 px.

## Bônus

Após o sucesso, mostrar o bloco decorativo `Voltar ao Rio Brasa Lagoa`; ele não
é pista nem estado de outra missão.

## Assets obrigatórios

Usar um SVG local de relógio analógico com doze letras, ponteiro interativo e
sete lacunas de extração. A animação é decorativa e a transcrição textual acima
é obrigatória; nenhum asset pode conter a palavra final em nome, `alt` ou texto
visível antes da sétima chegada correta.
