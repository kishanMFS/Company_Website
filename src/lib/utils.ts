import { BlocksContent } from "@strapi/blocks-react-renderer";

export function flattenAttributes(data: any): any {
  // Check if data is a plain object; return as is if not
  if (
    typeof data !== "object" ||
    data === null ||
    data instanceof Date ||
    typeof data === "function"
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
      (key === "attributes" || key === "data") &&
      typeof data[key] === "object" &&
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
  let length = 0;
  const result: BlocksContent = [];

  for (const block of content) {
    // Ignore empty paragraphs
    if (
      block.type === 'paragraph' &&
      block.children.every(
        (child) => child.type === 'text' && child.text.trim() === ''
      )
    ) {
      continue;
    }

    const newBlock = {
      ...block,
      children: [],
    } as typeof block;

    for (const child of block.children) {
      if (child.type !== 'text') {
        newBlock.children.push(child);
        continue;
      }

      if (length >= maxLength) break;

      const remaining = maxLength - length;

      if (child.text.length <= remaining) {
        newBlock.children.push(child);
        length += child.text.length;
      } else {
        newBlock.children.push({
          ...child,
          text: child.text.slice(0, remaining).trimEnd() + '...',
        });
        length = maxLength;
      }
    }

    // Only keep blocks that actually have text
    if (
      newBlock.children.some(
        (child) => child.type !== 'text' || child.text.trim() !== ''
      )
    ) {
      result.push(newBlock);
    }

    if (length >= maxLength) break;
  }

  return result;
}