# How do I contribute? 💪

We're excited to have you on board!

As you can see from the [tsErrorMessages.json](https://github.com/mattpocock/ts-error-translator/blob/main/packages/engine/src/tsErrorMessages.json),
there's a serious amount of work that needs to be done to cover every possible Typescript Error. And that's when the open-source community really shines.

Your contributions will eventually help save countless hours for people struggling with TypeScript error messages.

## Prerequisites

1. Node.js version installed, [latest LTS is recommended](https://nodejs.org/en/about/releases/)
2. Install pnpm

### Using [devcontainer](https://code.visualstudio.com/docs/devcontainers/create-dev-container)

Devcontainers is an easy way to avoid "works on my machine" situations. Essentially, the development happens in a Docker container.

1. Make sure you've got Docker installed on your machine
2. Do install the recommended by VSCode extensions
3. Click "Reopen in Container" button in a popup

## How to start developing?

Clone the repo and install the needed dependencies for all the packages by following these steps:

```sh
git clone https://github.com/mattpocock/ts-error-translator.git
cd ts-error-translator
pnpm install
pnpm dev # This will run the next app
```

## Adding/editing error translations

You'll find all of the errors' translations at `packages/engine/errors` and they follow the following conventions:

- Every file must be named with its error code: `<code>.md`

> 💡 Hint: To find the code for the error you're looking for, have a look inside [`tsErrorMessages.json`](https://github.com/mattpocock/ts-error-translator/blob/main/packages/engine/src/tsErrorMessages.json),
> or check your console, you'll see this formatting `error TS<code>: <msg>`.

- You can follow our template by running the following command. This will write an example file at `packages/engine/errors/<code>.md` with placeholders on how the explanation should be written.

```sh
pnpm run translate <code>
```

## Translation style guide

### You are the compiler

Similar to Elm, you should address the user as though _you are the compiler_.

Bad:

`TypeScript thinks that this is a type, not a variable.`

Good:

`I think that this is a type, not a variable.`

### Speak to the user directly

In a similar vein, you should address the user directly whenever possible - this keeps it conversational and terse.

Bad:

`The code might have an unnecessary trailing comma.`

Good:

`You might have added an unnecessary trailing comma.`

### Don't use `{0}` and `{1}` in excerpts

Excerpts should always be short and sweet - `{0}` can expand to _enormous_ size and make even our pretty excerpts unreadable. You can use 'A' and 'B' instead if you like.

Bad:

`{0} can't be passed to a slot expecting {1}.`

Good:

`'A' can't be passed to a slot expecting 'B'.`
