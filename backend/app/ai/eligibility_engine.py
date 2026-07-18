"""
Deterministic rule-based eligibility engine.
Pure functions — no database calls, no external API calls.
Fully unit-testable in isolation.
"""
import logging
from typing import Any
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class EligibilityResult:
    scheme_id: str
    scheme_name: str
    eligible: bool
    score: float
    explanation: str
    deadline: Any
    state: str
    benefits: str


def evaluate_scheme(profile: dict, scheme_id: str, scheme_name: str,
                    eligibility: dict, deadline, state: str, benefits: str) -> EligibilityResult | None:
    """
    Evaluate a single scheme's eligibility rules against a user profile.
    Returns EligibilityResult if eligible, None if not.
    Logs a warning and returns None if the eligibility JSON is malformed.
    """
    try:
        matched_reasons = []
        soft_bonuses = 0.0

        # --- Mandatory criteria ---

        # Age check
        min_age = eligibility.get("min_age")
        max_age = eligibility.get("max_age")
        user_age = profile.get("age")
        if user_age is not None:
            if min_age is not None and user_age < min_age:
                return None
            if max_age is not None and user_age > max_age:
                return None
            matched_reasons.append(f"age {user_age} within range")

        # Income check
        max_income = eligibility.get("max_income")
        user_income = profile.get("income")
        if max_income is not None and user_income is not None:
            if user_income > max_income:
                return None
            matched_reasons.append(f"income ₹{user_income:,} within limit")
            # Soft bonus: income significantly below threshold (>30% margin)
            if user_income <= max_income * 0.7:
                soft_bonuses += 0.1

        # Occupation check
        allowed_occupations = eligibility.get("occupation", [])
        if allowed_occupations:
            user_occ = (profile.get("occupation") or "").strip().lower()
            allowed_lower = [o.lower() for o in allowed_occupations]
            if user_occ not in allowed_lower:
                return None
            matched_reasons.append(f"occupation '{profile.get('occupation')}' matches")

        # State check
        allowed_states = eligibility.get("states", [])
        user_state = profile.get("state")
        if allowed_states:  # empty list = Central / all-state
            if user_state not in allowed_states:
                return None
            matched_reasons.append(f"state '{user_state}' matches")
            # Soft bonus: exact state match for state-level scheme
            soft_bonuses += 0.1
        else:
            matched_reasons.append("Central scheme (all states)")

        # Category check
        allowed_categories = eligibility.get("category", [])
        user_category = profile.get("category")
        if allowed_categories and user_category:
            if user_category not in allowed_categories:
                return None
            matched_reasons.append(f"category '{user_category}' qualifies")

        # Disability check
        disability_required = eligibility.get("disability_required", False)
        if disability_required:
            if not profile.get("disability"):
                return None
            matched_reasons.append("disability status verified")

        # Gender check (optional field in some schemes)
        required_gender = eligibility.get("gender")
        if required_gender:
            if profile.get("gender") != required_gender:
                return None
            matched_reasons.append(f"gender '{required_gender}' matches")

        # --- Score calculation ---
        score = min(0.6 + soft_bonuses, 1.0)

        explanation = "Matched because: " + ", ".join(matched_reasons) + "."
        return EligibilityResult(
            scheme_id=scheme_id,
            scheme_name=scheme_name,
            eligible=True,
            score=round(score, 2),
            explanation=explanation,
            deadline=deadline,
            state=state,
            benefits=benefits,
        )

    except Exception as e:
        logger.warning(f"Malformed eligibility JSON for scheme '{scheme_name}': {e}")
        return None


def evaluate(profile: dict, schemes: list) -> list[EligibilityResult]:
    """
    Evaluate all schemes against a user profile and return ranked eligible matches.
    Schemes with malformed eligibility JSON are silently skipped.
    Results sorted descending by score, ties broken by nearer deadline.
    """
    results = []
    for scheme in schemes:
        result = evaluate_scheme(
            profile=profile,
            scheme_id=str(scheme.id),
            scheme_name=scheme.scheme_name,
            eligibility=scheme.eligibility or {},
            deadline=scheme.deadline,
            state=scheme.state,
            benefits=scheme.benefits,
        )
        if result:
            results.append(result)

    # Sort: descending score, then nearer deadline (None = open-ended → rank lower)
    def sort_key(r: EligibilityResult):
        deadline_rank = r.deadline.toordinal() if r.deadline else 9999999
        return (-r.score, deadline_rank)

    results.sort(key=sort_key)
    return results
