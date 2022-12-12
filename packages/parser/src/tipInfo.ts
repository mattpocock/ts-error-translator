import { Tip } from './tips';

type MaybeArray<T> = T | T[];

export type TipInfo = {
  [Type in Tip['type']]?: {
    name: string;
    message?: string;
    deps?: MaybeArray<Exclude<Tip['type'], Type>>;
    link: string;
  };
};

export const tipInfo: TipInfo = {
  'basic-types': {
    name: 'Basic Types',
    message: 'string, number and boolean are all basic types.',
    link: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#the-primitives-string-number-and-boolean',
  },
  'awaited-utility-type': {
    deps: 'passing-generics-to-types',
    name: 'Awaited utility type',
    message: `The Awaited utility type lets you get the type of a Promise's resolved value.`,
    link: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#awaitedtype',
  },
  'partial-utility-type': {
    deps: 'passing-generics-to-types',
    name: 'Partial utility type',
    message: `The Partial utility type lets you make all the properties of an object optional.`,
    link: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype',
  },
  'required-utility-type': {
    deps: 'passing-generics-to-types',
    name: 'Required utility type',
    message: `The Required utility type lets you make all the properties of an object required.`,
    link: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#requiredtype',
  },
  'readonly-utility-type': {
    deps: 'passing-generics-to-types',
    name: 'Readonly utility type',
    message: `The Readonly utility type lets you make all the properties of an object readonly.`,
    link: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype',
  },
  'omit-utility-type': {
    deps: 'passing-generics-to-types',
    name: 'Omit utility type',
    message: `The Omit utility type lets you create an object type by omitting a set of properties from another type.`,
    link: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys',
  },
  'exclude-utility-type': {
    deps: 'passing-generics-to-types',
    name: 'Exclude utility type',
    message: `The Exclude utility type lets you exclude some members of a union type.`,
    link: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#excludeuniontype-excludedmembers',
  },
  'extract-utility-type': {
    deps: 'passing-generics-to-types',
    name: 'Extract utility type',
    message: `The Extract utility type lets you extract some members of a union type.`,
    link: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#extracttype-union',
  },
  'nonnullable-utility-type': {
    deps: 'passing-generics-to-types',
    name: 'NonNullable utility type',
    message: `The NonNullable utility type lets you exclude null and undefined from a union type.`,
    link: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#nonnullabletype',
  },
  'record-utility-type': {
    deps: 'passing-generics-to-types',
    name: 'Record utility type',
    message: `The Record utility type lets you create an object type with a set of properties whose keys are of one type and whose values are of another type.`,
    link: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type',
  },
  'returntype-utility-type': {
    deps: 'passing-generics-to-types',
    name: 'ReturnType utility type',
    message: `The ReturnType utility type lets you get the return type of a function type.`,
    link: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype',
  },
  'lowercase-utility-type': {
    deps: 'passing-generics-to-types',
    name: 'Lowercase utility type',
    message: `The Lowercase utility type lets you convert a string literal type to a string literal type with all characters lowercase.`,
    link: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#lowercasestringtype',
  },
  'uppercase-utility-type': {
    deps: 'passing-generics-to-types',
    name: 'Uppercase utility type',
    message: `The Uppercase utility type lets you convert a string literal type to a string literal type with all characters uppercase.`,
    link: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#uppercasestringtype',
  },
  'parameters-utility-type': {
    deps: 'passing-generics-to-types',
    name: 'Parameters utility type',
    message: `The Parameters utility type lets you get the parameters of a function type.`,
    link: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterstype',
  },
  'pick-utility-type': {
    deps: 'passing-generics-to-types',
    name: 'Pick utility type',
    message: `The Pick utility type lets you create an object type by picking a set of properties from another type.`,
    link: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys',
  },
  'any-type': {
    name: 'Any Type',
    message: `any is a type that pauses type-checking on whatever it's assigned to.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any',
  },
  'array-type': {
    name: 'Array type',
    message:
      'This is an array type. It represents an array, which can be any length.',
    link: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays',
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
    link: 'https://www.typescriptlang.org/docs/handbook/2/types-from-types.html',
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
  },
  'type-alias-with-multiple-generics': {
    name: 'Multiple generics in types/types',
    deps: ['type-alias-with-generics', 'type-alias-declaration'],
    message: `You can pass multiple generics to types.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/generics.html',
  },
  'tuple-type': {
    name: 'Tuple type',
    message: `This is a tuple type. It represents an array with a fixed number of elements.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types',
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
  },
  'union-type': {
    name: 'Union type',
    message: `A union type is a type formed from two or more other types, representing values that may be any one of those types.`,
    link: `https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#defining-a-union-type`,
  },
  'as-assertion': {
    name: `'as' Type assertion`,
    message: `This is a type assertion. It's a way to tell TypeScript that you know better than it does what the type of something is.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions',
  },
  'ts-object-type': {
    name: 'Object type',
    message: `This is an object type. It's used to represent object types in TypeScript`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#object-types',
  },
  'type-predicate': {
    name: 'Type predicate',
    message: `This is a type predicate. It turns the function into a type guard which asserts this 'is' statement.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates',
  },
  'interface-declaration': {
    name: 'Interface declaration',
    message: `This is an interface declaration. It's like a type alias, but it can be extended.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces',
  },
  'never-keyword': {
    name: 'Never keyword',
    message: `This is the never keyword. It's a way to represent the type of something that should never occur.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-never-type',
  },
  'in-operator-narrowing': {
    name: 'In operator narrowing',
    message: `You can use the 'in' operator to narrow the type of a variable.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-in-operator-narrowing',
  },
  'non-null-expression': {
    name: 'Non-null expression',
    message: `You can postfix an expression with ! to tell TypeScript that you know it's not null or undefined. This works the same as an 'as' assertion.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#non-null-assertion-operator-postfix-',
  },
  'null-keyword': {
    name: 'Null keyword',
    message: `This is the null keyword. It's a way to represent the type of null.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#null-and-undefined',
  },
  'undefined-keyword': {
    name: 'Undefined keyword',
    message: `This is the undefined keyword. It's a way to represent the type of undefined.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#null-and-undefined',
  },
  'literal-type': {
    name: 'Literal type',
    message: `This is a literal type. It's a way to represent a specific value in TypeScript.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types',
  },
  'optional-object-property': {
    name: 'Optional Object Property',
    message: `The question mark next to this object property means that it's optional - it doesn't need to be specified on this object.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#optional-properties',
  },
  'readonly-object-property': {
    name: 'Readonly Object Property',
    message: `The readonly keyword means that this property can't be changed after it's been set.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties',
  },
  'type-alias-declaration': {
    name: 'Type Keyword',
    message: `This is a type alias. It's like an interface, but it can't be extended - and it can represent things that interfaces can't.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases',
  },
  'variable-type-annotation': {
    name: 'Variable type annotation',
    message: `This annotation tells the variable what type it should be.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-annotations-on-variables',
  },
  'typing-function-parameters': {
    name: 'Function parameter type annotation',
    message: `This annotation tells the function what type the parameter should be.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#parameter-type-annotations',
  },
  'conditional-type': {
    name: 'Conditional type',
    message: `This is a conditional type. It's a kind of if-else logic in TypeScript, but at the type level.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/conditional-types.html',
  },
  'nested-conditional-type': {
    name: 'Nested conditional type',
    message: `Conditional types can be nested in TypeScript!`,
    deps: ['conditional-type'],
    link: 'https://www.typescriptlang.org/docs/handbook/2/conditional-types.html',
  },
  'k-in-keyof': {
    name: 'keyof in Mapped Types',
    deps: ['mapped-type'],
    link: 'https://www.typescriptlang.org/docs/handbook/2/mapped-types.html',
  },
  keyof: {
    name: 'keyof',
    message: `The keyof operator takes a type and returns a union of its keys.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/keyof-types.html',
  },
  typeof: {
    name: 'typeof',
    message: `The typeof operator can be used to infer the type of a runtime construct.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/typeof-types.html',
  },
  'generic-slots-in-functions': {
    name: 'Generics in functions',
    message: `You can use generics in functions to infer types based on what you call your function with.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/generics.html',
  },
  'interface-with-generics': {
    name: 'Generics in interfaces',
    deps: ['interface-declaration'],
    message: `You can use generics in interfaces to make them more flexible. It turns them into a kind of function, which can return different types depending on what you pass in.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/generics.html',
  },
  'interface-with-multiple-generics': {
    name: 'Multiple generics in types/interfaces',
    deps: ['interface-with-generics', 'interface-declaration'],
    message: `You can pass multiple generics to interfaces.`,
    link: 'https://www.typescriptlang.org/docs/handbook/2/generics.html',
  },
  'mapped-type': {
    name: 'Mapped types',
    message:
      'You can use a mapped type to create objects by iterating over keys.',
    link: 'https://www.typescriptlang.org/docs/handbook/2/mapped-types.html',
  },
  'multiple-generic-slots-in-functions': {
    name: 'Multiple generics in functions',
    deps: ['generic-slots-in-functions'],
    link: 'https://www.typescriptlang.org/docs/handbook/2/generics.html',
  },
  'remapping-in-mapped-type': {
    name: "Key remapping via 'as'",
    deps: ['mapped-type'],
    link: 'https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as',
    message: 'You can remap keys in mapped types using the "as" keyword.',
  },
};
