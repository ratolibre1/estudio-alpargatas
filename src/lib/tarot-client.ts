import { tarot } from '../i18n/tarot';
import { shuffleTarot, selectTarotCard, recommendTarotGame, tarotImage, type TarotCard } from './tarot';

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
  const deckArea = find<HTMLDivElement>('[data-tarot-deck-area]');
  const result = find<HTMLDivElement>('[data-tarot-result]');
  const status = find<HTMLParagraphElement>('[data-tarot-status]');
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

  function reset() {
    session++;
    animations.forEach((animation) => animation.cancel());
    animations.clear();
    selected = [];
    setBusy(false);
    result.hidden = true;
    deckArea.hidden = false;
    status.textContent = `0 / 3 ${t.counter}`;
    announcer.textContent = '';
    slots.forEach((slot) => {
      slot.querySelector('.tarot-card')?.remove();
      slot.querySelector<HTMLElement>('[data-tarot-reading]')!.hidden = true;
    });
    fan.replaceChildren();
    shuffleTarot().forEach((card, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'tarot-card';
      button.style.setProperty('--fan-index', String(index));
      button.style.setProperty('--fan-drop', `${Math.pow(index - 10.5, 2) * .65}px`);
      button.style.setProperty('--fan-angle', `${(index - 10.5) * 2.7}deg`);
      button.style.zIndex = String(index + 1);
      button.setAttribute('aria-label', `${t.faceDown} ${index + 1}`);
      const inner = document.createElement('span');
      inner.className = 'tarot-card-inner';
      const back = document.createElement('img');
      back.className = 'tarot-card-back';
      back.src = '/assets/tarot/back.svg';
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
    // Center the scrollable fan on phones; the page itself never scrolls horizontally.
    requestAnimationFrame(() => { scroll.scrollLeft = (scroll.scrollWidth - scroll.clientWidth) / 2; });
  }

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
    await animate(inner, [{ transform: 'rotateY(180deg)' }, { transform: 'rotateY(0deg)' }], 460);
    if (session !== currentSession || !dialog.open) return;
    button.classList.add('is-revealed');
    button.setAttribute('aria-label', `${t.chosen}: ${card.name[locale]}`);
    const reading = slots[index].querySelector<HTMLElement>('[data-tarot-reading]')!;
    reading.querySelector('h3')!.textContent = card.name[locale];
    reading.querySelector('p')!.textContent = card.prediction[locale];
    reading.hidden = false;
    status.textContent = `${selected.length} / 3 ${t.counter}`;
    announcer.textContent = `${selected.length} / 3 ${t.counter}. ${card.name[locale]}. ${card.prediction[locale]}`;
    setBusy(false);
    if (selected.length === 3) {
      deckArea.hidden = true;
      const keyword = recommendTarotGame(selected, games.map((game) => game.keyword));
      const game = games.find((item) => item.keyword === keyword);
      if (game) {
        find('[data-tarot-game-name]').textContent = game.name;
        find('[data-tarot-game-blurb]').textContent = game.blurb;
        const link = find<HTMLAnchorElement>('[data-tarot-game-link]');
        link.href = game.href;
        link.replaceChildren(document.createTextNode(`${t.discover} ${game.name} →`));
        result.hidden = false;
        status.textContent = t.complete;
        announcer.textContent += ` ${t.complete} ${t.match} ${game.name}.`;
        link.focus({ preventScroll: true });
        result.scrollIntoView({ block: 'nearest', behavior: reducedMotion.matches ? 'instant' : 'smooth' });
      }
    } else if (nextFocus !== button) {
      nextFocus.focus({ preventScroll: true });
    }
  }

  open.disabled = false;
  open.addEventListener('click', () => {
    if (dialog.open) return;
    reset();
    previousOverflow = document.documentElement.style.overflow;
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
    dialog.scrollTop = 0;
    close.focus({ preventScroll: true });
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
  again.addEventListener('click', () => {
    reset();
    dialog.scrollTop = 0;
    fan.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
  });
}
