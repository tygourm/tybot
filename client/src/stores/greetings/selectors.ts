import { type GreetingsState } from "@/stores/greetings/store";

const greetings = (state: GreetingsState) => state.greetings;

export { greetings };
