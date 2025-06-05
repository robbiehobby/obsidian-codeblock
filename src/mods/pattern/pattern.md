> [!warning] Notice
> This feature is intended for users who have a good understanding of regular expressions. Learn more on [javascript.info](https://javascript.info/regular-expressions).

Use the power of regular expressions to find and highlight patterns in code blocks. Under the hood, these are executed by the JavaScript RegExp engine.

```js rx=/console/g rx=/\(".+"\)/g mod=ln,mt,rx
console.log("1");
console.log("2");
console.log("3");
console.log("4");
```

Highlight color can be changed by adding a color name parameter. Parameters are added as CSS classes to the match for custom styling.

```js rx[red]=/red/ rx[green]=/green/ rx[blue]=/blue/ mod=ln,mt,rx
console.log("red");
console.log("green");
console.log("blue");
```

A list of line numbers can be specified to narrow down the matches. Any combination of individual line numbers and ranges is supported.

```js rx=1,2-3/log/g rx[blue]=4-6/log/g mod=ln,mt,rx
console.log("1");
console.log("2");
console.log("3");
console.log("4");
console.log("5");
console.log("6");
```
