Wrap long lines in code blocks instead of scrolling horizontally.

In addition to the global setting, you can use the meta string specified in the opening fence to toggle word wrapping.

**Enable:**

<div class="codeblock-help codeblock-line-hover codeblock-line-numbers codeblock-word-wrap">
  <code>
    <span class="line token comment">```html word-wrap</span>
    <span class="line">&lt;<span class="token tag">div</span> class=<span class="token string">"inline-flex items-center justify-center w-full"</span>&gt;</span>
    <span class="line">&nbsp;&nbsp;&lt;<span class="token tag">hr</span> class=<span class="token string">"w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"</span>&gt;</span>
    <span class="line">&nbsp;&nbsp;&lt;<span class="token tag">span</span> class=<span class="token string">"absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900"</span>&gt;&lt;/<span class="token tag">span</span>&gt;</span>
    <span class="line">&lt;/<span class="token tag">div</span>&gt;</span>
  </code>
</div>

**Disable:**

<div class="codeblock-help codeblock-line-hover codeblock-line-numbers">
  <code>
    <span class="line token comment">```html no-word-wrap</span>
    <span class="line">&lt;<span class="token tag">div</span> class=<span class="token string">"inline-flex items-center justify-center w-full"</span>&gt;</span>
    <span class="line">&nbsp;&nbsp;&lt;<span class="token tag">hr</span> class=<span class="token string">"w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"</span>&gt;</span>
    <span class="line">&nbsp;&nbsp;&lt;<span class="token tag">span</span> class=<span class="token string">"absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900"</span>&gt;&lt;/<span class="token tag">span</span>&gt;</span>
    <span class="line">&lt;/<span class="token tag">div</span>&gt;</span>
  </code>
</div>
