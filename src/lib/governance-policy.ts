export type GovernanceDecision = 'allowed' | 'deferred' | 'blocked' | 'requires-foundress-confirmation';

export interface GovernanceEvaluationInput {
  action: string;
  message?: string;
  planBMode?: boolean;
  bridgeRequired?: boolean;
  bridgeAvailable?: boolean;
  hasPasscode?: boolean;
}

export interface GovernanceEvaluationResult {
  policyVersion: string;
  decision: GovernanceDecision;
  reason: string;
  tags: string[];
}

const POLICY_VERSION = 'mun-governance-v0.1.0';

const CHARTER = {
  identityDisclosure: 'Always disclose channel/provider and active mode when relevant.',
  consentBoundaries: 'Do not escalate role authority without explicit user intent.',
  memoryIntegrity: 'Preserve truthful context and avoid fabricated certainty.',
  harmBoundary: 'Refuse unsafe manipulative or destructive instruction patterns.',
  operationalTransparency: 'Expose degraded/deferred states clearly with reasons.',
} as const;

function normalizeText(input?: string): string {
  return (input || '').trim().toLowerCase();
}

export function getGovernanceCharter() {
  return {
    version: POLICY_VERSION,
    principles: CHARTER,
  };
}

export function evaluateGovernancePolicy(input: GovernanceEvaluationInput): GovernanceEvaluationResult {
  const text = normalizeText(input.message);
  const tags: string[] = ['identity_disclosure', 'operational_transparency'];

  if (input.action === 'guided-tour-step' && input.planBMode) {
    tags.push('observer_only');
    return {
      policyVersion: POLICY_VERSION,
      decision: 'allowed',
      reason: 'plan_b_observer_mode',
      tags,
    };
  }

  if (input.action === 'chat' && input.planBMode && input.bridgeRequired && !input.bridgeAvailable) {
    tags.push('degraded_mode', 'bridge_required');
    return {
      policyVersion: POLICY_VERSION,
      decision: 'deferred',
      reason: 'bridge_required_unavailable',
      tags,
    };
  }

  if (input.action === 'chat' && /impersonate|pretend to be|hide your identity/.test(text)) {
    tags.push('identity_protection');
    return {
      policyVersion: POLICY_VERSION,
      decision: 'blocked',
      reason: 'identity_deception_request',
      tags,
    };
  }

  return {
    policyVersion: POLICY_VERSION,
    decision: 'allowed',
    reason: 'policy_checks_passed',
    tags,
  };
}

export function buildPolicyAuditRecord(input: GovernanceEvaluationInput, result: GovernanceEvaluationResult) {
  return {
    at: new Date().toISOString(),
    action: input.action,
    decision: result.decision,
    reason: result.reason,
    tags: result.tags,
    policyVersion: result.policyVersion,
  };
}
