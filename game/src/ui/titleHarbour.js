// Ember & Tide — ui/titleHarbour.js
// The title hub's harbour: sunset-to-indigo sky, setting sun, harbour
// skyline with lit windows, the lighthouse with its diagonal golden
// beam sweeping across the sky and water, and the gold ripple band.
// Split out of ui/titleBackdrop.js so both files stay under 5 KB.

const SKYLINE = [46, 78, 58, 92, 40, 70, 84, 52, 66, 96, 44, 74, 60, 88, 50, 68, 80, 56];

export function drawHarbour(ctx, now) {
  const sky = ctx.createLinearGradient(0, 0, 0, 720);
  sky.addColorStop(0, '#4a2350');
  sky.addColorStop(0.35, '#2b1e4e');
  sky.addColorStop(1, '#17102b');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 1280, 720);
  // Warm sunset glow behind the title.
  const glow = ctx.createRadialGradient(640, 70, 10, 640, 70, 420);
  glow.addColorStop(0, 'rgba(255,154,92,0.55)');
  glow.addColorStop(1, 'rgba(255,154,92,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1280, 400);
  // Setting sun, right of the title so it never sits behind the text.
  ctx.fillStyle = '#ffb347';
  ctx.beginPath(); ctx.arc(1120, 66, 30, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,179,71,0.25)';
  ctx.beginPath(); ctx.arc(1120, 66, 44, 0, Math.PI * 2); ctx.fill();
  // Harbour skyline silhouettes with lit windows.
  ctx.fillStyle = '#1a1030';
  let bx = 0;
  for (let i = 0; i < SKYLINE.length; i++) {
    const bw = 72, bh = SKYLINE[i];
    ctx.fillRect(bx, 260 - bh, bw, bh);
    ctx.fillStyle = 'rgba(255,217,77,0.75)';
    for (let wy = 268 - bh; wy < 250; wy += 18) {
      for (let wx = bx + 12; wx < bx + bw - 10; wx += 20) {
        if ((wx + wy) % 3 === 0) ctx.fillRect(wx, wy, 5, 7);
      }
    }
    ctx.fillStyle = '#1a1030';
    bx += bw;
  }
  // Lighthouse on the right, with a clear diagonal golden beam
  // sweeping down-left across the sunset sky and water. The beam
  // sways gently with time; it is drawn before the menu and slot
  // panels, so the dark panels sit over it and stay readable.
  const sway = Math.sin(now * 0.5) * 14;
  ctx.fillStyle = '#241a3a';
  ctx.fillRect(1216, 150, 26, 110);
  ctx.fillStyle = '#ffd94d';
  ctx.fillRect(1216, 142, 26, 10);
  ctx.fillStyle = 'rgba(255,217,77,0.5)';
  ctx.beginPath(); ctx.arc(1229, 147, 12, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,217,77,0.22)';
  ctx.beginPath(); ctx.arc(1229, 147, 22, 0, Math.PI * 2); ctx.fill();
  // Outer beam wedge (soft) + inner core wedge (bright), both fading
  // toward the far end so the light dies into the harbour haze.
  const beam = ctx.createLinearGradient(1218, 150, 660, 380 + sway);
  beam.addColorStop(0, 'rgba(255,217,77,0.30)');
  beam.addColorStop(1, 'rgba(255,217,77,0)');
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(1218, 138); ctx.lineTo(660, 330 + sway); ctx.lineTo(660, 430 + sway); ctx.lineTo(1218, 162);
  ctx.closePath(); ctx.fill();
  const core = ctx.createLinearGradient(1218, 150, 660, 380 + sway);
  core.addColorStop(0, 'rgba(255,236,160,0.34)');
  core.addColorStop(1, 'rgba(255,236,160,0)');
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.moveTo(1218, 144); ctx.lineTo(660, 356 + sway); ctx.lineTo(660, 404 + sway); ctx.lineTo(1218, 156);
  ctx.closePath(); ctx.fill();
  // Harbour water ripples: a gold shimmer band above the feature strip.
  ctx.strokeStyle = 'rgba(255,230,160,0.30)'; ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    const y = 576 + i * 7;
    ctx.beginPath();
    for (let x = 0; x <= 1280; x += 32) {
      const yy = y + Math.sin(x * 0.02 + now * 0.9 + i * 1.7) * 2;
      if (x === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }
}
