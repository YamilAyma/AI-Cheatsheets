const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '..', 'src', 'content', 'cheatsheets');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.mdx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(contentDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Fix arrows like <->, <-, ->, <=, >=
    // MDX treats < followed by non-space as a tag.
    
    // Replace < followed by non-letters/non-slash (to avoid breaking real tags)
    // We target common culprits: <->, <-, <=, <[space] (though space is fine)
    // Actually, any < not followed by a letter or / is a potential issue in MDX.
    
    // Safer approach: replace known symbols first
    // Safer approach: replace all < that are not followed by a letter or /
    // This handles <576px, <->, <-, <=, etc.
    const original = content;
    content = content.replace(/<(?![a-zA-Z\/])/g, '&lt;');
    
    // Also escape > if it follows a replaced < or just to be safe in comparison contexts
    // But > is generally safer in MDX unless it closes a tag.
    // Let's just handle known problematic > cases.
    content = content.replace(/ ->/g, ' -&gt;');
    content = content.replace(/=>/g, '=&gt;');
    content = content.replace(/>=/g, '&gt;=');
    
    // Also check for things like <tag-like-thing> that aren't real HTML
    // MDX is very sensitive.
    
    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Fixed: ${path.relative(contentDir, file)}`);
    }
});
