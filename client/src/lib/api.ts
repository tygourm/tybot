import { HttpAgent, type HttpAgentConfig } from "@ag-ui/client";
import axios from "axios";
import applyCaseMiddleware from "axios-case-converter";

const createClient = (path?: string) =>
  applyCaseMiddleware(
    axios.create({ baseURL: `${import.meta.env.SERVER_URL}${path}` }),
  );

const createAgent = (config: Omit<HttpAgentConfig, "url">) =>
  new HttpAgent({
    url: `${import.meta.env.SERVER_URL}/agents/run`,
    debug: import.meta.env.DEV,
    ...config,
  });

export { createAgent, createClient };
