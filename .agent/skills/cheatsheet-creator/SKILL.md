---
name: cheatsheet-creator
description: Generate high-quality technical cheat sheets in MDX format for the AI-Cheatsheets (Astro SSG) project. Use this skill whenever a user requests to create a new cheat sheet, generate a technical guide, add content to the cheat sheet project, or mentions "create cheat sheet," "new cheat sheet," "add cheat sheet," "generate guide," or wants to document a technology/tool/concept in cheat sheet format. This also applies when a user mentions technical topics that could benefit from a structured cheat sheet within the context of this project.
---
# Cheatsheet Creator

Create comprehensive, high-density reference cheatsheets on any topic. Each cheatsheet is a single, self-contained MDX file that condenses an entire subject into an exhaustive yet scannable document. The output language is **English by default** — switch only if the user explicitly requests another language.

## What makes a great cheatsheet

A cheatsheet is not a tutorial, a blog post, or a glossary. It's a **dense reference document** — the kind of thing you pin to your wall, bookmark permanently, or print out. A reader should be able to open it cold and find the answer they need in seconds, but also read it end-to-end to build a complete mental model of the subject.

The cheatsheets this skill produces are **unusually thorough**. Where a typical cheatsheet might list 20 commands, ours covers the entire landscape of a topic: foundational concepts, practical examples, edge cases, advanced techniques, common pitfalls, and expert-level tips. Think of it as compressing an entire book into a single, well-organized file.

**Minimum length: 400 lines.** Most good cheatsheets land between 400-800 lines. Language/framework topics often exceed 600. If you finish writing and it's under 400 lines, you haven't gone deep enough — expand sections, add more examples, cover more subtopics.

---

## Scope: Any topic, not just software

This skill handles **any subject** that benefits from structured reference material:

- **Programming languages**: Python, Rust, Go, C++, SQL, Bash, etc.
- **Frameworks & libraries**: React, Spring Boot, Django, TensorFlow, etc.
- **DevOps & infrastructure**: Docker, Kubernetes, Terraform, AWS, etc.
- **Architecture & design**: Microservices, DDD, CQRS, design patterns, etc.
- **Sciences**: Chemistry, physics, biology, mathematics, statistics
- **Medicine & health**: Pharmacology, anatomy, clinical protocols
- **Business & finance**: Accounting, financial modeling, marketing strategy
- **Law & regulation**: Contract law, GDPR, compliance frameworks
- **Languages & linguistics**: Grammar, vocabulary, translation patterns
- **Creative fields**: Music theory, photography, filmmaking, typography
- **Trades & engineering**: Electrical wiring, mechanical systems, construction
- **Cooking & culinary arts**: Techniques, ratios, knife skills, flavor pairing
- **Any domain with learnable, reference-worthy knowledge**

The structure adapts to the domain. A programming cheatsheet has code blocks; a music theory cheatsheet has notation examples; a chemistry cheatsheet has formulas and reaction equations. The organizational principles remain the same.

---

## Content architecture

Every cheatsheet follows this backbone. The specific section names adapt to the topic, but the **progression** is universal:

```
# 🎯 [Topic Name] — Complete Cheatsheet 🎯

[Dense introductory paragraph: what this is, why it matters, who it's for]

---

## 1. 🌟 Core Concepts / Fundamentals
## 2. 🛠️ Setup / Getting Started / Prerequisites  
## 3. 📝 Basic [Operations / Syntax / Techniques / Elements]
## 4-N. [Progressive sections: intermediate → advanced]
## N-1. ⚠️ Common Mistakes / Pitfalls / Troubleshooting
## N. 💡 Best Practices & Pro Tips

---

[Closing paragraph summarizing what the cheatsheet covers]
```

### How to adapt the progression

The middle sections (4 through N-2) are where the topic's substance lives. Choose section topics that follow a **logical learning progression** — the order someone would naturally encounter concepts as they go from beginner to expert.

**For a programming language** (e.g., Rust):

1. Core Concepts → 2. Installation & Toolchain → 3. Syntax Basics (variables, types, functions) → 4. Control Flow → 5. Ownership & Borrowing → 6. Structs & Enums → 7. Error Handling → 8. Collections → 9. Traits & Generics → 10. Concurrency → 11. Cargo & Ecosystem → 12. Common Pitfalls → 13. Best Practices

**For a tool** (e.g., Photoshop):

