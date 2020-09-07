# Webpack-File-Manager

Simple plugin to manage files before and after webpack compilation.

# Warining!

Both code and readme are work in progress, there may be some issues.

## Installation

Use npm like allways:

```typescript
npm install @rpgalski/webpack-file-manager --save-dev
```

## Usage

First import plugin:

```typescript
const WebpackFileManager = require("webpack-file-manager")
```

Then add it to your configuration:

```typescript
const config = {
	//...
	plugins: [
		new WebpackFileManager(options)
			.copy(srouce, target)
			.delete(target)
			.move(source, target)
			.copy(source, target, options)
			.move(source, target, /\.html$/)
			.delete(target, /\.js$/, options)
	]
	//...
}
```

## Configuration

First, when creating new instance of a plugin, you can pass optional 'options' object to overwrite default setting:

```typescript
{
  // create not existing target directories while movig/copying?
  createDir?: boolean = true,
  // overwrite existing target files while creating/moving/copying?
  overwrite?: boolean = true,
  // increment content of existing target files while creating/moving/copying?
  increment?: boolean = false,
  // run action after compilation?
  execute?: 'BEFORE' | 'AFTER' = 'BEFORE',
  // more logs in console!
  verbose?: boolean = false
  // no logs in the console!
  silent?: boolean = false
  // colorize logs?
  colors?: boolean = true
  // stop on error?
  throwError?: boolean = false
}
```

## Actions

Use create/move/copy/delete functions to define and chain actions. Each action can have target, actions like 'move' or 'copy' also have source object. Both source and target are strings, either absolute or relative to webpack's context. You can pass 'options' object while defining action to define custom configuration for your action. Configuration object used for defining action is subset one used while creating new instance and is optional. Copy/Move/Delete actions that points to directories can have specified regular expression that will change their behaviour. Those actions will look for files that match passed reg-exp instead of working on whole directories.

### Create

Let's you create file or directory.

```typescript
const config = {
	// .create( target: string )
	// .create( target: string, options )
	// .create( target: string, content: string )
	// .create( target: string, content: string, options )
	// .create( target: string, content: string, options )

	//...
	plugins: [
		new WebpackFileManager(options)
			// create a directory
			.create("C:/test")
			// create a file
			.create("C:/test/test1.txt", "Hello Webpack!")
			// create a file and set custom config
			.create("C:/test/test2.txt", "Hello Webpack!", { execute: "AFTER" })
	]
	//...
}
```

While creating new element plugin will check if content is passed. If so, it will create a file, otherwise it will create a directory. To create empty file simply put empty string ("") as content.

### Move / Copy

Let's you move/copy file or directory.
Below examplex are same for Move and Copy actions:

```typescript
const config = {

  // .move( source: string, target: string )
  // .move( source: string, target: string, options )
  // .move( source: string, target: string, regex )
  // .move( source: string, target: string, regex, options )

  // .copy( source: string, target: string )
  // .copy( source: string, target: string, options )
  // .copy( source: string, target: string, regex )
  // .copy( source: string, target: string, regex, options )

  // ...
  plugins: [
    new WebpackFileManager(options)
      // move a directory - content of source will be moved/copied to target
      .move("C:/test", "D:/test")
      // move a file - source file will be moved/copied to target directory
      .move("C:/test/test.txt", "D:/test")
      // move a file - source file will be moved/copied to target directory and renamed
      .move("C:/test/test1.txt", "D:/test/test2.txt")
      .move("C:/test/test3.txt", "D:/test", {execute: 'AFTER'})
      .move("C:/test", "D:/test", /\.(css|html)$/)
      .move("C:/test", "D:/test", /\.(css|html)$/, {
        overwrite: false
        execute: 'AFTER'
      })
  ],
  //...
};
```

There are few scenarios while moving or copying data:

-   move/copy directory - content of source directory will be moved/copied to another directory, if regex is defined, it will be used match file names.
-   move/copy file to directory - file will be moved/copied to target directory
-   move/copy file to file - file will be moved/copied to target file

Regex will be used only while dealing with directories.

### Delete

Let's you delete file or directory.

```typescript
const config = {
	// .delete( target: string )
	// .delete( target: string, options )
	// .delete( target: string, regex )
	// .delete( target: string, regex, options )

	//...
	plugins: [
		new WebpackFileManager(options)
			// delete a directory
			.delete("C:/test")
			// delete a file
			.delete("C:/test/test1.txt")
			// delete a file and set custom config
			.delete("C:/test/test2.txt", { execute: "AFTER" })
			// delete files matching reg-exp inside target directory
			.create("C:/test", /\.js$/)
			// delete files matching reg-exp inside target directory and set options
			.create("C:/test", /\.js$/, { execute: "AFTER" })
	]
	//...
}
```

While deleting files regex will not take effect.
While deleting a directory you can specify regex. This will keep directory but remove content matching regex. If regex is not specified whole directory will be removed.

## Examples

1. First remove dst/public directory, then create empty dst/public directory:

```typescript
const config = {
	//...
	plugins: [
		new WebpackFileManager(options)
			.delete("./dst/public")
			.create("./dst/public")
	]
}
```

2. Copy content of src/public directory to dst/public directory:

```typescript
const config = {
	//...
	plugins: [
		new WebpackFileManager(options).copy("./src/public", "./dst/public")
	]
}
```

3. Copy content of src/public/scripts/test.js file to dst/public/scripts/test.js file by incrementing if file target file exists:

```typescript
const config = {
	//...
	plugins: [
		new WebpackFileManager(options).copy(
			"./src/public/scripts/test.js",
			"dst/public/scripts/test.js",
			{
				increment: true // if set to true, content will be added to existing files
			}
		)
	]
}
```

4. Delete all .js files in public directory:

```typescript
const config = {
	//...
	plugins: [new WebpackFileManager(options).delete("./public", /\.js$/)]
}
```

5. Delete temp directory:

```typescript
const config = {
	//...
	plugins: [new WebpackFileManager(options).delete("./temp")]
}
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

MIT
