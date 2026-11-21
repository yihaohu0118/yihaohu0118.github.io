/* Native canvas lettering. The HTML name remains the accessible, no-JS fallback. */
(() => {
  'use strict';

  const heading = document.querySelector('[data-interactive-name]');
  if (!heading || !window.ResizeObserver) return;
  const root = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const settle = (value, target, seconds) => value + (target - value) * (1 - Math.exp(-seconds * 22));
  const measureContext = document.createElement('canvas').getContext('2d');
  if (!measureContext) return;

  class NameLine {
    constructor(element) {
      this.element = element;
      this.text = element.dataset.name;
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'name-canvas';
      this.canvas.setAttribute('aria-hidden', 'true');
      this.context = this.canvas.getContext('2d');
      this.element.append(this.canvas);
      this.glyphs = [];
      this.frame = {left: 0, top: 0, right: 0, bottom: 0, alpha: 0, index: -1};
      this.active = -1;
    }

    layout() {
      const style = getComputedStyle(this.element);
      this.rect = this.element.getBoundingClientRect();
      this.width = this.rect.width;
      this.height = this.rect.height;
      this.padding = parseFloat(style.getPropertyValue('--name-canvas-padding')) || 28;
      this.size = parseFloat(style.fontSize);
      this.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      this.spacing = parseFloat(style.letterSpacing) || 0;
      this.ink = style.color;
      this.dpr = Math.min(devicePixelRatio || 1, 2);
      this.canvas.width = Math.ceil((this.width + 2 * this.padding) * this.dpr);
      this.canvas.height = Math.ceil((this.height + 2 * this.padding) * this.dpr);
      Object.assign(this.canvas.style, {
        width: `${this.width + 2 * this.padding}px`,
        height: `${this.height + 2 * this.padding}px`,
        left: `${-this.padding}px`,
        top: `${-this.padding}px`
      });
      measureContext.font = this.font;
      measureContext.fontKerning = 'normal';
      const metrics = measureContext.measureText('Hg');
      const ascent = metrics.fontBoundingBoxAscent || this.size * .85;
      const descent = metrics.fontBoundingBoxDescent || this.size * .22;
      this.baseline = (this.height - ascent - descent) / 2 + ascent;
      let prefix = '';
      this.glyphs = Array.from(this.text).map((character, index) => {
        const x = measureContext.measureText(prefix).width + index * this.spacing;
        const ink = measureContext.measureText(character);
        prefix += character;
        return {
          character, x, index,
          left: x - ink.actualBoundingBoxLeft,
          right: x + ink.actualBoundingBoxRight,
          top: this.baseline - ink.actualBoundingBoxAscent,
          bottom: this.baseline + ink.actualBoundingBoxDescent,
          xOffset: 0, yOffset: 0, vx: 0, vy: 0, outline: 0
        };
      });
      this.active = -1;
      this.frame.alpha = 0;
      this.frame.index = -1;
      // Canvas resizing clears its pixels, including while the heading is off screen.
      this.paint(0, performance.now(), null, false);
      this.element.classList.add('name-ready');
    }

    nearest(clientX, clientY) {
      const x = clientX - this.rect.left;
      const y = clientY - this.rect.top;
      let selected = -1;
      let distance = Infinity;
      this.glyphs.forEach((glyph, index) => {
        if (!glyph.character.trim()) return;
        const dx = Math.max(glyph.left + glyph.xOffset - x, 0, x - glyph.right - glyph.xOffset);
        const dy = Math.max(glyph.top + glyph.yOffset - y, 0, y - glyph.bottom - glyph.yOffset);
        const score = Math.hypot(dx, dy);
        if (score < distance) { selected = index; distance = score; }
      });
      return {index: selected, distance};
    }

    paint(seconds, now, dragging, enabled) {
      const ctx = this.context;
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      ctx.clearRect(0, 0, this.canvas.width / this.dpr, this.canvas.height / this.dpr);
      ctx.translate(this.padding, this.padding);
      ctx.font = this.font;
      ctx.fontKerning = 'normal';
      ctx.letterSpacing = '0px';
      ctx.wordSpacing = '0px';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = this.ink;
      ctx.strokeStyle = this.ink;
      let moving = false;

      for (let index = 0; index < this.glyphs.length; index += 1) {
        const glyph = this.glyphs[index];
        const held = dragging?.line === this && dragging.index === index;
        if (enabled && held) {
          const minX = -Math.min(48, glyph.left + this.padding - 9);
          const maxX = Math.min(48, this.width + this.padding - glyph.right - 9);
          glyph.xOffset = settle(glyph.xOffset, clamp(dragging.dx, minX, maxX), seconds);
          glyph.yOffset = settle(glyph.yOffset, clamp(dragging.dy, -22, 22), seconds);
          glyph.vx = 0;
          glyph.vy = 0;
        } else if (enabled) {
          glyph.vx += (-260 * glyph.xOffset - 19 * glyph.vx) * seconds;
          glyph.vy += (-260 * glyph.yOffset - 19 * glyph.vy) * seconds;
          glyph.xOffset += glyph.vx * seconds;
          glyph.yOffset += glyph.vy * seconds;
          if (Math.abs(glyph.xOffset) + Math.abs(glyph.yOffset) + Math.abs(glyph.vx) + Math.abs(glyph.vy) < .06) {
            glyph.xOffset = glyph.yOffset = glyph.vx = glyph.vy = 0;
          }
        } else {
          glyph.xOffset = glyph.yOffset = glyph.vx = glyph.vy = 0;
        }
        const target = enabled && index === this.active ? 1 : 0;
        glyph.outline = enabled ? settle(glyph.outline, target, seconds) : 0;
        if (glyph.outline < .002) glyph.outline = 0;
        moving ||= Math.abs(glyph.outline - target) > .001 || Math.abs(glyph.xOffset) + Math.abs(glyph.yOffset) + (Math.abs(glyph.vx) + Math.abs(glyph.vy)) / 20 > .001;

        const x = glyph.x + glyph.xOffset;
        const y = this.baseline + glyph.yOffset;
        ctx.globalAlpha = 1 - glyph.outline * .94;
        ctx.fillText(glyph.character, x, y);
        if (glyph.outline > .002) {
          ctx.globalAlpha = glyph.outline;
          ctx.lineWidth = .95;
          ctx.lineJoin = 'round';
          ctx.setLineDash([2.5, 2]);
          ctx.strokeText(glyph.character, x, y);
          ctx.setLineDash([]);
        }
      }

      const target = enabled && this.active >= 0 ? 1 : 0;
      const frame = this.frame;
      frame.alpha = enabled ? settle(frame.alpha, target, seconds) : 0;
      if (frame.alpha < .002) frame.alpha = 0;
      const selected = this.glyphs[this.active];
      if (selected) {
        const bounds = {
          left: selected.left + selected.xOffset - 6,
          right: selected.right + selected.xOffset + 6,
          top: selected.top + selected.yOffset - 6,
          bottom: Math.max(selected.bottom, this.baseline) + selected.yOffset + 6
        };
        for (const key of ['left', 'right', 'top', 'bottom']) {
          frame[key] = frame.alpha < .12 ? bounds[key] : settle(frame[key], bounds[key], seconds);
          moving ||= Math.abs(frame[key] - bounds[key]) > .08;
        }
        frame.index = this.active;
      }
      if (frame.alpha > .002 && frame.index >= 0) {
        this.drawSelection(now, dragging?.line === this);
      }
      ctx.globalAlpha = 1;
      return moving || target > 0 || Math.abs(frame.alpha - target) > .001;
    }

    drawSelection(now, held) {
      const ctx = this.context;
      const frame = this.frame;
      const glyph = this.glyphs[frame.index];
      const width = frame.right - frame.left;
      const height = frame.bottom - frame.top;
      ctx.globalAlpha = frame.alpha * .5;
      ctx.lineWidth = .8;
      ctx.strokeRect(frame.left + .5, frame.top + .5, width, height);

      ctx.globalAlpha = frame.alpha * .95;
      for (const [x, y] of [[frame.left, frame.top], [frame.right, frame.top], [frame.left, frame.bottom], [frame.right, frame.bottom]]) {
        ctx.fillRect(Math.round(x) - 2, Math.round(y) - 2, 4, 4);
      }

      ctx.globalAlpha = frame.alpha * .56;
      ctx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.letterSpacing = '0px';
      ctx.textBaseline = 'bottom';
      const label = held
        ? `${Math.round(glyph.xOffset)}, ${Math.round(-glyph.yOffset)}`
        : `${glyph.character}  ${Math.round(glyph.right - glyph.left)} × ${Math.round(glyph.bottom - glyph.top)}`;
      ctx.fillText(label, Math.round(frame.left), Math.round(frame.top) - 7);

      // Small, deterministic pixels around the selected letter, never a page-wide trail.
      for (let index = 0; index < 9; index += 1) {
        const phase = (now / (900 + index * 91) + index * .173) % 1;
        if (phase > .76) continue;
        const side = index % 4;
        const fraction = ((index * .618 + frame.index * .137) % 1);
        const shift = 6 + index % 3 * 4;
        const size = index % 3 === 0 ? 4 : 2;
        const x = side === 0 ? frame.left - shift : side === 1 ? frame.right + shift : frame.left + width * fraction;
        const y = side === 2 ? frame.top - shift : side === 3 ? frame.bottom + shift : frame.top + height * fraction;
        ctx.globalAlpha = frame.alpha * Math.sin(phase / .76 * Math.PI) * .6;
        if (index % 3 === 0) ctx.strokeRect(Math.round(x) + .5, Math.round(y) + .5, size, size);
        else ctx.fillRect(Math.round(x), Math.round(y), size, size);
      }
    }
  }

  const lines = [...heading.querySelectorAll('[data-name]')].map(element => new NameLine(element));
  if (!lines.length || lines.some(line => !line.context)) return;
  let enabled = true;
  let visible = true;
  let frameId = 0;
  let previousTime = 0;
  let dragging = null;
  let tap = null;
  let clearTouch;
  let laidOut = false;

  function wake() {
    if (laidOut && visible && !document.hidden && !frameId) frameId = requestAnimationFrame(render);
  }
  function render(now) {
    frameId = 0;
    const seconds = previousTime ? clamp((now - previousTime) / 1000, .001, .032) : .016;
    previousTime = now;
    let moving = false;
    for (const line of lines) moving = line.paint(seconds, now, dragging, enabled) || moving;
    if (moving) wake();
    else previousTime = 0;
  }
  function clearSelection() {
    lines.forEach(line => { line.active = -1; });
    heading.style.cursor = '';
    wake();
  }
  function modeChanged() {
    enabled = root.dataset.motion !== 'off' && !reducedMotion.matches;
    if (!enabled) {
      dragging = null;
      clearSelection();
    }
    lines.forEach(line => line.layout());
    laidOut = true;
    wake();
  }
  function hit(x, y) {
    let result = null;
    for (const line of lines) {
      line.rect = line.element.getBoundingClientRect();
      const nearest = line.nearest(x, y);
      if (nearest.index >= 0 && nearest.distance < 24 && (!result || nearest.distance < result.distance)) {
        result = {line, ...nearest};
      }
    }
    return result;
  }
  function select(x, y) {
    const selected = hit(x, y);
    for (const line of lines) line.active = selected?.line === line ? selected.index : -1;
    heading.style.cursor = selected ? 'grab' : '';
    wake();
    return selected;
  }

  heading.addEventListener('pointermove', event => {
    if (!enabled || event.pointerType === 'touch') return;
    if (dragging) {
      dragging.dx = event.clientX - dragging.startX;
      dragging.dy = event.clientY - dragging.startY;
      dragging.moved ||= Math.abs(dragging.dx) + Math.abs(dragging.dy) > 5;
      heading.style.cursor = 'grabbing';
      wake();
    } else select(event.clientX, event.clientY);
  });
  heading.addEventListener('pointerleave', () => { if (!dragging) clearSelection(); });
  heading.addEventListener('pointerdown', event => {
    if (!enabled || event.button !== 0) return;
    if (event.pointerType === 'touch') {
      tap = {x: event.clientX, y: event.clientY};
      return;
    }
    const selected = select(event.clientX, event.clientY);
    if (!selected) return;
    event.preventDefault();
    dragging = {...selected, startX: event.clientX, startY: event.clientY, dx: 0, dy: 0, moved: false};
    heading.setPointerCapture(event.pointerId);
    heading.style.cursor = 'grabbing';
  });
  function release(event) {
    if (!dragging) return;
    const released = dragging;
    dragging = null;
    if (!released.moved) {
      released.line.glyphs.forEach((glyph, index) => {
        const distance = Math.abs(index - released.index);
        if (distance < 3) glyph.vy = -Math.min(270, released.line.size * 3) / (distance + 1);
      });
    }
    if (event && heading.hasPointerCapture(event.pointerId)) heading.releasePointerCapture(event.pointerId);
    heading.style.cursor = '';
    wake();
  }
  heading.addEventListener('pointerup', event => {
    if (event.pointerType === 'touch') {
      if (enabled && tap && Math.hypot(event.clientX - tap.x, event.clientY - tap.y) < 8) {
        const selected = select(event.clientX, event.clientY);
        if (selected) selected.line.glyphs[selected.index].vy = -110;
        clearTimeout(clearTouch);
        clearTouch = setTimeout(clearSelection, 650);
      }
      tap = null;
    } else release(event);
  });
  heading.addEventListener('pointercancel', event => { tap = null; release(event); clearSelection(); });
  heading.addEventListener('lostpointercapture', event => release(event));
  window.addEventListener('blur', () => { release(); clearSelection(); });
  window.addEventListener('scroll', () => { if (!dragging) clearSelection(); }, {passive: true});
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frameId); frameId = 0; previousTime = 0; }
    else if (laidOut) modeChanged();
  });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) wake();
    else { cancelAnimationFrame(frameId); frameId = 0; previousTime = 0; }
  }, {rootMargin: '60px'}).observe(heading);
  new MutationObserver(modeChanged).observe(root, {attributes: true, attributeFilter: ['data-theme', 'data-motion']});
  reducedMotion.addEventListener('change', modeChanged);
  const resize = new ResizeObserver(() => { if (laidOut) modeChanged(); });
  lines.forEach(line => resize.observe(line.element));
  window.addEventListener('resize', () => { if (laidOut) modeChanged(); });
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  fontsReady.then(modeChanged);
})();
