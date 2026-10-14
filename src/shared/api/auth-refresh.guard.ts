let skipAuthRefresh = false;

export const setSkipAuthRefresh = (value: boolean): void => {
  skipAuthRefresh = value;
};

export const shouldSkipAuthRefresh = () => skipAuthRefresh;
