/**
 * Merge data at nested path in input payload with the data
 * provided by target
 * @param input Input data
 * @param path Array of path to descend into
 * @param target Data to replace or merge at path
 * @param forceReplace Whether the last merge should be a replace or merge.
 * @returns data replaced/merged in input provided by the given path
 */
export function nestedDeepAssign(
  input: Dictionary,
  path: (string | number)[],
  target: Dictionary = {},
  forceReplace = false
): Dictionary {
  if (path.length === 0) {
    if (!input) {
      return target;
    } else if (typeof input === "object") {
      if (forceReplace) {
        return target;
      } else {
        return {
          ...input,
          ...target,
        };
      }
    } else {
      return target;
    }
  } else {
    const first = path[0];
    if (typeof first === "number") {
      input = (input || []).slice();
      input[first] = nestedDeepAssign(
        input[first],
        path.slice(1),
        target,
        forceReplace
      );
      return input.filter((d: any) => d !== null);
    } else {
      input = input || {};

      return {
        ...input,
        [path[0]]: nestedDeepAssign(
          input[path[0]],
          path.slice(1),
          target,
          forceReplace
        ),
      };
    }
  }
}

/**
 * Nested deep property accessor. Returns empty dictionary if data is missing
 * @param input Input dictionary
 * @param path  Nested path array to access properties
 * @returns The value or empty dict
 */
export function nestedDeepGet(
  input: Dictionary,
  path: (string | number)[]
): Dictionary {
  if (path.length === 0) {
    return input || {};
  } else {
    const first = path[0];
    if (typeof first === "number") {
      input = (input || []).slice();
      return nestedDeepGet(input[first], path.slice(1));
    } else {
      input = input || {};
      return nestedDeepGet(input[path[0]], path.slice(1));
    }
  }
}

/**
 * Check if object has given property
 * @param obj Object to check
 * @param propName The name of property
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function hasOwnProperty(obj: any, propName: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, propName);
}

/**
 * Return true if obj is POJO
 * @param obj
 * @returns true if obj
 */
// eslint-disable-next-line
export function isObject(obj: any): boolean {
  if (obj === null || typeof obj !== "object") {
    return false;
  }
  return Object.getPrototypeOf(obj) === Object.prototype;
}
