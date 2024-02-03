export const extractImgSrc = (html: string) => {
  const matches = html.match(/<img.*?src=['"](.*?)['"].*?>/);

  return matches ? matches[1] : null;
};
