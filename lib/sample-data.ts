import { RoadmapData, TeamMember, Initiative, SprintConfig } from './types';

/**
 * Default team members
 */
const defaultTeamMembers: TeamMember[] = [
  {
    id: 'tm-001',
    name: 'Sarah Chen',
    role: 'Developer',
    email: 'sarah.chen@cmgfi.com',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tm-002',
    name: 'Marcus Johnson',
    role: 'PM',
    email: 'marcus.johnson@cmgfi.com',
    createdAt: new Date().toISOString(),
  },
];

/**
 * Default sprint configuration
 * 2-week sprints, 3 per increment, 2 increments per quarter = 18 total sprints
 */
const defaultSprintConfig: SprintConfig = {
  cadence: '2-week',
  sprintsPerIncrement: 3,
  incrementsPerQuarter: 2,
  planningStartDate: new Date().toISOString(),
  totalSprints: 18, // 3 * 2 * 3 quarters
};

/**
 * Sample initiative with complete hierarchy
 */
const sampleInitiative: Initiative = {
  id: 'init-001',
  type: 'Initiative',
  title: 'Customer Portal Modernization',
  description: 'Modernize the customer portal to improve user experience and reduce support tickets',
  problemStatement: 'Current customer portal has a 45% bounce rate and generates 200+ support tickets weekly due to confusing navigation and outdated UI.',
  desiredOutcome: 'Reduce bounce rate to <20%, cut support tickets by 60%, and increase customer satisfaction score from 3.2 to 4.5+',
  sprintNumber: undefined,
  assignedMembers: ['tm-002'],
  status: 'In Progress',
  isExpanded: true,
  createdAt: new Date('2025-01-01').toISOString(),
  updatedAt: new Date().toISOString(),
  epics: [
    {
      id: 'epic-001',
      type: 'Epic',
      title: 'Authentication & Security Overhaul',
      description: 'Implement modern authentication with SSO and enhanced security features',
      parentInitiativeId: 'init-001',
      sprintNumber: 1,
      assignedMembers: ['tm-001'],
      status: 'Completed',
      isExpanded: true,
      createdAt: new Date('2025-01-05').toISOString(),
      updatedAt: new Date().toISOString(),
      features: [
        {
          id: 'feat-001',
          type: 'Feature',
          title: 'Single Sign-On Integration',
          description: 'Integrate with corporate SSO provider (Okta)',
          parentEpicId: 'epic-001',
          sprintNumber: 1,
          assignedMembers: ['tm-001'],
          status: 'Completed',
          isExpanded: true,
          createdAt: new Date('2025-01-10').toISOString(),
          updatedAt: new Date().toISOString(),
          stories: [
            {
              id: 'story-001',
              type: 'Story',
              title: 'Configure Okta SAML integration',
              description: 'Set up SAML 2.0 integration with Okta',
              parentFeatureId: 'feat-001',
              sprintNumber: 1,
              assignedMembers: ['tm-001'],
              status: 'Completed',
              storyPoints: 5,
              isExpanded: false,
              createdAt: new Date('2025-01-12').toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: 'story-002',
              type: 'Story',
              title: 'Build SSO callback handler',
              description: 'Create endpoint to handle SSO callbacks and session creation',
              parentFeatureId: 'feat-001',
              sprintNumber: 1,
              assignedMembers: ['tm-001'],
              status: 'Completed',
              storyPoints: 8,
              isExpanded: false,
              createdAt: new Date('2025-01-12').toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        },
        {
          id: 'feat-002',
          type: 'Feature',
          title: 'Multi-Factor Authentication',
          description: 'Add MFA support for enhanced security',
          parentEpicId: 'epic-001',
          sprintNumber: 2,
          assignedMembers: ['tm-001'],
          status: 'Completed',
          isExpanded: false,
          createdAt: new Date('2025-01-10').toISOString(),
          updatedAt: new Date().toISOString(),
          stories: [
            {
              id: 'story-003',
              type: 'Story',
              title: 'Implement TOTP-based MFA',
              description: 'Add time-based one-time password support',
              parentFeatureId: 'feat-002',
              sprintNumber: 2,
              assignedMembers: ['tm-001'],
              status: 'Completed',
              storyPoints: 5,
              isExpanded: false,
              createdAt: new Date('2025-01-20').toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        },
      ],
    },
    {
      id: 'epic-002',
      type: 'Epic',
      title: 'Dashboard Redesign',
      description: 'Create modern, intuitive dashboard with key customer metrics',
      parentInitiativeId: 'init-001',
      sprintNumber: 3,
      assignedMembers: ['tm-001', 'tm-002'],
      status: 'In Progress',
      isExpanded: true,
      createdAt: new Date('2025-01-05').toISOString(),
      updatedAt: new Date().toISOString(),
      features: [
        {
          id: 'feat-003',
          type: 'Feature',
          title: 'Account Summary Widget',
          description: 'Display key account information at a glance',
          parentEpicId: 'epic-002',
          sprintNumber: 3,
          assignedMembers: ['tm-001'],
          status: 'In Progress',
          isExpanded: true,
          createdAt: new Date('2025-02-01').toISOString(),
          updatedAt: new Date().toISOString(),
          stories: [
            {
              id: 'story-004',
              type: 'Story',
              title: 'Design account summary layout',
              description: 'Create responsive layout for account overview',
              parentFeatureId: 'feat-003',
              sprintNumber: 3,
              assignedMembers: ['tm-001'],
              status: 'In Progress',
              storyPoints: 3,
              isExpanded: false,
              createdAt: new Date('2025-02-05').toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: 'story-005',
              type: 'Story',
              title: 'Fetch and display account balance',
              description: 'Integrate with account API to show current balance',
              parentFeatureId: 'feat-003',
              sprintNumber: 3,
              assignedMembers: ['tm-001'],
              status: 'Not Started',
              storyPoints: 5,
              isExpanded: false,
              createdAt: new Date('2025-02-05').toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        },
      ],
    },
  ],
};

/**
 * Complete default roadmap data
 */
export const defaultRoadmapData: RoadmapData = {
  teamMembers: defaultTeamMembers,
  initiatives: [sampleInitiative],
  sprintConfig: defaultSprintConfig,
  lastModified: new Date().toISOString(),
};
