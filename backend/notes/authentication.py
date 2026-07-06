from rest_framework.authentication import SessionAuthentication


class CsrfExemptSessionAuthentication(SessionAuthentication):
    """
    Session authentication without CSRF enforcement for REST API endpoints
    that are protected by our custom desk ledger passkey / session flag.
    """
    def enforce_csrf(self, request):
        return  # Do not enforce CSRF check on API requests
