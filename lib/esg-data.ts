// ESG Data Types and Mock Data for Renesas ESG Monitor

export interface ESGScore {
  environmental: number;
  social: number;
  governance: number;
  total: number;
}

export interface CompanyESG {
  id: string;
  name: string;
  shortName: string;
  ticker: string;
  country: string;
  scores: ESGScore;
  trend: "up" | "down" | "stable";
  rank: number;
  highlights: string[];
  risks: string[];
  lastUpdated: string;
}

export interface Regulation {
  id: string;
  name: string;
  region: string;
  category: "E" | "S" | "G" | "ESG";
  status: "active" | "upcoming" | "proposed" | "draft";
  impactLevel: "critical" | "high" | "medium" | "low";
  effectiveDate: string;
  description: string;
  renesasImpact: string;
  responseStatus: "completed" | "in-progress" | "not-started" | "monitoring";
  deadline?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  category: "E" | "S" | "G" | "ESG";
  region: string;
  summary: string;
  aiAnalysis?: string;
  impactLevel: "high" | "medium" | "low";
  url?: string;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  category: "E" | "S" | "G";
  priority: "critical" | "high" | "medium" | "low";
  status: "completed" | "in-progress" | "not-started" | "blocked";
  assignedDepartment: string;
  dueDate: string;
  progress: number;
  relatedRegulation?: string;
}

export const COMPANIES: CompanyESG[] = [
  {
    id: "renesas",
    name: "Renesas Electronics",
    shortName: "Renesas",
    ticker: "6723.T",
    country: "Japan",
    scores: { environmental: 68, social: 72, governance: 75, total: 71.7 },
    trend: "up",
    rank: 4,
    highlights: ["Carbon neutrality target 2050", "Diversity initiatives expanding", "Strong IP governance"],
    risks: ["Supply chain emissions tracking", "Water usage in fabs", "Regional regulatory gaps"],
    lastUpdated: "2026-03-20",
  },
  {
    id: "ti",
    name: "Texas Instruments",
    shortName: "TI",
    ticker: "TXN",
    country: "USA",
    scores: { environmental: 74, social: 70, governance: 82, total: 75.3 },
    trend: "stable",
    rank: 2,
    highlights: ["Strong governance framework", "Renewable energy investments", "Transparent reporting"],
    risks: ["Workforce diversity gaps", "Lobbying disclosure"],
    lastUpdated: "2026-03-18",
  },
  {
    id: "stmicro",
    name: "STMicroelectronics",
    shortName: "STMicro",
    ticker: "STM",
    country: "Switzerland",
    scores: { environmental: 82, social: 76, governance: 78, total: 78.7 },
    trend: "up",
    rank: 1,
    highlights: ["Industry-leading carbon reduction", "Strong EU compliance", "Circular economy programs"],
    risks: ["Geopolitical supply chain risks"],
    lastUpdated: "2026-03-19",
  },
  {
    id: "nxp",
    name: "NXP Semiconductors",
    shortName: "NXP",
    ticker: "NXPI",
    country: "Netherlands",
    scores: { environmental: 71, social: 73, governance: 77, total: 73.7 },
    trend: "up",
    rank: 3,
    highlights: ["EU taxonomy aligned", "Strong data privacy", "Automotive sustainability focus"],
    risks: ["Scope 3 emissions reporting", "Conflict minerals"],
    lastUpdated: "2026-03-17",
  },
  {
    id: "onsemi",
    name: "ON Semiconductor",
    shortName: "onsemi",
    ticker: "ON",
    country: "USA",
    scores: { environmental: 70, social: 65, governance: 72, total: 69.0 },
    trend: "up",
    rank: 6,
    highlights: ["SiC sustainability advantage", "Energy efficiency focus"],
    risks: ["Social metrics lagging", "Board diversity", "Supply chain transparency"],
    lastUpdated: "2026-03-16",
  },
  {
    id: "microchip",
    name: "Microchip Technology",
    shortName: "Microchip",
    ticker: "MCHP",
    country: "USA",
    scores: { environmental: 62, social: 64, governance: 70, total: 65.3 },
    trend: "stable",
    rank: 8,
    highlights: ["Improving disclosure", "Employee development programs"],
    risks: ["Environmental targets behind peers", "Limited ESG reporting history", "Water management"],
    lastUpdated: "2026-03-15",
  },
  {
    id: "infineon",
    name: "Infineon Technologies",
    shortName: "Infineon",
    ticker: "IFX",
    country: "Germany",
    scores: { environmental: 78, social: 74, governance: 80, total: 77.3 },
    trend: "stable",
    rank: 2,
    highlights: ["Carbon neutral operations 2030", "Strong EU CSRD readiness", "Green bond issuance"],
    risks: ["Complex global supply chain", "Emerging market labor standards"],
    lastUpdated: "2026-03-18",
  },
  {
    id: "adi",
    name: "Analog Devices",
    shortName: "ADI",
    ticker: "ADI",
    country: "USA",
    scores: { environmental: 66, social: 69, governance: 74, total: 69.7 },
    trend: "up",
    rank: 5,
    highlights: ["Science-based targets set", "Community engagement strong"],
    risks: ["Renewable energy transition pace", "Scope 3 measurement gaps"],
    lastUpdated: "2026-03-14",
  },
];

