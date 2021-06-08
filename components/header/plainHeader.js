import React from 'react';
import Link from 'next/link';

import Wrapper from '../../hoc/wrapperHoc';
import {FontIcon } from 'material-ui';
import * as enVariables from '../../lib/envariables';


export default class Header extends React.Component {

    state = {
        active: false,
        open: false,
        anchorOrigin: {
            horizontal: 'left',
            vertical: 'bottom',
        },
        targetOrigin: {
            horizontal: 'left',
            vertical: 'top',
        },
        SliderWidth: 450,
        place: ''
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    toggleSideMenu = () => {
        !this.state.active ? this.props.showSideMenu() : this.props.hideSideMenu()
        this.setState({ active: !this.state.active })
    }

    handleClose = () => {
        this.setState({ SliderWidth: 0 })
    }
    
    render() {
       return (
            <Wrapper>
                <header className="header mobile-hide headerNav">
                    <div className="col-12 p-0">
                        <div className="justify-content-center">
                            {/* <div className="col-xl-12 col-sm-12 py-1 pt-md-2 px-2 px-md-4 px-sm-2 mobile-hide"> */}
                            <div className="col-xl-12 col-sm-12 py-1 pt-md-2  mobile-hide">
                                {/* <div className="row pt-1"> */}
                                <div className="row pt-1 padLeftNRightMulti">
                                    <div className="col-auto col-xl-2 col-lg-2 col-sm-3 col-xs-4">
                                        <div className="row">
                                            <div className="col-8 py-2 px-3 text-left">
                                                <a href="/">
                                                      <img src={enVariables.DESK_LOGO} alt={enVariables.APP_NAME} title={enVariables.APP_NAME} width="30" className="logoImg" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col px-1 mobile-hide">
                                        <div className="col-8 pl-0 pr-4">
                                            <div className="input-group product-search">
                                                <input type="text" placeholder="Search products in Super Store" aria-label="Search" />
                                                <div className="product-search-img">
                                                    <img src="/static/images/search.svg" width="14" height="15" className="img-fluid" alt="search" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-3 col-lg-3 col-sm-4 text-right rapLogInLayout mobile-hide">
                                        <div className="row align-items-center justify-content-end">
                                            {this.props.isAuthorized ?
                                                <div className="col-auto">
                                                    <Link href='/profile'>
                                                        <img src="/static/images/account-outline.svg" width="24" height="25" className="img-fluid" alt="cart" />
                                                    </Link>
                                                </div>
                                                :
                                                <div className="col-auto" onClick={this.props.showLoginHandler}  >
                                                    <h6 className="rapLogIn">Log In</h6>
                                                </div>
                                            }
                                            <div className="col-auto" id="cartModalTrigger">
                                                <img src="/static/images/cart.svg" onClick={this.props.showCart} width="22" height="25" className="img-fluid" alt="cart" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col col-xl-6 col-lg-6 col-sm-10 pt-2 text-right rapLogInLayout  mobile-show">
                                        <div className="row align-items-center justify-content-end">
                                            <div className="col-auto">
                                                <FontIcon className="material-icons" style={{ fontSize: "18px", marginRight: '0px' }}> <i className="fa fa-globe" aria-hidden="true"></i></FontIcon>
                                            </div>

                                            <div className="col-auto">
                                                <FontIcon className="material-icons" style={{ fontSize: "18px", marginRight: '0px' }}> <i className="fa fa-home"></i></FontIcon>
                                            </div>
                                            {this.props.isAuthorized ?
                                                <div className="col-auto">
                                                    <img src="/static/images/person.svg" width="14" height="15" className="img-fluid" alt="cart" />
                                                </div>
                                                :
                                                <div className="col-auto">
                                                    <FontIcon onClick={this.props.showLoginHandler} className="material-icons" style={{ fontSize: "18px", marginRight: '0px' }}> <i className="fa fa-sign-in"></i></FontIcon>
                                                </div>
                                            }
                                            <div className="col-auto" id="cartModalTrigger">
                                                <img src="/static/images/cart.svg" width="14" height="15" className="img-fluid" alt="cart" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <header className="header mobile-show">
                    <div className="col-12 py-2 px-3">
                        {this.props.children}
                    </div>
                </header>
            </Wrapper>
        )
    }
}