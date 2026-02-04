import { Store } from "@tanstack/react-store";

type GreetingsState = {
  greetings?: string;
};

const store = new Store<GreetingsState>({
  greetings: undefined,
});

export { store, type GreetingsState };
