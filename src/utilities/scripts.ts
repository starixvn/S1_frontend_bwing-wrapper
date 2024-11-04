export const CSSInjection = `
    let customCSS =  \`
        body { 
            
        }
        .downloanFrame,
        .downloadarea,
        .favouriteModule,
        .backupDomain,
        *[href*="/casino/27"],
        *[href*="/appDownload"]
        {
            display: none !important;
        }
   \`;

    let headTag = document.getElementsByTagName('head')[0];
    let styleTag = document.createElement('style')
    headTag.appendChild(styleTag);
    styleTag.type = 'text/css';
    styleTag.appendChild(document.createTextNode(customCSS));

    true;
`;