export const REGULATIONS: Regulation[] = [
  {
    id: "csrd",
    name: "EU Corporate Sustainability Reporting Directive (CSRD)",
    region: "EU",
    category: "ESG",
    status: "active",
    impactLevel: "critical",
    effectiveDate: "2025-01-01",
    description: "Comprehensive sustainability reporting requirements for large companies operating in the EU.",
    renesasImpact: "Requires detailed ESG disclosure for EU operations. Affects supply chain reporting and double materiality assessment.",
    responseStatus: "in-progress",
    deadline: "2026-06-30",
  },
  {
    id: "sec-climate",
    name: "SEC Climate Disclosure Rules",
    region: "USA",
    category: "E",
    status: "active",
    impactLevel: "high",
    effectiveDate: "2026-01-01",
    description: "Mandatory climate-related financial disclosures for SEC registrants.",
    renesasImpact: "Impacts US-listed ADR reporting. Requires Scope 1, 2 emissions disclosure and climate risk assessment.",
    responseStatus: "in-progress",
    deadline: "2026-12-31",
  },
  {
    id: "issb",
    name: "ISSB Sustainability Disclosure Standards (IFRS S1/S2)",
    region: "Global",
    category: "ESG",
    status: "active",
    impactLevel: "high",
    effectiveDate: "2025-01-01",
    description: "Global baseline for sustainability-related financial disclosures.",
    renesasImpact: "Japan SSBJ adoption expected. Requires alignment of existing TCFD disclosures with ISSB framework.",
    responseStatus: "in-progress",
    deadline: "2026-03-31",
  },
  {
    id: "eu-csddd",
    name: "EU Corporate Sustainability Due Diligence Directive (CSDDD)",
    region: "EU",
    category: "S",
    status: "upcoming",
    impactLevel: "high",
    effectiveDate: "2027-07-01",
    description: "Mandatory human rights and environmental due diligence across value chains.",
    renesasImpact: "Requires comprehensive supply chain due diligence. Affects procurement processes and supplier management.",
    responseStatus: "not-started",
    deadline: "2027-07-01",
  },
  {
    id: "japan-gx",
    name: "Japan GX Promotion Act",
    region: "Japan",
    category: "E",
    status: "active",
    impactLevel: "high",
    effectiveDate: "2023-05-01",
    description: "Green transformation strategy including carbon pricing and transition finance.",
    renesasImpact: "Carbon pricing impacts manufacturing costs. Transition bond opportunities for green investments.",
    responseStatus: "in-progress",
    deadline: "2026-09-30",
  },
  {
    id: "eu-taxonomy",
    name: "EU Taxonomy Regulation",
    region: "EU",
    category: "E",
    status: "active",
    impactLevel: "medium",
    effectiveDate: "2024-01-01",
    description: "Classification system for environmentally sustainable economic activities.",
    renesasImpact: "Semiconductor manufacturing alignment assessment needed. Green revenue classification for automotive/IoT products.",
    responseStatus: "monitoring",
  },
  {
    id: "cbam",
    name: "EU Carbon Border Adjustment Mechanism (CBAM)",
    region: "EU",
    category: "E",
    status: "upcoming",
    impactLevel: "medium",
    effectiveDate: "2026-01-01",
    description: "Carbon tariff on imports to prevent carbon leakage.",
    renesasImpact: "Potential impact on EU-bound semiconductor exports. Requires embedded emissions calculation.",
    responseStatus: "monitoring",
  },
  {
    id: "japan-human-rights",
    name: "Japan Guidelines on Responsible Business Conduct",
    region: "Japan",
    category: "S",
    status: "active",
    impactLevel: "medium",
    effectiveDate: "2022-09-01",
    description: "Government guidelines for human rights due diligence in business.",
    renesasImpact: "Voluntary but increasingly expected. Requires human rights impact assessment across supply chain.",
    responseStatus: "in-progress",
  },
];

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: "n1",
    title: "EU Finalizes CSDDD Implementation Timeline",
    source: "Reuters",
    date: "2026-03-24",
    category: "S",
    region: "EU",
    summary: "The European Commission has published final implementation guidelines for the Corporate Sustainability Due Diligence Directive, setting clear milestones for compliance.",
    aiAnalysis: "High relevance for Renesas EU operations. Supply chain due diligence requirements will need to be integrated into procurement processes by Q3 2027. Recommend initiating supplier assessment program.",
    impactLevel: "high",
  },
  {
    id: "n2",
    title: "ISSB Standards Adoption Accelerates in Asia-Pacific",
    source: "Nikkei Asia",
    date: "2026-03-23",
    category: "ESG",
    region: "Asia",
    summary: "Japan's SSBJ confirms timeline for mandatory ISSB-aligned reporting, with large companies expected to comply from FY2027.",
    aiAnalysis: "Direct impact on Renesas reporting requirements. Current TCFD framework needs upgrading to ISSB standards. Gap analysis recommended within 60 days.",
    impactLevel: "high",
  },
  {
    id: "n3",
    title: "Semiconductor Industry Faces Scope 3 Emissions Scrutiny",
    source: "Bloomberg",
    date: "2026-03-22",
    category: "E",
    region: "Global",
    summary: "Investors increasingly demanding comprehensive Scope 3 emissions data from semiconductor manufacturers, citing supply chain complexity.",
    aiAnalysis: "Industry-wide challenge affecting all benchmark companies. Renesas should accelerate Scope 3 measurement methodology. Collaborative industry approach recommended.",
    impactLevel: "medium",
  },
  {
    id: "n4",
    title: "SEC Proposes Enhanced Human Capital Disclosure Requirements",
    source: "WSJ",
    date: "2026-03-21",
    category: "S",
    region: "USA",
    summary: "SEC considering expanded workforce metrics disclosure including diversity data, turnover rates, and training investments.",
    aiAnalysis: "Moderate direct impact on Renesas (primarily affects US-listed peers). However, signals global trend toward mandatory social metrics. Proactive preparation recommended.",
    impactLevel: "medium",
  },
  {
    id: "n5",
    title: "Infineon Achieves Carbon Neutral Operations Milestone",
    source: "Financial Times",
    date: "2026-03-20",
    category: "E",
    region: "EU",
    summary: "Infineon Technologies announces achievement of carbon neutral operations across all manufacturing sites, ahead of 2030 target.",
    aiAnalysis: "Competitive benchmark alert: Infineon has achieved a key milestone that Renesas targets for 2050. Consider accelerating carbon neutrality roadmap to maintain competitive positioning.",
    impactLevel: "high",
  },
  {
    id: "n6",
    title: "Japan Introduces Mandatory Board Diversity Requirements",
    source: "Japan Times",
    date: "2026-03-19",
    category: "G",
    region: "Japan",
    summary: "TSE Prime Market companies will be required to have at least 30% female board representation by 2030.",
    aiAnalysis: "Direct governance impact for Renesas. Current board composition needs assessment against new targets. Succession planning should incorporate diversity objectives.",
    impactLevel: "medium",
  },
];

