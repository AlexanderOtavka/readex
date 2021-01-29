export interface Nfa {
  executeStep(char: string): Nfa[];
  isMatch(): boolean;
}

export function executeNfa(nfa: Nfa, input: string): boolean {
  let currentStates: Nfa[] = [nfa];
  let nextStates: Nfa[] = [];
  for (const char of input) {
    if (currentStates.length === 0) {
      return false;
    }

    for (const state of currentStates) {
      nextStates.push(...state.executeStep(char));
      // TODO: Do we need to check that we don't somehow insert the same state twice?
      // https://swtch.com/~rsc/regexp/regexp1.html does, and I can't figure out why.
    }

    currentStates = nextStates;
    nextStates = [];
  }

  return currentStates.some((state) => state.isMatch());
}
