export function uuid (): string {
  return Math.random().toString(36).slice(2);
}

export function slugify (value: string): string {
  if (!value) {
    return '';
  }
  return value.toLowerCase().split(' ').join('-');
}

export function ensureArray (data: any): any[] | any {
  if (!data) {
    return [];
  }
  if (!Array.isArray(data)) {
    data = [data];
  }
  return data;
}

/**
 * Will return only specified fields (key) on an object.
 * @param data {any}: The data
 * @param fields {Array<string>}: list of fields to pick
 * @returns {any}
 */
export function pickFields (data: any, fields: string[]): any {
  const dump: any = {};
  fields.forEach((field: string) => {
    if (field in data) {
      dump[field] = data[field];
    }
  });
  return dump;
}