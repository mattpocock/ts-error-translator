export type HintInstruction =
  | {
      type: 'includes';
      includes: string;
      hint: string;
    }
  | {
      type: 'regex';
      regex: RegExp;
      hint: string;
    };

export type TransformedHintInstruction = {
  type: 'regex';
  regex: RegExp;
  hint: string;
};

const hintNamespace = (() => {
  const hintInstructions: HintInstruction[] = [
    {
      type: 'includes',
      includes: ' not assignable to ',
      hint: `[Not Assignable To](https://totaltypescript.com/concepts/assignability): I expected one thing, but you passed another.`,
    },
    {
      type: 'includes',
      includes: 'parameter',
      hint: `[Parameters](https://totaltypescript.com/concepts/parameters) are the names you give to the variables that a function takes.`,
    },
    {
      type: 'regex',
      regex: /(?<!type )argument/gi,
      hint: `[Arguments](https://totaltypescript.com/concepts/arguments) are the values you pass to a function when you call it.`,
    },
    {
      type: 'includes',
      includes: 'Type argument',
      hint: `[Type Arguments](https://totaltypescript.com/concepts/type-arguments) are the types you pass to a generic type, function or class.`,
    },
    {
      type: 'includes',
      includes: ' used before its ',
      hint: `[Used Before Its](https://totaltypescript.com/concepts/used-before-declared): You tried to use something before you declared it.`,
    },
    {
      type: 'includes',
      includes: ` implicitly has an 'any' type`,
      hint: `[Implicit Any](https://totaltypescript.com/concepts/implicit-any): I couldn't figure out what type something is, so I defaulted it to \`any\`.`,
    },
    {
      type: 'includes',
      includes: `Unused '@ts-expect-error' directive`,
      hint: `You used a \`@ts-expect-error\`, but I didn't find any errors on the following line.`,
    },
    {
      type: 'includes',
      includes: 'Cannot assign to',
      hint: `You're trying to modify something that can't be modified.`,
    },
    {
      type: 'includes',
      includes: ' comparable to ',
      hint: `You'll usually see this error when you're trying to use 'as' to cast between two types that aren't compatible.`,
    },
    {
      type: 'includes',
      includes: `'React' refers to a UMD global`,
      hint: 'You either need to import React, or fix the `jsx` property of your `tsconfig.json`. [Full guide](https://www.totaltypescript.com/react-refers-to-a-umd-global).',
    },
    {
      type: 'includes',
      includes: `JSX.IntrinsicElements`,
      hint: '[JSX.IntrinsicElements](https://www.totaltypescript.com/what-is-jsx-intrinsicelements) is a type that describes the valid HTML elements you can use in JSX.',
    },
    {
      type: 'includes',
      includes: `does not exist on type 'JSX.IntrinsicElements'`,
      hint: `You're trying to use an HTML element that doesn't exist on React's types.`,
    },
  ];

  const transformedHintInstructions: TransformedHintInstruction[] =
    hintInstructions.map((instruction) => {
      if (instruction.type === 'includes') {
        return {
          hint: instruction.hint,
          type: 'regex',
          regex: new RegExp(instruction.includes, 'ig'),
        };
      }
      return instruction;
    });

  return {
    transformedHintInstructions,
  };
})();

export const findHintsInError = (err: string): string[] => {
  const hints: string[] = [];

  hintNamespace.transformedHintInstructions.forEach((instruction) => {
    if (instruction.type === 'regex') {
      if (instruction.regex.test(err)) {
        hints.push(instruction.hint);
      }
    }
  });

  return hints;
};
