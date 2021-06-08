import React, { useContext } from "react";
import { Component } from "react";
import Wrapper from "../../../hoc/wrapperHoc";
import LanguageContext from "../../../context/languageContext";
export const SideBarTabs = props => {
  const { lang } = useContext(LanguageContext);
  return (
    <Wrapper>
      <div
        className="col-12 col-md-auto col-lg-auto pr-0 pt-3 mb-4 mb-lg-0"
        id="ordersSideMenuLayout"
      >
        <ul
          className="nav nav-pills flex-column"
          role="tablist"
          id="ordersSideMenuLayoutULId"
        >
          {/* orders */}
          <li className="nav-item">
            <a
              className="nav-link active"
              id="ordersid"
              data-toggle="pill"
              href="#orders"
            >
              {lang.orders || "orders"}
            </a>
          </li>
          {/* manage addresses */}
          <li className="nav-item">
            <a
              className="nav-link"
              id="addressesid"
              data-toggle="pill"
              href="#manageAddresses"
            >
              {lang.manageAddress || "manage addresses"}
            </a>
          </li>
          {/* payments */}
          <li className="nav-item">
            <a
              className="nav-link"
              id="paymentsid"
              data-toggle="pill"
              href="#payments"
            >
              {lang.payment || "payments"}
            </a>
          </li>
          {/* favorites */}
          <li className="nav-item">
                        <a className="nav-link" id="favouritesid" data-toggle="pill" href="#favourites">{lang.favorites||"favorites"}</a>
                    </li>
                    {/* Wishlist */}
                    <li className="nav-item">
                        <a className="nav-link" id="wishListid" data-toggle="pill" href="#wishlist">{lang.wishlist||"Wishlist"}</a>
                    </li>
                    {/* Offers */}
          <li className="nav-item">
            <a
              className="nav-link"
              id="Offersid"
              data-toggle="pill"
              href="#offers"
            >
              {lang.offers || "Offers"}
            </a>
          </li>
          {/* Help Center */}
          <li className="nav-item">
            <a
              className="nav-link"
              id="Offersid"
              data-toggle="pill"
              href="#helpSupport"
            >
              {lang.helpCenter || "Help Center"}
            </a>
          </li>
          {/* Log out */}
          <li className="nav-item">
            <a
              className="nav-link"
              id="profile_logOutid"
              onClick={props.deleteAllCookies}
            >
              {lang.lougout || "Log out"}
            </a>
          </li>
        </ul>
      </div>
    </Wrapper>
  );
};
