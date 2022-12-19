import { Tip } from './tips';

type MaybeArray<T> = T | T[];
type Difficulty = 'easy' | 'not-easy';

export type TipInfoItem<Type extends Tip['type'] = Tip['type']> = {
  name: string;
  message?: string;
  deps?: MaybeArray<Exclude<Tip['type'], Type>>;
  link: string;
  difficulty: Difficulty;
};

export type TipInfo = {
  [Type in Tip['type']]?: TipInfoItem<Type>;
};

export const tipInfo: TipInfo = {
  'as-const': {
    name: 'Const assertions',
    message: `Const assertions let you mark an expression as deeply immutable. This means it gets narrowed to its narrowest possible type.`,
    difficulty: 'not-easy',
    link: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions',
  },
  'as-const-on-object': {
    name: 'Const assertions on objects',
    message: `Const assertions on objects let you mark an object as deeply immutable. This means its attributes get narrowed to their literal types.`,
    difficulty: 'not-easy',
    link: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions',
    deps: 'as-const',
  },
  infer: {
    name: 'Infer keyword',
    message: `The infer keyword lets you infer the type of a generic type parameter inside a conditional type.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types',
    deps: 'conditional-type',
    difficulty: 'not-easy',
  },
  'basic-types': {
    name: 'Basic Primitive Types',
    message: 'String, number and boolean are all basic primitive types.',
    link: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#the-primitives-string-number-and-boolean',
    difficulty: 'easy',
  },
  satisfies: {
    name: 'Satisfies',
    message:
      'The Satisfies operator lets you validate that a type of an expression matches some type, without changing the resulting type of that expression.',
    link: 'https://devblogs.microsoft.com/typescript/announcing-typescript-4-9-beta/#the-satisfies-operator',
    difficulty: 'not-easy',
  },
  'awaited-utility-type': {
    deps: 'passing-generics-to-types',
    name: 'Awaited utility type',
    message: `The Awaited utility type lets you get the type of a Promise's resolved value.`,
    link: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#awaitedtype',
    difficulty: 'not-easy',
  },
  'partial-utility-type': {
    deps: 'passing-generics-to-types',
    name: 'Partial utility type',
    message: `The Partial utility type lets you make all the properties of an object optional.`,
    link: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype',
    difficulty: 'not-easy',
  },
  'required-utility-type': {
    deps: 'passing-generics-to-types',
    name: 'Required utility type',
    message: `The Required utility type lets you make all the properties of an object required.`,
    link: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#requiredtype',
    difficulty: 'not-easy',
  },
  'readonly-utility-type': {
    deps: 'passing-generics-to-types',
    name: 'Readonly utility type',
    message: `The Readonly utility type lets you make all the properties of an object readonly. It's not possible to assign new values to the properties, it will result in a TypeScript warning`,
    link: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype',
    difficulty: 'not-easy',
  },
  'omit-utility-type': {
    deps: 'passing-generics-to-types',
    name: 'Omit utility type',
    message: `The Omit utility type lets you create an object type by omitting a set of properties from another type.`,
    link: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys',
    difficulty: 'not-easy',
  },
  'exclude-utility-type': {
    deps: 'passing-generics-to-types',
    name: 'Exclude utility type',
    message: `The Exclude utility type lets you exclude some members of a union type.`,
    link: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#excludeuniontype-excludedmembers',
    difficulty: 'not-easy',
  },
  'extract-utility-type': {
    deps: 'passing-generics-to-types',
    name: 'Extract utility type',
    message: `The Extract utility type lets you extract some members of a union type.`,
    link: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#extracttype-union',
    difficulty: 'not-easy',
  },
  'nonnullable-utility-type': {
    deps: 'passing-generics-to-types',
    name: 'NonNullable utility type',
    message: `The NonNullable utility type lets you exclude null and undefined from a union type.`,
    link: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#nonnullabletype',
    difficulty: 'not-easy',
  },
  'record-utility-type': {
    deps: 'passing-generics-to-types',
    name: 'Record utility type',
    message: `The Record utility type lets you create an object type with a set of properties whose keys are of one type and whose values are of another type.`,
    link: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type',
    difficulty: 'not-easy',
  },
  'returntype-utility-type': {
    deps: 'passing-generics-to-types',
    name: 'ReturnType utility type',
    message: `The ReturnType utility type lets you get the return type of a function type.`,
    link: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype',
    difficulty: 'not-easy',
  },
  'lowercase-utility-type': {
    deps: 'passing-generics-to-types',
    name: 'Lowercase utility type',
    message: `The Lowercase utility type lets you convert a string literal type to a string literal type with all characters lowercase.`,
    link: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#lowercasestringtype',
    difficulty: 'not-easy',
  },
  'uppercase-utility-type': {
    deps: 'passing-generics-to-types',
    name: 'Uppercase utility type',
    message: `The Uppercase utility type lets you convert a string literal type to a string literal type with all characters uppercase.`,
    link: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#uppercasestringtype',
    difficulty: 'not-easy',
  },
  'parameters-utility-type': {
    deps: 'passing-generics-to-types',
    name: 'Parameters utility type',
    message: `The Parameters utility type lets you get the parameters of a function type.`,
    link: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterstype',
    difficulty: 'not-easy',
  },
  'pick-utility-type': {
    deps: 'passing-generics-to-types',
    name: 'Pick utility type',
    message: `The Pick utility type lets you create an object type by picking a set of properties from another type.`,
    link: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys',
    difficulty: 'not-easy',
  },
  'any-type': {
    name: 'Any Type',
    message: `any is a type that pauses type-checking on whatever it's assigned to.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any',
    difficulty: 'easy',
  },
  'array-type': {
    name: 'Array type',
    message:
      'This is an array type. It represents an array, which can be any length.',
    link: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays',
    difficulty: 'easy',
  },
  // 'declare-global': {
  //   name: 'Declare global',
  //   message: `Declare global is a way to extend the global scope of your project. It's useful for adding types to global variables that are not defined in your project.`,
  // },
  // 'interface-window-in-declare-global': {
  //   name: 'Window interface',
  //   message: `This pattern lets you extend the Window interface to`,
  //   deps: 'declare-global',
  // },
  'passing-generics-to-types': {
    name: 'Passing Types to other Types',
    message: `Just like functions in JavaScript, you can pass types to other types as arguments. Just like functions, they then return other types.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/generics.html',
    difficulty: 'not-easy',
  },
  // 'promise-utility-type': {
  //   name: 'Promise type',
  //   message:
  //     'You can use the Promise type to represent a Promise in TypeScript.',
  //   deps: ['passing-generics-to-types'],
  // },
  'type-alias-with-generics': {
    name: 'Generics in types',
    deps: ['type-alias-declaration'],
    message: `You can use generics in types to make them more flexible. It turns them into a kind of function, which can return different types depending on what you pass in.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/generics.html',
    difficulty: 'not-easy',
  },
  'type-alias-with-multiple-generics': {
    name: 'Multiple generics in types/types',
    deps: ['type-alias-with-generics', 'type-alias-declaration'],
    message: `You can pass multiple generics to types.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/generics.html',
    difficulty: 'not-easy',
  },
  'tuple-type': {
    name: 'Tuple type',
    message: `This is a tuple type. It represents an array with a fixed number of elements.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types',
    difficulty: 'not-easy',
  },
  // 'number-indexed-access': {
  //   name: 'Array member access',
  //   message:
  //     'You can use the number keyword to create a union type of all the members of an array.',
  // },
  'function-return-type': {
    name: 'Function return type',
    message: `This is a function return type. It tells the function what type it should return.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#return-type-annotations',
    difficulty: 'easy',
  },
  'union-type': {
    name: 'Union type',
    message: `A union type is a type formed from two or more other types, representing values that may be any one of those types.`,
    link: `https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#defining-a-union-type`,
    difficulty: 'easy',
  },
  'as-assertion': {
    name: `'as' Type assertion`,
    message: `This is a type assertion. It's a way to tell TypeScript that you know better than it does what the type of something is.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions',
    difficulty: 'easy',
  },
  'ts-object-type': {
    name: 'Object type',
    message: `This is an object type. It's used to represent object types in TypeScript`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#object-types',
    difficulty: 'easy',
  },
  'type-predicate': {
    name: 'Type predicate',
    message: `This is a type predicate. It turns the function into a type guard which asserts this 'is' statement.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates',
    difficulty: 'not-easy',
  },
  'interface-declaration': {
    name: 'Interface declaration',
    message: `This is an interface declaration. It's like a type alias, but it can be extended.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces',
    difficulty: 'easy',
  },
  'never-keyword': {
    name: 'Never keyword',
    message: `This is the never keyword. It's a way to represent the type of something that should never occur.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-never-type',
    difficulty: 'not-easy',
  },
  'in-operator-narrowing': {
    name: 'In operator narrowing',
    message: `You can use the 'in' operator to narrow the type of a variable.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-in-operator-narrowing',
    difficulty: 'not-easy',
  },
  'non-null-expression': {
    name: 'Non-null expression',
    message: `You can postfix an expression with ! to tell TypeScript that you know it's not null or undefined. This works the same as an 'as' assertion.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#non-null-assertion-operator-postfix-',
    difficulty: 'not-easy',
  },
  'null-keyword': {
    name: 'Null keyword',
    message: `This is the null keyword. It's a way to represent the type of null.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#null-and-undefined',
    difficulty: 'easy',
  },
  'undefined-keyword': {
    name: 'Undefined keyword',
    message: `This is the undefined keyword. It's a way to represent the type of undefined.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#null-and-undefined',
    difficulty: 'easy',
  },
  'literal-type': {
    name: 'Literal type',
    message: `This is a literal type. It's a way to represent a specific value in TypeScript.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types',
    difficulty: 'easy',
  },
  'optional-object-property': {
    name: 'Optional Object Property',
    message: `The question mark next to this object property means that it's optional - it doesn't need to be specified on this object.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#optional-properties',
    difficulty: 'easy',
  },
  'readonly-object-property': {
    name: 'Readonly Object Property',
    message: `The readonly keyword means that this property can't be changed after it's been set.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties',
    difficulty: 'easy',
  },
  'type-alias-declaration': {
    name: 'Type Keyword',
    message: `This is a type alias. It's like an interface, but it can't be extended - and it can represent things that interfaces can't.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases',
    difficulty: 'easy',
  },
  'variable-type-annotation': {
    name: 'Variable type annotation',
    message: `This annotation tells the variable what type it should be.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-annotations-on-variables',
    difficulty: 'easy',
  },
  'typing-function-parameters': {
    name: 'Function parameter type annotation',
    message: `This annotation tells the function what type the parameter should be.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#parameter-type-annotations',
    difficulty: 'easy',
  },
  'conditional-type': {
    name: 'Conditional type',
    message: `This is a conditional type. It's a kind of if-else logic in TypeScript, but at the type level.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/conditional-types.html',
    difficulty: 'not-easy',
  },
  'nested-conditional-type': {
    name: 'Nested conditional type',
    message: `Conditional types can be nested in TypeScript!`,
    deps: ['conditional-type'],
    link: 'https://www.typescriptlang.org/docs/handbook/2/conditional-types.html',
    difficulty: 'not-easy',
  },
  'k-in-keyof': {
    name: 'keyof in Mapped Types',
    deps: ['mapped-type'],
    link: 'https://www.typescriptlang.org/docs/handbook/2/mapped-types.html',
    difficulty: 'not-easy',
  },
  keyof: {
    name: 'keyof',
    message: `The keyof operator takes a type and returns a union of its keys.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/keyof-types.html',
    difficulty: 'not-easy',
  },
  typeof: {
    name: 'typeof',
    message: `The typeof operator can be used to infer the type of a runtime construct.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/typeof-types.html',
    difficulty: 'not-easy',
  },
  'generic-slots-in-functions': {
    name: 'Generics in functions',
    message: `You can use generics in functions to infer types based on what you call your function with.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/generics.html',
    difficulty: 'not-easy',
  },
  'interface-with-generics': {
    name: 'Generics in interfaces',
    deps: ['interface-declaration'],
    message: `You can use generics in interfaces to make them more flexible. It turns them into a kind of function, which can return different types depending on what you pass in.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/generics.html',
    difficulty: 'not-easy',
  },
  'interface-with-multiple-generics': {
    name: 'Multiple generics in types/interfaces',
    deps: ['interface-with-generics', 'interface-declaration'],
    message: `You can pass multiple generics to interfaces.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/generics.html',
    difficulty: 'not-easy',
  },
  'mapped-type': {
    name: 'Mapped types',
    message:
      'You can use a mapped type to create objects by iterating over keys.',
    link: 'https://www.typescriptlang.org/docs/handbook/2/mapped-types.html',
    difficulty: 'not-easy',
  },
  'multiple-generic-slots-in-functions': {
    name: 'Multiple generics in functions',
    deps: ['generic-slots-in-functions'],
    link: 'https://www.typescriptlang.org/docs/handbook/2/generics.html',
    difficulty: 'not-easy',
  },
  'remapping-in-mapped-type': {
    name: "Key remapping via 'as'",
    deps: ['mapped-type'],
    link: 'https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as',
    message: 'You can remap keys in mapped types using the "as" keyword.',
    difficulty: 'not-easy',
  },
};
