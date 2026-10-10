import { jsPDF } from "jspdf";
import type { ReportInput, ScoringResult } from "../types/report";
import { getQuestion } from "../data/questions";
import { formatLongDate } from "./utils";

const SLATE: [number, number, number] = [15, 23, 42];
const GRAY: [number, number, number] = [100, 116, 139];
const LIGHT: [number, number, number] = [241, 245, 249];
const EMERALD: [number, number, number] = [5, 150, 105];
const AMBER: [number, number, number] = [217, 119, 6];
const RED: [number, number, number] = [220, 38, 38];
const INDIGO: [number, number, number] = [79, 70, 229];

const REFLECTION_IDS = ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8"];

export function generateReportPdf(input: ReportInput, result: ScoringResult): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = 16;
  const W = pageW - M * 2;
  let y = 0;

  const footer = (pageNum: number) => {
    doc.setFont("courier", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...GRAY);
    doc.text("RELATIONSHIP HR™ — generated locally. No data ever left your browser.", M, pageH - 8);
    doc.text(`PAGE ${pageNum}`, pageW - M, pageH - 8, { align: "right" });
  };

  let pageNum = 1;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - 18) {
      footer(pageNum);
      doc.addPage();
      pageNum += 1;
      y = M;
    }
  };

  const sectionHeader = (title: string) => {
    ensureSpace(14);
    doc.setFillColor(...SLATE);
    doc.rect(M, y, W, 8, "F");
    doc.setFont("courier", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(title, M + 3, y + 5.5);
    y += 12;
  };

  const bullets = (items: string[], color: [number, number, number]) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    items.forEach((item) => {
      const lines = doc.splitTextToSize(item, W - 8);
      ensureSpace(lines.length * 4.4 + 2);
      doc.setTextColor(...color);
      doc.text("■", M + 1, y + 0.5);
      doc.setTextColor(...SLATE);
      doc.text(lines, M + 6, y);
      y += lines.length * 4.4 + 1.6;
    });
    y += 2;
  };

  /* ------------------------------ Header band ------------------------------ */
  doc.setFillColor(...SLATE);
  doc.rect(0, 0, pageW, 34, "F");
  doc.setFont("courier", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("RELATIONSHIP HR™", M, 13);
  doc.setFont("courier", "normal");
  doc.setFontSize(10);
  doc.setTextColor(165, 180, 252);
  doc.text("MUTUAL COMPATIBILITY REPORT", M, 20);
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(
    `SESSION ${input.code}   ·   ${formatLongDate(input.generatedAt)}   ·   ${input.nameA}  ×  ${input.nameB}`,
    M,
    27
  );
  y = 42;

  /* ------------------------------ Score box ------------------------------ */
  doc.setDrawColor(...SLATE);
  doc.setLineWidth(0.8);
  doc.setFillColor(...LIGHT);
  doc.rect(M, y, W, 30, "FD");
  const scoreColor =
    result.overallScore >= 70 ? EMERALD : result.overallScore >= 50 ? AMBER : RED;
  doc.setFont("courier", "bold");
  doc.setFontSize(26);
  doc.setTextColor(...scoreColor);
  doc.text(`${result.overallScore}%`, M + 6, y + 19);
  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  doc.text("OVERALL MATCH", M + 6, y + 25);
  doc.setFontSize(9);
  doc.setTextColor(...SLATE);
  const statusLines = doc.splitTextToSize(result.statusLabel, W - 58);
  doc.text(statusLines, M + 50, y + 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...GRAY);
  doc.text("This report evaluates the match, never the individuals.", M + 50, y + 24);
  y += 36;

  if (result.hasValuesConflict) {
    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(...AMBER);
    doc.setLineWidth(0.6);
    const h = 9 + result.dealbreakerFlags.length * 4.5;
    doc.rect(M, y, W, h, "FD");
    doc.setFont("courier", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...AMBER);
    doc.text("! VALUES CONFLICT DETECTED — IMPORTANT CONVERSATION NEEDED", M + 3, y + 5.5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...SLATE);
    result.dealbreakerFlags.forEach((f, i) => {
      doc.text(`- ${f}`, M + 4, y + 10 + i * 4.5);
    });
    y += h + 6;
  }

  /* ------------------------------ Category table ------------------------------ */
  sectionHeader("01 · CATEGORY ALIGNMENT");
  result.categoryRows.forEach((row) => {
    ensureSpace(13);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...SLATE);
    doc.text(row.label, M + 1, y + 3.4);
    const c = row.alignment >= 70 ? EMERALD : row.alignment >= 50 ? AMBER : RED;
    // bar
    const barX = M + 78;
    const barW = 66;
    doc.setFillColor(...LIGHT);
    doc.setDrawColor(...GRAY);
    doc.setLineWidth(0.2);
    doc.rect(barX, y, barW, 4, "FD");
    doc.setFillColor(...c);
    doc.rect(barX, y, (barW * row.alignment) / 100, 4, "F");
    doc.setFont("courier", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...c);
    doc.text(`${row.alignment}%`, barX + barW + 3, y + 3.6);
    doc.setFont("courier", "normal");
    doc.setFontSize(6.6);
    doc.setTextColor(...GRAY);
    doc.text(`A: ${row.personASummary}`, M + 1, y + 8.4);
    doc.text(`B: ${row.personBSummary}`, M + W / 2 + 2, y + 8.4);
    y += 11.5;
  });
  y += 4;

  /* ------------------------------ Synergy ------------------------------ */
  sectionHeader("02 · SYNERGY HIGHLIGHTS");
  bullets(result.synergyHighlights, EMERALD);

  /* ------------------------------ Friction ------------------------------ */
  if (result.frictionPoints.length) {
    sectionHeader("03 · AREAS TO EXPLORE TOGETHER");
    bullets(result.frictionPoints, AMBER);
  }

  /* ------------------------------ Starters ------------------------------ */
  sectionHeader("04 · SUGGESTED CONVERSATION STARTERS");
  bullets(result.conversationStarters, INDIGO);

  /* ------------------------------ Reflections ------------------------------ */
  sectionHeader("05 · FINAL REFLECTIONS — SIDE BY SIDE");
  const colW = (W - 8) / 2;
  REFLECTION_IDS.forEach((id) => {
    const q = getQuestion(id);
    const aText = String(input.answersA[id] ?? "").trim() || "—";
    const bText = String(input.answersB[id] ?? "").trim() || "—";
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    const qLines = doc.splitTextToSize(`Q: ${q?.label ?? id}`, W);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const aLines = doc.splitTextToSize(aText, colW - 3);
    const bLines = doc.splitTextToSize(bText, colW - 3);
    const blockH = qLines.length * 4 + Math.max(aLines.length, bLines.length) * 3.9 + 8;
    ensureSpace(blockH);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...SLATE);
    doc.text(qLines, M, y);
    y += qLines.length * 4 + 1;
    doc.setFont("courier", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...INDIGO);
    doc.text(input.nameA.toUpperCase(), M, y);
    doc.text(input.nameB.toUpperCase(), M + colW + 8, y);
    y += 3.5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...SLATE);
    doc.text(aLines, M, y);
    doc.text(bLines, M + colW + 8, y);
    y += Math.max(aLines.length, bLines.length) * 3.9 + 1;
    doc.setDrawColor(...GRAY);
    doc.setLineWidth(0.2);
    doc.setLineDashPattern([1, 1.6], 0);
    doc.line(M, y, M + W, y);
    doc.setLineDashPattern([], 0);
    y += 4;
  });

  footer(pageNum);
  doc.save(`relationship-hr-report-${input.code}.pdf`);
}
