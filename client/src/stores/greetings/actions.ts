import { type GreetingsState, store } from "@/stores/greetings/store";

const setGreetingsState = (state: Partial<GreetingsState>) =>
  store.setState((prevState) => ({ ...prevState, ...state }));

export { setGreetingsState };