1. Core Concepts → 2. Interface Overview → 3. Essential Tools → 4. Layers & Masks → 5. Selection Techniques → 6. Color & Adjustment → 7. Typography → 8. Filters & Effects → 9. Automation (Actions/Scripts) → 10. Export & File Formats → 11. Common Pitfalls → 12. Pro Tips

**For a science** (e.g., Organic Chemistry):

1. Core Concepts → 2. Nomenclature → 3. Functional Groups → 4. Reaction Mechanisms → 5. Stereochemistry → 6. Spectroscopy (IR, NMR, MS) → 7. Synthesis Strategies → 8. Key Named Reactions → 9. Common Lab Techniques → 10. Common Mistakes → 11. Study Tips

**For a business domain** (e.g., Financial Modeling):

1. Core Concepts → 2. Financial Statements Overview → 3. Building an Income Statement → 4. Balance Sheet Modeling → 5. Cash Flow Statement → 6. DCF Valuation → 7. Comparable Analysis → 8. Sensitivity & Scenario Analysis → 9. Formatting Standards → 10. Common Pitfalls → 11. Best Practices

The key: **don't be generic**. Each section should contain knowledge that's actually useful. If a section feels thin or obvious, either merge it with another or dig deeper.

---

## Writing standards

### Density over length

Every line should earn its place. If a sentence doesn't teach something, cut it. Dense doesn't mean terse — it means no filler, no fluff, no "as we all know" padding. Compare:

❌ *"Variables are one of the most important concepts in programming. They allow you to store data that you can use later in your program. Let's take a look at how variables work."*

✅ *"Variables store values for later use. Declared with `let` (mutable) or `const` (immutable). Names are case-sensitive, must start with a letter/underscore."*

### Practical examples everywhere

Abstract explanations without examples are useless in a cheatsheet. Every concept gets at least one concrete example. For technical topics, this means working code. For non-technical topics, this means real-world scenarios, formulas, or demonstrations.

```python
# DON'T: Explain list comprehensions without showing one
# DO:
squares = [x**2 for x in range(10)]           # Basic
evens = [x for x in range(20) if x % 2 == 0]  # With filter
matrix = [[1,2],[3,4]]
flat = [x for row in matrix for x in row]      # Nested: [1, 2, 3, 4]
```

For non-code topics, use structured examples:

```
## Flavor Pairing Principles

* **Bridge ingredient**: A third ingredient that shares flavor compounds with two others.
  * Example: Honey bridges goat cheese (lactic) and walnut (nutty) — honey contains both.
* **Contrast pairing**: Combining opposite taste profiles for balance.
  * Example: Dark chocolate (bitter) + sea salt (salty) + caramel (sweet).
```

### Comments and annotations

Inside code blocks, comments are instructional — they explain the *why*, not just the *what*:

```python
# Generators yield items one at a time — crucial for large datasets
# that don't fit in memory
def fibonacci():
    a, b = 0, 1
    while True:
        yield a        # Pauses here, resumes on next()
        a, b = b, a + b

# Usage: only computes values as needed (lazy evaluation)
fib = fibonacci()
print(next(fib))  # 0
print(next(fib))  # 1
print(next(fib))  # 1
```

### Formatting conventions

