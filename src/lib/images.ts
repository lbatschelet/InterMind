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
import Analyze from "~/assets/analyze.svg";
import Art from "~/assets/art.svg";
import Baby from "~/assets/baby.svg";
import Barista from "~/assets/barista.svg";
import BeachDay from "~/assets/beach-day.svg";
import Blooming from "~/assets/blooming.svg";
import BreakingBarriers from "~/assets/breaking-barriers.svg";
import Buddies from "~/assets/buddies.svg";
import Chilling from "~/assets/chilling.svg";
import Circles from "~/assets/circles.svg";
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
import Expecting from "~/assets/expecting.svg";
import Explore from "~/assets/explore.svg";
import Family from "~/assets/family.svg";
import Fatherhood from "~/assets/fatherhood.svg";
import Fireworks from "~/assets/fireworks.svg";
import FootballWithDad from "~/assets/football-with-dad.svg";
import Friends from "~/assets/friends.svg";
import FunMoments from "~/assets/fun-moments.svg";
import Gardening from "~/assets/gardening.svg";
import GoodDoggy from "~/assets/good-doggy.svg";
import HeavyBox from "~/assets/heavy-box.svg";
import Hiking from "~/assets/hiking.svg";
import ICanFly from "~/assets/i-can-fly.svg";
import InTheOffice from "~/assets/in-the-office.svg";
import InThought from "~/assets/in-thought.svg";
import Injured from "~/assets/injured.svg";
import LateAtNight from "~/assets/late-at-night.svg";
import LearningSketchingsh from "~/assets/learning-sketchingsh.svg";
import LikeDislike from "~/assets/like-dislike.svg";
import Living from "~/assets/living.svg";
import LocationSearch from "~/assets/location-search.svg";
import Logic from "~/assets/logic.svg";
import Login from "~/assets/login.svg";
import Lost from "~/assets/lost.svg";
import MakingArt from "~/assets/making-art.svg";
import Mindfulness from "~/assets/mindfulness.svg";
import Motherhood from "~/assets/motherhood.svg";
import MyCurrentLocation from "~/assets/my-current-location.svg";
import MyUniverse from "~/assets/my-universe.svg";
import Neighbors from "~/assets/neighbors.svg";
import OnTheWay from "~/assets/on-the-way.svg";
import OnlineLearning from "~/assets/online-learning.svg";
import OpenSource from "~/assets/open-source.svg";
import Opinion from "~/assets/opinion.svg";
import OrdinaryDay from "~/assets/ordinary-day.svg";
import OurNeighborhood from "~/assets/our-neighborhood.svg";
import Outdoors from "~/assets/outdoors.svg";
import PageNotFound from "~/assets/page-not-found.svg";
import PassingBy from "~/assets/passing-by.svg";
import People from "~/assets/people.svg";
import PizzaSharing from "~/assets/pizza-sharing.svg";
import PlayTime from "~/assets/play-time.svg";
import PlayingFetch from "~/assets/playing-fetch.svg";
import QualityTime from "~/assets/quality-time.svg";
import Questions from "~/assets/questions.svg";
import QuietStreet from "~/assets/quiet-street.svg";
import QuietTown from "~/assets/quiet-town.svg";
import ReadingABook from "~/assets/reading-a-book.svg";
import ReadingTime from "~/assets/reading-time.svg";
import RelaxMode from "~/assets/relax-mode.svg";
import Relaxation from "~/assets/relaxation.svg";
import RelaxedReading from "~/assets/relaxed-reading.svg";
import Reminders from "~/assets/reminders.svg";
import RideABicycle from "~/assets/ride-a-bicycle.svg";
import RoadSign from "~/assets/road-sign.svg";
import Sculpting from "~/assets/sculpting.svg";
import Searching from "~/assets/searching.svg";
import Settings from "~/assets/settings.svg";
import Skateboard from "~/assets/skateboard.svg";
import Studying from "~/assets/studying.svg";
import SuperThankYou from "~/assets/super-thank-you.svg";
import TakingSelfie from "~/assets/taking-selfie.svg";
import Thoughts from "~/assets/thoughts.svg";
import ThroughThePark from "~/assets/through-the-park.svg";
import ToyCar from "~/assets/toy-car.svg";
import Traveling from "~/assets/traveling.svg";
import TreeSwing from "~/assets/tree-swing.svg";
import UnexpectedFriends from "~/assets/unexpected-friends.svg";
import WalkingInRain from "~/assets/walking-in-rain.svg";
import WalkingOutside from "~/assets/walking-outside.svg";
import WalkingTogether from "~/assets/walking-together.svg";
import Walking from "~/assets/walking.svg";
import Welcoming from "~/assets/welcoming.svg";
import Yoga from "~/assets/yoga.svg";

/**
 * Bildtypen für die App
 */
