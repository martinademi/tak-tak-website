import React from "react";
import Lottie from "lottie-react-web";

import toggleAnimation from "../../../animations/lottieLoader.json";
import "../styles/lottieLoader.scss";
// import "../../../assets/lottieLoader.scss";

const Loader = props => {
    return props.isLoading ? (
        <div className="loader">
            <Lottie
                direction={props.isLoading ? 1 : -1}
                options={{
                    animationData: toggleAnimation,
                    loop: true
                }}
            />
        </div>
    ) : (
            ""
        );
};

export default Loader;
