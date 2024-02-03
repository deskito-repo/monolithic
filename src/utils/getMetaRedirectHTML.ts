export const getMetaRedirectHTML = (targetUrl: string, contentDelay = 0) => `<!DOCTYPE html>
<html>
<head><meta http-equiv="refresh" content="${contentDelay}; url='${targetUrl}'"></head>
<body></body>
</html>
`;
