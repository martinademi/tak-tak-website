import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Slider from 'react-slick';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: '10px',
        padding:'0px 15px'
    }
});

class ProductImageSlider extends React.Component {
   
    render() {
        const { classes } = this.props;
       
        const settings = {
            arrows: true,
            infinite: true,
            autoplay: true,
            speed: 800,
            dots:true,
            slidesToShow: 1,
            slidesToScroll: 1, 
        };

        return (
            <div className={classes.root}>

                <Slider {...settings}>
                    {this.props.product.mobileImage.map((step, index) => (
                        <img key={"imagekey" + index} className="productDetailImage" src={step.image} alt={step.image} />
                    ))}
                </Slider>    

            </div>
        );
    }
}


export default withStyles(styles, { withTheme: true })(ProductImageSlider);