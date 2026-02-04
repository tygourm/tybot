import { useStore } from "@tanstack/react-store";

import { setGreetingsState } from "@/stores/greetings/actions";
import { greetings } from "@/stores/greetings/selectors";
import { store } from "@/stores/greetings/store";

const greetingsActions = { setGreetingsState };

const useGreetings = () => useStore(store, greetings);

export { greetingsActions, useGreetings };
