// ===== ESG Data Module =====
// Shared data, types, and utility functions for the Renesas ESG Monitor

export const COMPANIES = [
  { id: "renesas", name: "Renesas Electronics", ticker: "6723.T", country: "Japan", scores: { total: 71.7, environmental: 68, social: 72, governance: 75 }, rank: 4, trend: "improving", lastUpdated: "2026-03-20" },
  { id: "stmicro", name: "STMicroelectronics", ticker: "STM", country: "Switzerland", scores: { total: 78.7, environmental: 82, social: 76, governance: 78 }, rank: 1, trend: "stable", lastUpdated: "2026-03-18" },
  { id: "infineon", name: "Infineon Technologies", ticker: "IFX.DE", country: "Germany", scores: { total: 77.3, environmental: 80, social: 74, governance: 78 }, rank: 2, trend: "improving", lastUpdated: "2026-03-15" },
  { id: "ti", name: "Texas Instruments", ticker: "TXN", country: "USA", scores: { total: 75.3, environmental: 74, social: 75, governance: 77 }, rank: 3, trend: "stable", lastUpdated: "2026-03-12" },
  { id: "nxp", name: "NXP Semiconductors", ticker: "NXPI", country: "Netherlands", scores: { total: 73.7, environmental: 72, social: 74, governance: 75 }, rank: 5, trend: "improving", lastUpdated: "2026-03-10" },
  { id: "onsemi", name: "ON Semiconductor", ticker: "ON", country: "USA", scores: { total: 69.3, environmental: 66, social: 70, governance: 72 }, rank: 6, trend: "improving", lastUpdated: "2026-03-08" },
  { id: "microchip", name: "Microchip Technology", ticker: "MCHP", country: "USA", scores: { total: 65.0, environmental: 62, social: 66, governance: 67 }, rank: 7, trend: "stable", lastUpdated: "2026-03-05" },
  { id: "adi", name: "Analog Devices", ticker: "ADI", country: "USA", scores: { total: 72.3, environmental: 70, social: 73, governance: 74 }, rank: 8, trend: "stable", lastUpdated: "2026-03-01" },
];

export const REGULATIONS = [
  { id: "csrd", name: "EU CSRD", fullName: "Corporate Sustainability Reporting Directive", jurisdiction: "EU", effectiveDate: "2026-06-30", status: "in-progress", compliance: 45, impactLevel: "critical", category: "G", description: "Mandatory sustainability reporting for large companies operating in the EU. Requires double materiality assessment and ESRS-aligned disclosures.", departments: ["Legal", "Finance", "Sustainability"] },
  { id: "sec-climate", name: "SEC Climate Rules", fullName: "SEC Climate-Related Disclosures", jurisdiction: "USA", effectiveDate: "2026-12-31", status: "planning", compliance: 20, impactLevel: "high", category: "E", description: "SEC rules requiring climate-related disclosures including GHG emissions, climate risks, and transition plans.", departments: ["Legal", "Finance", "IR"] },
  { id: "issb", name: "ISSB Standards", fullName: "IFRS S1 & S2 Sustainability Disclosure Standards", jurisdiction: "Global", effectiveDate: "2026-01-01", status: "in-progress", compliance: 60, impactLevel: "high", category: "ESG", description: "Global baseline sustainability disclosure standards covering general requirements and climate-related disclosures.", departments: ["Finance", "Sustainability"] },
  { id: "csddd", name: "EU CSDDD", fullName: "Corporate Sustainability Due Diligence Directive", jurisdiction: "EU", effectiveDate: "2027-07-01", status: "monitoring", compliance: 15, impactLevel: "high", category: "S", description: "Requires companies to identify and address adverse human rights and environmental impacts in their value chains.", departments: ["Procurement", "Legal", "HR"] },
  { id: "japan-gx", name: "Japan GX Act", fullName: "Green Transformation Promotion Act", jurisdiction: "Japan", effectiveDate: "2026-04-01", status: "in-progress", compliance: 55, impactLevel: "critical", category: "E", description: "Japan's framework for carbon pricing, emissions trading, and green transformation investment.", departments: ["Operations", "Finance", "Sustainability"] },
  { id: "cbam", name: "EU CBAM", fullName: "Carbon Border Adjustment Mechanism", jurisdiction: "EU", effectiveDate: "2026-01-01", status: "in-progress", compliance: 35, impactLevel: "medium", category: "E", description: "Carbon tariff on imports to prevent carbon leakage. Affects semiconductor supply chain costs.", departments: ["Procurement", "Finance", "Trade"] },
  { id: "conflict-minerals", name: "Conflict Minerals", fullName: "EU Conflict Minerals Regulation", jurisdiction: "EU", effectiveDate: "2025-01-01", status: "compliant", compliance: 90, impactLevel: "medium", category: "S", description: "Due diligence requirements for importers of tin, tantalum, tungsten, and gold.", departments: ["Procurement", "Legal"] },
  { id: "tnfd", name: "TNFD Framework", fullName: "Taskforce on Nature-related Financial Disclosures", jurisdiction: "Global", effectiveDate: "2027-01-01", status: "monitoring", compliance: 10, impactLevel: "medium", category: "E", description: "Framework for organizations to report on nature-related dependencies, impacts, risks, and opportunities.", departments: ["Sustainability", "Operations"] },
];

