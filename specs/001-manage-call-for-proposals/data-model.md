# Data Model: Gerenciamento de Editais de Fomento

## Entidade: `Edital` (app `editais`, `editais/models.py`)

Representa a "Chamada de Fomento" da spec (Key Entities). Um único model —
ver `research.md` para a justificativa de não desmembrar
documentação/critérios/estágio em models separados.

| Campo                  | Tipo Django                                   | Obrigatório | Notas |
|-------------------------|------------------------------------------------|-------------|-------|
| `id`                    | `AutoField` (implícito)                        | —           | PK padrão |
| `captador`               | `ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="editais")` | sim (setado no `save`, não no form) | Dono do registro — FR-015/FR-016. Nunca exposto no formulário; atribuído a partir de `request.user` na view de criação. |
| `nome_chamada`           | `CharField(max_length=255)`                     | sim (FR-003) | |
| `instituicao`            | `CharField(max_length=255)`                     | sim (FR-003) | Instituição que publica o edital (CHK028) — não a organização proponente do captador. |
| `descricao`              | `TextField`                                     | sim (FR-003) | |
| `link`                   | `URLField`                                      | sim (FR-003/FR-005 — ver research.md) | |
| `data_abertura`          | `DateField(null=True, blank=True)`               | não (FR-004, Edge Case) | Pode ficar em branco quando só a data de fechamento é conhecida. |
| `data_fechamento`        | `DateField`                                      | sim (FR-003) | Prazo de submissão. |
| `documentacao_exigida`   | `TextField(blank=True)`                          | não (FR-006) | Texto livre (FR-017). |
| `criterios_avaliacao`    | `TextField(blank=True)`                          | não (FR-007) | Texto livre (FR-017), critérios publicados pela instituição (CHK027). |
| `estagio`                | `CharField(max_length=20, choices=Estagio.choices, default=Estagio.BACKLOG)` | sim (FR-008) | Ver `Estagio` abaixo. |
| `criado_em`              | `DateTimeField(auto_now_add=True)`                | —           | Auditoria básica, não exposta na UI. |
| `atualizado_em`          | `DateTimeField(auto_now=True)`                    | —           | Auditoria básica, não exposta na UI. |

### `Estagio` (`models.TextChoices`, interno a `Edital`)

Ordem fixa, usada tanto para renderizar as colunas do kanban quanto para
calcular "próxima"/"anterior" coluna nos botões de mover (FR-002/FR-009):

```python
class Estagio(models.TextChoices):
    BACKLOG = "backlog", "Backlog"
    ANDAMENTO = "andamento", "Em andamento"
    VALIDACAO = "validacao", "Validação"
    CONCLUIDO = "concluido", "Concluído"
```

### Propriedades computadas (não persistidas)

- `prazo_vencido` (`bool`): `self.data_fechamento < date.today()` — usada
  para FR-011/SC-005. Ver research.md ("Prazo vencido é calculado").

### Validações

- Campos obrigatórios (`nome_chamada`, `instituicao`, `descricao`, `link`,
  `data_fechamento`) são reforçados pelo próprio `ModelForm`/`required` do
  model — cobre FR-005 (mensagem de erro por campo faltando é o
  comportamento padrão do Django forms, sem código extra).
- Nenhuma validação de unicidade em `nome_chamada` — Edge Case de nomes
  duplicados (CHK017) é aceito como cenário válido (duas edições anuais do
  mesmo programa), conforme observado no checklist como risco baixo/não
  bloqueante.

### Transições de estado (`estagio`)

- Toda transição entre quaisquer dos 4 valores é permitida nos dois
  sentidos (FR-009) — não há máquina de estados restritiva; "pular" direto
  de Backlog para Concluído é permitido (Edge Case respondido por FR-009:
  não há bloqueio de sequência).
- Estágio inicial sempre `BACKLOG` na criação (FR-008), setado pelo
  `default` do campo — nenhuma lógica extra necessária.

### Escopo por captador

- Toda `QuerySet` usada nas views filtra por `captador=request.user`
  (FR-015/FR-016). Não existe endpoint/rota que liste editais de outro
  usuário — reforçado tanto no `ListView.get_queryset()` quanto nas views de
  update/delete (evita IDOR: um captador não pode editar/remover edital de
  outro só adivinhando o `id` na URL).

### Migrations

- Uma única migration inicial (`0001_initial`) gerada via
  `manage.py makemigrations editais` — sem migrations de dados (não há dado
  legado a migrar).
