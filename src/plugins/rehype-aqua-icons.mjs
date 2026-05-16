import { visit } from 'unist-util-visit';
import { aquaIconMap } from '../utils/aquaIconMap.js';

// Regex to match any emoji in our dictionary
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const emojis = Object.keys(aquaIconMap);
const emojiRegex = new RegExp(`(${emojis.map(escapeRegex).join('|')})`, 'g');

export function rehypeAquaIcons() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!node.value || typeof node.value !== 'string') return;
      if (!emojiRegex.test(node.value)) return;

      // Reset regex index
      emojiRegex.lastIndex = 0;

      const newNodes = [];
      let lastIndex = 0;
      let match;

      while ((match = emojiRegex.exec(node.value)) !== null) {
        // Add text before the emoji
        if (match.index > lastIndex) {
          newNodes.push({
            type: 'text',
            value: node.value.substring(lastIndex, match.index)
          });
        }

        // Add the image node replacing the emoji
        const emoji = match[0];
        const iconPath = aquaIconMap[emoji];
        
        newNodes.push({
          type: 'element',
          tagName: 'img',
          properties: {
            src: iconPath,
            alt: emoji, // keep the emoji as alt text for accessibility
            className: ['aqua-icon'],
            loading: 'lazy',
            decoding: 'async'
          },
          children: []
        });

        lastIndex = emojiRegex.lastIndex;
      }

      // Add remaining text
      if (lastIndex < node.value.length) {
        newNodes.push({
          type: 'text',
          value: node.value.substring(lastIndex)
        });
      }

      // Replace the original text node with the new array of nodes
      if (newNodes.length > 0) {
        parent.children.splice(index, 1, ...newNodes);
      }
    });
  };
}
