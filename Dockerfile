FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

RUN useradd --create-home --uid 1000 appuser

WORKDIR /app

# Dependency layer first (changes rarely) so app-code edits below don't
# invalidate the `uv sync` cache. --no-dev drops ruff/bandit/semgrep (dev-only
# tooling) from the production image.
COPY app/pyproject.toml app/uv.lock ./
RUN uv sync --locked --no-install-project --no-dev

COPY app/ .
RUN uv sync --locked --no-dev && chown -R appuser:appuser /app

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD python3 -c "import os, urllib.request; urllib.request.urlopen('http://127.0.0.1:' + os.environ.get('DJANGO_PORT', '8000'), timeout=2)" || exit 1

CMD ["/entrypoint.sh"]
