let skipAuthRefresh = false;

export const setSkipAuthRefresh = (value: boolean) => {
  skipAuthRefresh = value;
};

export const shouldSkipAuthRefresh = () => skipAuthRefresh;
