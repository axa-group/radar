
let data = {};

export const clear  = (): void => {
    data = {};
};

// tslint:disable-next-line:no-shadowed-variable
export const setItem = (key: string, value: string) => {
    data[key] = value;
};


// tslint:disable-next-line:no-shadowed-variable
export const getItem = (key: string) : string | null => {
    return data[key];
};

const key = (index: number): string | null => index.toLocaleString();
// tslint:disable-next-line:no-shadowed-variable
const removeItem = (key: string): void => {
    // tslint:disable-next-line:no-console
    console.log(key);
    return null;
};
const length = 0;

const storage: Storage = {
    clear,
    setItem,
    getItem,
    key,
    removeItem,
    length
};

export default storage;

