/*
In production the stylesheet is compiled to .next/static/style.css and served from /_next/static/style.css

You have to include it into the page using either next/head or a custom _document.js, as is being done in this file.
*/

import Document, { Head, Main, NextScript } from "next/document";
import * as enVariables from "../lib/envariables";
import { appConfig } from "../services/auth";
import fetch from "isomorphic-unfetch";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    // /customer/config

    const getConfig = await fetch(enVariables.API_HOST + "/customer/config", {
      method: "get",
      headers: {
        language: "en",
        "content-type": "application/json",
      },
    });
    const getConfigList = await getConfig.json();
    return { ...initialProps, getConfigList };
  }

  render() {
  // google map key from the config
    let gSource = `https://maps.googleapis.com/maps/api/js?key=${this.props.getConfigList.data.googleMapKey}&libraries=places`;
    // let gSource = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAtrnJwdRbJXfbsH4fr28N1TJG64c7Lrc4&libraries=places`;

    return (
      <html>
        <Head>
          <link rel="icon" href={enVariables.DESK_LOGO}/>
          {/* <title>{enVariables.APP_NAME}</title> */}
          {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          />
          {/* <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600" rel="stylesheet" /> */}
        {/* fonts */}
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900"
            rel="stylesheet"
          />
          {/* font family */}
          <link
            href="https://fonts.googleapis.com/css?family=Patua+One"
            rel="stylesheet"
          />
          {/* bootstrap */}
          <link
            rel="stylesheet"
            type="text/css"
            href="/static/css/bootstrap.min.css"
          />

          {/* <link rel="stylesheet" type="text/css" href="/static/css/style.css" /> */}
          {/* time picker */}
          <link rel="stylesheet" href="/static/css/timepicker.css " />
          {/* <link rel="stylesheet" type="text/css" href="/static/css/homepage.css" /> */}
          {/* <link rel="stylesheet" type="text/css" href="/static/css/mdb.min.css" /> */}
          {/* <link rel="stylesheet" type="text/css" href="/static/css/login.css" /> */}
          {/* <link rel="stylesheet" type="text/css" href="/static/css/about.css" /> */}
        {/* phone number input */}
          <link
            rel="stylesheet"
            type="text/css"
            href="/static/css/phone-number-input.css"
          />
          {/* font awesome */}
          <link
            rel="stylesheet"
            type="text/css"
            href="/static/css/font-awesome.min.css"
          />
          {/* toastr popup */}
          <link href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css" rel="stylesheet" />
          {/* intl-tel-input */}
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/12.1.15/css/intlTelInput.css"

          />
          <link
            rel="stylesheet"
            type="text/css"
            charSet="UTF-8"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
          />
          {/* jquery */}
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
          {/* <script src="https://www.onlinepayment.com.my/MOLPay/API/seamless/3.17/js/MOLPay_seamless.deco.js"></script>   AIzaSyDlHBy-lAPGWpJ-7C5UeuPVynY41AA2zB8    */}
          <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"></script>
          <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"></script>
          <script type="text/javascript" src={gSource}></script>
          <script src="https://sdk.amazonaws.com/js/aws-sdk-2.19.0.min.js"></script>
          <script
            type="text/javascript"
            src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"
          ></script>
          {/* stripe */}
          <script
            type="text/javascript"
            src="https://js.stripe.com/v2/"
          ></script>
        </Head>
        <body data-spy="scroll" data-target="#restHomeSpy" data-offset="300">
          <Main />
          <NextScript />

          <script
            type="text/javascript"
            src="https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js"
          ></script>
        </body>
      </html>
    );
  }
}
