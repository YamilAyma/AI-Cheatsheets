# MDX Safety Reference

When writing cheatsheets as `.mdx` files, certain characters cause compilation failures because MDX interprets them as JSX/HTML. This reference documents every known dangerous pattern and its safe replacement.

## The Core Rule

MDX treats `<` as the start of a JSX/HTML tag. Any `<` that is NOT part of a valid HTML tag will crash the build. The same goes for `>` in certain contexts, and arrow-like sequences.

---

## Character Escaping Table

| Pattern | Problem | Replacement | Example |
|---|---|---|---|
| `<` not before letter/`/` | Interpreted as broken tag | `&lt;` | `if (x &lt; 10)` |
| `->` | Arrow breaks parser | `-&gt;` | `$this-&gt;method()` |
| `=>` | Fat arrow breaks parser | `=&gt;` | `key =&gt; value` |
| `>=` | Comparison operator | `&gt;=` | `x &gt;= 100` |
| `<=` | Comparison operator | `&lt;=` | `y &lt;= 50` |
| `<>` | Diamond operator | `&lt;&gt;` | `a &lt;&gt; b` |
| `<-` | Left arrow | `&lt;-` | `x &lt;- value` |

## Where escaping applies

### Inside fenced code blocks (` ``` `)

Yes, even inside code blocks, these characters must be escaped in this project. The existing `fix_mdx_syntax.cjs` script processes all `.mdx` files and replaces these patterns automatically, including inside code fences.

**Write naturally, then run the fixer:**
```bash
node scripts/fix_mdx_syntax.cjs
```

The script handles:
1. `<` not followed by a letter or `/` → `&lt;`
2. ` ->` (space-arrow) → ` -&gt;`
3. `=>` → `=&gt;`
4. `>=` → `&gt;=`

### Outside code blocks (prose)

The same rules apply more strictly. Any `<` in running text that isn't a real HTML tag will crash the build.

**Safe HTML tags** (these are fine as-is):
- `<br>`, `<br/>`, `<p>`, `<strong>`, `<em>`, `<code>`, `<a href="...">`, etc.

**Dangerous patterns** (must escape):
- `value < threshold` → `value &lt; threshold`
- `A -> B -> C` → `A -&gt; B -&gt; C`
- `map => filter => reduce` → `map =&gt; filter =&gt; reduce`

---

## Common scenarios

### Generics (Java, C#, TypeScript)
```
// Outside code blocks:
List&lt;String&gt; names = new ArrayList&lt;&gt;();

// Inside code blocks (also escaped per project convention):
List&lt;String&gt; names = new ArrayList&lt;&gt;();
```

### PHP arrows
```php
$this-&gt;name = "value";
$array = ["key" =&gt; "value"];
```

### Mathematical comparisons
```
if ($age &gt;= 18 && $age &lt;= 65)
x &lt; y
a &gt;= b
```

### Shell redirects
```bash
echo "hello" &gt; file.txt     # Redirect output
cat file.txt | grep "test"   # Pipe is safe
command 2&gt;&amp;1                 # Redirect stderr
```

---

## Safety net

After writing any `.mdx` file, run:

```bash
node scripts/fix_mdx_syntax.cjs
```

Then verify with:

```bash
npm run build
```

If the build fails with an error mentioning "Expected corresponding JSX closing tag" or "Unexpected token", it's almost always an unescaped `<` or arrow character.
