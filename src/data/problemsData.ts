import problemDetailsJson from './problem-details.json';
import type { ProblemDetail } from '../types/dsa';

const problemMap: Record<string, ProblemDetail> = problemDetailsJson as unknown as Record<string, ProblemDetail>;

export function getProblemDetail(problemId: string, slug?: string | null): ProblemDetail | null {
  if (problemId && problemMap[problemId]) {
    return problemMap[problemId];
  }
  if (slug) {
    const cleanSlug = slug.replace('/plus/dsa/problems/', '').split('?')[0].replace(/^\/+|\/+$/g, '');
    if (problemMap[cleanSlug]) {
      return problemMap[cleanSlug];
    }
  }
  return null;
}

export default problemMap;