export const ACTION_ITEMS: ActionItem[] = [
  {
    id: "a1",
    title: "CSRD Double Materiality Assessment",
    description: "Complete double materiality assessment for EU CSRD compliance. Engage stakeholders and map material ESG topics.",
    category: "E",
    priority: "critical",
    status: "in-progress",
    assignedDepartment: "Sustainability",
    dueDate: "2026-06-30",
    progress: 45,
    relatedRegulation: "EU CSRD",
  },
  {
    id: "a2",
    title: "Scope 3 Emissions Measurement Framework",
    description: "Develop comprehensive Scope 3 emissions measurement methodology across value chain categories.",
    category: "E",
    priority: "high",
    status: "in-progress",
    assignedDepartment: "Sustainability",
    dueDate: "2026-09-30",
    progress: 30,
  },
  {
    id: "a3",
    title: "Supply Chain Due Diligence Program",
    description: "Establish human rights and environmental due diligence program for key suppliers in preparation for EU CSDDD.",
    category: "S",
    priority: "high",
    status: "not-started",
    assignedDepartment: "Procurement",
    dueDate: "2027-03-31",
    progress: 0,
    relatedRegulation: "EU CSDDD",
  },
  {
    id: "a4",
    title: "ISSB Reporting Gap Analysis",
    description: "Assess gaps between current TCFD reporting and ISSB S1/S2 requirements. Develop transition roadmap.",
    category: "G",
    priority: "high",
    status: "in-progress",
    assignedDepartment: "Legal",
    dueDate: "2026-05-31",
    progress: 60,
    relatedRegulation: "ISSB Standards",
  },
  {
    id: "a5",
    title: "Board Diversity Enhancement Plan",
    description: "Develop succession planning framework to achieve 30% female board representation target.",
    category: "G",
    priority: "medium",
    status: "in-progress",
    assignedDepartment: "HR",
    dueDate: "2028-12-31",
    progress: 25,
  },
  {
    id: "a6",
    title: "Carbon Neutrality Roadmap Acceleration",
    description: "Review and potentially accelerate 2050 carbon neutrality target in response to competitor progress (Infineon 2030 achievement).",
    category: "E",
    priority: "medium",
    status: "not-started",
    assignedDepartment: "Sustainability",
    dueDate: "2026-12-31",
    progress: 0,
  },
  {
    id: "a7",
    title: "Water Risk Assessment for Manufacturing Sites",
    description: "Conduct comprehensive water risk assessment across all manufacturing facilities using WRI Aqueduct tool.",
    category: "E",
    priority: "medium",
    status: "not-started",
    assignedDepartment: "Sustainability",
    dueDate: "2026-08-31",
    progress: 0,
  },
  {
    id: "a8",
    title: "ESG Data Management System Enhancement",
    description: "Upgrade ESG data collection and management systems to support multi-framework reporting (CSRD, ISSB, SEC).",
    category: "G",
    priority: "high",
    status: "in-progress",
    assignedDepartment: "Legal",
    dueDate: "2026-07-31",
    progress: 35,
  },
];

export const DEPARTMENTS = [
  "Sustainability",
  "HR",
  "Procurement",
  "Legal",
  "Finance",
  "Operations",
  "R&D",
  "Investor Relations",
];

export function getESGColor(category: "E" | "S" | "G" | "ESG"): string {
  switch (category) {
    case "E": return "#10B981";
    case "S": return "#F59E0B";
    case "G": return "#6366F1";
    case "ESG": return "#003366";
  }
}

export function getImpactColor(level: "critical" | "high" | "medium" | "low"): string {
  switch (level) {
    case "critical": return "#EF4444";
    case "high": return "#F97316";
    case "medium": return "#F59E0B";
    case "low": return "#10B981";
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "completed": return "#10B981";
    case "in-progress": return "#3B82F6";
    case "not-started": return "#94A3B8";
    case "blocked": return "#EF4444";
    case "monitoring": return "#8B5CF6";
    default: return "#64748B";
  }
}
