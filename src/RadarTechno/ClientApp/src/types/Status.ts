// @ts-ignore max-line-length
// tslint:disable: max-line-length
export enum Status {
  excel = 'Excel',
  reinforce = 'Reinforce',
  assess = 'Assess',
  deprecated = 'Deprecated',
  out = 'Out',
  candidate = 'Candidate'
}

export enum StatusDescription {
  excel = 'We have capacity to use these solutions and they have already been deployed. We need to reinforce us in order to excel on these solutions that will be massively deployed or already are critical',
  reinforce = 'Assessments have demonstrated pertinence of these solutions. We have to reinforce their usages to relevant use cases and build a capacity on top of it at AXA France.',
  assess = 'We think these solutions may bring value to AXA.It is necessary to assess and to test them in our environment to confirm or not this vision.',
  deprecated = 'For various reasons, these solutions present a risk or a drag to AXA. Usage is deprecated. It is necessary to work proactively to decommission them.',
  out = 'Out',
  candidate = 'Candidate'
}
