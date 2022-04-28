# How do I Contribute 💪

We're excited to have you on board!

As you can see from the [tsErrorMessages.json](https://github.com/mattpocock/ts-error-translator/blob/main/packages/engine/src/tsErrorMessages.json),
there's a serious amount of work that needs to be done to cover every possible Typescript Error. And that's when the open-source community really shines.

Your contributions will eventually help save countless hours for people struggling with TypeScript error messages.

## Prerequisites
1. Node.js version installed, [latest LTS is recommended](https://nodejs.org/en/about/releases/)
2. Install [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable) (for installing npm dependencies, using yarn workspaces)

## How to start developing?

Clone the repo and install the needed dependencies for all the packages by following these steps:

```sh
git clone https://github.com/mattpocock/ts-error-translator.git
cd ts-error-translator
yarn
yarn dev # This will run the next app
```

## Adding/editing errors' translations

You'll find all of the errors' translations at `packages/engine/errors` and they follow the following conventions:

- Every file must be named with its error code: `<code>.md` (cause how it works is that there's a regex expression that matches your error message with the
defined ones and get the error code back then search for `<code>.md` to read the explanation for it).

> 💡 Hint: To find the code for the error you're looking for, have a look inside [`tsErrorMessages.json`](https://github.com/mattpocock/ts-error-translator/blob/main/packages/engine/src/tsErrorMessages.json),
> or check your console, you'll see this formatting `error TS<code>: <msg>`.

- You have to follow our template by running the following command. This will write an example file at `packages/engine/errors/<code>.md` with placeholders on how the explanation should be written.

```sh
yarn explain <code>
```

