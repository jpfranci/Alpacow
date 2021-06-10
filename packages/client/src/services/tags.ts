import axios, { AxiosResponse } from "axios";

const baseUrl = "/api/tags";

type Tag = {
  name: string;
};

export const getDefaultTags = async () => {
  const results: AxiosResponse<Tag[]> = await axios.get(`${baseUrl}`);
  return results.data.map((result) => result.name);
};

export const searchByTag = async (tagFilter: string): Promise<string[]> => {
  const results: AxiosResponse<Tag[]> = await axios.get(
    `${baseUrl}?name_like=${tagFilter}`,
  );
  return results.data.map((result) => result.name);
};
