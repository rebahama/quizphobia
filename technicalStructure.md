# JSON

1. Quiz frågor och svar
   - Path: src/json/quiz.json

# CSS / SASS

## Syntax
1. Skriv class namn med bindestreck som avdelare ex. 'this-is-a-class'
2. Inga förkortningar

## Sass Partials

1. Variabler / mixins partials

   - Path: `src/styles/variables/\_variables.scss`
   - Path: `src/styles/variables/\_mixins.scss`

2. Layout partials

   - Path: `src/styles/layout/\_mobile.scss`
     ....

3. Vendor Reset partial

   - Path: `src/styles/vendor/\_reset.scss`

# Debug funktion

- Lägga en färg för att se divs i utvecklingsstadie / true från början

div {
@if $debugging {
outline: 1px solid hotpink
}
}

# TS

## Syntax
1. Skriv camelCase
2. Inga förkortningar ex. (ej btn, skriv button)

## Funktion syntax / funktionalitet

1. Function syntax istället för arrow-functions
2. Lokala funktioner om möjligt
3. Inte vara rädd för långa funktionsnamn
4. Om möjligt kortare funktioner som gör endast en sak


## Egen types fil

- För större interfaces som exporteras in i main, där I är prefixet.
  - Path: `src/assets/utils/types.ts`

## Helperfunctions

- Helperfunction.ts för hjälpfunktioner - mer generiska funktioner som exporteras.
  - Path: `src/assets/utils/helperfunctions.ts`

Förslag filsökväg

## Funktions dokumentation

1. Dokumentara svårare funktioner med pseudokod ovanför.

/\*\*

- Funktion övergripande beskrivning
- @param parameter namn
- @returns beskrivning
  \*/
  function myFunc() {
  console.log('Kom och hjälp mig!')
  };

2. Kommentarer som förklarar svårare icke-beskrivande stycken i koden.

## Beskrivande funktionsprefixer

- returnerande funktioner // prefix: `get`
- togglande funktioner // prefix: `toggle`
- boolean funktioner // prefix: `is`
- funktioner som ändrar t.ex. attribut // prefix: `set`
- initiala funktioner // prefix: `initial`
- saker som visar saker för användaren // `display`

## Struktur i main.ts

1. importer längst upp
2. const globala selektorer
3. let variabler
4. Indela funktioner på rätt plats / logiskt
5. Event lyssnare längst ner
