# HtmlToClipboard
Small JavaScript function to copy rich text or HTML code to clipboard.

## What does it do?
It copies html code (custom or from current selection) to your clipboard as rich text for pasting into WYSIWYG environments like Microsoft Word.

## How do I use it?
Create a new instance of the `HtmlToClipboard` object with some settings:
```html
<script>
var copyer = new HtmlToClipboard({
    listenOnCopy: true
});
</script>
<textarea>This is some <strong>formatted</strong> text.</textarea>
```
If you now select the text in the textarea and press `Ctrl + C / ⌘ + C`, the following will be copied to your clipboard:

This is some **formatted** text.

## Methods
`.copy([ data ])`

You might call the `copy` method on your initialized `copyer` to copy text to your clipboard.
If you don't provide any `data`, this is automatically fetched from your current selection.

The text will be rich text by default or the actual selected or given HTML code if you passed `true` as the `raw` option (see below).

If you set the `listenOnCopy` option to `true`, `copy()` will be called automatically if you hit your system's copy shortcut.

Remember that calling `copy()` manually will only have an effect if you call it as a consequence of user interaction (i. e. if the user clicked a button or used a keyboard shortcut).


## Options
### `limitTarget`

Can be a selector string or an `HTMLElement` instance. If the code to be copied is determined automatically via the current selection, the selected text will be limited to text inside the given element. Pass `null` (default) to not limit the selection boundaries.

#### Example:

HTML:
```html
<script>
var copyer = new HtmlToClipboard({
    limitTarget: ".yes"
});
</script>
<span class="no">This <em>won't</em> be selected.</span>
<span class="yes">This <em>will</em> be selected.</span>
<span class="no">This <em>won't</em> be selected.</span>
```

Output:
    
"This *won't* be selected. This *will* be selected. This *won't be* selected."

If you now select the *whole line* and call `copyer.copy()`, the copied text will only be: "This *will* be selected".

### `listenOnCopy`

`false` by default. If set to `true`, the function will listen for the document (or the `limitTarget`, if provided) to emit the `copy` event and automatically call the `copy()` method.

### `raw`
If set to true, the copied content will not be a formatted text but rather the pure HTML code.

## Compability

Works in latest versions of Firefox, Chrome, Opera and Edge. *Should* work in IE9 (didn't test), *does* definitely work in IE11.

Does *not* work in Safari due to missing `document.execCommand()` support.