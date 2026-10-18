import { tarot } from '../i18n/tarot';
import {
  shuffleTarot,
  selectTarotCard,
  recommendTarotGame,
  tarotCardHeading,
  tarotBackImage,
  tarotImage,
  type TarotCard,
} from './tarot';

type Game = { keyword: string; name: string; href: string; blurb: string };

export function initTarot(root: HTMLElement) {
  if (root.dataset.tarotReady) return;
  root.dataset.tarotReady = 'true';
  const locale = root.dataset.locale === 'en' ? 'en' : 'es';
  const t = tarot[locale];
  const games: Game[] = JSON.parse(root.dataset.tarotGames ?? '[]');
  const find = <T extends HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
  const dialog = find<HTMLDialogElement>('.tarot-dialog');
  const open = find<HTMLButtonElement>('[data-tarot-open]');
  const close = find<HTMLButtonElement>('[data-tarot-close]');
  const again = find<HTMLButtonElement>('[data-tarot-again]');
  const fan = find<HTMLDivElement>('[data-tarot-fan]');
  const scroll = find<HTMLDivElement>('[data-tarot-scroll]');
  const scrollHint = root.querySelector<HTMLElement>('[data-tarot-scroll-hint]');
  const scrollRegion = find<HTMLElement>('[data-tarot-scroll-region]');
  const scrollMask = find<HTMLElement>('[data-tarot-scroll-mask]');
  const fanMask = find<HTMLElement>('[data-tarot-fan-mask]');
  const fanStage = find<HTMLElement>('[data-tarot-fan-stage]');
  const spread = find<HTMLElement>('[data-tarot-spread]');
  const deckArea = find<HTMLDivElement>('[data-tarot-deck-area]');
  const result = find<HTMLDivElement>('[data-tarot-result]');
  const announcer = find<HTMLParagraphElement>('[data-tarot-announcer]');
  const slots = [...root.querySelectorAll<HTMLElement>('[data-tarot-slot]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let selected: TarotCard[] = [];
  let busy = false;
  let session = 0;
  let previousOverflow = '';
  const animations = new Set<Animation>();
  /** Mismo corte que tablet/phone del sitio (980px). */
  const narrowViewport = () => window.matchMedia('(max-width: 980px)').matches;

  function syncCompactFanUi() {
    if (!dialog.open) {
      dialog.classList.remove('tarot-dialog--compact-fan');
      return;
    }
    const compact =
      narrowViewport() || fanStage.classList.contains('is-scrollable');
    dialog.classList.toggle('tarot-dialog--compact-fan', compact);
    if (!compact) fanStage.classList.remove('is-scrolled');
  }
  const fanDropScale = () => (narrowViewport() ? 0.32 : 0.52);
  /** Desktop: 2.7°. Móvil pivot: ~7° entre cartas en el mismo arco. */
  const fanAngleStep = () => (pivotFanEnabled() ? 7 : 2.7);
  let touchPanStart: { x: number; y: number } | null = null;
  /** Posición al centrar el abanico (solo desktop con scroll horizontal). */
  let fanScrollAnchor = 0;
  let fanPivotDeg = 0;
  let pivotDrag: { x: number; pivot: number; moved: boolean } | null = null;
  let suppressFanClick = false;

  const pivotFanEnabled = () => narrowViewport() && dialog.open;

  function fanPivotLimits() {
    const step = fanAngleStep();
    const half = 10.5 * step;
    return { min: -half, max: half };
  }

  /** Fija el centro del arco en el viewport; las cartas orbitan, el escenario no rota. */
  function syncFanOrbitGeometry() {
    if (!pivotFanEnabled()) {
      fan.style.removeProperty('--fan-orbit-y');
      fan.style.removeProperty('--fan-orbit-r');
      fan.style.removeProperty('--fan-orbit-clip-h');
      fan.style.removeProperty('--fan-orbit-pad-b');
      fan.style.removeProperty('--fan-orbit-lift');
      scroll.style.removeProperty('--fan-orbit-clip-h');
      return;
    }
    const styles = getComputedStyle(fan);
    const cardW =
      Number.parseFloat(styles.getPropertyValue('--fan-card-w')) ||
      fan.querySelector<HTMLButtonElement>('button')?.offsetWidth ||
      100;
    const viewW = scroll.clientWidth || 320;
    const measureH = Math.max(scroll.clientHeight, 220);
    const cardH = cardW * 1.5;
    const halfAngleRad = (10.5 * fanAngleStep() * Math.PI) / 180;
    const sinHalf = Math.max(Math.sin(halfAngleRad), 0.4);
    const cosHalf = Math.cos(halfAngleRad);
    // Cuerda del arco ~ ancho útil (spread tipo desktop).
    const spreadR = (viewW * 0.98) / (2 * sinHalf);
    const edgeLift = spreadR * (1 - cosHalf) * 0.68;
    const minTop = 10;
    // Pivote bajo el canvas visible (clipeado por overflow del viewport).
    const pivotDepth = Math.max(measureH * 0.48, cardW * 1.05, 80);
    let orbitY = measureH + pivotDepth;
    const maxR = Math.max(orbitY - cardH - minTop, cardW * 2.05);
    const radius = Math.min(
      Math.max(spreadR, cardW * 2.65, measureH * 0.54),
      maxR,
    );
    const arcTop = orbitY - cardH - radius - edgeLift * 0.25;
    if (arcTop < minTop) {
      orbitY += minTop - arcTop;
    }
    const padB = orbitY - measureH;
    const centerBottom = orbitY - radius;
    const centerTop = centerBottom - cardH;
    const maxLift = Math.max(0, centerTop - minTop);
    const lift = Math.max(0, Math.min(maxLift, centerTop + cardH * 0.08) - 14);
    const displayH = Math.min(
      measureH,
      Math.ceil(cardH + radius * 0.34 + 36),
    );
    fan.style.setProperty('--fan-orbit-y', `${orbitY}px`);
    fan.style.setProperty('--fan-orbit-r', `${radius}px`);
    fan.style.setProperty('--fan-orbit-lift', `${lift}px`);
    fan.style.setProperty('--fan-orbit-clip-h', `${displayH}px`);
    fan.style.setProperty('--fan-orbit-pad-b', `${padB}px`);
    scroll.style.setProperty('--fan-orbit-clip-h', `${displayH}px`);
  }

  function setFanPivot(deg: number) {
    const { min, max } = fanPivotLimits();
    fanPivotDeg = Math.max(min, Math.min(max, deg));
    fan.style.setProperty('--fan-pivot', `${fanPivotDeg}deg`);
    updateFanPanMask();
  }

  function focusFanCard(button: HTMLButtonElement) {
    if (!pivotFanEnabled()) {
      button.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
      return;
    }
    const index = Number(button.style.getPropertyValue('--fan-index'));
    if (!Number.isFinite(index)) return;
    setFanPivot(-(index - 10.5) * fanAngleStep());
  }

  async function animate(element: HTMLElement, keyframes: Keyframe[], duration: number) {
    if (reducedMotion.matches) return;
    const animation = element.animate(keyframes, { duration, easing: 'cubic-bezier(.22,.68,0,1)' });
    animations.add(animation);
    try { await animation.finished; } catch { /* Closing cancels the current animation. */ }
    animations.delete(animation);
  }

  function setBusy(value: boolean) {
    busy = value;
    fan.querySelectorAll<HTMLButtonElement>('button').forEach((button) => { button.disabled = value; });
    fan.setAttribute('aria-busy', String(value));
  }

  function reset(options?: { preserveDeckFade?: boolean }) {
    session++;
    animations.forEach((animation) => animation.cancel());
    animations.clear();
    selected = [];
    setBusy(false);
    result.hidden = true;
    deckArea.classList.remove('is-complete');
    spread.classList.remove('is-fading-out');
    result.classList.remove('is-fading-out');
    if (!options?.preserveDeckFade) {
      deckArea.classList.remove('is-fading-out');
    }
    fanPivotDeg = 0;
    fan.style.setProperty('--fan-pivot', '0deg');
    announcer.textContent = '';
    slots.forEach((slot) => {
      slot.querySelector('.tarot-card')?.remove();
      const reading = slot.querySelector<HTMLElement>('[data-tarot-reading]')!;
      reading.classList.remove('is-shown');
      reading.setAttribute('aria-hidden', 'true');
      reading.querySelector('h3')!.textContent = '';
      reading.querySelector('p')!.textContent = '';
    });
    fan.replaceChildren();
    shuffleTarot().forEach((card, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'tarot-card';
      button.style.setProperty('--fan-index', String(index));
      button.style.setProperty('--fan-drop', `${Math.pow(index - 10.5, 2) * fanDropScale()}px`);
      button.style.setProperty('--fan-angle', `${(index - 10.5) * fanAngleStep()}deg`);
      button.style.zIndex = String(index + 1);
      button.setAttribute('aria-label', `${t.faceDown} ${index + 1}`);
      const inner = document.createElement('span');
      inner.className = 'tarot-card-inner';
      const back = document.createElement('img');
      back.className = 'tarot-card-back';
      back.src = tarotBackImage();
      back.width = 600;
      back.height = 900;
      back.alt = '';
      back.draggable = false;
      const front = document.createElement('img');
      front.className = 'tarot-card-front';
      front.alt = '';
      front.draggable = false;
      inner.append(front, back);
      button.append(inner);
      button.addEventListener('click', () => { void draw(card, button, front, inner); });
      // Arrow navigation makes every overlapping card reachable without 22 Tab presses.
      button.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const remaining = [...fan.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')];
        const current = remaining.indexOf(button);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? remaining.length - 1 :
          (current + (event.key === 'ArrowRight' ? 1 : -1) + remaining.length) % remaining.length;
        remaining[next]?.focus({ preventScroll: true });
        focusFanCard(remaining[next]!);
      });
      fan.append(button);
    });
    layoutFan();
    updatePanMasks();
  }

  function updateFanGeometry() {
    const pivot = pivotFanEnabled();
    const scale = pivot ? 0 : fanDropScale();
    const angleStep = fanAngleStep();
    fan.querySelectorAll<HTMLButtonElement>('button').forEach((button) => {
      const index = Number(button.style.getPropertyValue('--fan-index'));
      if (!Number.isFinite(index)) return;
      button.style.setProperty('--fan-drop', pivot ? '0px' : `${Math.pow(index - 10.5, 2) * scale}px`);
      button.style.setProperty('--fan-angle', `${(index - 10.5) * angleStep}deg`);
    });
  }

  function layoutFan() {
    updateFanGeometry();
    const pivot = pivotFanEnabled();
    scroll.classList.toggle('is-pivot-fan', pivot);
    fan.classList.toggle('is-pivot-fan', pivot);
    fanStage.classList.toggle('is-pivot-fan', pivot);

    const fanWidth = fan.scrollWidth;
    const viewportWidth = scroll.clientWidth;
    const needsScroll = pivot || fanWidth > viewportWidth + 8;
    scroll.classList.toggle('is-scrollable', needsScroll);
    fanStage.classList.toggle('is-scrollable', needsScroll);
    scrollHint?.classList.toggle('is-visible', needsScroll && !narrowViewport());
    syncCompactFanUi();

    if (pivot) {
      scroll.scrollLeft = 0;
      syncFanOrbitGeometry();
      setFanPivot(fanPivotDeg);
      requestAnimationFrame(() => {
        syncFanOrbitGeometry();
        setFanPivot(fanPivotDeg);
        requestAnimationFrame(() => {
          syncFanOrbitGeometry();
          setFanPivot(fanPivotDeg);
        });
      });
    } else {
      syncFanOrbitGeometry();
    }
    if (!pivot && needsScroll) {
      fanScrollAnchor = (scroll.scrollWidth - scroll.clientWidth) / 2;
      scroll.scrollLeft = fanScrollAnchor;
    } else {
      fanScrollAnchor = 0;
      scroll.scrollLeft = 0;
    }
    updateFanPanMask();
  }

  function updateFanPanMask() {
    if (pivotFanEnabled()) {
      const { min, max } = fanPivotLimits();
      fanMask.classList.toggle('is-pan-left', fanPivotDeg > min + 1.5);
      fanMask.classList.toggle('is-pan-right', fanPivotDeg < max - 1.5);
      return;
    }
    const max = scroll.scrollWidth - scroll.clientWidth;
    fanMask.classList.toggle('is-pan-left', scroll.scrollLeft > 6);
    fanMask.classList.toggle('is-pan-right', max > 6 && scroll.scrollLeft < max - 6);
  }

  function updateVerticalPanMask() {
    // Sin degradés fijos al viewport: al scrollear tapaban lecturas y resultado.
    scrollMask.classList.remove('is-pan-top', 'is-pan-bottom');
  }

  function updatePanMasks() {
    updateVerticalPanMask();
    updateFanPanMask();
  }

  function scrollModalTo(target: HTMLElement, behavior: ScrollBehavior = 'smooth') {
    const motion = reducedMotion.matches ? 'instant' : behavior;
    const regionRect = scrollRegion.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    if (narrowViewport()) {
      if (target === result) {
        // Solo asoma el resultado; no empujar tanto que las cartas queden cortadas arriba.
        const anchorTop = regionRect.top + regionRect.height * 0.4;
        const delta = targetRect.top - anchorTop;
        if (delta > 4) scrollRegion.scrollBy({ top: delta, behavior: motion });
        window.setTimeout(updateVerticalPanMask, motion === 'instant' ? 0 : 420);
        return;
      }
      const margin = 18;
      let delta = 0;
      if (targetRect.bottom > regionRect.bottom - margin) {
        delta = targetRect.bottom - regionRect.bottom + margin;
      } else if (targetRect.top < regionRect.top + margin) {
        delta = targetRect.top - regionRect.top - margin;
      }
      if (delta !== 0) scrollRegion.scrollBy({ top: delta, behavior: motion });
      window.setTimeout(updateVerticalPanMask, motion === 'instant' ? 0 : 420);
      return;
    }

    const nextTop = scrollRegion.scrollTop + (targetRect.top - regionRect.top) - 6;
    scrollRegion.scrollTo({ top: Math.max(0, nextTop), behavior: motion });
    window.setTimeout(updateVerticalPanMask, motion === 'instant' ? 0 : 420);
  }

  function waitForScrollEnd() {
    return new Promise<void>((resolve) => {
      if (reducedMotion.matches) {
        resolve();
        return;
      }
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        resolve();
      };
      scrollRegion.addEventListener('scrollend', finish, { once: true });
      window.setTimeout(finish, 560);
    });
  }

  async function scrollModalToTop(behavior: ScrollBehavior = 'smooth') {
    const motion = reducedMotion.matches ? 'instant' : behavior;
    scrollRegion.scrollTo({ top: 0, behavior: motion });
    if (motion === 'smooth') await waitForScrollEnd();
    updateVerticalPanMask();
  }

  let replaying = false;
  const REPLAY_FADE_MS = 420;

  function beginReplayFade() {
    spread.classList.add('is-fading-out');
    if (!result.hidden) result.classList.add('is-fading-out');
    deckArea.classList.add('is-fading-out');
  }

  function revealDeckAfterReset() {
    requestAnimationFrame(() => {
      deckArea.classList.remove('is-fading-out');
      layoutFan();
      updatePanMasks();
    });
  }

  /** Desvanece la tirada, panea arriba y resetea antes de que el visitante note el swap. */
  function replayReading() {
    if (replaying) return;
    replaying = true;
    again.disabled = true;

    const finish = () => {
      updatePanMasks();
      fan.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
      replaying = false;
      again.disabled = false;
    };

    if (reducedMotion.matches) {
      reset();
      scrollRegion.scrollTop = 0;
      finish();
      return;
    }

    let swapped = false;
    let fallbackTimer = 0;

    const swap = () => {
      if (swapped) return;
      swapped = true;
      window.clearTimeout(fallbackTimer);
      reset({ preserveDeckFade: true });
      scrollRegion.scrollTop = 0;
      revealDeckAfterReset();
      finish();
    };

    beginReplayFade();
    const startScroll = scrollRegion.scrollTop;
    if (startScroll >= 12) {
      scrollRegion.scrollTo({ top: 0, behavior: 'smooth' });
    }

    window.setTimeout(swap, REPLAY_FADE_MS);
    fallbackTimer = window.setTimeout(swap, REPLAY_FADE_MS + 420);
  }

  scrollRegion.addEventListener('scroll', updateVerticalPanMask, { passive: true });
  scroll.addEventListener('scroll', () => {
    if (pivotFanEnabled()) return;
    updateFanPanMask();
  }, { passive: true });

  const PIVOT_DEG_PER_PX = 0.14;

  scroll.addEventListener('pointerdown', (event) => {
    if (!pivotFanEnabled() || busy || event.button !== 0) return;
    pivotDrag = { x: event.clientX, pivot: fanPivotDeg, moved: false };
    fan.classList.add('is-pivot-dragging');
    scroll.setPointerCapture(event.pointerId);
  });

  const endPivotDrag = (event: PointerEvent) => {
    if (!pivotDrag) return;
    if (pivotDrag.moved) suppressFanClick = true;
    pivotDrag = null;
    fan.classList.remove('is-pivot-dragging');
    if (scroll.hasPointerCapture(event.pointerId)) scroll.releasePointerCapture(event.pointerId);
  };
  scroll.addEventListener('pointerup', endPivotDrag);
  scroll.addEventListener('pointercancel', endPivotDrag);
  scroll.addEventListener('pointermove', (event) => {
    if (!pivotDrag) return;
    const dx = event.clientX - pivotDrag.x;
    if (Math.abs(dx) > 4) {
      pivotDrag.moved = true;
      event.preventDefault();
      setFanPivot(pivotDrag.pivot + dx * PIVOT_DEG_PER_PX);
    }
  }, { passive: false });

  scroll.addEventListener(
    'click',
    (event) => {
      if (!suppressFanClick) return;
      suppressFanClick = false;
      event.preventDefault();
      event.stopPropagation();
    },
    true,
  );

  const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End']);

  function blockManualPan(event: Event) {
    if (!dialog.open) return;
    const target = event.target;
    if (target instanceof Element && target.closest('[data-tarot-scroll]')) return;

    if (event instanceof TouchEvent && event.touches.length === 1 && touchPanStart) {
      const dx = Math.abs(event.touches[0].clientX - touchPanStart.x);
      const dy = Math.abs(event.touches[0].clientY - touchPanStart.y);
      if (dx > dy + 4) return;
    }

    if (event instanceof WheelEvent && Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

    event.preventDefault();
  }

  function blockScrollKeys(event: KeyboardEvent) {
    if (!dialog.open || !SCROLL_KEYS.has(event.key)) return;
    const target = event.target;
    if (target instanceof HTMLButtonElement && target.classList.contains('tarot-card')) return;
    event.preventDefault();
  }

  scrollRegion.addEventListener(
    'touchstart',
    (event) => {
      if (event.touches.length !== 1) {
        touchPanStart = null;
        return;
      }
      touchPanStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    },
    { passive: true },
  );
  scrollRegion.addEventListener('touchend', () => { touchPanStart = null; }, { passive: true });
  scrollRegion.addEventListener('touchcancel', () => { touchPanStart = null; }, { passive: true });

  dialog.addEventListener('wheel', blockManualPan, { passive: false });
  scrollRegion.addEventListener('touchmove', blockManualPan, { passive: false });
  scrollMask.addEventListener('touchmove', blockManualPan, { passive: false });
  dialog.addEventListener('keydown', blockScrollKeys);

  async function draw(card: TarotCard, button: HTMLButtonElement, front: HTMLImageElement, inner: HTMLElement) {
    if (busy || !dialog.open || selected.length >= 3 || selected.some((item) => item.id === card.id)) return;
    const currentSession = session;
    const index = selected.length;
    selected = selectTarotCard(selected, card);
    setBusy(true);
    const before = button.getBoundingClientRect();
    const sourceWidth = button.offsetWidth;
    const sourceHeight = button.offsetHeight;
    const baseAngle = parseFloat(button.style.getPropertyValue('--fan-angle')) || 0;
    const angle = `${baseAngle + fanPivotDeg}deg`;
    // Only the chosen images are downloaded; opening does not load all 22 fronts.
    front.src = tarotImage(card.id);
    const imageReady = front.decode().catch(() => { /* The textual reading remains available if an image fails. */ });
    const place = slots[index].querySelector<HTMLElement>('[data-tarot-place]')!;
    const remaining = [...fan.querySelectorAll<HTMLButtonElement>('button')];
    const nextFocus = remaining[remaining.indexOf(button) + 1] ?? remaining[0];
    button.disabled = true;
    button.classList.add('is-selected');
    button.style.zIndex = '30';
    place.append(button);
    const after = button.getBoundingClientRect();
    await animate(button, [
      { transform: `translate(${before.left - after.left}px, ${before.top - after.top}px) scale(${sourceWidth / after.width}, ${sourceHeight / after.height}) rotate(${angle})` },
      { transform: 'translate(0, 0) scale(1) rotate(0deg)' },
    ], 520);
    await imageReady;
    if (session !== currentSession || !dialog.open) return;
    const reading = slots[index].querySelector<HTMLElement>('[data-tarot-reading]')!;
    reading.querySelector('h3')!.textContent = tarotCardHeading(card, locale);
    reading.querySelector('p')!.textContent = card.prediction[locale];
    reading.classList.add('is-shown');
    reading.setAttribute('aria-hidden', 'false');
    updateVerticalPanMask();
    await animate(inner, [{ transform: 'rotateY(180deg)' }, { transform: 'rotateY(0deg)' }], 460);
    if (session !== currentSession || !dialog.open) return;
    button.classList.add('is-revealed');
    button.setAttribute('aria-label', `${t.chosen}: ${card.name[locale]}`);
    const progress = locale === 'en' ? `${selected.length} of 3.` : `${selected.length} de 3.`;
    announcer.textContent = `${progress} ${card.name[locale]}. ${card.prediction[locale]}`;
    setBusy(false);
    if (selected.length === 3) {
      deckArea.classList.add('is-complete');
      fan.querySelectorAll<HTMLButtonElement>('button:not(.is-selected)').forEach((btn) => { btn.disabled = true; });
      const keyword = recommendTarotGame(selected, games.map((game) => game.keyword));
      const game = games.find((item) => item.keyword === keyword);
      if (game) {
        find('[data-tarot-game-name]').textContent = game.name;
        find('[data-tarot-game-blurb]').textContent = game.blurb;
        const link = find<HTMLAnchorElement>('[data-tarot-game-link]');
        link.href = game.href;
        link.replaceChildren(document.createTextNode(`${t.discover} ${game.name} →`));
        result.hidden = false;
        announcer.textContent = `${t.complete} ${t.match} ${game.name}.`;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => scrollModalTo(result));
        });
        link.focus({ preventScroll: true });
      }
    } else if (!narrowViewport()) {
      requestAnimationFrame(() => scrollModalTo(slots[index]));
    } else {
      updateVerticalPanMask();
    }
    if (selected.length < 3 && nextFocus !== button) {
      nextFocus.focus({ preventScroll: true });
    }
  }

  const onResize = () => {
    syncCompactFanUi();
    if (!dialog.open) return;
    layoutFan();
    updatePanMasks();
  };
  window.addEventListener('resize', onResize);

  open.disabled = false;
  open.addEventListener('click', () => {
    if (dialog.open) return;
    reset();
    previousOverflow = document.documentElement.style.overflow;
    dialog.showModal();
    syncCompactFanUi();
    document.documentElement.style.overflow = 'hidden';
    close.focus({ preventScroll: true });
    scrollModalToTop('instant');
    layoutFan();
    updatePanMasks();
    requestAnimationFrame(() => {
      layoutFan();
      updatePanMasks();
    });
  });
  close.addEventListener('click', () => dialog.close());
  // Require both ends of the pointer gesture on the backdrop, so a drag does not dismiss.
  let backdropStart = false;
  dialog.addEventListener('pointerdown', (event) => { backdropStart = event.target === dialog; });
  dialog.addEventListener('click', (event) => {
    if (backdropStart && event.target === dialog) dialog.close();
    backdropStart = false;
  });
  dialog.addEventListener('close', () => {
    session++;
    animations.forEach((animation) => animation.cancel());
    animations.clear();
    dialog.classList.remove('tarot-dialog--compact-fan');
    document.documentElement.style.overflow = previousOverflow;
    open.focus({ preventScroll: true });
  });
  again.addEventListener('click', () => replayReading());
}
