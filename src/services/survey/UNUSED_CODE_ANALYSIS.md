# Analyse der ungenutzten Logik im Survey-System

Diese Analyse identifiziert Code und Logik im Survey-System, die möglicherweise ungenutzt, redundant oder unnötig komplex ist.

## 1. SurveyService

### Ungenutzte oder redundante Methoden:

- `isSurveyAvailable()`: Diese Methode wird verwendet, aber könnte direkt den SurveyAvailabilityService aufrufen.
- `isSlotReady()`: Scheint ungenutzt zu sein oder könnte in den SlotService verlagert werden.
- `shouldCompleteOnNext()`: Redundante Delegation an NavigationService.
- Mehrere Methoden, die lediglich an spezialisierte Services delegieren, ohne Mehrwert zu bieten.

## 2. SurveyQuestionService

### Ungenutzte oder redundante Methoden:

- `shouldAdjustNavigation()`: Scheint nur innerhalb des Services verwendet zu werden, aber überschneidet sich mit der Verantwortlichkeit des NavigationService.
- Duplizierte Sortierlogik in verschiedenen Methoden.

### Code-Analyse:

```typescript
// Redundante Implementierung in statischer und Instanz-Methode
async getQuestionsForSurvey(...) {
  return SurveyQuestionService.getQuestionsForSurvey(...);
}

static async getQuestionsForSurvey(...) {
  // Die eigentliche Implementierung
}
```

## 3. SurveyNavigationService

### Ungenutzte oder redundante Methoden:

- `calculateNavigation()`: Scheint intern nicht genutzt zu werden und kombiniert verschiedene Verantwortlichkeiten.

### Code-Analyse:

Die Verantwortlichkeiten sind unscharf – teils im QuestionService, teils im NavigationService.

## 4. SurveyResponseService

### Ungenutzte oder redundante Methoden:

- `markResponded()`: Vermutlich veraltet zugunsten von `markShowOnceQuestionsAsAnswered()`.

### Code-Analyse:

Doppelte Verantwortung in der `processResponse()`-Methode – sowohl Speicherung als auch bedingte Filterung.

## 5. SurveyLifecycleService

### Ungenutzte oder redundante Methoden:

- Vermischung von Instanz- und statischen Methoden, die ähnliche Aufgaben erfüllen.
- `processSurveyCompletion()` vs. `markCurrentSurveyCompleted()`: Überlappende Verantwortlichkeiten.

## 6. SurveySessionService

### Ungenutzte oder redundante Methoden:

- Diese Klasse ist vergleichsweise fokussiert, aber es fehlt ein Interface für die Abstraktion.

## 7. SurveyAvailabilityService

### Ungenutzte oder redundante Methoden:

- `shouldShowFirstSurvey()` und `shouldShowRegularSurvey()`: Werden nur intern verwendet, sollten eventuell privat sein.
- `getTimeUntilNextSurvey()`: Scheint nicht direkt verwendet zu werden.

## 8. SurveyDataService

### Ungenutzte oder redundante Methoden:

- Diese Klasse erscheint als lose Sammlung von datenbezogenen Hilfsfunktionen ohne klare Verantwortlichkeit.
- `resetAnsweredOnceQuestions()`: Könnte zum SurveyAnsweredQuestionsService gehören.
- `resetSlotSystem()`: Könnte zum SlotService gehören.

## 9. SurveyAnsweredQuestionsService

### Ungenutzte oder redundante Methoden:

- Insgesamt gut fokussiert, aber die Speicherschlüssel sollten als Konstanten ausgelagert werden.

## Allgemeine Probleme:

1. **Redundante Code-Muster:**
   - Wiederholte Log-Aufrufe mit ähnlichen Nachrichten
   - Ähnliche Try-Catch-Blöcke in verschiedenen Services
   - Duplizierte Fehlerbehandlungsstrategien

2. **Fehlende Abstraktion:**
   - Direkte Abhängigkeiten zum Speichersystem (AsyncStorage, Supabase)
   - Fehlende Repository-Interfaces für einige Datenquellen

3. **Unklare Schnittstellen:**
   - Parameter wie `includeAnsweredOnceQuestions` werden durch mehrere Schichten weitergereicht
   - Inkonsistente Benennung ähnlicher Konzepte (z.B. `completed` vs. `answered` vs. `responded`)

## Vorschläge zur Bereinigung:

1. **Eliminierung der doppelten Verantwortlichkeiten:**
   - Entscheidung für einen Paradigma: entweder statische Methoden oder OOP-Instanzmethoden
   - Bevorzugt: OOP-Modell mit Interfaces für bessere Testbarkeit

2. **Klare Verantwortlichkeiten definieren:**
   - NavigationService: Ausschließlich für Navigation und Index-Berechnung
   - QuestionService: Ausschließlich für Fragen-Beschaffung und -Filterung
   - ResponseService: Ausschließlich für Antwort-Management

3. **Entfernung des SurveyService als Fassade:**
   - Direkte Verwendung der spezialisierten Services in den Aufrufern

4. **Konstanten und Hilfsfunktionen konsolidieren:**
   - Gemeinsame Hilfsfunktionen in einer separaten Utilities-Datei
   - Alle Konstanten (wie Speicherschlüssel) in einer zentralen Constants-Datei

## Vorrangige Entfernungen:

Die folgenden konkreten Methoden/Funktionen sollten vorrangig entfernt oder verschoben werden:

1. **Alle statischen Methoden in den Service-Klassen, die aktuelle Instanz-Methoden duplizieren:**
   ```typescript
   // Instanz-Methode behalten:
   async getQuestionsForSurvey(...) { ... }
   
   // Statische Methode entfernen:
   static async getQuestionsForSurvey(...) { ... }
   ```

2. **Der gesamte `SurveyService` als Fassade:**
   - Alle Aufrufer sollten stattdessen direkt die spezialisierten Services verwenden
   - Die Services können weiterhin als Singletons bereitgestellt werden

3. **Die `shouldAdjustNavigation`-Methode im `SurveyQuestionService`:**
   - Diese Logik sollte vollständig im NavigationService liegen

4. **Verschiebung der `findAppropriateQuestionIndex`-Methode:**
   - Vom QuestionService zum NavigationService

5. **Konsolidierung der Lebenszyklusmethoden in `SurveyLifecycleService`:**
   - Entweder beide statisch oder beide als Instanzmethoden
   - Zusammenführung überlappender Methoden 