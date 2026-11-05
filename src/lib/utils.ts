import { BlocksContent } from '@strapi/blocks-react-renderer';

export function flattenAttributes(data: any): any {
  // Check if data is a plain object; return as is if not
  if (
    typeof data !== 'object' ||
    data === null ||
    data instanceof Date ||
    typeof data === 'function'
  ) {
    return data;
  }

  // If data is an array, apply flattenAttributes to each element and return as array
  if (Array.isArray(data)) {
    return data.map((item) => flattenAttributes(item));
  }

  // Initialize an object with an index signature for the flattened structure
  let flattened: { [key: string]: any } = {};

  // Iterate over each key in the object
  for (let key in data) {
    // Skip inherited properties from the prototype chain
    if (!data.hasOwnProperty(key)) continue;

    // If the key is 'attributes' or 'data', and its value is an object, merge their contents
    if (
      (key === 'attributes' || key === 'data') &&
      typeof data[key] === 'object' &&
      !Array.isArray(data[key])
    ) {
      Object.assign(flattened, flattenAttributes(data[key]));
    } else {
      // For other keys, copy the value, applying flattenAttributes if it's an object
      flattened[key] = flattenAttributes(data[key]);
    }
  }

  return flattened;
}

export function truncateBlocks(
  content: BlocksContent,
  maxLength = 150
): BlocksContent {
  function getText(node: unknown): string {
    if (Array.isArray(node)) {
      return node.map(getText).join('');
    }

    if (typeof node !== 'object' || node === null) {
      return '';
    }

    if ('text' in node && typeof node.text === 'string') {
      return node.text;
    }

    if ('children' in node && Array.isArray(node.children)) {
      return node.children.map(getText).join('');
    }

    return '';
  }

  const text = getText(content).replace(/\s+/g, ' ').trim();
  if (!text) {
    return [];
  }

  const truncated =
    text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}...` : text;

  return [
    {
      type: 'paragraph',
      children: [{ type: 'text', text: truncated }],
    },
  ];
}
