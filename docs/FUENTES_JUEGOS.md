# Pares de fuentes por juego

No copiamos pareos de [Fontpair](https://fontpair.co/all) uno a uno: casi nunca hay match con lo que ya cargamos. Armamos **title + tagline + body** con reglas simples y solo familias de `src/lib/caja-fonts.ts` (Google Fonts, una hoja).

## Reglas de pareo

1. **Cuerpo (`bodyFont`)** — casi siempre **Nunito** (legible, neutral). Excepciones: juego JP → **Zen Maru Gothic** (Amateurasu).
2. **Display / cartoon / condensed** (Bungee, Bubblegum, Fredoka, Baloo 2, Bebas)  
   - Tagline: **Oswald** si el título es apretado/impacto; si no, **Nunito**.  
   - Cuerpo: Nunito.
3. **Serif display / editorial** (Playfair, Yeseva, Cinzel, Cormorant título)  
   - Tagline: **Cormorant Garamond** (misma vibra editorial, más fino).  
   - Cuerpo: Nunito.
4. **Serif texto** (Spectral, Lora, Cardo, Fraunces)  
   - Tagline: misma familia **o** Cormorant si el título ya es “text serif” (Spectral, Cardo).  
   - Cuerpo: Nunito.
5. **Sans geométrico / humanista título** (Raleway, Josefin, Quicksand)  
   - Tagline: Cormorant (contraste serif) o Nunito (stack limpio).  
   - Cuerpo: Nunito.
6. **Heritage / manuscrito** (IM Fell, Shantell)  
   - Tagline: **Josefin Sans** (Fell) o **Patrick Hand** (doodle / Evoluciona).  
   - Cuerpo: Nunito.
7. **JP** — Shippori Mincho + Zen Maru (tagline y cuerpo).

## Tabla por keyword

| Keyword | Título | Tagline | Cuerpo |
|---|---|---|---|
| almagesto | Spectral | Cormorant Garamond | Nunito |
| amateurasu | Shippori Mincho | Zen Maru Gothic | Zen Maru Gothic |
| canes | Fredoka | Nunito | Nunito |
| carcinogenial | Bubblegum Sans | Nunito | Nunito |
| chauvet | Cardo | Cormorant Garamond | Nunito |
| chispas | Bungee | Oswald | Nunito |
| ermitanos | Baloo 2 | Nunito | Nunito |
| evoluciona | Shantell Sans | Patrick Hand | Nunito |
| gato | Quicksand | Quicksand | Nunito |
| hubris | Cinzel | Cormorant Garamond | Nunito |
| letrados | Raleway | Cormorant Garamond | Nunito |
| mantas | Josefin Sans | Nunito | Nunito |
| ninive | Cormorant Garamond | Cormorant Garamond | Nunito |
| nudis | Lora | Lora | Nunito |
| palomas | Bebas Neue | Oswald | Nunito |
| pavoneo | Playfair Display | Cormorant Garamond | Nunito |
| piramisu | Yeseva One | Cormorant Garamond | Nunito |
| reloj | Fraunces | Fraunces | Nunito |
| tartan | IM Fell English | Josefin Sans | Nunito |

## CMS y ficha

- Campos opcionales en `src/content/games/<keyword>.md`: `titleFont`, `taglineFont`, `bodyFont`.
- Héroe: `--ficha-title-font` + `--ficha-tagline-font` (por juego).
- Premios, componentes, facts y cuerpo de sección: **`--ficha-section-font`** = Nunito en todos salvo Amateurasu (Zen Maru Gothic).
- Fuente nueva → sumar a `CAJA_FONTS_URL` en `caja-fonts.ts` y revisar `/juegos/<keyword>/`.
