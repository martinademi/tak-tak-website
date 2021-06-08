import React from "react";
import * as enVariables from "../../lib/envariables";
import { getCookiees, getCookie } from "../../lib/session";
import LanguageWrapper from "../../hoc/language";
const Footer = props => {
  const locale = props.lang;
  const lang = props.selectedLang || "en";
  return (
    <footer id="footer" className="mobile-hide customBgWhiteSection">
      <div className="col-12">
        <div className="row justify-content-center padLeftNRightMulti">
          <div className="col-12">
            {/* <div className="row px-4">
                        <article className="aboutTitle p-lg-0 p-3">
                            <h6 className="d-none">Grocers</h6>
                            <p className="">
                                <span className="textTransform">"grocers"</span> is owned & managed by
                            <span className="textTransform text-muted">"grocers India Private Limited"</span> and is not related, linked or interconnected
                                in whatsoever manner or nature, to
                            <span className="textTransformUpper text-muted">"grocers.com"</span> which is a real estate services business operated
                                by "Redstone Consultancy Services Private Limited".
                            </p>
                        </article>
                        </div> */}
            {/* <div className="row px-4"> */}
            {/* footer content  */}
            <div className="row">
              <article className="col-12">
                <div className="bestPracticesAndOffers">
                  <div className="row">
                    <div className="col-md-4 px-md-4 px-sm-0 mb-1">
                      <div className="row">
                        <div className="col-3 col-md-3 col-lg-2 px-sm-1 text-center">
                          <img
                            src="/static/images/updated/2.svg"
                            width="35"
                            alt=""
                            title=""
                            className="img-fluid"
                          />
                        </div>
                        <div className="col-9 col-md-9 col-lg-10 px-sm-2 text-sm-left text-lg-left">
                          <div className="title">
                            <h5>
                              {locale ? locale.Footer.bestPrice : "Save time"}
                            </h5>
                          </div>
                          <div className="description">
                            {locale
                              ? locale.Footer.cheapPrice
                              : "Receive your market in less than 1 hour"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 px-md-4 px-sm-0 mb-1">
                      <div className="row">
                        <div className="col-3 col-md-3 col-lg-2 px-sm-1 text-center">
                          <img
                            src="/static/images/updated/1.svg"
                            width="35"
                            alt=""
                            title=""
                            className="img-fluid"
                          />
                        </div>
                        <div className="col-9 col-md-9 col-lg-10 px-sm-2 text-sm-left text-lg-left">
                          <div className="title">
                            <h5>
                              {" "}
                              {locale
                                ? locale.Footer.andorsment
                                : "In expert hands"}
                            </h5>
                          </div>
                          <div className="description">
                            {locale
                              ? locale.Footer.chooseFromMsg
                              : "A shopper selects your products with love"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 px-md-4 px-sm-0 mb-1">
                      <div className="row">
                        <div className="col-3 col-md-3 col-lg-2 px-sm-1 text-center">
                          <img
                            src="/static/images/updated/3.svg"
                            width="35"
                            alt=""
                            title=""
                            className="img-fluid"
                          />
                        </div>
                        <div className="col-9 col-md-9 col-lg-10 px-sm-2 text-sm-left text-lg-left">
                          <div className="title">
                            <h5>
                              {locale
                                ? locale.Footer.easyReturn
                                : "100% quality"}
                            </h5>
                          </div>
                          <div className="description">
                            {locale
                              ? locale.Footer.notSatisfied
                              : "If you do not like the status of a product, you do not pay for it!"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
            {/* <div className="row px-4"> */}
            <div className="row justify-content-center">
              <article className="col-12 px-3">
                <div className="categoriesFooter">
                  <div className="row">
                    <div className="col-md-4 col-sm-4 usefulLinksLayout marginBottom10">
                      <div className="row">
                        <h5 className="col-12 categoriesFooterTitle">
                          {locale ? locale.Footer.footerSec1 : "Useful Links"}
                        </h5>
                        <div className="col-6">
                          <ul className="list-group">
                          {/* About Us */}
                            <li className="list-group-item pointer">
                              <a href={"/about?lang=" + lang}>
                                {locale
                                  ? locale.Footer.footerAbtLnk
                                  : "About Us"}
                              </a>
                            </li>
                            {/* FAQ */}
                            <li className="list-group-item pointer">
                              <a href={"/faq?lang=" + lang}>
                                {locale ? locale.Footer.footerFaqLnk : "FAQ"}
                              </a>
                            </li>
                            {/* Terms & Conditions */}
                            <li className="list-group-item pointer">
                              <a href={"/terms?lang=" + lang}>
                                {locale
                                  ? locale.Footer.footerConLnk
                                  : "Terms & Conditions"}
                              </a>
                            </li>
                            {/* Privacy Policy */}
                            <li className="list-group-item pointer">
                              <a href={"/privacy?lang=" + lang}>
                                {locale
                                  ? locale.Footer.footerPlcLnk
                                  : "Privacy Policy"}
                              </a>
                            </li>
                          </ul>
                        </div>
                        <div className="col-6">
                          <ul className="list-group">
                          {/* Blog */}
                            <li className="list-group-item pointer">
                            {/* href={enVariables.BLOG_LINK} target="_blank" */}
                              <a>
                                {locale ? locale.Footer.footerBlogLnk : "Blog"}
                              </a>
                            </li>
                            {/* Contact Us */}
                            <li className="list-group-item pointer">
                              <a href={"/contact?lang=" + lang}>
                                {locale
                                  ? locale.Footer.footerCntLnk
                                  : "Contact Us"}
                              </a>
                            </li>
                            {/* Join as a store */}
                            <li className="list-group-item pointer">
                              <a href={"/storeSignup?lang=" + lang}>
                                {locale
                                  ? locale.Footer.footerSec6
                                  : "Join as a store"}
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 col-sm-4 usefulLinksLayout marginBottom10">
                      <div className="row">
                        <div className="col-12 downloadAppLayout">
                          <h5 className="col-12 px-0 px-lg-3 categoriesFooterTitle">
                            {locale ? locale.Footer.footerSec2 : "Download App"}
                          </h5>
                         {/* app store and play store links */}
                          <div className="col-12">
                            <div className="row">
                              <div className="col-md-12 col-lg-12 col-12 p-0 px-lg-3 downloadApp">
                                <a href={enVariables.APP_STORE} target="_blank">
                                  <img
                                    src="/static/images/app-store.png"
                                    width="92"
                                    alt=""
                                    title=""
                                  />
                                </a>
                                <a
                                  href={enVariables.PLAY_STORE}
                                  target="_blank"
                                >
                                  <img
                                    src="/static/images/google-play.png"
                                    width="92"
                                    alt=""
                                    title=""
                                  />
                                </a>
                              </div>
                              {/* <div className="col-md-12 col-lg-6 col-6 p-0 px-lg-3 downloadApp">
                                                        <a >
                                                            <img src="/static/images/google-play.png" width="92" alt="" title="" />
                                                        </a>
                                                    </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 col-sm-4 marginBottom10">
                      <div className="row">
                        <div className="col-12 downloadAppLayout">
                          <h5 className="col-12 px-0 px-lg-3 categoriesFooterTitle">
                            {locale ? locale.Footer.footerSec3 : "Follow us"}
                          </h5>
                          {/* <a ><img src="/static/images/fb.png" className="clear-fix bgTrans" alt="" /></a>
                                                <a ><img src="/static/images/twitter_icon.png" className="clear-fix" alt="" /></a>
                                                <a ><img src="/static/images/instagram_icon.png" className="clear-fix" alt="" /></a>
                                                <a ><img src="/static/images/invision_icon.png" className="clear-fix" alt="" /></a> */}
                         {/* facebook link */}
                          <a href="" target="_blank">
                            <i
                              className="fa fa-facebook-official"
                              aria-hidden="true"
                            ></i>
                          </a>
                          {/* twitter link */}
                          <a href="" target="_blank">
                            <i
                              className="fa fa-twitter-square"
                              aria-hidden="true"
                            ></i>
                          </a>
                          {/* instagram link */}
                          <a href="" target="_blank">
                            <i
                              className="fa fa-instagram"
                              aria-hidden="true"
                            ></i>
                          </a>
                          {/* linkedin link */}
                          <a href="" target="_blank">
                            <i
                              className="fa fa-linkedin-square"
                              aria-hidden="true"
                            ></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
            {/* <div className="row px-4"> */}
            <div className="row">
              <article className="col-12 px-lg-0 px-3 paymentMethods text-center">
                {/* <div className="row">
                                <h5 className="col-12 categoriesFooterTitle">Payment Options</h5>
                                <div className="w-100"></div>
                                <p className="col-12 paymentOptions">
                                    <img alt="Mobikwik" title="Mobikwik" className="" src="/static/images/mobikwik.png" />
                                    <img alt="Paytm" title="Paytm" className="" src="/static/images/paytm.png" />
                                    <img alt="Visa" title="Visa" className="" src="/static/images/visa.png" />
                                    <img alt="MasterCard" title="MasterCard" className="" src="/static/images/mastercard.png" />
                                    <img alt="Maestro" title="Maestro" className="" src="/static/images/maestro.png" />
                                    <img alt="American Express" title="American Express" className="" src="/static/images/amex.png" />
                                    <img alt="Sodexo" title="Sodexo" className="" src="/static/images/sodexo.png" />
                                    <span className="">Net Banking</span>
                                    <span className="">Pay on Delivery</span>
                                    <span className="">Grocers Cash</span>
                                </p>
                            </div> */}
                <div className="copyRights">
                  {/* <span className="">GreenBox POS LLC , San Diego</span> */}
                  <span> {enVariables.FOOTER_TEXT} </span>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LanguageWrapper(Footer);
