/**
 * @packageDocumentation
 * @module Lib/Images
 * 
 * @summary
 * Zentrale Registry für Bilder und Grafiken in der App.
 * 
 * @remarks
 * - Bietet einheitlichen Zugriff auf alle App-Bilder
 * - Verhindert doppeltes Laden von Bildern
 * - Vereinfacht Zugriff auf Bilder in Fragetypen
 */

// SVG-Komponenten importieren
import ADayAtThePark from "~/assets/a-day-at-the-park.svg";
import Buddies from "~/assets/buddies.svg";
import CityLife from "~/assets/city-life.svg";
import CoffeeWithFriends from "~/assets/coffee-with-friends.svg";
import Contract from "~/assets/contract.svg";
import DogWalking from "~/assets/dog-walking.svg";
import Dreamer from "~/assets/dreamer.svg";
import EffortlessLove from "~/assets/effortless-love.svg";
import EverydayDesign from "~/assets/everyday-design.svg";
import Exams from "~/assets/exams.svg";
import Friends from "~/assets/friends.svg";
import Hiking from "~/assets/hiking.svg";
import LocationSearch from "~/assets/location-search.svg";
import Login from "~/assets/login.svg";
import MyCurrentLocation from "~/assets/my-current-location.svg";
import Neighbors from "~/assets/neighbors.svg";
import OnlineLearning from "~/assets/online-learning.svg";
import OurNeighborhood from "~/assets/our-neighborhood.svg";
import Outdoors from "~/assets/outdoors.svg";
import PageNotFound from "~/assets/page-not-found.svg";
import QualityTime from "~/assets/quality-time.svg";
import QuietStreet from "~/assets/quiet-street.svg";
import QuietTown from "~/assets/quiet-town.svg";
import ReadingABook from "~/assets/reading-a-book.svg";
import RelaxMode from "~/assets/relax-mode.svg";
import Relaxation from "~/assets/relaxation.svg";
import RoadSign from "~/assets/road-sign.svg";
import Studying from "~/assets/studying.svg";
import ThroughThePark from "~/assets/through-the-park.svg";
import Traveling from "~/assets/traveling.svg";
import TreeSwing from "~/assets/tree-swing.svg";
import WalkingOutside from "~/assets/walking-outside.svg";
import Walking from "~/assets/walking.svg";

/**
 * Bildtypen für die App
 */
export type ImageKey = 
  | 'a-day-at-the-park'
  | 'buddies'
  | 'city-life'
  | 'coffee-with-friends'
  | 'contract'
  | 'dog-walking'
  | 'dreamer'
  | 'effortless-love'
  | 'everyday-design'
  | 'exams'
  | 'friends'
  | 'hiking'
  | 'location-search'
  | 'login'
  | 'my-current-location'
  | 'neighbors'
  | 'online-learning'
  | 'our-neighborhood'
  | 'outdoors'
  | 'page-not-found'
  | 'quality-time'
  | 'quiet-street'
  | 'quiet-town'
  | 'reading-a-book'
  | 'relax-mode'
  | 'relaxation'
  | 'road-sign'
  | 'studying'
  | 'through-the-park'
  | 'traveling'
  | 'tree-swing'
  | 'walking-outside'
  | 'walking'
  | 'placeholder';

/**
 * Zentrale Bild-Registry
 * Mappt Bildschlüssel auf entsprechende SVG-Komponenten
 */
export const SvgRegistry: Record<ImageKey, React.ComponentType<any>> = {
  'a-day-at-the-park': ADayAtThePark,
  'buddies': Buddies,
  'city-life': CityLife,
  'coffee-with-friends': CoffeeWithFriends,
  'contract': Contract,
  'dog-walking': DogWalking,
  'dreamer': Dreamer,
  'effortless-love': EffortlessLove,
  'everyday-design': EverydayDesign,
  'exams': Exams,
  'friends': Friends,
  'hiking': Hiking,
  'location-search': LocationSearch,
  'login': Login,
  'my-current-location': MyCurrentLocation,
  'neighbors': Neighbors,
  'online-learning': OnlineLearning,
  'our-neighborhood': OurNeighborhood,
  'outdoors': Outdoors,
  'page-not-found': PageNotFound,
  'quality-time': QualityTime,
  'quiet-street': QuietStreet,
  'quiet-town': QuietTown,
  'reading-a-book': ReadingABook,
  'relax-mode': RelaxMode,
  'relaxation': Relaxation,
  'road-sign': RoadSign,
  'studying': Studying,
  'through-the-park': ThroughThePark,
  'traveling': Traveling,
  'tree-swing': TreeSwing,
  'walking-outside': WalkingOutside,
  'walking': Walking,
  'placeholder': ADayAtThePark, // Platzhalter (später durch echtes Bild ersetzen)
};

/**
 * Prüft, ob ein Bildschlüssel in der Registry existiert
 * 
 * @param key - Der zu prüfende Bildschlüssel
 * @returns true, wenn das Bild in der Registry existiert
 */
export function isRegisteredImage(key: string): key is ImageKey {
  return key in SvgRegistry;
}

/**
 * Holt eine SVG-Komponente aus der Registry
 * 
 * @param key - Bildschlüssel oder URL
 * @returns SVG-Komponente oder undefined, wenn nicht gefunden
 */
export function getImage(key: string): React.ComponentType<any> | undefined {
  if (isRegisteredImage(key)) {
    return SvgRegistry[key];
  }
  return undefined;
}

/**
 * Prüft, ob eine Bild-Source eine URL ist
 * 
 * @param source - Die zu prüfende Bildquelle
 * @returns true, wenn es sich um eine URL handelt
 */
export function isImageUrl(source: string): boolean {
  return source.startsWith('http://') || source.startsWith('https://');
} 