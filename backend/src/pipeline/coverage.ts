export const checkCoverage = (requirements: any[], questions: any[]) => {
  const coveredIds = new Set<string>();
  
  for (const q of questions) {
    if (q.requirement_ids && Array.isArray(q.requirement_ids)) {
      for (const id of q.requirement_ids) {
        coveredIds.add(id);
      }
    }
  }

  const uncoveredRequirementIds: string[] = [];
  
  for (const req of requirements) {
    if (req.priority === 'must' && !coveredIds.has(req.id)) {
      uncoveredRequirementIds.push(req.id);
    }
  }

  return { uncovered_requirement_ids: uncoveredRequirementIds };
};
