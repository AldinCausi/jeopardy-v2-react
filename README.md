# Jeopardy – Mehrspieler-Quiz mit React und Firebase

Ein browserbasiertes Quizspiel im Stil von Jeopardy. Eine Person hostet das Spiel und steuert das Board, bis zu vier Mitspielende treten über einen Raumcode bei und sehen die aktuelle Frage in Echtzeit auf ihrem eigenen Gerät.

## Funktionen

- **Eigene Boards erstellen:** 5 Kategorien mit je 5 Feldern. Jedes Feld hat Punkte, Frage, Antwort und optional ein Bild (per URL).
- **Raumcode:** Jedes Board bekommt einen zufälligen vierstelligen Code. Mitspielende treten mit Name und Code bei (maximal 4 Spieler).
- **Host-Ansicht:** Der Host wählt ein Feld, sieht Frage und Antwort, kann das Bild für alle ein- und ausblenden und vergibt Punkte. Bei falscher Antwort wird die Hälfte der Punkte abgezogen.
- **Spieler-Ansicht:** Das Board und die aktuelle Frage werden live angezeigt, die Antwort bleibt dem Host vorbehalten.
- **Echtzeit-Synchronisation:** Der Spielzustand liegt in Firebase Firestore und wird per Listener (`onSnapshot`) auf allen Geräten aktualisiert.
- **Spielverwaltung:** Board zurücksetzen, Spiel beenden und frühere Boards erneut hosten.

## Technologien

React 19, Vite, React Router, Firebase Firestore, JavaScript (ES-Module), ESLint

## Projektstruktur

```
src/
  main.jsx                   Routing
  App.jsx                    Startseite: Board erstellen, Spiel beitreten
  components/
    CreateBoardPage.jsx      Board-Editor, Speichern in Firestore
    TileForm.jsx             Formular für ein einzelnes Feld
    BoardSelector.jsx        Liste vorhandener Boards
    HostBoard.jsx            Host-Ansicht mit Punktevergabe
    PlayerBoard.jsx          Spieler-Ansicht
  firebase/firebaseConfig.js Firebase-Initialisierung
```

| Route | Seite |
| --- | --- |
| `/` | Startseite |
| `/host/create-board` | Board erstellen |
| `/host/:roomCode` | Host-Ansicht |
| `/game/:roomCode` | Spieler-Ansicht |

## Lokal starten

```bash
git clone https://github.com/AldinCausi/jeopardy-v2-react.git
cd jeopardy-v2-react
npm install
npm run dev
```

Die App läuft dann unter der von Vite ausgegebenen Adresse (standardmäßig `http://localhost:5173`).

### Eigenes Firebase-Projekt verwenden

Wenn du eine eigene Datenbank nutzen möchtest:

1. Erstelle ein Firebase-Projekt und aktiviere Firestore.
2. Ersetze die Werte in `src/firebase/firebaseConfig.js` durch die Konfiguration deiner Web-App.
3. Lege in Firestore Regeln fest, die Lesen und Schreiben auf die Collection `boards` erlauben.

## Spielablauf

1. Host: „Erstelle ein Board“, Kategorien und Felder ausfüllen, speichern und den Raumcode weitergeben.
2. Mitspielende: „Trete einem Spiel bei“, Name und Raumcode eingeben.
3. Host: Felder anklicken, Frage vorlesen, mit `+` oder `-` Punkte vergeben.
4. Host: Mit „Spiel beenden“ wird der Raum geleert.

## Status und mögliche Erweiterungen

Der Fokus liegt auf der Funktionalität, das Styling wird derzeit neu aufgebaut.

- Neues Styling
- Authentifizierung für Hosts und strengere Firestore-Regeln
- Punktestände auch in der Spieler-Ansicht