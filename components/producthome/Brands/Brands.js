import React from 'react';
import Slider from 'react-slick';
import Wrapper from '../../../hoc/wrapperHoc';
import Link from 'next/link'
import Router from "next/router";

const Brands = (props) => {

    const settings = {
        arrows: true,
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 10,
        slidesToScroll: 8,
        responsive: [{ breakpoint: 1000, settings: { arrows: true, slidesToShow: 8, slidesToScroll: 7, } }, { breakpoint: 800, settings: { arrows: true, slidesToShow: 5, slidesToScroll: 3, dots: false } }, { breakpoint: 550, settings: { slidesToShow: 3, slidesToScroll: 3, dots: false } }, , { breakpoint: 420, settings: { slidesToShow: 3, slidesToScroll: 3, dots: false } }]
    };


    return (
        props.brands.length > 0 ?
            <Wrapper>
                <section className="col-12 catTitle customBgWhiteSection" id={props.rowId}>
                    {/* <div className="row px-3"> */}
                    <div className="row">

                        <div className="col-8">
                            <h3>{props.header}</h3>
                        </div>
                        <div className="col-4 text-right px-0">
                        {/* <Link href='/viewBrands'>
                            <a className="stop-hover-effects" onClick={props.startTopLoader} >
                                <span className="col-auto ml-auto">View all</span>
                            </a>
                        </Link> */}
                        </div>
                       
                        <div className="col-12">
                            {/* <p className="">
                                Near you there are <b>{props.brands.length - 1}+</b> {props.header}
                            </p> */}
                        </div>
                    </div>
                </section>
                <section className="col-12 mb-sm-4 wrapLayout">
                    <div className="row">
                        <div className="col-12 p-0 featuredItems brands featuredItemsId customBgWhiteSection wrapLayout">
                            <Slider {...settings}>
                                {props.brands ? props.brands.map((brand, index) =>
                                    <div   key={"brandImages-" + index}>
                                        <div >
                                            <div className="card card-cascade" 
                                            onClick={() => Router.push(`/brands?name=${brand.brandName.replace('&', '%26')}&store=${props.selectedStore._id}` , `/brands/${brand.brandName.replace(/%20/g, '-').replace(/ /g, '-').replace('&', '%26')}`).then(() => window.scrollTo(0, 0))}  >
                                                <div className="view overlay">
                                                    <img src={brand.logoImage || "/static/images/unknown.png"} width="142" className="img-fluid" alt={brand.brandName} />
                                                    <a>
                                                        <div className="mask rgba-white-slight"></div>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : ""}
                            </Slider>
                        </div>
                    </div>
                </section>
            </Wrapper>
            : ''
    )
};

export default Brands;