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
import Contract from "~/assets/undraw_contract_upwc.svg";
import OurNeighborhood from "~/assets/undraw_our-neighborhood_s0n2.svg";
import Relaxation from "~/assets/undraw_relaxation_ies6.svg";
import EverydayDesign from "~/assets/undraw_everyday-design_4f7q.svg";
import LocationSearch from "~/assets/undraw_location-search_nesh.svg";

// Weitere SVG-Importe hier hinzufügen...
// import OtherSvg from "~/assets/other-svg.svg";

/**
 * Bildtypen für die App
 */
export type ImageKey = 
  | 'a-day-at-the-park'
  | 'contract'
  | 'our-neighborhood'
  | 'relaxation'
  | 'everyday-design'
  | 'location-search'
  // Weitere Bildschlüssel hier hinzufügen
  | 'placeholder';

/**
 * Zentrale Bild-Registry
 * Mappt Bildschlüssel auf entsprechende SVG-Komponenten
 */
export const SvgRegistry: Record<ImageKey, React.ComponentType<any>> = {
  'a-day-at-the-park': ADayAtThePark,
  'contract': Contract,
  'our-neighborhood': OurNeighborhood,
  'relaxation': Relaxation,
  'everyday-design': EverydayDesign,
  'location-search': LocationSearch,
  // Weitere SVG-Komponenten hier registrieren
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