export type ImageKey = 
  | 'a-day-at-the-park'
  | 'a-day-off'
  | 'among-nature'
  | 'analyze'
  | 'art'
  | 'baby'
  | 'barista'
  | 'beach-day'
  | 'blooming'
  | 'breaking-barriers'
  | 'buddies'
  | 'chilling'
  | 'circles'
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
  | 'expecting'
  | 'explore'
  | 'family'
  | 'fatherhood'
  | 'fireworks'
  | 'football-with-dad'
  | 'friends'
  | 'fun-moments'
  | 'gardening'
  | 'good-doggy'
  | 'heavy-box'
  | 'hiking'
  | 'i-can-fly'
  | 'in-the-office'
  | 'in-thought'
  | 'injured'
  | 'late-at-night'
  | 'learning-sketchingsh'
  | 'like-dislike'
  | 'living'
  | 'location-search'
  | 'logic'
  | 'login'
  | 'lost'
  | 'making-art'
  | 'mindfulness'
  | 'motherhood'
  | 'my-current-location'
  | 'my-universe'
  | 'neighbors'
  | 'on-the-way'
  | 'online-learning'
  | 'open-source'
  | 'opinion'
  | 'ordinary-day'
  | 'our-neighborhood'
  | 'outdoors'
  | 'page-not-found'
  | 'passing-by'
  | 'people'
  | 'pizza-sharing'
  | 'play-time'
  | 'playing-fetch'
  | 'quality-time'
  | 'questions'
  | 'quiet-street'
  | 'quiet-town'
  | 'reading-a-book'
  | 'reading-time'
  | 'relax-mode'
  | 'relaxation'
  | 'relaxed-reading'
  | 'reminders'
  | 'ride-a-bicycle'
  | 'road-sign'
  | 'sculpting'
  | 'searching'
  | 'settings'
  | 'skateboard'
  | 'studying'
  | 'super-thank-you'
  | 'taking-selfie'
  | 'thoughts'
  | 'through-the-park'
  | 'toy-car'
  | 'traveling'
  | 'tree-swing'
  | 'unexpected-friends'
  | 'walking-in-rain'
  | 'walking-outside'
  | 'walking-together'
  | 'walking'
  | 'welcoming'
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
  'analyze': Analyze,
  'art': Art,
  'baby': Baby,
  'barista': Barista,
  'beach-day': BeachDay,
  'blooming': Blooming,
  'breaking-barriers': BreakingBarriers,
  'buddies': Buddies,
  'chilling': Chilling,
  'circles': Circles,
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
  'expecting': Expecting,
  'explore': Explore,
  'family': Family,
  'fatherhood': Fatherhood,
  'fireworks': Fireworks,
  'football-with-dad': FootballWithDad,
  'friends': Friends,
  'fun-moments': FunMoments,
  'gardening': Gardening,
  'good-doggy': GoodDoggy,
  'heavy-box': HeavyBox,
  'hiking': Hiking,
  'i-can-fly': ICanFly,
  'in-the-office': InTheOffice,
  'in-thought': InThought,
  'injured': Injured,
  'late-at-night': LateAtNight,
  'learning-sketchingsh': LearningSketchingsh,
  'like-dislike': LikeDislike,
  'living': Living,
  'location-search': LocationSearch,
  'logic': Logic,
  'login': Login,
  'lost': Lost,
  'making-art': MakingArt,
  'mindfulness': Mindfulness,
  'motherhood': Motherhood,
  'my-current-location': MyCurrentLocation,
  'my-universe': MyUniverse,
  'neighbors': Neighbors,
  'on-the-way': OnTheWay,
  'online-learning': OnlineLearning,
  'open-source': OpenSource,
  'opinion': Opinion,
  'ordinary-day': OrdinaryDay,
  'our-neighborhood': OurNeighborhood,
  'outdoors': Outdoors,
  'page-not-found': PageNotFound,
  'passing-by': PassingBy,
  'people': People,
  'pizza-sharing': PizzaSharing,
  'play-time': PlayTime,
  'playing-fetch': PlayingFetch,
  'quality-time': QualityTime,
  'questions': Questions,
  'quiet-street': QuietStreet,
  'quiet-town': QuietTown,
  'reading-a-book': ReadingABook,
  'reading-time': ReadingTime,
  'relax-mode': RelaxMode,
  'relaxation': Relaxation,
  'relaxed-reading': RelaxedReading,
  'reminders': Reminders,
  'ride-a-bicycle': RideABicycle,
  'road-sign': RoadSign,
  'sculpting': Sculpting,
  'searching': Searching,
  'settings': Settings,
  'skateboard': Skateboard,
  'studying': Studying,
  'super-thank-you': SuperThankYou,
  'taking-selfie': TakingSelfie,
  'thoughts': Thoughts,
  'through-the-park': ThroughThePark,
  'toy-car': ToyCar,
  'traveling': Traveling,
  'tree-swing': TreeSwing,
  'unexpected-friends': UnexpectedFriends,
  'walking-in-rain': WalkingInRain,
  'walking-outside': WalkingOutside,
  'walking-together': WalkingTogether,
  'walking': Walking,
  'welcoming': Welcoming,
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