import bcrypt from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ClassConstructor } from 'class-transformer/types/interfaces';

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

export function validateConfig<T extends object>(
  config: Record<string, unknown>,
  envVariablesClass: ClassConstructor<T>,
) {
  const validatedConfig = plainToClass(envVariablesClass, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}

export default validateConfig;

/**
 * Return short of status code HTTP
 * @param statusCode StatusCode HTTP
 * @returns {string} statusCode Format
 */
export const formatStatusCode = (statusCode: number | string): string => {
  statusCode = statusCode.toString();
  return statusCode.split('')[0] + 'xx';
};
/**
 *
 * @param element String need to check regex
 * @param regexps Regex pattern
 * @returns {boolean} Return true/false if string match with regex pattern
 */
export const matchVsRegExps = (
  element: string,
  regexps: RegExp[] | string[],
): boolean => {
  for (const regexp of regexps) {
    if (regexp instanceof RegExp) {
      if (element.match(regexp)) {
        return true;
      }
    } else if (element === regexp) {
      return true;
    }
  }
  return false;
};
