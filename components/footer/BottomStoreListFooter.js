import React from 'react'
import FontIcon from 'material-ui/FontIcon'
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation'
import SearchDrawer from '../mobileViews/search'
import { setCookie, getCookiees, getCookie } from '../../lib/session'

import SimpleBadge from './badge'
import Router from "next/router";

const home = <FontIcon className="material-icons" style={{ fontSize: "25px" }}>
    <img src="/static/tabIcons/home_on.png" height="22" width="26" />
</FontIcon>;

const homeFade = <FontIcon className="material-icons" style={{ fontSize: "25px" }}>
    <img src="/static/tabIcons/home_off.png" height="22" width="26" />
</FontIcon>;

const search = <FontIcon className="material-icons" style={{ fontSize: "25px" }}>
    <img src="/static/tabIcons/search.png" height="37" width="37" />
</FontIcon>;

const searchFade = <FontIcon className="material-icons" style={{ fontSize: "25px" }}>
    <img src="/static/tabIcons/search_off.png" height="37" width="37" />
</FontIcon>;

const cart = <FontIcon className="material-icons" style={{ fontSize: "25px" }}>
    <img src="/static/tabIcons/cart.png" height="37" width="37" />
</FontIcon>;

const cartFade = <FontIcon className="material-icons" style={{ fontSize: "25px" }}>
    <img src="/static/tabIcons/cart_off.png" height="37" width="37" />
</FontIcon>;

const history = <FontIcon className="material-icons" style={{ fontSize: "25px" }}>
    <img src="/static/tabIcons/history.png" height="37" width="37" />
</FontIcon>;

const historyFade = <FontIcon className="material-icons" style={{ fontSize: "25px" }}>
    <img src="/static/tabIcons/history_off.png" height="37" width="37" />
</FontIcon>;

const user = <FontIcon className="material-icons" style={{ fontSize: "25px" }}>
    <img src="/static/tabIcons/user.png" height="37" width="37" />
</FontIcon>;

const userFade = <FontIcon className="material-icons" style={{ fontSize: "25px" }}>
    <img src="/static/tabIcons/user_off.png" height="37" width="37" />
</FontIcon>;


class LabelStoreListFooter extends React.Component {



    state = {
        selectedIndex: 0,
    };

    constructor(props) {
        super(props);
        this.openSearchBar = this.openSearchBar.bind(this)
        this.openHistory = this.openHistory.bind(this)
        this.openCart = this.openCart.bind(this)
    }

    select = (index) => {
        this.setState({ selectedIndex: index });
    };
    openSearchBar() {
        Router.push('/searchPage').then(() => window.scrollTo(0, 0))
    }
    openHistory() {
        Router.push('/history').then(() => window.scrollTo(0, 0))
    }
    openCart() {
        Router.push('/cart').then(() => window.scrollTo(0, 0))
    }
    redirectTo() {
        // Router.push('/storeList').then(() => window.scrollTo(0, 0))
        let catId = getCookie("categoryId");
        let catType = getCookie("categoryType");
        let catName = getCookie("categoryName");

        catname = (catName).replace(/%20/g, '').replace(/,/g, '').replace(/&/g, '').replace(/ /g, '-');

        Router.push(`/storeList?id=${catId}&type=${catType}`, `/storeList/${(catName).replace(/%20/g, '').replace(/,/g, '').replace(/&/g, '').replace(/ /g, '-')}`).then(() => window.scrollTo(0, 0))
    }
    viewProfile() {
        Router.push('/profile').then(() => window.scrollTo(0, 0))
    }



    render() {
        return (
            <div className="col px-4" style={{ backgroundColor: "#fff", borderTop: '1px solid #ddd' }}>

                <BottomNavigation>

                    {/* home page  */}
                    <BottomNavigationItem
                        icon={this.props.index == 1 ? home : homeFade}
                        onClick={this.redirectTo}
                        style={{ minWidth: '11vw' }}
                    />


                    {/* search page  */}
                    <BottomNavigationItem
                        icon={this.props.index == 2 ? search : searchFade}
                        onClick={this.openSearchBar}
                        style={{ minWidth: '11vw' }}
                    />



                    {/* cart page  */}
                    {this.props.isAuthorized ?
                        this.props.count > 0 ?

                            <BottomNavigationItem
                                style={{ minWidth: '11vw' }}
                                onClick={this.openCart}
                                icon={
                                    <SimpleBadge count={this.props.count} >
                                        {this.props.index == 3 ?
                                            <FontIcon className="material-icons" style={{ fontSize: "25px" }}> <img src="/static/tabIcons/cart.png" height="37" width="37" /></FontIcon>
                                            : <FontIcon className="material-icons" style={{ fontSize: "25px" }}> <img src="/static/tabIcons/cart_off.png" height="37" width="37" /></FontIcon>
                                        }
                                    </SimpleBadge>
                                }
                            />
                            :

                            <BottomNavigationItem
                                style={{ minWidth: '11vw' }}
                                onClick={this.openCart}
                                icon={this.props.index == 3 ? cart : cartFade}
                            /> :
                        <BottomNavigationItem
                            style={{ minWidth: '11vw' }}
                            icon={this.props.index == 3 ? cart : cartFade}
                            onClick={this.props.showLoginHandler}
                        />
                    }

                    {/* history page  */}
                    {this.props.isAuthorized ?
                        <BottomNavigationItem
                            style={{ minWidth: '11vw' }}
                            icon={this.props.index == 4 ? history : historyFade}
                            onClick={this.openHistory}
                        /> :
                        <BottomNavigationItem
                            style={{ minWidth: '11vw' }}
                            icon={this.props.index == 4 ? history : historyFade}
                            onClick={this.props.showLoginHandler}
                        />
                    }


                    {/* profile page  */}
                    {/* {this.props.isAuthorized ?
                        <BottomNavigationItem
                            style={{ minWidth: '11vw' }}
                            icon={this.props.index == 5 ? user : userFade}
                            onClick={this.viewProfile}
                        />
                        :
                        <BottomNavigationItem
                            style={{ minWidth: '11vw' }}
                            icon={this.props.index == 5 ? user : userFade}
                            onClick={this.props.showLoginHandler}
                        />
                    } */}

                </BottomNavigation>

            </div>
        );
    }
}



export default LabelStoreListFooter;