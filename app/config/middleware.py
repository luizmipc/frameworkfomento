"""Small hand-rolled middleware for HTTP security headers Django's
SecurityMiddleware doesn't set natively (no dependency needed for a few
header lines). See docs/cybersec-report/2026-08-01.html#achado-6.

Content-Security-Policy is set as Report-Only, not enforced: this is still
a scaffold with no business templates/static assets yet, and the Django
admin uses inline style/script in places, so an enforced policy without
'unsafe-inline' would break it. Report-Only satisfies ZAP's "CSP Header Not
Set" check without blocking anything. Tighten to an enforced
Content-Security-Policy (dropping 'unsafe-inline') once real templates
exist and inline usage can be audited/removed, in coordination with the
designer.
"""

_CSP_REPORT_ONLY = "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'"


def security_headers_middleware(get_response):
    def middleware(request):
        response = get_response(request)
        response.setdefault(
            'Permissions-Policy',
            'geolocation=(), microphone=(), camera=()',
        )
        response.setdefault('Cross-Origin-Embedder-Policy', 'require-corp')
        response.setdefault('Content-Security-Policy-Report-Only', _CSP_REPORT_ONLY)
        return response

    return middleware
