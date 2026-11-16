// Draws a verse as a shareable 1080×1350 image (4:5, the shape that fills a
// phone screen in a chat or a feed) entirely in the browser. Loaded on demand
// the first time someone taps "Image", so it costs nothing on page load.

const W = 1080;
const H = 1350;
const FONT = 'InterVariable, Inter, system-ui, -apple-system, "Segoe UI", sans-serif';

function wrap(ctx, text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });
  if (line) lines.push(line);
  return lines;
}

function glow(ctx, x, y, radius, color) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);
}

// A small fixed constellation, echoing the map: a centre, five circles.
function constellation(ctx, cx, cy, scale) {
  const colors = ['#f45d48', '#14b8a6', '#f59e0b', '#516cf0', '#8b5cf6'];
  ctx.save();
  ctx.globalAlpha = 0.5;
  colors.forEach((color, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / colors.length;
    const x = cx + Math.cos(angle) * 78 * scale;
    const y = cy + Math.sin(angle) * 78 * scale;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3 * scale;
    ctx.setLineDash([6 * scale, 8 * scale]);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#1d1815';
    ctx.beginPath();
    ctx.arc(x, y, 17 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 4 * scale;
    ctx.stroke();
  });
  ctx.fillStyle = '#fff8ec';
  ctx.beginPath();
  ctx.arc(cx, cy, 26 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export async function drawVerseCard({ verse, reference }) {
  try {
    await Promise.all([
      document.fonts.load(`800 64px ${FONT}`),
      document.fonts.load(`900 34px ${FONT}`),
    ]);
  } catch {
    // The system font still makes a good card.
  }

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#1d1815';
  ctx.fillRect(0, 0, W, H);
  glow(ctx, 140, 120, 760, 'rgba(243, 207, 116, 0.34)');
  glow(ctx, 1020, 1280, 820, 'rgba(20, 184, 166, 0.3)');
  glow(ctx, 980, 260, 520, 'rgba(244, 93, 72, 0.2)');

  // Fine frame.
  ctx.strokeStyle = 'rgba(255, 248, 236, 0.16)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(44, 44, W - 88, H - 88, 36);
  ctx.stroke();

  constellation(ctx, W - 170, 190, 1);

  // Opening quotation mark.
  ctx.fillStyle = '#f3cf74';
  ctx.font = `900 220px Georgia, "Times New Roman", serif`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('“', 92, 330);

  // Verse: the largest size whose wrapped lines fit the text box.
  const boxX = 104;
  const boxWidth = W - boxX * 2;
  const boxTop = 360;
  const boxBottom = H - 330;
  let size = 76;
  let lines = [];
  let lineHeight = 0;
  for (; size >= 30; size -= 2) {
    ctx.font = `800 ${size}px ${FONT}`;
    lineHeight = Math.round(size * 1.26);
    lines = wrap(ctx, verse, boxWidth);
    if (lines.length * lineHeight <= boxBottom - boxTop) break;
  }
  ctx.fillStyle = '#fff8ec';
  ctx.textBaseline = 'top';
  const blockHeight = lines.length * lineHeight;
  let y = boxTop + Math.max(0, (boxBottom - boxTop - blockHeight) / 2) * 0.35;
  lines.forEach((line) => {
    ctx.fillText(line, boxX, y);
    y += lineHeight;
  });

  // Reference.
  y += 34;
  ctx.fillStyle = '#f3cf74';
  ctx.fillRect(boxX, y, 72, 6);
  y += 34;
  ctx.font = `900 44px ${FONT}`;
  ctx.fillText(reference, boxX, y);
  const refWidth = ctx.measureText(reference).width;
  ctx.font = `700 28px ${FONT}`;
  ctx.fillStyle = 'rgba(255, 248, 236, 0.72)';
  ctx.fillText('NIV', boxX + refWidth + 18, y + 14);

  // Footer.
  ctx.textBaseline = 'alphabetic';
  ctx.font = `900 30px ${FONT}`;
  ctx.fillStyle = '#fff8ec';
  ctx.fillText('OikosMap.com', boxX, H - 118);
  ctx.font = `600 26px ${FONT}`;
  ctx.fillStyle = 'rgba(255, 248, 236, 0.72)';
  ctx.fillText('See the people God has placed around you.', boxX, H - 78);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not draw the card'))), 'image/png');
  });
}

// Shares through the phone's share sheet where it accepts files; otherwise
// downloads the PNG. Returns 'shared', 'downloaded' or 'cancelled'.
export async function shareVerseCard({ verse, reference, url }) {
  const blob = await drawVerseCard({ verse, reference });
  const name = `${reference.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-niv.png`;
  const file = new File([blob], name, { type: 'image/png' });
  // The share sheet is what people expect on a phone; on a desktop, a file.
  const touch = window.matchMedia?.('(pointer: coarse)').matches;
  if (touch && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: reference, text: `${reference} (NIV) ${url}` });
      return 'shared';
    } catch (error) {
      if (error?.name === 'AbortError') return 'cancelled';
      // Fall through to a download.
    }
  }
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 4000);
  return 'downloaded';
}