export const NEWS_ITEMS = [
  { id: "n1", title: "EU Finalizes CSRD Implementation Standards for Semiconductor Sector", source: "Reuters", date: "2026-03-28", category: "G", region: "EU", summary: "The European Commission has published final implementation guidance for CSRD reporting specific to the semiconductor industry, including sector-specific metrics for energy consumption, water usage, and supply chain emissions.", aiAnalysis: "Critical for Renesas: This directly impacts EU operations and reporting requirements. The sector-specific metrics will require enhanced data collection from EU-based facilities. Recommend accelerating CSRD compliance program and engaging external auditors for readiness assessment.", impactLevel: "high" },
  { id: "n2", title: "Semiconductor Climate Consortium Releases 2026 Roadmap", source: "Bloomberg", date: "2026-03-25", category: "E", region: "Global", summary: "The SCC published its updated decarbonization roadmap, setting industry-wide targets for Scope 1, 2, and 3 emissions reduction. Key milestones include 50% reduction in Scope 1&2 by 2030.", aiAnalysis: "Renesas should align its carbon neutrality roadmap with SCC targets. Current 2050 target may need acceleration given peer commitments. Infineon has already achieved carbon neutral operations.", impactLevel: "high" },
  { id: "n3", title: "Japan Strengthens Corporate Governance Code for ESG Oversight", source: "Nikkei", date: "2026-03-22", category: "G", region: "Japan", summary: "Tokyo Stock Exchange updates governance code requiring enhanced board-level ESG oversight, including mandatory sustainability committee and climate competency requirements for directors.", aiAnalysis: "As a TSE-listed company, Renesas must comply with updated governance requirements. Board composition review may be needed to ensure adequate climate/ESG expertise.", impactLevel: "high" },
  { id: "n4", title: "Global Water Stress Index Highlights Risks for Chip Fabrication", source: "Financial Times", date: "2026-03-20", category: "E", region: "Global", summary: "New research identifies increasing water stress in key semiconductor manufacturing regions, with projections showing 30% of global fab capacity in high-stress areas by 2030.", impactLevel: "medium" },
  { id: "n5", title: "SEC Proposes Enhanced Scope 3 Reporting Requirements", source: "Wall Street Journal", date: "2026-03-18", category: "E", region: "USA", summary: "SEC announces proposed amendments to climate disclosure rules, expanding Scope 3 emissions reporting requirements for large accelerated filers.", impactLevel: "medium" },
  { id: "n6", title: "ASEAN Harmonizes ESG Reporting Standards", source: "Straits Times", date: "2026-03-15", category: "G", region: "Asia", summary: "ASEAN member states agree on harmonized ESG reporting framework, creating consistent disclosure requirements across Southeast Asian markets.", impactLevel: "medium" },
  { id: "n7", title: "EU Supply Chain Due Diligence Directive Enters Implementation Phase", source: "Euronews", date: "2026-03-12", category: "S", region: "EU", summary: "CSDDD implementation begins with large companies required to map value chains and identify human rights and environmental risks.", impactLevel: "high" },
  { id: "n8", title: "Semiconductor Industry Workforce Diversity Report Shows Mixed Progress", source: "IEEE Spectrum", date: "2026-03-10", category: "S", region: "Global", summary: "Annual industry report reveals slow progress on gender diversity in semiconductor engineering roles, with women representing only 15% of technical positions globally.", impactLevel: "low" },
  { id: "n9", title: "Carbon Credit Market Reform Impacts Electronics Manufacturers", source: "Carbon Brief", date: "2026-03-08", category: "E", region: "Global", summary: "New international standards for carbon credits raise the bar for quality and additionality, affecting offset strategies used by electronics manufacturers.", impactLevel: "medium" },
  { id: "n10", title: "AI-Driven ESG Analytics Platforms Gain Traction Among Investors", source: "TechCrunch", date: "2026-03-05", category: "ESG", region: "Global", summary: "Institutional investors increasingly adopt AI-powered ESG analytics tools, raising the bar for corporate ESG data quality and real-time reporting capabilities.", impactLevel: "low" },
];

