> [!caution] Notice
> Using both notation and meta highlights in the same code block is not fully compatible because the notation lines may be removed. Additionally, only notation highlights are available inside code blocks within a callout.

Apply a line highlight effect inside a code block.

<div class="codeblock-help codeblock-line-hover">
  <code>
    <span class="line"><span class="token property">console.log</span>(<span class="token string">"Not highlighted"</span>)</span>
    <span class="line highlighted"><span class="token property">console.log</span>(<span class="token string">"Highlighted"</span>) <span class="token comment">// [!code highlight]</span></span>
    <span class="line"><span class="token property">console.log</span>(<span class="token string">"Not highlighted"</span>)</span>
  </code>
</div>

You can also specify the number of lines immediately following the notation comment on which to highlight lines.

<div class="codeblock-help codeblock-line-hover">
  <code>
    <span class="line token comment">// [!code highlight:3]</span>
    <span class="line highlighted"><span class="token property">console.log</span>(<span class="token string">"Highlighted"</span>)</span>
    <span class="line highlighted"><span class="token property">console.log</span>(<span class="token string">"Highlighted"</span>)</span>
    <span class="line"><span class="token property">console.log</span>(<span class="token string">"Not highlighted"</span>)</span>
  </code>
</div>

Alternatively, use the meta string specified in the opening fence to highlight lines.

<div class="codeblock-help codeblock-line-hover">
  <code>
    <span class="line token comment">```js {1,3-4}</span>
    <span class="line highlighted"><span class="token property">console.log</span>(<span class="token string">"1"</span>)</span>
    <span class="line"><span class="token property">console.log</span>(<span class="token string">"2"</span>)</span>
    <span class="line highlighted"><span class="token property">console.log</span>(<span class="token string">"3"</span>)</span>
    <span class="line highlighted"><span class="token property">console.log</span>(<span class="token string">"4"</span>)</span>
  </code>
</div>
