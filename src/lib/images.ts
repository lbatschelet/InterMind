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
import ADayOff from "~/assets/a-day-off.svg";
import AmongNature from "~/assets/among-nature.svg";
import Baby from "~/assets/baby.svg";
import Barista from "~/assets/barista.svg";
import BeachDay from "~/assets/beach-day.svg";
import Buddies from "~/assets/buddies.svg";
import Chilling from "~/assets/chilling.svg";
import CityLife from "~/assets/city-life.svg";
import CoffeeWithFriends from "~/assets/coffee-with-friends.svg";
import Contract from "~/assets/contract.svg";
import CountingStars from "~/assets/counting-stars.svg";
import CountrySide from "~/assets/country-side.svg";
import DogWalking from "~/assets/dog-walking.svg";
import Dreamer from "~/assets/dreamer.svg";
import EatingTogether from "~/assets/eating-together.svg";
import EffortlessLove from "~/assets/effortless-love.svg";
import EverydayDesign from "~/assets/everyday-design.svg";
import Exams from "~/assets/exams.svg";
import Explore from "~/assets/explore.svg";
import Family from "~/assets/family.svg";
import Fireworks from "~/assets/fireworks.svg";
import Friends from "~/assets/friends.svg";
import FunMoments from "~/assets/fun-moments.svg";
import Gardening from "~/assets/gardening.svg";
import GoodDoggy from "~/assets/good-doggy.svg";
import Hiking from "~/assets/hiking.svg";
import InTheOffice from "~/assets/in-the-office.svg";
import LateAtNight from "~/assets/late-at-night.svg";
import LearningSketchingsh from "~/assets/learning-sketchingsh.svg";
import Living from "~/assets/living.svg";
import LocationSearch from "~/assets/location-search.svg";
import Logic from "~/assets/logic.svg";
import Login from "~/assets/login.svg";
import Lost from "~/assets/lost.svg";
import Mindfulness from "~/assets/mindfulness.svg";
import MyCurrentLocation from "~/assets/my-current-location.svg";
import MyUniverse from "~/assets/my-universe.svg";
import Neighbors from "~/assets/neighbors.svg";
import OnTheWay from "~/assets/on-the-way.svg";
import OnlineLearning from "~/assets/online-learning.svg";
import OrdinaryDay from "~/assets/ordinary-day.svg";
import OurNeighborhood from "~/assets/our-neighborhood.svg";
import Outdoors from "~/assets/outdoors.svg";
import PageNotFound from "~/assets/page-not-found.svg";
import PassingBy from "~/assets/passing-by.svg";
import People from "~/assets/people.svg";
import PlayingFetch from "~/assets/playing-fetch.svg";
import QualityTime from "~/assets/quality-time.svg";
import QuietStreet from "~/assets/quiet-street.svg";
import QuietTown from "~/assets/quiet-town.svg";
import ReadingABook from "~/assets/reading-a-book.svg";
import ReadingTime from "~/assets/reading-time.svg";
import RelaxMode from "~/assets/relax-mode.svg";
import Relaxation from "~/assets/relaxation.svg";
import RelaxedReading from "~/assets/relaxed-reading.svg";
import RideABicycle from "~/assets/ride-a-bicycle.svg";
import RoadSign from "~/assets/road-sign.svg";
import Settings from "~/assets/settings.svg";
import Skateboard from "~/assets/skateboard.svg";
import Studying from "~/assets/studying.svg";
import SuperThankYou from "~/assets/super-thank-you.svg";
import Thoughts from "~/assets/thoughts.svg";
import ThroughThePark from "~/assets/through-the-park.svg";
import Traveling from "~/assets/traveling.svg";
import TreeSwing from "~/assets/tree-swing.svg";
import WalkingInRain from "~/assets/walking-in-rain.svg";
import WalkingOutside from "~/assets/walking-outside.svg";
import WalkingTogether from "~/assets/walking-together.svg";
import Walking from "~/assets/walking.svg";
import Yoga from "~/assets/yoga.svg";

/**
 * Bildtypen für die App
 */
