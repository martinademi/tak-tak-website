import React from "react";
import Link from "next/link";
import * as environmentVar from '../lib/envariables'
import redirect from '../lib/redirect';
import { setCookie, getCookiees, getCookie } from '../lib/session'
import Roll from 'react-reveal/Roll';
import Slide from 'react-reveal/Slide';
import HeadShake from 'react-reveal/HeadShake';
import Zoom from 'react-reveal/Zoom';
import Lottie from 'lottie-react-web'
import toggleAnimation from '../animations/error.json'
import Router from "next/router"

const deleteAllCookies = async () => {
    await setCookie("locAuthenticated", false)
    await setCookie("authenticatedZone", '')
    await setCookie("authorized", '')
    await setCookie("username", '')
    await setCookie("storeId", '')
    await setCookie("storeName", '')
    await setCookie("token", false)
    await setCookie("locAuthenticated", '')
    await redirect('/')
}

class errorHandler extends React.Component {
    state = {
        isToggled: true,
        isRendered: false
    }
    handleToggle = () => {
        this.setState({ isToggled: !this.state.isToggled });
        Router.back();
    }
    componentDidMount = () => {
        this.setState({ isRendered: true });
    }
    render() {
        return (
            <div style={{ height: "100vh" }}>
                <div className="errContainer--">

                    {this.state.isRendered ?
                        <div className="col-12 text-right" style={{ position: "absolute", zIndex: 9999, top: 20 }}>
                            <Zoom top>
                                {/* <Link href="/"> */}
                                <img src={environmentVar.DESK_LOGO} onClick={this.handleToggle} />
                                {/* </Link> */}
                            </Zoom>
                        </div> : ''
                    }

                    <Lottie
                        direction={this.state.isToggled ? 1 : -1}
                        options={{
                            animationData: toggleAnimation,
                            loop: false,
                        }}
                    />
                </div>
                {/* <div className="errContainer">
                <div className="col-12 text-center">
                    <Zoom top>
                        <img src="/static/images/grocer/colour_logo.png" />
                    </Zoom>
                </div>
                <div className="col-12">
                    <Roll left>
                        <h1 className="errCode">404</h1>
                    </Roll>
                </div>
                <div className="col-12">
                    <Roll right>
                        <p className="nothingFoundMsg">OOPS! NOTHING WAS FOUND</p>
                    </Roll>
                </div>
                <div className="col-12">
                    <Slide bottom>
                        <p className="returnMsg">The page you are looking for might have been removed had its name changed or is temporarily unavailable.
                                <a href="/" className="returnLnk stop-hover-effects">
                                Return to homepage
                                </a>
                        </p>
                    </Slide>
                </div>
            </div> */}
            </div>
        );
    }
}

export default errorHandler;