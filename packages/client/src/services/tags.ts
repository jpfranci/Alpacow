import axios, { AxiosResponse } from "axios";

const baseUrl = "/api/tags";

type Tag = {
  tag: string;
};

export const searchByTag = async (tagFilter: string): Promise<string[]> => {
  const results: AxiosResponse<Tag[]> = await axios.get(baseUrl, {
    params: {
      searchString: tagFilter,
    },
  });
  return results.data.map((result) => result.tag);
};
