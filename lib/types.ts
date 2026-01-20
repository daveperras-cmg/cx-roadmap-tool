/**
 * Sprint Roadmap Planning Tool - Type Definitions
 * Defines the 4-level hierarchy: Initiative > Epic > Feature > Story
 */

// Team member roles
export type TeamRole = 'Developer' | 'Designer' | 'PM' | 'QA';

// Work item status
export type WorkItemStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Blocked';

// Work item types
export type WorkItemType = 'Initiative' | 'Epic' | 'Feature' | 'Story';

// Story point values (Fibonacci sequence)
export type StoryPoints = 1 | 2 | 3 | 5 | 8 | 13;

// Sprint cadence options
export type SprintCadence = '2-week' | '3-week';

/**
 * Team Member
 */
export interface TeamMember {
  id: string;
  name: string;
  role: TeamRole;
  email?: string;
  createdAt: string;
}

/**
 * Base interface for all work items
 */
export interface BaseWorkItem {
  id: string;
  type: WorkItemType;
  title: string;
  description?: string;
  sprintNumber?: number; // Assigned sprint
  assignedMembers: string[]; // Array of team member IDs
  status: WorkItemStatus;
  isExpanded: boolean; // For expand/collapse functionality
  createdAt: string;
  updatedAt: string;
}

/**
 * Story - Granular work items with story points
 */
export interface Story extends BaseWorkItem {
  type: 'Story';
  storyPoints?: StoryPoints;
  parentFeatureId: string;
}

/**
 * Feature - Specific functionality within epics
 */
export interface Feature extends BaseWorkItem {
  type: 'Feature';
  parentEpicId: string;
  stories: Story[];
}

/**
 * Epic - Major deliverables breaking down initiatives
 */
export interface Epic extends BaseWorkItem {
  type: 'Epic';
  parentInitiativeId: string;
  features: Feature[];
}

/**
 * Initiative - Top-level strategic goals
 */
export interface Initiative extends BaseWorkItem {
  type: 'Initiative';
  problemStatement?: string;
  desiredOutcome?: string;
  epics: Epic[];
}

/**
 * Sprint Configuration
 */
export interface SprintConfig {
  cadence: SprintCadence;
  sprintsPerIncrement: number; // Default: 3
  incrementsPerQuarter: number; // Default: 2
  planningStartDate: string; // ISO date string
  totalSprints: number; // Calculated: sprintsPerIncrement * incrementsPerQuarter * 3 quarters
}

/**
 * Complete Roadmap Data Structure
 */
export interface RoadmapData {
  teamMembers: TeamMember[];
  initiatives: Initiative[];
  sprintConfig: SprintConfig;
  lastModified: string;
}

/**
 * Filter state
 */
export interface FilterState {
  selectedMemberId?: string;
}

/**
 * Helper type for counting children
 */
export interface ItemCounts {
  epics?: number;
  features?: number;
  stories?: number;
  total: number;
}