export type ImageKey = 
  | 'a-day-at-the-park'
  | 'a-day-off'
  | 'among-nature'
  | 'baby'
  | 'barista'
  | 'beach-day'
  | 'buddies'
  | 'chilling'
  | 'city-life'
  | 'coffee-with-friends'
  | 'contract'
  | 'counting-stars'
  | 'country-side'
  | 'dog-walking'
  | 'dreamer'
  | 'eating-together'
  | 'effortless-love'
  | 'everyday-design'
  | 'exams'
  | 'explore'
  | 'family'
  | 'fireworks'
  | 'friends'
  | 'fun-moments'
  | 'gardening'
  | 'good-doggy'
  | 'hiking'
  | 'in-the-office'
  | 'late-at-night'
  | 'learning-sketchingsh'
  | 'living'
  | 'location-search'
  | 'logic'
  | 'login'
  | 'lost'
  | 'mindfulness'
  | 'my-current-location'
  | 'my-universe'
  | 'neighbors'
  | 'on-the-way'
  | 'online-learning'
  | 'ordinary-day'
  | 'our-neighborhood'
  | 'outdoors'
  | 'page-not-found'
  | 'passing-by'
  | 'people'
  | 'playing-fetch'
  | 'quality-time'
  | 'quiet-street'
  | 'quiet-town'
  | 'reading-a-book'
  | 'reading-time'
  | 'relax-mode'
  | 'relaxation'
  | 'relaxed-reading'
  | 'ride-a-bicycle'
  | 'road-sign'
  | 'settings'
  | 'skateboard'
  | 'studying'
  | 'super-thank-you'
  | 'thoughts'
  | 'through-the-park'
  | 'traveling'
  | 'tree-swing'
  | 'walking-in-rain'
  | 'walking-outside'
  | 'walking-together'
  | 'walking'
  | 'yoga'
  | 'placeholder';

/**
 * Zentrale Bild-Registry
 * Mappt Bildschlüssel auf entsprechende SVG-Komponenten
 */
export const SvgRegistry: Record<ImageKey, React.ComponentType<any>> = {
  'a-day-at-the-park': ADayAtThePark,
  'a-day-off': ADayOff,
  'among-nature': AmongNature,
  'baby': Baby,
  'barista': Barista,
  'beach-day': BeachDay,
  'buddies': Buddies,
  'chilling': Chilling,
  'city-life': CityLife,
  'coffee-with-friends': CoffeeWithFriends,
  'contract': Contract,
  'counting-stars': CountingStars,
  'country-side': CountrySide,
  'dog-walking': DogWalking,
  'dreamer': Dreamer,
  'eating-together': EatingTogether,
  'effortless-love': EffortlessLove,
  'everyday-design': EverydayDesign,
  'exams': Exams,
  'explore': Explore,
  'family': Family,
  'fireworks': Fireworks,
  'friends': Friends,
  'fun-moments': FunMoments,
  'gardening': Gardening,
  'good-doggy': GoodDoggy,
  'hiking': Hiking,
  'in-the-office': InTheOffice,
  'late-at-night': LateAtNight,
  'learning-sketchingsh': LearningSketchingsh,
  'living': Living,
  'location-search': LocationSearch,
  'logic': Logic,
  'login': Login,
  'lost': Lost,
  'mindfulness': Mindfulness,
  'my-current-location': MyCurrentLocation,
  'my-universe': MyUniverse,
  'neighbors': Neighbors,
  'on-the-way': OnTheWay,
  'online-learning': OnlineLearning,
  'ordinary-day': OrdinaryDay,
  'our-neighborhood': OurNeighborhood,
  'outdoors': Outdoors,
  'page-not-found': PageNotFound,
  'passing-by': PassingBy,
  'people': People,
  'playing-fetch': PlayingFetch,
  'quality-time': QualityTime,
  'quiet-street': QuietStreet,
  'quiet-town': QuietTown,
  'reading-a-book': ReadingABook,
  'reading-time': ReadingTime,
  'relax-mode': RelaxMode,
  'relaxation': Relaxation,
  'relaxed-reading': RelaxedReading,
  'ride-a-bicycle': RideABicycle,
  'road-sign': RoadSign,
  'settings': Settings,
  'skateboard': Skateboard,
  'studying': Studying,
  'super-thank-you': SuperThankYou,
  'thoughts': Thoughts,
  'through-the-park': ThroughThePark,
  'traveling': Traveling,
  'tree-swing': TreeSwing,
  'walking-in-rain': WalkingInRain,
  'walking-outside': WalkingOutside,
  'walking-together': WalkingTogether,
  'walking': Walking,
  'yoga': Yoga,
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