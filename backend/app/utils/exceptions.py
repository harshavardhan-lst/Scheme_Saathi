class SchemeSathiError(Exception):
    """Base class for all application errors."""
    pass


class ValidationError(SchemeSathiError):
    """Raised when request data fails business-level validation."""
    def __init__(self, message: str, fields: list[str] | None = None):
        super().__init__(message)
        self.message = message
        self.fields = fields or []


class NotFoundError(SchemeSathiError):
    """Raised when a requested resource does not exist."""
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message)
        self.message = message


class AuthError(SchemeSathiError):
    """Raised on authentication/authorization failures."""
    def __init__(self, message: str = "Authentication failed"):
        super().__init__(message)
        self.message = message


class AIServiceError(SchemeSathiError):
    """Raised when the Gemini API is unavailable or returns an error."""
    def __init__(self, message: str = "AI service unavailable"):
        super().__init__(message)
        self.message = message


class DuplicateError(SchemeSathiError):
    """Raised on unique constraint violations (e.g. duplicate email)."""
    def __init__(self, message: str, code: str = "DUPLICATE"):
        super().__init__(message)
        self.message = message
        self.code = code


class IncompleteProfileError(SchemeSathiError):
    """Raised when /recommend is called with missing profile fields."""
    def __init__(self, missing_fields: list[str]):
        super().__init__("Profile is incomplete")
        self.message = "Profile is incomplete"
        self.missing_fields = missing_fields
