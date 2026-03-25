import { describe, it, expect } from "vitest";
import {
  COMPANIES,
  REGULATIONS,
  NEWS_ITEMS,
  ACTION_ITEMS,
  DEPARTMENTS,
  getESGColor,
  getImpactColor,
  getStatusColor,
} from "../esg-data";

describe("ESG Data Module", () => {
  describe("COMPANIES", () => {
    it("should contain 8 companies", () => {
      expect(COMPANIES).toHaveLength(8);
    });

    it("should include Renesas Electronics", () => {
      const renesas = COMPANIES.find((c) => c.id === "renesas");
      expect(renesas).toBeDefined();
      expect(renesas!.name).toBe("Renesas Electronics");
      expect(renesas!.ticker).toBe("6723.T");
    });

    it("should include all 7 benchmark competitors", () => {
      const expectedIds = ["ti", "stmicro", "nxp", "onsemi", "microchip", "infineon", "adi"];
      expectedIds.forEach((id) => {
        expect(COMPANIES.find((c) => c.id === id)).toBeDefined();
      });
    });

    it("should have valid ESG scores (0-100) for all companies", () => {
      COMPANIES.forEach((company) => {
        expect(company.scores.environmental).toBeGreaterThanOrEqual(0);
        expect(company.scores.environmental).toBeLessThanOrEqual(100);
        expect(company.scores.social).toBeGreaterThanOrEqual(0);
        expect(company.scores.social).toBeLessThanOrEqual(100);
        expect(company.scores.governance).toBeGreaterThanOrEqual(0);
        expect(company.scores.governance).toBeLessThanOrEqual(100);
        expect(company.scores.total).toBeGreaterThanOrEqual(0);
        expect(company.scores.total).toBeLessThanOrEqual(100);
      });
    });

    it("should have valid rank values (1-8)", () => {
      COMPANIES.forEach((company) => {
        expect(company.rank).toBeGreaterThanOrEqual(1);
        expect(company.rank).toBeLessThanOrEqual(8);
      });
    });

    it("should have valid trend values", () => {
      COMPANIES.forEach((company) => {
        expect(["up", "down", "stable"]).toContain(company.trend);
      });
    });

    it("STMicro should be ranked #1", () => {
      const stmicro = COMPANIES.find((c) => c.id === "stmicro");
      expect(stmicro!.rank).toBe(1);
      expect(stmicro!.scores.total).toBe(78.7);
    });
  });

  describe("REGULATIONS", () => {
    it("should contain at least 5 regulations", () => {
      expect(REGULATIONS.length).toBeGreaterThanOrEqual(5);
    });

    it("should have valid category values", () => {
      REGULATIONS.forEach((reg) => {
        expect(["E", "S", "G", "ESG"]).toContain(reg.category);
      });
    });

    it("should have valid impact levels", () => {
      REGULATIONS.forEach((reg) => {
        expect(["critical", "high", "medium", "low"]).toContain(reg.impactLevel);
      });
    });

    it("should have valid response statuses", () => {
      REGULATIONS.forEach((reg) => {
        expect(["completed", "in-progress", "not-started", "monitoring"]).toContain(reg.responseStatus);
      });
    });

    it("should include EU CSRD as a critical regulation", () => {
      const csrd = REGULATIONS.find((r) => r.id === "csrd");
      expect(csrd).toBeDefined();
      expect(csrd!.impactLevel).toBe("critical");
      expect(csrd!.category).toBe("ESG");
    });
  });

  describe("NEWS_ITEMS", () => {
    it("should contain at least 3 news items", () => {
      expect(NEWS_ITEMS.length).toBeGreaterThanOrEqual(3);
    });

    it("should have valid category and impact levels", () => {
      NEWS_ITEMS.forEach((news) => {
        expect(["E", "S", "G", "ESG"]).toContain(news.category);
        expect(["high", "medium", "low"]).toContain(news.impactLevel);
      });
    });

    it("should have AI analysis for high-impact items", () => {
      const highImpact = NEWS_ITEMS.filter((n) => n.impactLevel === "high");
      highImpact.forEach((news) => {
        expect(news.aiAnalysis).toBeDefined();
        expect(news.aiAnalysis!.length).toBeGreaterThan(0);
      });
    });
  });

  describe("ACTION_ITEMS", () => {
    it("should contain at least 5 action items", () => {
      expect(ACTION_ITEMS.length).toBeGreaterThanOrEqual(5);
    });

    it("should have valid priority and status values", () => {
      ACTION_ITEMS.forEach((action) => {
        expect(["critical", "high", "medium", "low"]).toContain(action.priority);
        expect(["completed", "in-progress", "not-started", "blocked"]).toContain(action.status);
      });
    });

    it("should have progress values between 0 and 100", () => {
      ACTION_ITEMS.forEach((action) => {
        expect(action.progress).toBeGreaterThanOrEqual(0);
        expect(action.progress).toBeLessThanOrEqual(100);
      });
    });

    it("should have assigned departments from DEPARTMENTS list", () => {
      ACTION_ITEMS.forEach((action) => {
        expect(DEPARTMENTS).toContain(action.assignedDepartment);
      });
    });
  });

  describe("Helper Functions", () => {
    it("getESGColor should return correct colors", () => {
      expect(getESGColor("E")).toBe("#10B981");
      expect(getESGColor("S")).toBe("#F59E0B");
      expect(getESGColor("G")).toBe("#6366F1");
      expect(getESGColor("ESG")).toBe("#003366");
    });

    it("getImpactColor should return correct colors", () => {
      expect(getImpactColor("critical")).toBe("#EF4444");
      expect(getImpactColor("high")).toBe("#F97316");
      expect(getImpactColor("medium")).toBe("#F59E0B");
      expect(getImpactColor("low")).toBe("#10B981");
    });

    it("getStatusColor should return correct colors", () => {
      expect(getStatusColor("completed")).toBe("#10B981");
      expect(getStatusColor("in-progress")).toBe("#3B82F6");
      expect(getStatusColor("not-started")).toBe("#94A3B8");
      expect(getStatusColor("blocked")).toBe("#EF4444");
      expect(getStatusColor("monitoring")).toBe("#8B5CF6");
      expect(getStatusColor("unknown")).toBe("#64748B");
    });
  });
});
