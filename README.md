# Airtable Eazydocs Block by [Superblocks.at](https://superblocks.at)

## About the Block

Create rich text guides and manuals for your workflow and base, with embedded videos, images and a table of contents.

## Screenshot

![Eazydocs block](https://superblocks.at/superdocs-block-screenshot-1/)

## Implementation Details

This block is based on the excellent [tinymce](https://www.tiny.cloud/) rich text editor.

## Worth Checking Out

- The use of the excellent [react-frame-component](https://www.npmjs.com/package/react-frame-component) in [EazydocsBlock.js](frontend/EazydocsBlock.js) for rendering the rich text html output inside an iframe to avoid style interferences.

- The use and implementation of [react error boundaries](https://reactjs.org/docs/error-boundaries.html) in [Superblocks.js](frontend/Superblocks.js) and [ErrorBoundary.js](frontend/ErrorBoundary.js) to catch and display errors that occur during rendering.

- The interception of clicking on links to views and records in the current base and the use of [Cursor.setActiveView](https://airtable.com/developers/blocks/api/models/Cursor) in [EazydocsBlock.js](frontend/EazydocsBlock.js)

- The SuperblocksFooter static footer component in [Superblocks.js](frontend/Superblocks.js)

## License
Eazydocs - [MIT](LICENSE) - use it in any way you see fit, without limitations.

Tinymce - [LGPL](https://github.com/tinymce/tinymce/blob/develop/LICENSE.TXT)

[Edit Icon](https://fontawesome.com/icons/edit?style=solid) by [Font Awesome](https://fontawesome.com/) - [Creative Commons Attribution 4.0 International license](https://fontawesome.com/license)
