# Catálogo de desafios

Cada arquivo desta pasta é a especificação completa e implementável de uma missão. Os documentos são spoilers e não devem ser compartilhados com a jogadora.

## Índice

| Data | Documento | Resposta |
| --- | --- | --- |
| 01/09 | [Auditoria do inventário](01-auditoria-do-inventario.md) | `EXPERIÊNCIAS` |
| 03/09 | [Manifesto poliglota](03-manifesto-poliglota.md) | `VALE` |
| 05/09 | [Vale açaí](05-vale-acai.md) | `AÇAÍ` |
| 07/09 | [Vale iFood](07-vale-ifood.md) | `IFOOD` |
| 09/09 | [Vale praia](09-vale-praia.md) | `PRAIA` |
| 10/09 | [Vale cinema](10-vale-cinema.md) | `CINEMA` |
| 11/09 | [Vale rodízio](11-vale-rodizio.md) | Palavra derivada no relógio |
| 12/09 | [Vale japonês](12-vale-japones.md) | `JAPONÊS` |
| 13/09 | [Vale joia](13-vale-joia.md) | `JOIA` |
| 14/09 | [Artefato: carta](14-artefato-carta.md) | `CARTA` |
| 15/09 | [Última milha](15-ultima-milha.md) | caixa de correios, lateral interna direita |

## Contrato obrigatório

Cada arquivo é o contrato único da missão. A implementação não deve precisar
inventar dados, ordem, índices, estados ou regras de validação. Toda
especificação deve registrar:

1. metadados, dificuldade e duração;
2. objetivo narrativo e regra de isolamento;
3. experiência exata da jogadora;
4. assets e dados de entrada;
5. dataset literal e contrato de entrada, sem valores implícitos;
6. mecânica determinística, incluindo pseudocódigo quando houver cálculo;
7. fluxo fechado de telas, controles, desbloqueios, persistência e reset;
8. solução completa, prova de unicidade e oráculo de teste reproduzível;
9. resposta final, índices e normalização com regras de rejeição;
10. contagem de erros, dicas exatamente em 3/7 e ajuda em 12;
11. bônus emocional sem dependência posterior;
12. acessibilidade e comportamento em celular;
13. critérios de aceite e testes de caminho feliz, erro, recarga e borda.

## Diretiva de consistência antes do código

Antes de implementar uma missão, o implementador deve conseguir responder
sem consultar outro arquivo:

1. Qual é a ordem canônica de exibição, resolução e extração?
2. Quais dados exatos são renderizados e qual é a resposta derivada deles?
3. A validação exige cada etapa intermediária ou somente a resposta final?
4. Os índices são zero-based ou one-based? Como letras acentuadas são tratadas?
5. O que acontece com entrada inválida, erro, recarga, reset e limite de ajuda?

Se qualquer resposta exigir uma decisão nova, a especificação deve ser
atualizada e revisada antes de qualquer código. Termos como “opcional”,
“sugerido” ou “pode” só podem aparecer para elementos explicitamente
decorativos e sem efeito na solução.

## Regra de consistência

Se a implementação exigir uma decisão não registrada no arquivo da missão, a documentação deve ser atualizada e revisada antes do código correspondente.
