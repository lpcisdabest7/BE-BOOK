import * as bcrypt from 'bcryptjs';

/**
 * generate hash from password or string
 * @param {string} password
 * @returns {string}
 */
export function generateHash(password: string): string {
  return bcrypt.hashSync(password, 10);
}

/**
 * validate text with hash
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export function validateHash(
  password: string | undefined,
  hash: string | undefined | null,
): Promise<boolean> {
  if (!password || !hash) {
    return Promise.resolve(false);
  }

  return bcrypt.compare(password, hash);
}

/**
 *
 * @param getVar
 * @returns
 */
export function getVariableName<TResult>(
  getVar: () => TResult,
): string | undefined {
  const m = /\(\)=>(.*)/.exec(
    getVar.toString().replace(/(\r\n|\n|\r|\s)/gm, ''),
  );

  if (!m) {
    throw new Error(
      "The function does not contain a statement matching 'return variableName;'",
    );
  }

  const fullMemberName = m[1];

  const memberParts = fullMemberName.split('.');

  return memberParts.at(-1);
}

export function hiddenApiKey(apiKey: string, numAsterisks = 6) {
  if (apiKey.length <= numAsterisks * 2) {
    // return inputString; // Not enough characters to mask
    numAsterisks = 2;
  }

  const firstPart = apiKey.substring(0, numAsterisks);
  const lastPart = apiKey.substring(apiKey.length - numAsterisks);
  const maskedMiddle = '*'.repeat(apiKey.length - numAsterisks * 2);

  return firstPart + maskedMiddle + lastPart;
}

export function markdownImage(imageUrl: string, alt?: string) {
  return `![${alt ?? 'Image'}](${imageUrl})`;
}

export function isMarkdownImage(markdown: string) {
  const regex = /!\[.*?\]\((.*?)\)/;
  return regex.test(markdown);
}

export function getImageLinkInMarkdown(markdown: string) {
  // Regular expression to capture the image URL
  const regex = /!\[.*?\]\((.*?)\)/;

  // Extract the image URL
  const match = markdown.match(regex);
  return match ? match[1] : null;
}

export function isURL(str: string) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return pattern.test(str);
}

export const makeData2SSE = <T>(data: T) => {
  return `data: ${JSON.stringify(data)}\n\n`;
};
