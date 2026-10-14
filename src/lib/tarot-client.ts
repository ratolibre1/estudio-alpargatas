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
      button.style.setProperty('--fan-drop', `${Math.pow(index - 10.5, 2) * .52}px`);
      button.style.setProperty('--fan-angle', `${(index - 10.5) * 2.7}deg`);
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
        remaining[next]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
      });
      fan.append(button);
    });
    layoutFan();
    updatePanMasks();
  }

  function layoutFan() {
    const fanWidth = fan.scrollWidth;
    const viewportWidth = scroll.clientWidth;
    const needsScroll = fanWidth > viewportWidth + 8;
    scroll.classList.toggle('is-scrollable', needsScroll);
    scrollHint?.classList.toggle('is-visible', needsScroll);
    if (needsScroll) {
      scroll.scrollLeft = (scroll.scrollWidth - scroll.clientWidth) / 2;
    } else {
      scroll.scrollLeft = 0;
    }
    updateFanPanMask();
  }

  function updateFanPanMask() {
    const max = scroll.scrollWidth - scroll.clientWidth;
    fanMask.classList.toggle('is-pan-left', scroll.scrollLeft > 6);
    fanMask.classList.toggle('is-pan-right', max > 6 && scroll.scrollLeft < max - 6);
  }

  function updateVerticalPanMask() {
    const max = scrollRegion.scrollHeight - scrollRegion.clientHeight;
    scrollMask.classList.toggle('is-pan-top', scrollRegion.scrollTop > 6);
    scrollMask.classList.toggle('is-pan-bottom', max > 6 && scrollRegion.scrollTop < max - 6);
  }

  function updatePanMasks() {
    updateVerticalPanMask();
    updateFanPanMask();
  }

  function scrollModalTo(target: HTMLElement, behavior: ScrollBehavior = 'smooth') {
    const motion = reducedMotion.matches ? 'instant' : behavior;
    const regionTop = scrollRegion.getBoundingClientRect().top;
    const targetTop = target.getBoundingClientRect().top;
    const nextTop = scrollRegion.scrollTop + (targetTop - regionTop) - 6;
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
  scroll.addEventListener('scroll', updateFanPanMask, { passive: true });

  const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End']);

  function blockManualPan(event: Event) {
    if (!dialog.open) return;
    event.preventDefault();
  }

  function blockScrollKeys(event: KeyboardEvent) {
    if (!dialog.open || !SCROLL_KEYS.has(event.key)) return;
    const target = event.target;
    if (target instanceof HTMLButtonElement && target.classList.contains('tarot-card')) return;
    event.preventDefault();
  }

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
    const angle = button.style.getPropertyValue('--fan-angle');
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
    await animate(inner, [{ transform: 'rotateY(180deg)' }, { transform: 'rotateY(0deg)' }], 460);
    if (session !== currentSession || !dialog.open) return;
    button.classList.add('is-revealed');
    button.setAttribute('aria-label', `${t.chosen}: ${card.name[locale]}`);
    const progress = locale === 'en' ? `${selected.length} of 3.` : `${selected.length} de 3.`;
    announcer.textContent = `${progress} ${card.name[locale]}. ${card.prediction[locale]}`;
    setBusy(false);
    requestAnimationFrame(() => scrollModalTo(slots[index]));
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
    } else if (nextFocus !== button) {
      nextFocus.focus({ preventScroll: true });
    }
  }

  const onResize = () => {
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
    document.documentElement.style.overflow = 'hidden';
    close.focus({ preventScroll: true });
    scrollModalToTop('instant');
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
    document.documentElement.style.overflow = previousOverflow;
    open.focus({ preventScroll: true });
  });
  again.addEventListener('click', () => replayReading());
}
