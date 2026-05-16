import { visit } from 'unist-util-visit';
import { aquaIconMap } from '../utils/aquaIconMap';

// Helper to strip Variation Selector-16 (U+FE0F) which causes matching issues
const normalize = (str) => typeof str === 'string' ? str.replace(/\uFE0F/g, '') : str;

// Create a normalized map for lookup
const normalizedMap = Object.fromEntries(
  Object.entries(aquaIconMap).map(([key, value]) => [normalize(key), value])
);

// Regex to match any emoji in our dictionary (using normalized keys to build it)
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const emojis = Object.keys(normalizedMap).filter(key => key.length > 1);
const emojiRegex = new RegExp(`(${emojis.map(escapeRegex).join('|')})`, 'g');

export function rehypeAquaIcons() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!node.value || typeof node.value !== 'string') return;
      
      const normalizedValue = normalize(node.value);
      if (!emojiRegex.test(normalizedValue)) return;

      emojiRegex.lastIndex = 0;

      const newNodes = [];
      let lastIndex = 0;
      let match;

      while ((match = emojiRegex.exec(normalizedValue)) !== null) {
        if (match.index > lastIndex) {
          newNodes.push({
            type: 'text',
            value: normalizedValue.substring(lastIndex, match.index)
          });
        }

        const emoji = match[0];
        const iconPath = normalizedMap[emoji];
        
        newNodes.push({
          type: 'element',
          tagName: 'img',
          properties: {
            src: iconPath,
            alt: emoji,
            className: ['aqua-icon'],
            loading: 'lazy',
            decoding: 'async',
            style: 'width: 1.1em; height: 1.1em; vertical-align: -0.15em; margin: 0 0.05em;'
          },
          children: []
        });

        lastIndex = emojiRegex.lastIndex;
      }

      if (lastIndex < normalizedValue.length) {
        newNodes.push({
          type: 'text',
          value: normalizedValue.substring(lastIndex)
        });
      }

      if (newNodes.length > 0) {
        parent.children.splice(index, 1, ...newNodes);
      }
    });
  };
}
