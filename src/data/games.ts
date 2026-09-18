export const featuredGames = [
  {
    name: 'Nínive',
    meta: 'Ludoísmo · 2025',
    description: 'Dos jugadores construyen juntos un palacio jardín, pero compiten por dominar los valores que quedan visibles.',
    facts: ['2 jugadores', '15 minutos', '26 cartas'],
    image: '/assets/ninive-palacio.webp',
    imageAlt: 'Partida de Nínive',
    href: '/juegos/ninive/',
    kind: 'ninive',
  },
  {
    name: 'Letrados',
    meta: 'Duelo abstracto',
    description: 'Construye una torre de letras y puntúa según la distancia que separa cada par en el abecedario.',
    facts: ['2 jugadores', '15 minutos', '26 cartas'],
    coverNumber: 'JUEGO 02',
    coverTitle: 'Letra\ndos',
    coverStatus: 'PROYECTO AVANZADO',
    theme: 'red',
    href: '/juegos/letrados/',
  },
  {
    name: 'Mantas a Raya',
    meta: 'Patrones submarinos',
    description: 'Gira y voltea mantarrayas en un tablero compartido para completar las formaciones de tus misiones.',
    facts: ['2 jugadores', '20–30 minutos', 'Losetas'],
    coverNumber: 'JUEGO 03',
    coverTitle: 'Mantas\na Raya',
    coverStatus: 'PROTOTIPO V1',
    theme: 'green',
  },
  {
    name: 'Chispas',
    meta: 'Riesgo compartido',
    description: 'Un único mazo, tres acciones visibles y una mecha que obliga a medir cuánto consume cada jugada.',
    facts: ['12 acciones', 'Potencias 1–3', 'En playtest'],
    coverNumber: 'JUEGO 04',
    coverTitle: 'Chis\npas',
    coverStatus: 'VERSIÓN 0.3',
    theme: 'blue',
  },
] as const;

export const prototypes = [
  { name: 'Amateuratsu', meta: 'Estrategia · Saikū', description: 'Una procesión que va construyendo el tablero.', image: '/assets/amateuratsu-procesion.webp', imageAlt: 'Amateuratsu', href: '/juegos/amateuratsu/' },
  { name: 'HUBRIS', meta: 'Dados · tragedia', description: 'Coopera para completar hazañas, pero compite por reclamar su gloria.', image: '/assets/hubris-estelas.webp', imageAlt: 'HUBRIS', href: '/juegos/hubris/' },
  { name: 'Hasta un Reloj Roto...', meta: 'Rapidez · 48 cartas', description: 'Horas, medias horas y modos nerviosos.', image: '/assets/reloj-collage.webp', imageAlt: 'Hasta un Reloj Roto...', href: '/juegos/reloj/' },
  { name: 'Festival de Canes', meta: 'Combos · competencias', description: 'Cinco disciplinas caninas y acciones que crecen con cada especialidad.', initials: 'FC', coverClass: 'cover-canes', href: '/juegos/el-gran-festival-de-canes/' },
  { name: 'Piramisú', meta: 'Cooperativo · patrones', description: 'Construir juntos una pirámide de ingredientes sin repetir adyacencias.', initials: 'PI', coverClass: 'cover-piramisu', href: '/juegos/piramisu/' },
  { name: 'Pavoneo', meta: 'Duelo · información asimétrica', description: 'Mostrar un poco más puede dar puntos o hacer que todo se venga abajo.', initials: 'PV', coverClass: 'cover-pavoneo', href: '/juegos/pavoneo/' },
  { name: 'Tartán', meta: 'Abstracto · patrones', description: 'Una exploración abierta alrededor de tramas, cruces y conexiones.', initials: 'TT', coverClass: 'cover-tartan', href: '/juegos/tartan/' },
] as const;

export const archiveGames = ['Snorkel', 'Palomas', 'Manda Nudis', 'Ermitaños', 'Carcinogenial', 'Carpas Koi', 'Trinkets', 'Chauvet', 'Almagesto'] as const;
