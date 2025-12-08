export const createOptions = (
    values: string[],
    translate: (key: string) => string,
    prefix: string
) =>
    values.map((v) => ({
        value: v,
        label: translate(`${prefix}.${v.toLowerCase()}`),
    }));
