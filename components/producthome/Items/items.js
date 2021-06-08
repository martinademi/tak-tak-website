import React from "react";
import Slider from "react-slick";
import { Card } from "material-ui/Card";

import Wrapper from "../../../hoc/wrapperHoc";
import Link from "next/link";
import Router from "next/router";
import ProductListMViewSlider from "../ProductList/ProductListMViewSlider";
import {connect} from "react-redux"

const routing = () => {
  const href = "/?counter=10";
  const as = href;
  Router.push(href);
};

const Items = props => {
  const settings = {
    arrows: true,
    infinite: false,
    speed: 500,
    // slidesToShow: 2,
    // slidesToScroll: 2,
    // lazyLoad: true,
    // initialSlide: 2,
    placeholders: false,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 4,
          infinite: false,
          placeholders: false
        }
      },
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 4,
          infinite: false,
          placeholders: false
        }
      },
      {
        breakpoint: 900,
        settings: {
          arrows: true,
          infinite: false,
          slidesToShow: 3,
          slidesToScroll: 3
        }
      },
      { breakpoint: 550, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      ,
      { breakpoint: 420, settings: { slidesToShow: 2, slidesToScroll: 2 } }
    ]
  };

  return (
    <Wrapper>
      <section
        className="col-12 catTitle customBgWhiteSection"
        id={props.rowId}
      >
        {/* <div className="row px-3"> */}
        <div className="row align-items-center">
          <div className="col-8">
            <h3>{props.header}</h3>
          </div>

          <div className="col-4 px-0 floatReverseClass">
            <Link href={`/productList?type=${props.bType}&store=${props.selectedStore._id}`}>
              <a className="stop-hover-effects" onClick={props.startTopLoader}
              // onClick={() => (
              //   Router.push(
              //     `/productList?type=${props.bType}&store=${
              //       props.selectedStore._id
              //     }`.toString()
              //   ).then(() => window.scrollTo(0, 0)),
              //   this.props.startLoader
              // )}
              >
                <span className="col-auto ml-auto px-0 mobile-show">{props.locale.MoreProducts||"More Products"}</span>
                <span className="col-auto ml-auto mobile-hide">{props.locale.ViewAll}</span>
              </a>
            </Link>
          </div>

          <div className="col-12">
            {/* {props.bType != 0 ?
            <p className="">
              {props.products.length > 2 ?
                <p className=""> Near you there are <b>{props.products.length - 1}</b>+ products </p> :
                <p className=""> Near you there is <b>One</b> product </p>} 
            </p> : ''
          } */}
          </div>
        </div>
      </section>
      <section className="col-12 mb-sm-4 wrapLayout customBgWhiteSection">
        <div className="row">
          <div className="col-12 px-0 featuredItems product-card featuredItemsId">
            <Slider {...settings}>
              {props.products
                ? props.products.map((post, index) => (
                  //   post.isEmpty ?
                  //   <div
                  //   className="col d-flex align-items-center featuredProductsSection border"
                  //   onClick={() =>
                  //     Router.push(
                  //       `/productList?type=${props.bType}&store=${
                  //         props.selectedStore._id
                  //       }`
                  //     ).then(() => window.scrollTo(0, 0))
                  //   }
                  // >
                  //   <div className="row">
                  //     <div className="col">
                  //       <h5 className="featuredProductsSectionH5">
                  //         See all the products
                  //       </h5>
                  //       <div className="seeMoreLayout">
                  //         <i className="fa fa-angle-right" />
                  //         <span className="seeMoreSpan">see more</span>
                  //       </div>
                  //     </div>
                  //   </div>
                  // </div> :
                  <ProductListMViewSlider
                    post={post}
                    currency={props.currency}
                    openProductDialog={props.openProductDialog}
                    handleDetailToggle={props.handleDetailToggle}
                    cartProducts={props.cartProducts}
                    editCart={props.editCart}
                    addToCart={props.addToCart}
                    index={index}
                    bType={props.bType}
                    total={props.products.length}
                    selectedStore={props.selectedStore}
                  />

                ))
                : ""}
              {/* {props.products.length > 5 ? (
                <div
                  className="col d-flex align-items-center featuredProductsSection border"
                  onClick={() =>
                    Router.push(
                      `/productList?type=${props.bType}&store=${
                        props.selectedStore._id
                      }`
                    ).then(() => window.scrollTo(0, 0))
                  }
                >
                  <div className="row">
                    <div className="col">
                      <h5 className="featuredProductsSectionH5">
                        See all the products
                      </h5>
                      <div className="seeMoreLayout">
                        <i className="fa fa-angle-right" />
                        <span className="seeMoreSpan">see more</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )} */}
            </Slider>
            {/* <!--/.Card--> */}
          </div>
        </div>
      </section>
    </Wrapper>
  );
};

// export default Items;
const mapStateToProps = state => {
  return {
    locale:state.locale
  };
};

export default connect(mapStateToProps)(Items);
