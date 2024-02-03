export const removeHTMLTags = (rawHTML: string) => rawHTML.replace(/<[^>]*>?/g, '');
