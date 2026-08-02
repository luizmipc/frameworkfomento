#!/bin/sh
# Release stage (migrate) + exec into the production WSGI server as PID 1
# so it receives SIGTERM directly from `docker stop` (graceful shutdown).
#
# --no-dev: `uv run` auto-syncs .venv against pyproject.toml/uv.lock on every
# invocation. docker-compose bind-mounts the full app/ dir (dev pyproject.toml
# included) over /app, so without this flag the container would re-install
# ruff/bandit/semgrep into the .venv volume at startup, undoing the image's
# --no-dev build layer.
set -e

uv run --no-dev manage.py migrate --noinput

# ponytail: no STATIC_ROOT configured yet (no production static files beyond
# admin's own, not served by Django in prod anyway) -> collectstatic skipped.
# Add `uv run manage.py collectstatic --noinput` here once STATIC_ROOT exists.

exec uv run --no-dev gunicorn config.wsgi:application \
    --bind "${DJANGO_HOST:-0.0.0.0}:${DJANGO_PORT:-8000}"