export const ACTION_ITEMS = [
  { id: "a1", title: "Complete CSRD Double Materiality Assessment", category: "G", priority: "critical", status: "in-progress", progress: 45, deadline: "2026-05-15", assignedDepartment: "Sustainability", description: "Conduct comprehensive double materiality assessment covering all ESRS topics. Engage stakeholders and document impact/financial materiality for each topic.", template: "materiality-assessment" },
  { id: "a2", title: "Implement Scope 3 Emissions Measurement Framework", category: "E", priority: "critical", status: "in-progress", progress: 30, deadline: "2026-06-30", assignedDepartment: "Operations", description: "Establish methodology and data collection processes for measuring Scope 3 emissions across all 15 categories. Priority focus on Category 1 (purchased goods) and Category 11 (use of sold products).", template: "emissions-tracking" },
  { id: "a3", title: "ISSB Gap Analysis and Remediation Plan", category: "ESG", priority: "high", status: "in-progress", progress: 60, deadline: "2026-04-30", assignedDepartment: "Finance", description: "Complete gap analysis between current disclosures and IFRS S1/S2 requirements. Develop remediation roadmap with clear milestones.", template: "gap-analysis" },
  { id: "a4", title: "Supply Chain ESG Risk Assessment", category: "S", priority: "high", status: "planning", progress: 15, deadline: "2026-07-31", assignedDepartment: "Procurement", description: "Map tier 1 and tier 2 suppliers for ESG risk factors. Implement supplier ESG scoring and engagement program.", template: "risk-assessment" },
  { id: "a5", title: "Board ESG Competency Enhancement", category: "G", priority: "high", status: "planning", progress: 20, deadline: "2026-06-30", assignedDepartment: "Legal", description: "Review board composition for ESG/climate expertise. Develop training program and consider advisory appointments.", template: "governance-review" },
  { id: "a6", title: "Carbon Neutrality Roadmap Acceleration", category: "E", priority: "medium", status: "planning", progress: 10, deadline: "2026-09-30", assignedDepartment: "Operations", description: "Evaluate feasibility of accelerating carbon neutrality target from 2050 to 2040. Benchmark against peer commitments (Infineon: 2030).", template: "strategy-planning" },
  { id: "a7", title: "Water Stewardship Program Development", category: "E", priority: "medium", status: "not-started", progress: 0, deadline: "2026-12-31", assignedDepartment: "Operations", description: "Develop comprehensive water stewardship program for manufacturing facilities in water-stressed regions.", template: "environmental-program" },
  { id: "a8", title: "Diversity & Inclusion Strategy Update", category: "S", priority: "medium", status: "in-progress", progress: 40, deadline: "2026-08-31", assignedDepartment: "HR", description: "Update D&I strategy with specific targets for gender diversity in technical roles. Align with industry benchmarks and TSE governance code requirements.", template: "hr-strategy" },
];

export const TEMPLATES = [
  { id: "t1", name: "Materiality Assessment", category: "G", description: "Double materiality assessment template aligned with ESRS requirements", steps: ["Identify stakeholders", "Map impact topics", "Assess financial materiality", "Assess impact materiality", "Prioritize and document"] },
  { id: "t2", name: "Emissions Tracking", category: "E", description: "GHG emissions measurement and tracking framework", steps: ["Define organizational boundary", "Identify emission sources", "Collect activity data", "Apply emission factors", "Calculate and verify"] },
  { id: "t3", name: "Gap Analysis", category: "ESG", description: "Regulatory gap analysis and remediation planning template", steps: ["Map current disclosures", "Identify requirements", "Assess gaps", "Prioritize remediation", "Develop timeline"] },
  { id: "t4", name: "Risk Assessment", category: "S", description: "Supply chain ESG risk assessment framework", steps: ["Map supply chain tiers", "Identify risk factors", "Score suppliers", "Develop engagement plan", "Monitor and report"] },
  { id: "t5", name: "Governance Review", category: "G", description: "Board ESG competency and governance review checklist", steps: ["Assess current competencies", "Identify gaps", "Develop training plan", "Review committee structure", "Document improvements"] },
  { id: "t6", name: "Strategy Planning", category: "E", description: "Carbon neutrality and climate strategy planning template", steps: ["Baseline assessment", "Set science-based targets", "Identify reduction levers", "Develop implementation plan", "Establish monitoring"] },
];

export function getESGColor(category) {
  const colors = { E: "#10B981", S: "#6366F1", G: "#F59E0B", ESG: "#003366" };
  return colors[category] || "#64748B";
}

export function getImpactColor(level) {
  const colors = { critical: "#EF4444", high: "#F97316", medium: "#F59E0B", low: "#10B981" };
  return colors[level] || "#64748B";
}

export function getStatusColor(status) {
  const colors = { "compliant": "#10B981", "in-progress": "#00A0E9", "planning": "#F59E0B", "monitoring": "#6366F1", "not-started": "#94A3B8" };
  return colors[status] || "#64748B";
}

export function getTrendIcon(trend) {
  if (trend === "improving") return "↑";
  if (trend === "declining") return "↓";
  return "→";
}

export function getTrendColor(trend) {
  if (trend === "improving") return "#10B981";
  if (trend === "declining") return "#EF4444";
  return "#F59E0B";
}
