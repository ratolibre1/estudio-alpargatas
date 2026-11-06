---
keyword: oxido
name: Óxido
emoji: ⚒️
tagline: El cobre cambia. Tu taller también.
taglineEn: Copper changes. So does your workshop.
description: Combina muestras de cobre, atiende encargos antes que los demás y mejora lo que sale de tu bolsa. La precisión paga mejor, pero una entrega imperfecta también puede ser una buena decisión.
descriptionEn: Combine copper samples, fill orders before your rivals, and improve what comes out of your bag. Precision pays better, but an imperfect delivery can still be a good decision.
meta: Cobre · Encargos · Construcción de bolsa
metaEn: Copper · Orders · Bag building
state: pruebas
stateLabel: En pruebas
stateLabelEn: In testing
stateOrder: 4
date: '2026-11'
home: proto
homeOrder: 8
players: 2–4
facts:
  - Construcción de bolsa
  - Encargos compartidos
  - Primeras pruebas pendientes
factsEn:
  - Bag building
  - Shared orders
  - First playtests pending
image: /assets/concepto-oxido.webp
imageAlt: Una mina a tajo abierto se transforma gradualmente en un cuenco de cobre labrado con pátina turquesa; un camión avanza por el borde y hay oficinas de containers a lo lejos.
imageAltEn: An open-pit mine gradually transforms into a chased copper bowl with turquoise patina; a truck drives along the rim and container offices stand in the distance.
imageCaption: Arte conceptual · Del mineral al oficio
imageCaptionEn: Concept art · From ore to craft
bg: '#E1EBE1'
titleColor: '#276F61'
taglineColor: '#1C3831'
palette:
  - '#E1EBE1'
  - '#276F61'
  - '#A7461E'
  - '#1C3831'
fichaMode: light
titleFont: 'Fredoka, sans-serif'
taglineFont: 'Nunito, sans-serif'
bodyFont: 'Nunito, sans-serif'
conceptos:
  - Talleres de cobre y pátina inspirados en Santa Clara del Cobre, México; artesanos, visitantes y un mercado vivo.
  - Portada de surrealismo fotográfico donde una mina se convierte en cuenco; web en verdes de pátina con acentos naranja cobre. El prototipo conserva humor gráfico de tinta expresiva y personajes consistentes de gestos amables.
  - Construcción de bolsa, extracción táctil por tamaño, combinación de valores para encargos compartidos y mejora de muestras entre períodos.
pitchTitle: Un taller entre el brillo y la pátina
pitchTitleEn: A workshop between shine and patina
pitch: Óxido se inspira en los patios, talleres y comercios de Santa Clara del Cobre. Cada persona lleva su propio taller, pero los clientes están a la vista de todos. Durante cuatro eras, representadas por la mañana, el mediodía, el atardecer y la noche, decides qué muestras preparar, qué encargos entregar y cuánto reinvertir. Al cierre, gana quien haya reunido más dinero.
pitchEn: Óxido draws inspiration from the courtyards, workshops, and shops of Santa Clara del Cobre. Each player runs a workshop, while customers are shared by everyone. Across four eras, represented by morning, midday, sunset, and night, you decide which samples to prepare, which orders to deliver, and how much to reinvest. At the end, the player with the most money wins.
version: '0.2'
adjusting: El núcleo de reglas está definido y la identidad visual ya tiene una dirección clara. Estamos afinando la relación entre valores, pagos y mejoras. Las escenas y los componentes que mostramos son propuestas conceptuales; la lista final de materiales sigue abierta.
adjustingEn: The core rules are defined and the visual identity has a clear direction. We are refining the relationship between sample values, payments, and upgrades. The scenes and components shown here are concept proposals; the final component list remains open.
nextPlaytests: La primera configuración de prueba está preparada para dos personas. Queremos observar la competencia por los encargos, el ritmo de las mejoras y el valor de entregar sin acertar exactamente. La meta es llegar a 2–4 jugadores y partidas de 30–45 minutos; ambos parámetros están por validar.
nextPlaytestsEn: The first test configuration is prepared for two players. We want to observe competition for orders, the pace of upgrades, and the value of delivering without an exact match. The goal is 2–4 players and 30–45 minute games; both parameters still need validation.
howTo:
  - title: Prepara tus muestras
    titleEn: Prepare your samples
    body: Elige al tacto un tamaño de ficha dentro de tu bolsa y revela su valor. Los triángulos, rombos y hexágonos distinguen las tres categorías. Las muestras extraídas quedan disponibles en tu taller para combinarlas después.
    bodyEn: Choose a token size by touch inside your bag and reveal its value. Triangles, rhombuses, and hexagons distinguish the three categories. Drawn samples stay available in your workshop to combine later.
  - title: Encuentra la combinación
    titleEn: Find your combination
    body: Suma los valores de las muestras que quieras usar para un encargo visible. Cuanto más te acerques al objetivo, mejor cobras. Puedes entregar sin acertar exactamente, pero otro taller puede atender al cliente antes que tú.
    bodyEn: Add the values of whichever samples you want to use for a visible order. The closer you get to the target, the more you earn. You can deliver without an exact match, but another workshop may serve the customer first.
  - title: Invierte en el próximo período
    titleEn: Invest in the next period
    body: Las muestras gastadas esperan fuera de la bolsa hasta el próximo período. Paga para sustituirlas por otras de la misma categoría y preparar mejores combinaciones. Decide cuánto mejorar y cuánto dinero conservar para el final.
    bodyEn: Spent samples wait outside your bag until the next period. Pay to replace them with others in the same category and prepare better combinations. Decide how much to improve and how much money to keep for the end.
