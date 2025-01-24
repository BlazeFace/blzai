import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params }) => {
  return {
    name: params.topic,
  };
};

export interface TopicPage {
  name: string;
}
