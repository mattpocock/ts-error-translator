import { Tip } from './tips';

type MaybeArray<T> = T | T[];

export type TipInfo = {
  [Type in Tip['type']]: {
    name: string;
    message?: string;
    deps?: MaybeArray<Exclude<Tip['type'], Type>>;
  };
};

export const tipInfo: TipInfo = {
  'spread-into-tuple-type': {
    name: 'Spread into Tuple type',
    deps: 'tuple-type',
  },
  'declare-global': {
    name: 'Declare global',
    message: `Declare global is a way to extend the global scope of your project. It's useful for adding types to global variables that are not defined in your project.`,
  },
  'interface-window-in-declare-global': {
    name: 'Window interface',
    message: `This pattern lets you extend the Window interface to`,
    deps: 'declare-global',
  },
  'passing-generics-to-types': {
    name: 'Passing Generics to Types',
    message: 'You can pass generics to types to make them do different things.',
  },
  'promise-type': {
    name: 'Promise type',
    message:
      'You can use the Promise type to represent a Promise in TypeScript.',
    deps: ['passing-generics-to-types'],
  },
  'type-alias-with-generics': {
    name: 'Generics in types',
    deps: ['type-alias-declaration'],
    message: `You can use generics in types to make them more flexible. It turns them into a kind of function, which can return different types depending on what you pass in.`,
  },
  'type-alias-with-multiple-generics': {
    name: 'Multiple generics in types/types',
    deps: ['type-alias-with-generics', 'type-alias-declaration'],
    message: `You can pass multiple generics to types.`,
  },
  'tuple-type': {
    name: 'Tuple type',
  },
  'number-indexed-access': {
    name: 'Array member access',
    message:
      'You can use the number keyword to create a union type of all the members of an array.',
  },
  'function-return-type': {
    name: 'Function return type',
    message: `This is a function return type. It tells the function what type it should return.`,
  },
  'interface-declaration': {
    name: 'Interface declaration',
    message: `This is an interface declaration. It's like a type alias, but it can be extended.`,
  },
  'optional-object-property': {
    name: 'Optional Object Property',
    message: `The question mark next to this object property means that it's optional - it doesn't need to be specified on this object.`,
  },
  'readonly-object-property': {
    name: 'Readonly Object Property',
    message: `The readonly keyword means that this property can't be changed after it's been set.`,
  },
  'type-alias-declaration': {
    name: 'Type Keyword',
    message: `This is a type alias. It's like an interface, but it can't be extended - and it can represent things that interfaces can't.`,
  },
  'variable-type-annotation': {
    name: 'Variable type annotation',
    message: `This annotation tells the variable what type it should be.`,
  },
  'conditional-type': {
    name: 'Conditional type',
    message: `This is a conditional type. It's a kind of if-else logic in TypeScript, but at the type level.`,
  },
  'nested-conditional-type': {
    name: 'Nested conditional type',
    message: `Conditional types can be nested in TypeScript!`,
    deps: ['conditional-type'],
  },
  'k-in-keyof': {
    name: 'keyof in Mapped Types',
    deps: ['mapped-type'],
  },
  'generic-slots-in-functions': {
    name: 'Generics in functions',
  },
  'interface-with-generics': {
    name: 'Generics in interfaces',
    deps: ['interface-declaration'],
    message: `You can use generics in interfaces to make them more flexible. It turns them into a kind of function, which can return different types depending on what you pass in.`,
  },
  'interface-with-multiple-generics': {
    name: 'Multiple generics in types/interfaces',
    deps: ['interface-with-generics', 'interface-declaration'],
    message: `You can pass multiple generics to interfaces.`,
  },
  'mapped-type': {
    name: 'Mapped types',
    message:
      'You can use a mapped type to create objects by iterating over keys.',
  },
  'multiple-generic-slots-in-functions': {
    name: 'Multiple generics in functions',
    deps: ['generic-slots-in-functions'],
  },
};
