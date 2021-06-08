import React from 'react'
import FontIcon from 'material-ui/FontIcon'
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation'
import SearchDrawer from '../mobileViews/search'
import { setCookie, getCookiees, getCookie } from '../../lib/session'
import {connect} from "react-redux"
import SimpleBadge from './badge'
import Router from "next/router";

const home = <FontIcon className="material-icons" style={{ fontSize: "26px" }}>
  {/* <img src="/static/tabIcons/home_on.png" height="22" width="26" /> */}
  <img src="/static/img/svg/Supermarket.svg" width="30" height="30" />
</FontIcon>;

const homeFade = <FontIcon className="material-icons" style={{ fontSize: "26px" }}>
  <img src="/static/tabIcons/home_off.png" height="22" width="26" />
</FontIcon>;

const search = <FontIcon className="material-icons" style={{ fontSize: "25px" }}>
  {/* <img src="/static/tabIcons/search.png" height="37" width="37" /> */}
  {/* <img src="/static/img/svg/Lens.svg" width="30" height="30" /> */}
  <img src="/static/img/svg/searchDecent.svg" width="30" height="30" />
</FontIcon>;

const searchFade = <FontIcon className="material-icons" style={{ fontSize: "25px" }}>
  {/* <img src="/static/tabIcons/search_off.png" height="37" width="37" /> */}
  <img src="/static/img/svg/searchDecent.svg" width="30" height="30" />
</FontIcon>;

const cart = <FontIcon className="material-icons" style={{ fontSize: "25px" }}>
  {/* <img src="/static/tabIcons/cart.png" height="37" width="37" /> */}
  {/* <img src="/static/img/svg/Cart.svg" width="30" height="30" /> */}
  <img src="/static/tabIcons/cart.png" height="37" width="37" />
</FontIcon>;

const cartFade = <FontIcon className="material-icons" style={{ fontSize: "25px" }}>
  <img src="/static/tabIcons/cart_off.png" height="37" width="37" />
</FontIcon>;

const history = <FontIcon className="material-icons" style={{ fontSize: "25px" }}>
  {/* <img src="/static/tabIcons/history.png" height="37" width="37" /> */}
  <img src="/static/img/svg/History.svg" width="30" height="30" />
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


class LabelBottomNavigation extends React.Component {



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

  getHomeLabel = () => {
    switch (getCookie("categoryName")) {
      // case "Grocery":
      //   return "Supermarket"
      // case "Dining":
      //   return "Restaurants"
      default:
        return this.props.lang.home || getCookie("categoryName") || "Home";
    }
  }

  redirectTo(isFromStoreList) {
   
    // if (!isFromStoreList) {
    //   let catId = getCookie("categoryId");
    //   let catType = getCookie("categoryType");
    //   let catName = getCookie("categoryName");

    //   catName = (catName).replace(/%20/g, '').replace(/,/g, '').replace(/&/g, '').replace(/ /g, '-');

    //   Router.push(`/storeList?id=${catId}&type=${catType}`, `/storeList/${(catName).replace(/%20/g, '').replace(/,/g, '').replace(/&/g, '').replace(/ /g, '-')}`).then(() => window.scrollTo(0, 0))

    // }
    // else {
    Router.push('/').then(() => window.scrollTo(0, 0))
    // }
  }
  viewProfile() {
    Router.push('/profile').then(() => window.scrollTo(0, 0))
  }



  render() {

    return (
      <div className="col px-4 pb-3" style={{ backgroundColor: "#fff", borderTop: '1px solid #ddd' }}>

        <BottomNavigation>

          {/* home page  */}
          <BottomNavigationItem
            icon={home}
            onClick={this.redirectTo.bind(this, this.props.isFromStoreList)}
            style={{ minWidth: '11vw', height: "75px" }}
            className={this.props.index === 1 ? "bottomIconNormal" : "bottomIconFade"}
            label={this.getHomeLabel()}
          />


          {/* search page  */}
          <BottomNavigationItem
            icon={search}
            onClick={this.openSearchBar}
            style={{ minWidth: '11vw', height: "75px" }}
            className={this.props.index === 2 ? "bottomIconNormal" : "bottomIconFade"}
            label={this.props.lang.locationSel.search}

          />



          {/* cart page  */}
          {this.props.isAuthorized ?
            this.props.count > 0 ?

              <BottomNavigationItem
                style={{ minWidth: '11vw', height: "70px" }}
                onClick={this.openCart}
                className={this.props.index === 3 ? "bottomIconNormal" : "bottomIconFade"}
                label={this.props.lang.cart}
                icon={
                  <SimpleBadge count={this.props.count} >
                    {this.props.index == 3 ?
                      <FontIcon className="material-icons" style={{ fontSize: "25px" }}> {cart}</FontIcon>
                      : <FontIcon className="material-icons" style={{ fontSize: "25px" }}> {cart}</FontIcon>
                    }
                  </SimpleBadge>
                }
              />
              :

              <BottomNavigationItem
                style={{ minWidth: '11vw', height: "70px" }}
                onClick={this.openCart}
                icon={cart}
                className={this.props.index === 3 ? "bottomIconNormal" : "bottomIconFade"}
                label={this.props.lang.cart}

              /> :
            <BottomNavigationItem
              style={{ minWidth: '11vw', height: "75px" }}
              icon={cart}
              onClick={this.props.showLoginHandler}
              className={this.props.index === 3 ? "bottomIconNormal" : "bottomIconFade"}
              label={this.props.lang.cart}
            />
          }

          {/* history page  */}
          {this.props.isAuthorized ?
            <BottomNavigationItem
              style={{ minWidth: '11vw', height: "75px" }}
              icon={history}
              onClick={this.openHistory}
              label={this.props.lang.History}
              className={this.props.index === 4 ? "bottomIconNormal" : "bottomIconFade"}
            /> :
            <BottomNavigationItem
              style={{ minWidth: '11vw', height: "75px" }}
              icon={history}
              className={this.props.index === 4 ? "bottomIconNormal" : "bottomIconFade"}
              onClick={this.props.showLoginHandler}
              label={this.props.lang.History}
            />
          }


          {/* profile page  */}
          {/* {!this.props.isFromStoreList ? */}
          {/* {this.props.isAuthorized ?
            <BottomNavigationItem
              style={{ minWidth: '11vw', height: "75px"  }}
              icon={this.props.index == 5 ? user : userFade}
              onClick={this.viewProfile}
            />
            :
            <BottomNavigationItem
              style={{ minWidth: '11vw', height: "75px"  }}
              icon={this.props.index == 5 ? user : userFade}
              onClick={this.props.showLoginHandler}
            />
            //  : ''
      } */}

        </BottomNavigation>

      </div>
    );
  }
}



// export default LabelBottomNavigation;
const mapStateToProps = state => {
  return {
    reduxState: state,
    selectedLang: state.selectedLang,
    lang: state.locale
  };
};

export default connect(mapStateToProps)(LabelBottomNavigation);