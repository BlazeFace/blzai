export interface ITopics {
  topic: string;
  subtopics: string[];
}

export interface ICards {
  products: string[];
}

export interface ITopicGrid {
  subtopic: string;
  urls: string[];
}

export interface IGlobalState {
  cdn: string;
}

export interface IStateWrapper {
  global: IGlobalState;
  topics: ITopics[];
  photos: Map<string, string[]>;
  cards: ICards;
}
