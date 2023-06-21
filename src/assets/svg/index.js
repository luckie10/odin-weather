const importAll = (require) => {
  return require.keys().reduce((accumulator, currentValue) => {
    accumulator[
      currentValue.replace(/(^\.\/)(.+)(\.svg$)/, "$2")
    ] = require(currentValue);
    return accumulator;
  }, {});
};

export const svgs = importAll(require.context("./", false, /\.svg$/));
