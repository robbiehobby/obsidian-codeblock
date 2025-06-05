Apply a highlight effect to a single line, a list of lines, or a range of lines. Any combination of individual line numbers and ranges is supported.

```js lh=1,3,5-7 mod=ln,lh,mt
console.log("1");
console.log("2");
console.log("3");
console.log("4");
console.log("5");
console.log("6");
console.log("7");
console.log("8");
```

Highlight color can be changed by adding a color name parameter. Parameters are added as CSS classes to the line for custom styling.

```js lh[red]=1 lh[green]=2 lh[blue]=3 mod=ln,lh,mt
console.log("red");
console.log("green");
console.log("blue");
```

To imitate diffs, use the add (added), del (deleted), or chg (changed) modifiers.

```js lh[add]=1 lh[del]=2 lh[chg]=3 mod=ln,lh,mt
console.log("added");
console.log("removed");
console.log("changed");
```

Add the focus parameter to draw attention to one or more lines.

```js lh[focus]=2 mod=ln,lh,mt
console.log("1");
console.log("2");
console.log("3");
```