- **Section headings (##)**: Always prefixed with a number and a thematic emoji. The emoji isn't decorative — it makes scanning faster.
- **Sub-headings (###)**: Numbered as subsections (`3.1.`, `3.2.`). No emoji.
- **Lists**: Use `*` (asterisk) for bullet points. Bold the key term: `* **Term**: Definition.`
- **Code blocks**: Always specify the language tag (` ```python `, ` ```sql `, ` ```yaml `, etc.). For non-code domains, use appropriate tags like ` ```text `, ` ```math `, ` ```markdown `.
- **Inline code**: Use backticks for technical terms, commands, formulas, file names, keyboard shortcuts.
- **Tables**: Use when comparing options, listing parameters, or showing structured data. Tables are scannable; paragraphs are not.
- **Separators**: Use `---` between major sections (between each `##`). Always with a blank line before and after.

---

## Mandatory sections

These three sections appear in **every** cheatsheet, regardless of topic:

### Opening: "Core Concepts / Fundamentals" (Section 1)

The reader's mental model starts here. Define the 5-10 foundational ideas that everything else builds on. Use bold terms with colon definitions:

```markdown
## 1. 🌟 Core Concepts

* **Immutability**: Once created, the value cannot be changed. Any "modification" creates a new value.
  * Why it matters: eliminates an entire class of bugs (shared mutable state).
* **Type inference**: The compiler deduces the type from context, so you rarely need to write it explicitly.
* **Pattern matching**: A control flow construct that destructures data and branches based on shape, not just value.
```

### Penultimate: "Common Mistakes / Pitfalls" (Section N-1)

This section is gold. It's what separates a cheatsheet from documentation. List the specific, concrete mistakes that people actually make — with the fix:

```markdown
## 12. ⚠️ Common Mistakes & Pitfalls

* **Comparing floats with `==`**: Floating-point arithmetic is imprecise. `0.1 + 0.2 != 0.3`.
  * Fix: Use a tolerance: `abs(a - b) < 1e-9`
* **Forgetting `break` in switch statements**: Causes fall-through to the next case.
  * Fix: Use `match` expressions (Rust/PHP 8+) or always include `break`.
* **N+1 query problem**: Loading a list then querying each item individually.
  * Fix: Use eager loading / `JOIN` / batch queries.
```

### Closing: "Best Practices & Pro Tips" (Section N)

Actionable advice from experienced practitioners. Each tip should pass the "would an expert actually say this?" test:

```markdown
## 13. 💡 Best Practices & Pro Tips

* **Fail fast, fail loud**: Validate inputs at the boundary. Don't let bad data propagate silently through your system.
* **Name things for the reader**: Code is read 10x more than it's written. `calculateMonthlyRevenue()` beats `calc()`.
* **Measure before optimizing**: Profile first. The bottleneck is never where you think it is.
```

---

## Title and closing format

### Title (H1)

```markdown
# 🎯 [Topic Name] — Complete Cheatsheet 🎯
```

The twin emojis serve as visual bookends. Use a topic-relevant emoji when one exists naturally (🐍 Python, ☕ Java, 🧪 Chemistry, 🎵 Music Theory, 📊 Statistics). Fall back to a thematic one (💻, 📐, 🔬) or use 🎯 as default.

### Introduction paragraph

Immediately after the H1. Dense, 2-4 sentences. Answers: What is this? Why does it matter? Who benefits?

```markdown
**Kubernetes** is an open-source container orchestration platform that automates deployment,
scaling, and management of containerized applications. Originally designed by Google and now
maintained by CNCF, it has become the de facto standard for running production workloads at
scale. This cheatsheet covers everything from basic `kubectl` commands to advanced scheduling,
networking, and security patterns.
```

### Closing paragraph

Always the last thing in the file, after the final `---`:

```markdown
This cheatsheet provides a comprehensive reference for [Topic], covering [list of main areas]
and the best practices for [practical outcome the reader achieves].
```

---

## Language handling

- **Default**: English (American spelling conventions: "color" not "colour", "optimize" not "optimise")
- **User-specified language**: If the user asks for a specific language (e.g., "hazlo en español", "en français"), write the entire cheatsheet in that language — headings, explanations, comments, closing paragraph. Technical terms remain in their original form.
- **Mixed content**: Code identifiers, CLI commands, and standard technical terms stay in English regardless of the content language. Only explanations, descriptions, and annotations switch.

---

## Quality checklist

Before delivering a cheatsheet, verify:

- [ ] **400+ lines** — if under, expand the weakest sections
- [ ] **H1 with twin emojis** and strong intro paragraph
- [ ] **Section 1** is "Core Concepts" or equivalent
- [ ] **Penultimate section** covers pitfalls/common mistakes
- [ ] **Final section** is "Best Practices & Pro Tips"
- [ ] **Closing paragraph** present
- [ ] **Every `##` heading** has a number and emoji
- [ ] **Every code block** has a language tag
- [ ] **`---` separators** between all `##` sections
- [ ] **No filler** — every paragraph teaches something
- [ ] **Concrete examples** in every section (code, formulas, scenarios)
- [ ] **Balanced depth** — no section is a stub while others are bloated
- [ ] Content **actually covers the topic comprehensively** — would an expert nod?

---

## Handling MDX syntax

Since cheatsheets are `.mdx` files, certain characters break the compiler. Read `cheatsheet-creator/references/mdx_safety.md` for the full escaping reference when writing MDX files. The short version:

| Character | When dangerous                  | Safe replacement |
| --------- | ------------------------------- | ---------------- |
| `<`     | Not followed by letter or `/` | `&lt;`         |
| `->`    | Arrow notation                  | `-&gt;`        |
| `=>`    | Fat arrow                       | `=&gt;`        |
| `>=`    | Comparison                      | `&gt;=`        |

A post-processing script (`scripts/fix_mdx_syntax.cjs`) exists as a safety net, but write with awareness of these rules to produce clean output.
