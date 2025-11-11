export type HolisticPillar =
  | 'nutrition'
  | 'work'
  | 'sleep'
  | 'mind-body'
  | 'ai-tools'
  | 'analog-tools'
  | 'neuroplasticity'
  | 'societal-impact'
  | 'purpose';

export type AccentChoice = 'classic' | 'vivid';

export interface BlogMeta {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  pillars?: HolisticPillar[];
}

export type ResourceType = 'tip' | 'study';

export interface ResourceMeta {
  slug: string;
  title: string;
  type: ResourceType;
  tags: string[];
  date: string;
  excerpt?: string;
  pillars?: HolisticPillar[];
}

export type FormationStatus = 'soon' | 'prelaunch' | 'available';
export type FormationLevel = 'intro' | 'intermediate' | 'advanced';

export interface Formation {
  slug: string;
  title: string;
  short: string;
  status: FormationStatus;
  level?: FormationLevel;
  outline?: string[];
  pillars?: HolisticPillar[];
  ctaUrl?: string | null;
}

export interface AdminArticleSummary {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | null;
  isListed: boolean;
  publishedAt?: string | null;
  category?: string | null;
  pillars?: HolisticPillar[];
}

export interface AdminFormationSummary {
  id: string;
  title: string;
  slug: string;
  status: FormationStatus;
  isListed: boolean;
}

export interface AdminArticleDetail extends AdminArticleSummary {
  excerpt?: string | null;
  tags?: string[] | null;
  heroImage?: string | null;
  interactiveSlug?: string | null;
  interactiveHtml?: string | null;
  body: string;
}

export interface AdminResourceSummary {
  id: string;
  title: string;
  slug: string;
  type: ResourceType;
  isListed: boolean;
  status: 'draft' | 'published' | null;
  publishedAt?: string | null;
  pillars?: HolisticPillar[];
}

export interface AdminResourceDetail extends AdminResourceSummary {
  excerpt?: string | null;
  tags?: string[] | null;
  body: string;
}

export interface AdminContactMessage {
  id: string;
  fullName: string;
  email: string;
  message: string;
  consent: boolean;
  consentAt: string | null;
  originPath?: string | null;
  userAgent?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface AdminNewsletterSignup {
  id: string;
  email: string;
  status: string | null;
  consent: boolean;
  consentAt: string | null;
  sourcePath?: string | null;
  doubleOptInSentAt?: string | null;
  confirmedAt?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}
