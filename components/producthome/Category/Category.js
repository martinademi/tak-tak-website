import React from 'react';
import Slider from 'react-slick';
import Router from "next/router";


const Category = (props) => {
    let sliderLength ;
    props.categories.length > 8 ? sliderLength = 8 :  sliderLength = props.categories.length;

    let settings = {
        dots: true, infinite: true, speed: 500, slidesToShow: sliderLength, slidesToScroll: 2,
        responsive: [{ breakpoint: 728, settings: { slidesToShow: 7 } }, { breakpoint: 550, settings: { dots: false, slidesToShow: 4, slidesToScroll: 3 } }, { breakpoint: 420, settings: { dots: false, slidesToShow: 4, slidesToScroll: 3 }, },]
    };
    return (

        <div className="row">
            <section className="col-12 mb-2 mt-lg-3 wrapLayout">
                <h6 className="d-none">Catrgories List</h6>
                <div className="row justify-content-center">
                    <div className="col-lg-12 py-2 px-3 text-center catItems">
                        <Slider {...settings}>
                        {props.categories ? props.categories.map((category, index) =>
                            <div key={index}>
                                <img className="img-fluid" width="60" src={category.imageUrl} alt={category.categoryName} title={category.categoryName} />
                                <p>{category.categoryName}</p>
                            </div>
                         ) : ""}
                        </Slider>
                    </div>
                </div>
            </section>
        </div>

    )
};

export default Category;