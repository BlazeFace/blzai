export interface ITopics {
    topic: string;
    subtopics: string[];
}

export interface ITopicGrid {
    subtopic: string;
    urls: string[];
}

export interface IStateWrapper {
    topics: ITopics[]
    photos: Map<string, string[]>
}


