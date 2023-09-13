# Change Log

## 0.10.1

### Patch Changes

- [`bd9ff4b`](https://github.com/mattpocock/ts-error-translator/commit/bd9ff4bbce29eae48535a5bfed03628c681d296f) Thanks [@mattpocock](https://github.com/mattpocock)! - Added 19 more translations.

## 0.10.0

### Minor Changes

- [`2279946`](https://github.com/mattpocock/ts-error-translator/commit/2279946a233c64d7f4c7fa7aa131ecba690ddedf) Thanks [@mattpocock](https://github.com/mattpocock)! - Made it so the error translator only translates errors, not low-priority messages like unused variables.

### Patch Changes

- [`1d09c62`](https://github.com/mattpocock/ts-error-translator/commit/1d09c6277d85afcef6cc363479928467795add56) Thanks [@mattpocock](https://github.com/mattpocock)! - Added new translations and updated old ones with links.

## 0.9.2

### Patch Changes

- [`cafffd8`](https://github.com/mattpocock/ts-error-translator/commit/cafffd899b5394bac74ddaa99d648afa98875b55) Thanks [@mattpocock](https://github.com/mattpocock)! - Added a link for property does not exist on type.

## 0.9.1

### Patch Changes

- [`95cc3b2`](https://github.com/mattpocock/ts-error-translator/commit/95cc3b29c2daac086d6eb17178c65d652afa9154) Thanks [@mattpocock](https://github.com/mattpocock)! - Removed a now-redundant option from the options registered with VSCode.

## 0.9.0

### Minor Changes

- [`6d17789`](https://github.com/mattpocock/ts-error-translator/commit/6d1778991e8c2703d510bd1d6a4766213505be90) Thanks [@mattpocock](https://github.com/mattpocock)! - Removed the ability to see a full translation on the website. This might be added back in the future when migrated over to TT.

- [#176](https://github.com/mattpocock/ts-error-translator/pull/176) [`fbc8e2d`](https://github.com/mattpocock/ts-error-translator/commit/fbc8e2d61b424eb5e6ea2e895769540a2de039a5) Thanks [@mattpocock](https://github.com/mattpocock)! - Removed ability to remove the TLDR translations. All translations now always show the TLDR.

- [#176](https://github.com/mattpocock/ts-error-translator/pull/176) [`fbc8e2d`](https://github.com/mattpocock/ts-error-translator/commit/fbc8e2d61b424eb5e6ea2e895769540a2de039a5) Thanks [@mattpocock](https://github.com/mattpocock)! - Removed the 'contribute' button, and added a 'request translation' button.

  From Matt - I wanted to ensure that all the translations on the vscode extension were high-quality and of one voice, but I ended up not having enough time to edit the translations that came in.

  I think it's a cleaner flow to let folks simply request translations, and I can provide them - instead of going through multiple review rounds discussing corrections.

- [#174](https://github.com/mattpocock/ts-error-translator/pull/174) [`ee7a736`](https://github.com/mattpocock/ts-error-translator/commit/ee7a7360a78f920e19c45efeb4d59a65973bc55b) Thanks [@mattpocock](https://github.com/mattpocock)! - Removed ability to show full body explanation of error

## 0.8.0

### Minor Changes

- [`b0c683d`](https://github.com/mattpocock/ts-error-translator/commit/b0c683d2dae4172876157bd9624ae1c198bf5be6) Thanks [@mattpocock](https://github.com/mattpocock)! - Updated icon

### Patch Changes

- [`b0c683d`](https://github.com/mattpocock/ts-error-translator/commit/b0c683d2dae4172876157bd9624ae1c198bf5be6) Thanks [@mattpocock](https://github.com/mattpocock)! - Added bigint type

- [`605ae4a`](https://github.com/mattpocock/ts-error-translator/commit/605ae4aba085c498024d3adca4f3c29d8624e856) Thanks [@mattpocock](https://github.com/mattpocock)! - Removed tips which didn't have messages attached

## 0.7.3

### Patch Changes

- [`4421c57`](https://github.com/mattpocock/ts-error-translator/commit/4421c574fd56e59849964542502720ed8418af64) Thanks [@mattpocock](https://github.com/mattpocock)! - Fixed a bug where union type would be extracted twice

## 0.7.0

### Minor Changes

- [`7fbe7ca`](https://github.com/mattpocock/ts-error-translator/commit/7fbe7caefa36aef2391c49890ec23e2c8bf4128a) Thanks [@mattpocock](https://github.com/mattpocock)! - Added the ability to see hints on unknown syntax in your TypeScript code.

  <img src="https://raw.githubusercontent.com/mattpocock/ts-error-translator/main/assets/hint-screenshot.png" alt="A TypeScript hint showing in a VSCode document" />

  Currently opt-out.

## 0.5.3

### Patch Changes

- [#97](https://github.com/mattpocock/ts-error-translator/pull/97) [`5381d03`](https://github.com/mattpocock/ts-error-translator/commit/5381d0340b35d0fb43b21dc992cca98bffa9e4fb) Thanks [@mattpocock](https://github.com/mattpocock)! - Allowed the ts extension to also run in js and jsx files

## 0.5.2

### Patch Changes

- [`bd4b32b`](https://github.com/mattpocock/ts-error-translator/commit/bd4b32b15796a453d4e75912678b7892b74585f9) Thanks [@mattpocock](https://github.com/mattpocock)! - Fixed a bug where {0} (without quotes) in excerpt was not translated

## 0.5.1

### Patch Changes

- [`89e37ba`](https://github.com/mattpocock/ts-error-translator/commit/89e37ba4591fae85219311efe55db5f146af627e) Thanks [@mattpocock](https://github.com/mattpocock)! - Fixed a bug where the full translation showed by default

## 0.5.0

### Minor Changes

- [#89](https://github.com/mattpocock/ts-error-translator/pull/89) [`e14f25e`](https://github.com/mattpocock/ts-error-translator/commit/e14f25e44ee94216d5ff09a490f623c4dcfefb45) Thanks [@Princesseuh](https://github.com/Princesseuh)! - Add support for Astro files

## 0.4.0

### Minor Changes

- [#86](https://github.com/mattpocock/ts-error-translator/pull/86) [`5749899`](https://github.com/mattpocock/ts-error-translator/commit/5749899febea95d7388029f217412ba26dad9207) Thanks [@mattpocock](https://github.com/mattpocock)! - Removed whitespace from body-and-tldr display mode, making things more compact and easier to scan.

## 0.3.2

### Patch Changes

- [`a274a70`](https://github.com/mattpocock/ts-error-translator/commit/a274a706dbe59c6e0a016c6b36d290f498c16525) Thanks [@mattpocock](https://github.com/mattpocock)! - More errors added

## 0.3.1

### Patch Changes

- [#83](https://github.com/mattpocock/ts-error-translator/pull/83) [`6c29b64`](https://github.com/mattpocock/ts-error-translator/commit/6c29b640de019b59fe8c780a8cf139724a6c3efc) Thanks [@eddyw](https://github.com/eddyw)! - Correctly match duplicated matched parameters

## 0.3.0

### Minor Changes

- [`35a91f0`](https://github.com/mattpocock/ts-error-translator/commit/35a91f0d212a7fa7b1d49bc5b2f9eaa5519c01aa) Thanks [@mattpocock](https://github.com/mattpocock)! - Made the extension also work with Vue and Svelte

### Patch Changes

- [`57e588c`](https://github.com/mattpocock/ts-error-translator/commit/57e588c7ebccfc9e81f4c3143f7274d1ade9397b) Thanks [@mattpocock](https://github.com/mattpocock)! - More translations

* [`0eba595`](https://github.com/mattpocock/ts-error-translator/commit/0eba595ead2260de4911933e6cf75f5bae8e76d6) Thanks [@mattpocock](https://github.com/mattpocock)! - Tweak to existing errors

## 0.2.1

### Patch Changes

- [`21a2b5f`](https://github.com/mattpocock/ts-error-translator/commit/21a2b5f7463efb57ca41dc713051c8b6516a82e9) Thanks [@mattpocock](https://github.com/mattpocock)! - Got the extension ready for deploy on open-vsix

## 0.2.0

### Minor Changes

- [`6aab9bc`](https://github.com/mattpocock/ts-error-translator/commit/6aab9bc2a05e731e5b13821ab29958e56b94b65c) Thanks [@mattpocock](https://github.com/mattpocock)! - Improved the way that multiple errors display by simplifying the display and adding `<hr />` tags between them.

## 0.1.8

### Patch Changes

- [`fb85b4f`](https://github.com/mattpocock/ts-error-translator/commit/fb85b4f7f6ce2381a30c49a1fc55718f69b80de2) Thanks [@mattpocock](https://github.com/mattpocock)! - Enabled the extension for web

## 0.1.7

### Patch Changes

- [`211bfd8`](https://github.com/mattpocock/ts-error-translator/commit/211bfd83bc9fecbde5b3aabd9f0dd0153635b06e) Thanks [@mattpocock](https://github.com/mattpocock)! - Fixed a bug where the extension did not work in untitled files

## 0.1.6

### Patch Changes

- [`1354df5`](https://github.com/mattpocock/ts-error-translator/commit/1354df5ef4b3d0f24e47e85882b426b32e74b82f) Thanks [@mattpocock](https://github.com/mattpocock)! - More error translations

## 0.1.5

### Patch Changes

- [`61aea88`](https://github.com/mattpocock/ts-error-translator/commit/61aea880d0663ccad918982f5f8df5b5cad27ea1) Thanks [@mattpocock](https://github.com/mattpocock)! - Fixed a bug where the extension wouldn't work in .tsx files

## 0.1.4

### Patch Changes

- [`c8df4ae`](https://github.com/mattpocock/ts-error-translator/commit/c8df4aee5f9ff82eb53d0ed9670de81530f35da4) Thanks [@mattpocock](https://github.com/mattpocock)! - Added an error for 2761

## 0.1.3

### Patch Changes

- [`f3deed5`](https://github.com/mattpocock/ts-error-translator/commit/f3deed5851372a44f38277c3c9d32f2f22d644a3) Thanks [@mattpocock](https://github.com/mattpocock)! - Took down the compatible vscode engine to 1.50.0

## 0.1.2

### Patch Changes

- [`594fe08`](https://github.com/mattpocock/ts-error-translator/commit/594fe088353476d24129721a803f9b1f2f4fa6b5) Thanks [@mattpocock](https://github.com/mattpocock)! - Changed name of extension for easier searching

## 0.1.1

### Patch Changes

- [`fd85ee1`](https://github.com/mattpocock/ts-error-translator/commit/fd85ee18d20c302fa828d0b4646abf1b82e18a15) Thanks [@mattpocock](https://github.com/mattpocock)! - Readme tweak

## 0.1.0

### Minor Changes

- [`d306d4a`](https://github.com/mattpocock/ts-error-translator/commit/d306d4ab7c79e3667d23113f7d40debd8403f5c0) Thanks [@mattpocock](https://github.com/mattpocock)! - Made showing the TL;DR excerpt and the full body of the translated error configurable by these options:

  `"tsErrorTranslator.showFullTranslation": true`
  `"tsErrorTranslator.showTLDRTranslation": true`

## 0.0.4

### Patch Changes

- [`6bfb005`](https://github.com/mattpocock/ts-error-translator/commit/6bfb0053a0595fb617f9a2a4379ed505740ef211) Thanks [@mattpocock](https://github.com/mattpocock)! - Initial changelog

All notable changes to the "my-extension" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

- Initial release
