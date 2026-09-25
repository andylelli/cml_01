/**
 * ANALYSIS_109 M1 — a Simple Temporal Network (Dechter, Meiri & Pearl, 1991).
 *
 * Time-points, and constraints of the form `min ≤ to − from ≤ max`, each carried as two edges of a
 * distance graph: from→to weighted `max`, to→from weighted `−min`. The network is consistent iff the
 * graph has no negative cycle; Floyd–Warshall decides it and, when consistent, its distance matrix is
 * the MINIMAL network — the tightest bounds every point can take. On a negative cycle, the cycle's
 * edges ARE the statements that cannot all hold, and each edge carries the sentence it came from.
 *
 * A case has a few dozen points, so O(n³) is instant. No dependency.
 */

export interface StnConstraint {
  from: string;
  to: string;
  /** `to − from ≥ min`; omit for no lower bound. */
  min?: number;
  /** `to − from ≤ max`; omit for no upper bound. */
  max?: number;
  /** The statement this constraint came from — what a conflict report prints. */
  label: string;
}

export interface StnResult {
  consistent: boolean;
  /** The labels of the constraints on one negative cycle, in cycle order, when inconsistent. */
  conflict: string[];
  /** Tightest bounds of `point − origin`, when consistent: [earliest, latest] (±Infinity if open). */
  bounds: (point: string) => [number, number] | null;
}

export const solveStn = (origin: string, constraints: ReadonlyArray<StnConstraint>): StnResult => {
  const names: string[] = [origin];
  const index = new Map<string, number>([[origin, 0]]);
  const idOf = (p: string): number => {
    let i = index.get(p);
    if (i === undefined) {
      i = names.length;
      names.push(p);
      index.set(p, i);
    }
    return i;
  };
  for (const c of constraints) {
    idOf(c.from);
    idOf(c.to);
  }
  const n = names.length;
  const dist: number[][] = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 0 : Infinity)));
  const next: number[][] = Array.from({ length: n }, () => Array.from({ length: n }, () => -1));
  const label: string[][] = Array.from({ length: n }, () => Array.from({ length: n }, () => ""));
  const edge = (a: number, b: number, w: number, why: string): void => {
    if (w < dist[a]![b]!) {
      dist[a]![b] = w;
      next[a]![b] = b;
      label[a]![b] = why;
    }
  };
  for (const c of constraints) {
    const a = idOf(c.from);
    const b = idOf(c.to);
    if (c.max !== undefined) edge(a, b, c.max, c.label);
    if (c.min !== undefined) edge(b, a, -c.min, c.label);
  }
  for (let k = 0; k < n; k += 1) {
    for (let i = 0; i < n; i += 1) {
      const ik = dist[i]![k]!;
      if (ik === Infinity) continue;
      for (let j = 0; j < n; j += 1) {
        const via = ik + dist[k]![j]!;
        if (via < dist[i]![j]!) {
          dist[i]![j] = via;
          next[i]![j] = next[i]![k]!;
        }
      }
    }
  }
  const bad = names.findIndex((_, i) => dist[i]![i]! < 0);
  if (bad >= 0) {
    // Walk the cycle through `next` from the point whose distance to itself went negative.
    const conflict: string[] = [];
    let u = bad;
    for (let steps = 0; steps <= n; steps += 1) {
      const v = next[u]![bad]!;
      if (v < 0) break;
      const why = label[u]![v]!;
      if (why && !conflict.includes(why)) conflict.push(why);
      u = v;
      if (u === bad) break;
    }
    return { consistent: false, conflict, bounds: () => null };
  }
  return {
    consistent: true,
    conflict: [],
    bounds: (point) => {
      const i = index.get(point);
      if (i === undefined) return null;
      return [-dist[i]![0]!, dist[0]![i]!];
    },
  };
};
