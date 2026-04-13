/** A single injectable content atom. */
export interface Asset {
  /** Deterministic ID: "{type}:{scopeKey}:{index}". E.g. "portrait:Alice:physical" */
  id: string;
  /** Source field path in the CML object, for traceability. */
  source: string;
  /** Whether this atom is tied to a specific character/location or spans the whole story. */
  scope: 'character' | 'location' | 'story' | 'window';
  /** The key value for the scope — character name, location ID, or "" for story-scope. */
  scopeKey: string;
  /** Register tag: 'tense' | 'relief' | 'humorous' | 'observational' | 'neutral' */
  register?: string;
  /** The prose content to inject. */
  content: string;
  /**
   * Maximum times this atom should appear across the story.
   * 1 = inject once only; 2 = at most twice; 0 = unlimited.
   */
  budget: number;
  /**
   * Obligation tier — determines whether the atom is a hard obligation or a
   * texture suggestion.
   */
  tier: 'obligation' | 'texture';
  /** Token-budget priority for applyPromptBudgeting(). */
  priority: 'critical' | 'high' | 'medium' | 'lower';
}

/** Map of atom ID → Asset. */
export type AssetLibrary = Record<string, Asset>;
