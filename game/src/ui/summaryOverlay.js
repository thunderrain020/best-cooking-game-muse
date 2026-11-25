// Ember & Tide — ui/summaryOverlay.js
// End-of-run summary, V5: dark-navy & gold victory card. Header: chef
// mascot, gold stars, Grade medallion. Body: stats, 7-bar shift chart
// (S1..S6 + CRITIC), FEATS badge, Perks & Relics icons, DISHES SERVED
// plates. Footer: BEST RUN + COOK AGAIN / NEW SEED / ENDLESS buttons.
// V9: the section bodies live in ui/summarySections.js (this file was
// 6,138 B); the card is taller (y 22, h 676) with generous 16-22px
// gaps between sections.

import { roundRectPath } from '../core/util.js';
import { drawChefMascot, drawStars } from '../render/iconBadges.js';
import { darkPanel } from '../render/palette.js';
import { drawShiftChart, drawFeatsBadge, drawVictoryQuote } from './summaryChart.js';
import { SUMMARY_CARD, SUMMARY_SECTIONS, drawStatsColumns, drawPerksSection, drawDishesSection, drawBestRunPill, drawSummaryButtons, summaryButtons } from './summarySections.js';
import { dim } from './titleOverlay.js';

export { summaryButtons };

export function gradeRun(g) {
  if (g.result && g.result.won) return g.failed === 0 ? 'S' : 'A';
  if (g.served >= 20) return 'B';
  if (g.served >= 12) return 'C';
  return 'D';
}

export function drawSummary(ctx, g) {
  dim(ctx);
  ctx.fillStyle = 'rgba(8,6,12,0.92)';
  ctx.fillRect(0, 660, 1280, 60);
  darkPanel(ctx, SUMMARY_CARD.x, SUMMARY_CARD.y, SUMMARY_CARD.w, SUMMARY_CARD.h);
  const won = g.result && g.result.won;
  drawChefMascot(ctx, 330, 110, 0.85);
  ctx.textAlign = 'center';
  ctx.fillStyle = won ? '#a8d94a' : '#ff8a5c';
  ctx.font = 'bold 28px Georgia, serif';
  ctx.fillText(won ? 'THE CRITIC IS WON OVER!' : 'SERVICE IS OVER', 640, 90);
  ctx.fillStyle = '#d8cdb4';
  ctx.font = 'italic 15px Georgia, serif';
  ctx.fillText(g.result ? g.result.reason : '', 640, 116);
  drawStars(ctx, 640, 144, 3, won ? 3 : 1);
  drawVictoryQuote(ctx, g, won);
  const grade = gradeRun(g);
  const mg = ctx.createRadialGradient(950, 92, 4, 950, 92, 30);
  mg.addColorStop(0, '#ffe9a8');
  mg.addColorStop(1, '#d4a017');
  ctx.fillStyle = mg;
  ctx.beginPath(); ctx.arc(950, 92, 30, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1a120b';
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(950, 92, 30, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#1a120b';
  ctx.font = 'bold 30px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(grade, 950, 92);
  ctx.fillStyle = '#ffd94d';
  ctx.font = 'bold 10px system-ui, sans-serif';
  // V10: GRADE baseline-centred at y 133 — 11px below the gold S border
  // (circle bottom 122) and a clean gap above the FEATS pill (top 148).
  ctx.fillText('GRADE', 950, 133);
  ctx.textBaseline = 'alphabetic';
  // FEATS badge: unlocked feats this run, out of 16.
  drawFeatsBadge(ctx, g);
  // Two-column stats, then the shift chart.
  drawStatsColumns(ctx, g, 196);
  drawShiftChart(ctx, g);
  // Roomy sections: perks, dishes, BEST RUN, buttons.
  drawPerksSection(ctx, g, SUMMARY_SECTIONS.perksHeaderY);
  drawDishesSection(ctx, g, SUMMARY_SECTIONS.dishesHeaderY);
  drawBestRunPill(ctx, g, SUMMARY_SECTIONS.bestRunY);
  drawSummaryButtons(ctx, g, SUMMARY_SECTIONS.buttonsY);
  ctx.fillStyle = '#d8cdb4';
  ctx.font = '12px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('or press Enter to cook again', 640, SUMMARY_SECTIONS.footerY);
}
