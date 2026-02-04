import { client } from "@/api/client";

const getGreetings = () =>
  client.get<string>("/greetings").then((res) => res.data);

export const greetingsApi = { getGreetings };
