import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  esg: router({
    askAI: publicProcedure
      .input(z.object({ question: z.string().min(1).max(2000) }))
      .mutation(async ({ input }) => {
        try {
          const systemPrompt = `You are an expert ESG (Environmental, Social, Governance) analyst specializing in the semiconductor industry. You provide strategic advice for Renesas Electronics Corporation.

Context about Renesas:
- Japanese semiconductor company (TSE: 6723)
- ESG Score: E=68, S=72, G=75, Total=71.7
- Rank #4 among 8 semiconductor peers
- Key peers: STMicro (#1, 78.7), Infineon (#2, 77.3), TI (#2, 75.3), NXP (#3, 73.7)
- Carbon neutrality target: 2050 (Infineon achieved 2030)
- Key regulations: EU CSRD, SEC Climate Rules, ISSB Standards, Japan GX Act
- Active initiatives: CSRD compliance (45%), Scope 3 measurement (30%), ISSB gap analysis (60%)

Provide concise, actionable analysis focused on:
1. Strategic implications for Renesas
2. Competitive positioning vs peers
3. Specific recommended actions
4. Timeline and priority assessment

Keep responses under 300 words. Be specific to the semiconductor industry and Renesas context.`;

          const result = await invokeLLM({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: input.question },
            ],
          });

          const answer = typeof result.choices[0]?.message?.content === "string"
            ? result.choices[0].message.content
            : Array.isArray(result.choices[0]?.message?.content)
              ? result.choices[0].message.content
                  .filter((c: any) => c.type === "text")
                  .map((c: any) => c.text)
                  .join("")
              : "Unable to generate analysis at this time.";

          return { answer };
        } catch (error: any) {
          console.error("LLM invocation failed:", error?.message);
          return {
            answer: "AI analysis is temporarily unavailable. The system will use contextual analysis based on available ESG data. Please try again in a moment.",
          };
        }
      }),

    generateReport: publicProcedure
      .input(z.object({
        focusArea: z.enum(["overview", "environmental", "social", "governance", "regulatory", "competitive"]),
      }))
      .mutation(async ({ input }) => {
        try {
          const prompts: Record<string, string> = {
            overview: "Generate a comprehensive executive ESG summary for Renesas Electronics, covering all E, S, G dimensions, competitive positioning, and key action items.",
            environmental: "Generate an environmental performance report for Renesas Electronics, focusing on carbon emissions, energy management, water usage, and comparison with semiconductor peers.",
            social: "Generate a social performance report for Renesas Electronics, covering workforce diversity, human rights, supply chain labor practices, and community engagement.",
            governance: "Generate a governance assessment for Renesas Electronics, covering board composition, ESG oversight, transparency, and regulatory compliance readiness.",
            regulatory: "Generate a regulatory landscape analysis for Renesas Electronics, covering EU CSRD, SEC Climate Rules, ISSB Standards, Japan GX Act, and compliance readiness.",
            competitive: "Generate a competitive ESG benchmark analysis comparing Renesas Electronics against TI, STMicro, NXP, onsemi, Microchip, Infineon, and ADI.",
          };

          const result = await invokeLLM({
            messages: [
              {
                role: "system",
                content: `You are a senior ESG consultant preparing an executive report for Renesas Electronics' board of directors. Write in a professional, concise style suitable for C-suite executives. Use clear headings and bullet points. Include specific data points and actionable recommendations.`,
              },
              { role: "user", content: prompts[input.focusArea] },
            ],
          });

          const report = typeof result.choices[0]?.message?.content === "string"
            ? result.choices[0].message.content
            : "Report generation failed. Please try again.";

          return { report };
        } catch (error: any) {
          console.error("Report generation failed:", error?.message);
          return {
            report: "Report generation is temporarily unavailable. Please try again later.",
          };
        }
      }),

    analyzeNews: publicProcedure
      .input(z.object({
        newsTitle: z.string(),
        newsSummary: z.string(),
      }))
      .mutation(async ({ input }) => {
        try {
          const result = await invokeLLM({
            messages: [
              {
                role: "system",
                content: `You are an ESG analyst for Renesas Electronics. Analyze the following news item and provide:
1. Impact assessment (high/medium/low) on Renesas
2. Specific implications for Renesas operations
3. Recommended actions
4. Timeline for response
Keep the analysis concise (under 200 words).`,
              },
              {
                role: "user",
                content: `News: ${input.newsTitle}\n\nSummary: ${input.newsSummary}`,
              },
            ],
          });

          const analysis = typeof result.choices[0]?.message?.content === "string"
            ? result.choices[0].message.content
            : "Analysis unavailable.";

          return { analysis };
        } catch (error: any) {
          console.error("News analysis failed:", error?.message);
          return { analysis: "News analysis is temporarily unavailable." };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
