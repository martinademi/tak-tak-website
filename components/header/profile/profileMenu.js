import React from "react";
import Wrapper from "../../../hoc/wrapperHoc";
import { PROFILE_ICON, ORDERS_ICON, LOGOUT_ICON } from "../../../lib/envariables";
import redirect from "../../../lib/redirect";
import {connect} from "react-redux"
const RouteToProfile = (event) => {
    event.stopPropagation();
    redirect("/profile");
}

const ProfileMenu = (props) => {
    return (
        <Wrapper>
            {/* <span className="profArrow"></span> */}
            <div className="profilePopMenu" style={{ right: props.right }}>
                <a className="py-2 color-black" onClick={(event) => RouteToProfile(event)} ><img src={PROFILE_ICON} className="mr-2" height="12px" /><span>{props.locale.Profile}</span></a>
                <a className="py-2 color-black" onClick={(event) => RouteToProfile(event)}><img src={ORDERS_ICON} className="mr-2" height="12px" />{props.locale.orders}</a>
                <a className="py-2 color-black" onClick={props.logOut}><img src={LOGOUT_ICON} className="mr-2" height="12px" />{props.locale.logout}</a>
            </div>
        </Wrapper>
    )
}

// export default ProfileMenu;

const mapStateToProps = (state) => {
    return {
     locale:state.locale
    };
  };
  
  export default connect(mapStateToProps)(ProfileMenu);