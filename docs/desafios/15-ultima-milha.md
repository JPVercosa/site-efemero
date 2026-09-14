# Desafio 15 — Última milha

## Contrato da missão

Encerramento físico da trilha com uma única charada. A jogadora resolve o enigma,
digita o nome do lugar e recebe uma confirmação breve para iniciar a busca física;
não há grafo, diagrama, foto ou segunda resposta.

| Campo | Valor |
|---|---|
| Data | 2026-09-15 |
| Dificuldade | Alta |
| Duração | 10–15 min |
| Resposta final | `CAIXA DE CORREIOS` |

## Experiência e fluxo

`intro → charada → success`

A introdução deve ser breve: depois de tantos desafios, resta apenas decifrar a
última charada. Em `charada`, mostrar o poema completo, um campo livre e o botão
`Enviar resposta`. Somente a resposta correta move para `success`. Persistir
`{ errors, completed }` durante a sessão; recarregar restaura o
estado e `Reiniciar missão` limpa o progresso.

## Charada

Exibir os versos preservando estrofes e quebras de linha:

> Tenho boca, mas calada; tenho porta, sem entrar,
> engulo o que vem de longe sem jamais me alimentar.
> Não sou quarto, nem armário, mas sei bem acomodar
> pequenas coisas que alguém manda o mundo atravessar.
>
> Guardo nomes e destinos sem a rota percorrer;
> quem me visita traz volumes, quem me abre vai receber.
> Roupinhas chegam amiúde, quase sempre ao meu abrigo,
> e o mais óbvio dos lugares fez-se o melhor esconderijo.
>
> Antes da segunda entrada, onde o prédio é de todos,
> perto do que leva embora o que já não serve a nós,
> muitas portas bem iguais fazem fila, lado a lado;
> procure abaixo, pelo doze, o pequeno reservado.
>
> Meu nome junta mais palavras — eis uma pista, não a sorte —,
> trago recados sem falar e fico imóvel no transporte.
> Se por fora nada surge, olhe dentro com cuidado:
> o segredo, muito discreto, pode estar ali colado.
>
> Não o puxe com violência, dê-lhe tempo ao retirar;
> papel rasgado perde versos que ainda querem te encontrar.
> E, se mesmo procurando o paradeiro se ocultar,
> ele está onde a resposta diz: com o autor deves falar.

A charada deve permanecer enigmática: não destacar letras, formar acróstico,
mostrar ícone postal ou empregar a resposta antes do acerto. A indicação de
“mais palavras” é a pista de que a resposta é uma expressão composta.

## Validação

Normalizar a entrada em Unicode NFD, remover diacríticos e pontuação, transformar
hífens em espaços, reduzir espaços duplicados, aparar e converter para
maiúsculas. Aceitar somente `CAIXA DE CORREIOS`, incluindo variantes como
`caixa de correios` e `CAIXA-DE-CORREIOS`. Rejeitar `CAIXA`, `CORREIO`,
`CORREIOS`, `CAIXA POSTAL`, `HALL`, `LIXEIRA`, `PORTA` e o código de entrada.
Entrada vazia não incrementa `errors`; cada resposta completa incorreta, sim. Uma
resposta incorreta mostra sempre `Ainda não. Releia a charada e tente outra vez.`;
não há dicas progressivas nem limite de tentativas.

## Acerto e busca física

Ao acertar, marcar `completed: true`, mover para `success` e exibir:

> **Última rota encontrada. Agora procure a carta no lugar revelado.**


## Acessibilidade e responsividade

- Associar rótulo visível ao campo e anunciar erro ou acerto em `aria-live`.
- Usar foco visível, alvos mínimos de `44×44px`, teclado e
  `prefers-reduced-motion`.
- Preservar as estrofes sem rolagem horizontal em 360 px.

## Critérios de aceite e testes obrigatórios

- Há somente uma charada e um único campo de resposta.
- A resposta não é exibida automaticamente antes nem depois do acerto.
- Apenas variantes normalizadas de `CAIXA DE CORREIOS` são aceitas.
- Testar entrada vazia, respostas parciais, tentativas repetidas, persistência,
  recarga e reset.
- O acerto exibe somente a confirmação curta definida nesta especificação.
- Testar teclado, leitor de tela, movimento reduzido e viewport de 360 px.
