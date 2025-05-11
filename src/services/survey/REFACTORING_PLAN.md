# Refactoring-Plan für das Survey-System

## Identifizierte Probleme

### 1. Doppelte Verantwortlichkeiten: Statische vs. Instanz-Methoden

Alle Services implementieren zwei parallele APIs:
- OOP-Ansatz mit Instanzmethoden (via Interfaces)
- Statische Methoden für "Legacy"-Code

Dies führt zu:
- Redundantem Code
- Unklarer Verantwortlichkeit
- Schwierigkeiten bei Tests
- Verletzung des Single Responsibility Principle

### 2. Massive SurveyService-Klasse als Fassade

Der `SurveyService` dient hauptsächlich als Fassade für andere Services ohne eigenen Mehrwert.

### 3. Überlappende Verantwortlichkeiten

- Überlappung zwischen `SurveyQuestionService` und `SurveyNavigationService`
- `findAppropriateQuestionIndex` passt besser zum NavigationService

### 4. Fehlende Repository-Abstraktionen

- Direkte Abhängigkeit von Supabase in einigen Services
- Fehlende oder ungenutzte Repository-Interfaces

### 5. Starke Kopplung zwischen Services

- Direkte Importe anderer Services statt Dependency Injection
- Erschwertes Testen und verletztes Dependency Inversion Principle

## Refactoring-Schritte

### Phase 1: Klare Trennung zwischen statischen und Instanz-Methoden

1. **Entfernung der statischen Methoden in allen Service-Klassen**
   - Beginnend mit `SurveyQuestionService`, `SurveyResponseService`, `SurveyNavigationService`
   - Umstellung auf reine Instanz-Implementierungen
   - Anpassung aller Aufrufe an die Singleton-Instanzen

2. **Umstellung von `SurveyService` von statischen auf Instanz-Methoden**
   - Erstellung eines Singletons
   - Anpassung aller Aufrufe in der App

### Phase 2: Bessere Trennung der Verantwortlichkeiten

1. **Aufteilung und Neuordnung der Service-Methoden**
   - `SurveyQuestionService`: Fokus auf Fragen-Beschaffung und -Filterung
   - `SurveyNavigationService`: Alle navigations-bezogenen Methoden hier konsolidieren
   - `findAppropriateQuestionIndex` vom QuestionService zum NavigationService verschieben

2. **Überprüfung und Entfernung ungenutzter Methoden**
   - Insbesondere in `SurveyAvailabilityService` und `SurveyDataService`

### Phase 3: Dependency Injection implementieren

1. **Interfaces für alle Services definieren**
   - Vollständige Interfaces für alle Services erstellen bzw. verbessern

2. **Konstruktor-Injection implementieren**
   ```typescript
   class SurveyQuestionService implements ISurveyQuestionService {
     constructor(
       private questionRepository: IQuestionRepository,
       private answeredQuestionsService: ISurveyAnsweredQuestionsService
     ) {}
     
     // Methoden...
   }
   ```

3. **Service-Registrierung einführen**
   - Service-Container für Test-Mocks und bessere Dependency-Verwaltung

### Phase 4: Repository-Abstraktion verbessern

1. **Vollständige Repository-Interfaces definieren**
   - Für alle direkten Datenbankzugriffe

2. **Supabase-Abhängigkeiten isolieren**
   - In der Repository-Implementierung kapseln
   - Services sollten nur gegen Interfaces programmieren

### Phase 5: Entfernung des SurveyService als Fassade

1. **Direkte Nutzung der spezialisierten Services**
   - Screens und Hooks nutzen direkt die relevanten Services
   - `SurveyScreen` nutzt `questionService`, `navigationService` und `responseService` direkt

2. **Orchestrierende Logik in Hooks verschieben**
   - Komplexe Prozesse in die Hooks verschieben
   - Services auf einzelne Verantwortlichkeiten beschränken

## Konkrete Änderungen für die ersten Services

### 1. SurveyQuestionService

```typescript
// Vor dem Refactoring
class SurveyQuestionService implements ISurveyQuestionService {
  async getQuestionsForSurvey(...) {
    return SurveyQuestionService.getQuestionsForSurvey(...);
  }
  
  // Instanz-Methoden delegieren an statische Methoden
  
  static async getQuestionsForSurvey(...) {
    // Implementierung
  }
}

// Nach dem Refactoring
class SurveyQuestionService implements ISurveyQuestionService {
  constructor(
    private questionRepository: IQuestionRepository,
    private answeredQuestionsService: ISurveyAnsweredQuestionsService
  ) {}
  
  async getQuestionsForSurvey(...) {
    // Implementierung direkt hier
  }
}
```

### 2. SurveyNavigationService

Methode `findAppropriateQuestionIndex` hierher verschieben und im `SurveyQuestionService` entfernen.

### 3. SurveyResponseService 

```typescript
// Nach dem Refactoring
class SurveyResponseService implements ISurveyResponseService {
  constructor(
    private questionService: ISurveyQuestionService,
    private supabaseClient: ISupabaseClient
  ) {}
  
  async submitResponse(...) {
    // Implementierung direkt hier ohne Delegation
  }
}
```

## Erwartete Vorteile

1. **Verbesserte Testbarkeit**
   - Alle Abhängigkeiten können gemockt werden
   - Klare Verantwortlichkeiten vereinfachen Tests

2. **Bessere Wartbarkeit**
   - Kleinere Klassen mit klaren Verantwortlichkeiten
   - Weniger redundanter Code

3. **Stärkere SOLID-Konformität**
   - Single Responsibility Principle: Jede Klasse hat nur eine Aufgabe
   - Open/Closed Principle: Erweiterungen ohne Änderungen am vorhandenen Code
   - Liskov Substitution Principle: Interfaces können implementiert werden
   - Interface Segregation: Kleine, spezifische Interfaces
   - Dependency Inversion: Abhängigkeit von Abstraktionen statt Implementierungen 