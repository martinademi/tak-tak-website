import React from 'react';
import Wrapper from '../../../hoc/wrapperHoc';
import Router from "next/router";
import Link from "next/link";
import { setCookie, getCookiees, getCookie } from '../../../lib/session';
import Header from '../Header/header';
import ListLoader from '../Loaders/listLoader';
import CategoryLoader from '../Loaders/categoryLoader';
import TopLoader from '../../ui/loaders/TopBarLoader/TopBarLoader';

const RouteTo = (category) => {
    setCookie("categoryId", category._id)
    setCookie("categoryType", category.type)
    let catname = (category.categoryName).replace(/%20/g, '').replace(/,/g, '').replace(/&/g, '').replace(/ /g, '-');
    setCookie("categoryName", catname)
    Router.push(`/storeList?id=${category._id}&type=${category.type}`, `/storeList/${(category.categoryName).replace(/%20/g, '').replace(/,/g, '').replace(/&/g, '').replace(/ /g, '-')}`).then(() => window.scrollTo(0, 0))
    // Router.push(`/categoryList?id=${category._id}&type=${category.type}`, `/categories/${(category.categoryName).replace(/%20/g, '').replace(/,/g, '').replace(/&/g, '').replace(/ /g, '-')}`).then(() => window.scrollTo(0, 0))
}

const getBackGround = (type) => {
    switch (type) {
        case 1:
            return "/static/images/gifs/resto.gif"
            break;
        case 2:
            return "/static/images/gifs/store.gif"
            break;

        case 3:
            return "/static/images/gifs/fashion.gif"
            break;
    }
}

class CategoryList extends React.Component {
    handleRedirection = (category) => {
        this.startTopLoader();
        RouteTo(category);
    }
    startTopLoader = () => this.TopLoader.startLoader();
    render() {
        return (
            <div className="col-12">
                <div className="row justify-content-center">
                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-8">
                        <div className="row">
                            <div className="col-12 mobLpSec">

                                {/* headerM */}
                                <Header headerMobile={true} hammburger={true} hideFilters={true} handleHammburger={this.props.handleHammburger} showLocationMobileHandler={this.props.showLocationMobileHandler} />
                                {/* headerM */}

                                {/* , backgroundImage: `url(${getBackGround(category.type)})` */}

                                <div className="row mb-4" style={{ marginTop: '70px' }}>

                                    {this.props.isCategoryLoading ? CategoryLoader() : ''}

                                    {this.props.categoryList && this.props.categoryList.data ?
                                        this.props.categoryList.data.map((category, index) =>
                                            index <= 3 ?
                                                // <Link href={`/storeList?id=${category._id}&type=${category.type}`} as={`/storeList/${(category.categoryName).replace(/%20/g, '').replace(/,/g, '').replace(/&/g, '').replace(/ /g, '-')}`}>
                                                <div key={"catL" + index} onClick={() => this.handleRedirection(category)} className="col-12">
                                                    <div className="col mobLpSecCatSec" style={{ backgroundColor: '#' + category.colorCode, backgroundSize: 'cover', borderRadius: '4px' }} >
                                                        <div className="row">
                                                            <div className="col-8 p-0" >
                                                                <div className="mobLpSecCatSecInner" style={{ padding: '25px 20px' }} >
                                                                    <h5 className="mobLpSecCatTitle">{category.categoryName}</h5>
                                                                    <div className="mobLpSecSubCatTitle">
                                                                        <span className="">{category.typeName}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-4 p-0">
                                                                <div className="mobLpSecCatSecInner" style={{ padding: '26px 18px 10px' }} >
                                                                    <img style={{ background: 'transparent' }} src={category.bannerImage} width="80" height="80" className="img-fluid rounded-circle" alt="pop icon" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                // </Link>
                                                : ''
                                        ) : ''}
                                </div>

                                <div className="row">
                                    {this.props.categoryList && this.props.categoryList.data && this.props.categoryList.data.length > 3 ?
                                        <div className="col-12 othersCatSec">
                                            <h6 className="mobLpSecH6Title text-left">others</h6>
                                            <div className="row">
                                                {this.props.categoryList.data.map((category, index) =>
                                                    index > 3 ?
                                                        <div onClick={() => RouteTo(category)} key={"otherCat" + index} className={index % 2 == 0 ? "col-6 py-2 pl-3 pr-2 othersCatSecItem" : "col-6 py-2 pl-2 pr-3 othersCatSecItem"} >
                                                            {/* <div className="othersCatSecInner"> */}
                                                            <div className="col text-center mobLpSecCatSec" style={{ backgroundColor: '#' + category.colorCode }}>
                                                                <div className="row">
                                                                    <div className="col py-2 text-center">
                                                                        <h6 className="othersCatSecH6Ttile">{category.categoryName}</h6>
                                                                    </div>
                                                                </div>
                                                                <div className="row ">
                                                                    <div className="col pb-2 text-center">
                                                                        <img src={category.bannerImage} width="60" height="60" className="othersCatSecImg" alt={category.categoryName} title={category.categoryName} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        : ''
                                                )}
                                            </div>
                                        </div> : ''
                                    }
                                </div>

                                <TopLoader onRef={ref => (this.TopLoader = ref)} />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CategoryList;