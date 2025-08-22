export const breakpoints: { [key: string]: string } =
  Object.entries({
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536,
  }).reduce((acc, [breakpointName, breakpointScreenSize]) => {
    acc[breakpointName] = `@media (width < ${breakpointScreenSize}px)`;
    return acc;
  }, {});

export const combineStyles = (...styleObjects) => {
  let combinedStyles = {};

  styleObjects.forEach(
    (styleObj) => (combinedStyles = { ...combinedStyles, ...styleObj })
  );

  return combinedStyles;
};
