> [!caution] Notice
> Using both notation and meta highlights in the same code block is not fully compatible because the notation lines may be removed. Additionally, only notation highlights are available inside code blocks within a callout.

Apply a word highlight effect inside a code block.

<div class="codeblock-help codeblock-line-hover">
  <code>
    <span class="line token comment">// [!code word:Hello]</span>
    <span class="line"><span class="token keyword">const</span> <span class="token property">message</span> = <span class="token string">"<span class="highlighted-word">Hello</span> World"</span></span>
    <span class="line"><span class="token property">console.log</span>(msg) <span class="token comment">// prints <span class="highlighted-word">Hello</span> World</span></span>
  </code>
</div>

You can also specify the number of lines immediately following the notation comment on which to highlight words.

<div class="codeblock-help codeblock-line-hover">
  <code>
    <span class="line token comment">// [!code word:Hello:1]</span>
    <span class="line"><span class="token keyword">const</span> <span class="token property">message</span> = <span class="token string">"<span class="highlighted-word">Hello</span> World"</span></span>
    <span class="line"><span class="token property">console.log</span>(msg) <span class="token comment">// prints Hello World</span></span>
  </code>
</div>

Alternatively, use the meta string specified in the opening fence to highlight words.

<div class="codeblock-help codeblock-line-hover">
  <code>
    <span class="line token comment">```js /Hello/</span>
    <span class="line"><span class="token keyword">const</span> <span class="token property">msg</span> = <span class="token string">"<span class="highlighted-word">Hello</span> World"</span></span>
    <span class="line"><span class="token property">console.log</span>(msg)</span>
    <span class="line"><span class="token property">console.log</span>(msg) <span class="token comment">// prints <span class="highlighted-word">Hello</span> World</span></span>
  </code>
</div>
