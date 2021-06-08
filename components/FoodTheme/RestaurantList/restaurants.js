import React from 'react';

// id={(cusines.subCatName).replace(/\s+/g, '')} onClick={() => props.test((cusines.subCatName).replace(/\s+/g, ''))} 

const RestaurantList = (props) => (
    <ul className="nav nav-pills flex-column scrollspy-sidebar" id="myScrollspy">
        {props.subCategoryList && props.subCategoryList.map((cusines, index) =>
            <li key={"cusinesMobile" + index} className="nav-item">
                <a className={index == 0 ?  "nav-link navLinkRest active" : "nav-link navLinkRest "} href={"#" + (cusines.subCatName).replace(/\s+/g, '')}>
                    <img src={cusines.subCatIcon || "https://s3.amazonaws.com/grocerufly/storeSubCategory/iconImages/file2019227174931.png"} />
                    {cusines.subCatName}</a>
            </li>
        )}

        {/* <li className="nav-item">
<a className="nav-link" href="#section7">SEE ALL</a>
</li> */}
    </ul>
)

export default RestaurantList;