componentsPhoto: /assets/oxido-tablero.webp
componentsPhotoAlt: Montaje conceptual del tablero central con encargos horizontales, mercado de mejoras y cuatro mazos de era.
componentsPhotoAltEn: Concept setup of the central board with landscape orders, an upgrade market, and four era decks.
components:
  - qty: '1'
    name: tablero central · propuesta conceptual
    nameEn: central board · concept proposal
    icon: map
    image: /assets/oxido-tablero.webp
    imageAlt: Propuesta de la zona central compartida de Óxido.
    imageAltEn: Proposed shared central play area for Óxido.
  - qty: '4'
    name: mazos de era · de la mañana a la noche
    nameEn: era decks · from morning to night
    icon: deck-cards
    image: /assets/oxido-cartas-eras.webp
    imageAlt: Frentes y reversos de cartas horizontales; los reversos llevan los números I a IV grandes y centrados.
    imageAltEn: Landscape card fronts and backs; backs carry large centered numerals I through IV.
  - qty: '3'
    name: formas de muestra · triángulo, rombo y hexágono
    nameEn: sample shapes · triangle, rhombus, and hexagon
    icon: tokens-stack
    image: /assets/oxido-muestras-monedas.webp
    imageAlt: Propuesta de muestras geométricas y monedas redondas de Óxido.
    imageAltEn: Proposed geometric sample tokens and round coins for Óxido.
fotos:
  - src: /assets/oxido-tablero.webp
    alt: Tablero central de Óxido con cartas de encargo, mazos de era, fichas geométricas y monedas.
    altEn: Óxido central board with order cards, era decks, geometric tokens, and coins.
    caption: Montaje conceptual · encargos y mejoras en un espacio compartido.
    captionEn: Concept setup · orders and upgrades in a shared space.
  - src: /assets/oxido-cartas-eras.webp
    alt: Cuatro pares de cartas de Óxido, con escenas de mañana, mediodía, atardecer y noche.
    altEn: Four pairs of Óxido cards, with morning, midday, sunset, and night scenes.
    caption: Cartas horizontales · cuatro luces, cuatro eras. Reversos sin logo y con el número central.
    captionEn: Landscape cards · four lights, four eras. Backs without a logo and with a centered numeral.
  - src: /assets/oxido-muestras-monedas.webp
    alt: Fichas triangulares, romboidales y hexagonales junto a monedas circulares, en cobre y turquesa.
    altEn: Triangular, rhombus, and hexagonal tokens alongside round coins, in copper and turquoise.
    caption: Propuesta de fichas · la forma distingue las muestras del dinero.
    captionEn: Token proposal · shape distinguishes samples from money.
  - src: /assets/oxido-taller.webp
    alt: Un artesano martilla un cuenco en un taller con planchas de cobre, herramientas y visitantes al fondo.
    altEn: An artisan hammers a bowl in a workshop with copper sheets, tools, and visitors in the background.
    caption: Exploración de ambiente · producción, materiales y vida de taller.
    captionEn: Setting exploration · production, materials, and workshop life.
  - src: /assets/oxido-mercado.webp
    alt: Puestos de cobre con artesanos, compradores y una gran variedad de productos en Santa Clara del Cobre.
    altEn: Copper stalls with artisans, customers, and a wide variety of products in Santa Clara del Cobre.
    caption: Exploración de ambiente · un mercado lleno de productos y encuentros.
    captionEn: Setting exploration · a market full of products and encounters.
credits: Óxido · Diseño de juego y dirección visual · Estudio Alpargatas
creditsEn: Óxido · Game design and visual direction · Estudio Alpargatas
---
