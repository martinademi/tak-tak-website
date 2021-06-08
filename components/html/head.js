import React from "react";
import NextHead from "next/head";
import {
  APP_NAME,
  APP_DESC,
  WEB_LINK,
  DESK_LOGO,
  OG_LOGO
} from "../../lib/envariables";

const defaultTitle = APP_NAME;
const defaultDescription = APP_DESC;
const defaultOGURL = WEB_LINK;
const defaultOGImage = DESK_LOGO;

const CustomHead = props => (
  <NextHead>
    <meta charSet="UTF-8" />
    <title>{props.title || defaultTitle}</title>
    <meta
      name="description"
      content={props.description || defaultDescription}
    />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <meta property="og:url" content={props.url || defaultOGURL} />
    {/* <meta property="og:url" content={props.url || defaultOGURL} /> */}
    <meta property="og:title" content={props.ogTitle || props.title || ""} />
    <meta
      property="og:description"
      content={props.description || defaultDescription}
    />
    <meta property="og:type" content="website" />

    {/* twitter */}
    <meta name="twitter:site" content={props.url || defaultOGURL} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content={props.ogImage || defaultOGImage} />

    {/* og image */}

    <meta property="og:image" content={props.ogImage || OG_LOGO} />
    {/* <meta property="og:image" content={props.ogImage || "https://website.deliv-x.com/static/images/grocer/icon.png"} /> */}
    <meta property="og:image:width" content="512" />
    <meta property="og:image:height" content="512" />
  </NextHead>
);

export default CustomHead;
