export type Region = "mexico" | "sudamerica" | "centroamerica";

type DestinationCategory = "playas" | "montanas" | "historicas" | "aventura" | "naturaleza";

export interface Category {
  id: "all" | DestinationCategory;
  name: string;
  icon: string;
}

export interface Destination {
  id: string;
  slug: string;
  title: string;
  location: string;
  region: Region;
  category: DestinationCategory;
  categoryName: string;
  rating: string;
  season: string;
  budget: string;
  duration: string;
  weather: string;
  ambience: string;
  transport: string;
  shortDescription: string;
  fullBody: string;
  activities: string[];
  tips: string[];
  coords: string;
  image: string;
  gallery: [string, string, string];
  mapsUrl: string;
}
