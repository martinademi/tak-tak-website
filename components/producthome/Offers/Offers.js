import React from 'react'
import Slider from 'react-slick'
import Link from 'next/link'
import Wrapper from '../../../hoc/wrapperHoc'

const Offers = (props) => {

    const settings = {
        arrows: true,
        infinite: true,
        autoplay: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <Wrapper>
            {props.offers.length > 0 ?
                <div className="row">
                    <section className="col-12  wrapLayout">
                        <h6 className="d-none">Banner</h6>
                        <div className="row justify-content-center">
                            <div className="col-lg-12 p-0 text-center bannerItems" style={{ transition: '.3s' }}>
                                <Slider {...settings}>
                                    {props.offers ? props.offers.map((offers, index) =>
                                        <Link key={"offerIndexMobi" + index} href={`/offers?offerId=${offers.offerId}&store=${props.store._id}&type=2`} as={`/offers/${offers.offerName.replace(/%/g, 'percentage').replace(/,/g, '').replace(/& /g, '').replace(/ /g, '-')}`}>
                                            <div className="animated-fast" key={index}>
                                                <img src={offers.images.image} height='250' className="img-fluid shine" alt={offers.offerName} title={offers.offerName} />
                                            </div>
                                        </Link>
                                    ) : ""}
                                </Slider>
                            </div>
                        </div>
                    </section>
                </div>
                : ""}
        </Wrapper>
    )
};

export default Offers;