# Cómo llegar a paletas que convencen

Las paletas **no salen de teoría sola** (60-15-15, contrapunto, etc.). Salen de **anclas visuales del juego** y después se ordenan en cuatro slots.

## Lo que sí funciona

1. **Leer `conceptos`** en el `.md` (línea de ilustración / mesa / cartas). Ahí está el vocabulario real (“flores naranjas y fuentes azules”, “pizarra azul”, “ACME amarillo y rojo”).
2. **2–4 hex ancla** — de arte, mockup, BGG, o tu ojo:
   - uno **principal** (identidad),
   - uno **contrapunto** (complementario o temático: naranja vs azul en Nínive),
   - opcional **base** clara y **tinta** oscura (con matiz, no gris puro).
3. **Ordenar en CMS** sin cambiar el matiz:
   - `palette[0]` base · `[1]` primary · `[2]` apoyo (contrapunto) · `[3]` tinta
   - `bg` = atmósfera de banda (cielo, pizarra, cueva…)
   - `titleColor` = lo que quieres leer en héroe (a menudo primary o tinta)
4. **Validar en portafolio** (4 swatches) + **una ficha** en dev. Ajustar un solo slot, no rehacer todo.

## Lo que no funciona (y por qué falló el agente)

- Elegir hex “de catálogo” (#9333ea, #6366f1…) sin ancla del juego.
- Forzar el mismo apoyo terracota/coral en medio catálogo.
- Confundir **tinta** con **CTA** — el botón lo resuelve `ficha-theme` desde primary/apoyo.

## Cómo pedírselo al agente (copy-paste)

```
Paleta [keyword]:
- Anclas: #______ principal, #______ contrapunto, (opcional base/tinta)
- Referencia: [concepto / imagen / “como commit X”]
- Modo ficha: banda clara | banda oscura
- No tocar: [bg | titleColor | …]
```

Si no tienes hex: “saca anclas del concepto en `games/ninive.md` y propón 4 slots; no inventes colores fuera del brief”.

## Fuente de verdad histórica

El último commit antes de experimentos masivos de paleta (`git show HEAD:src/content/games/<keyword>.md`) tiene colores **elegidos por juego**. Al migrar a base/apoyo/tinta, **conservar esos matices**, solo reordenar roles.

Ver [PALETAS_FICHA.md](./PALETAS_FICHA.md) para roles y restricciones (#fff/#000).
