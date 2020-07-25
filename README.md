# Airtable Eazydocs block by [Superblocks](https://superblocks.at)

## Table of contents

- [About this block](#about-this-block)
- [Screenshot](#screenshot)
- [Installation](#installation)
- [License](#license)
- [Implementation details](#implementation-details)
- [Worth checking out](#worth-checking-out)
- [Looking for help with blocks development?](#looking-for-help-with-blocks-development?)
- [How to remix this block](#how-to-remix-this-block)

## About this block

Create rich text guides and manuals for your workflow and base, with embedded videos, images and a table of contents.

## Screenshot

![Eazydocs block](https://superblocks.at/superdocs-block-screenshot-1/)

## Installation

1. This is a custom block. To install custom blocks, you need to join Airtable's custom blocks developer preview, by filling [this form](https://airtable.com/shrEvq5IlQqYxWkaS).

2. Follow the instructions [here](https://airtable.com/developers/blocks/guides/hello-world-tutorial#create-a-new-block) to create a new block - and in _Start from an example_, choose the Eazydocs block

3. Install the block into your base by releasing it, using the following command:

```
block release
```

## License

Eazydocs - [MIT](LICENSE) - use it in any way you see fit, without limitations.

Tinymce - [LGPL](https://github.com/tinymce/tinymce/blob/develop/LICENSE.TXT)

[Edit Icon](https://fontawesome.com/icons/edit?style=solid) by [Font Awesome](https://fontawesome.com/) - [Creative Commons Attribution 4.0 International license](https://fontawesome.com/license)

## Implementation details

This block is based on the excellent [tinymce](https://www.tiny.cloud/) rich text editor.

## Worth checking out

- The use of the excellent [react-frame-component](https://www.npmjs.com/package/react-frame-component) in [EazydocsBlock.js](frontend/EazydocsBlock.js) for rendering the rich text html output inside an iframe to avoid style interferences.

- The use and implementation of [react error boundaries](https://reactjs.org/docs/error-boundaries.html) in [Superblocks.js](frontend/Superblocks.js) and [ErrorBoundary.js](frontend/ErrorBoundary.js) to catch and display errors that occur during rendering.

- The interception of clicking on links to views and records in the current base and the use of [Cursor.setActiveView](https://airtable.com/developers/blocks/api/models/Cursor) in [EazydocsBlock.js](frontend/EazydocsBlock.js)

- The SuperblocksFooter static footer component in [Superblocks.js](frontend/Superblocks.js)

## Looking for help with blocks development?

We at [Superblocks](https://superblocks.at) have already developed quite a few [blocks](https://superblocks.at/#blocks) and more are coming soon. We also offer extremely quick and reliable [block development services](https://superblocks.at/#services). Feel free to [contact us](https://superblocks.at/#services).

## How to remix this block

1. Create a new base (or you can use an existing base).

2. Create a new block in your base (see Create a new block, selecting "Remix from Github" as your template.

3. From the root of your new block, run block run.
