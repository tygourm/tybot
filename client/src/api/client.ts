import { HttpAgent, type Message } from "@ag-ui/client";
import axios from "axios";

const createHttpClient = () =>
  axios.create({ baseURL: `${import.meta.env.SERVER_URL}/api` });

const createHttpAgent = (threadId?: string, initialMessages?: Message[]) =>
  new HttpAgent({
    url: `${import.meta.env.SERVER_URL}/api/agents/run`,
    debug: import.meta.env.DEV,
    initialMessages,
    threadId,
  });

export { createHttpAgent, createHttpClient };
