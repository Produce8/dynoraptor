export const customTimeout = (milliseconds: number) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};