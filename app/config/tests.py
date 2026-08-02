"""Self-check for the security hardening in settings.py (A022-A025).

Not a Django TestCase because settings are evaluated once at import time,
before any test runner exists to override them; this exercises the same
logic (fail-safe secret-key check, hardened flags gated on DEBUG) directly
via subprocess with controlled env vars, the way it actually runs in prod.
"""

import os
import subprocess
import sys
from pathlib import Path

MANAGE_PY = Path(__file__).resolve().parent.parent / 'manage.py'


def _run_check(env_overrides):
    env = {k: v for k, v in os.environ.items() if not k.startswith('DJANGO_')}
    env.update(env_overrides)
    return subprocess.run(
        [sys.executable, str(MANAGE_PY), 'check'],
        env=env,
        capture_output=True,
        text=True,
        check=False,
    )


def demo():
    # DEBUG=False + no real secret key set -> must refuse to boot (A023).
    result = _run_check({'DJANGO_DEBUG': 'False'})
    assert result.returncode != 0, 'expected boot to fail with insecure fallback secret in prod'
    assert 'ImproperlyConfigured' in result.stderr

    # DEBUG=False + real secret key + allowed hosts -> boots, no crash (A022/A024).
    result = _run_check({
        'DJANGO_DEBUG': 'False',
        'DJANGO_SECRET_KEY': 'a-sufficiently-long-and-random-production-secret-key-value',
        'DJANGO_ALLOWED_HOSTS': 'example.com',
    })
    assert result.returncode == 0, result.stderr

    # DEBUG unset (default) -> secure-by-default, still boots fine with no
    # secret configured only because DEBUG stays False... so give it DEBUG=True
    # to mirror the local dev fallback path (A022) and confirm it still boots.
    result = _run_check({'DJANGO_DEBUG': 'True'})
    assert result.returncode == 0, result.stderr

    print('ok')


if __name__ == '__main__':
    demo()
