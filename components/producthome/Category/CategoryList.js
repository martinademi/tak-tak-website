import React from 'react';
import Slider from 'react-slick';
import Link from 'next/link'
import Router from "next/router";
import { setCookie, getCookiees, getCookie } from '../../../lib/session'
import { DESK_LOGO } from '../../../lib/envariables';
const setRouter = async (category, subCategory) => {

    await setCookie("catId", category.categoryId)
    await setCookie("subCatID", subCategory.subCategoryId)
    await setCookie("subCatName", subCategory.subCategoryName)
    await setCookie("catName", category.categoryName)

    const storeName = await getCookie("storeName", '')

    // await Router.push(`/subcategories?storeName=${storeName.replace('&', '%26')}&categoryName=${category.categoryName}&store=${subCategory.subCategoryName}`,
    //     `/${storeName.replace(/%20/g, '').replace(/,/g, '').replace(/&/g, '').replace(/ /g, '-')}/${category.categoryName.replace(/%20/g, '').replace(/,/g, '').replace(/&/g, '').replace(/ /g, '-')}/${subCategory.subCategoryName.replace(/%20/g, '').replace(/,/g, '').replace(/&/g, '').replace(/ /g, '-')}`
    await Router.push(`/subcategories?storeName=${storeName.replace('&', '%26')}&categoryName=${category.categoryName}&store=${subCategory.subCategoryName}`,
        `/store/${storeName.replace(/%20/g, '').replace(/,/g, '').replace(/&/g, '').replace(/ /g, '-')}/${category.categoryName.replace(/%20/g, '').replace(/,/g, '').replace(/&/g, '').replace(/ /g, '-')}/${subCategory.subCategoryName.replace(/%20/g, '').replace(/,/g, '').replace(/&/g, '').replace(/ /g, '-')}`
    ).then(() => window.scrollTo(0, 0))
}

const CategoryList = (props) => {

    return (
        props.categories && props.categories.length > 0 ?

            <div id="scrollToCategoryList">
                {/* <div className="row px-4">  subCategories */}
                <div className="row padLeftNRightMulti">
                    <section className="col-12 catTitle customBgWhiteSection" id={props.rowId}>
                        {/* <div className="row px-3"> */}
                        <div className="row">
                            <h3 className="col-auto">{props.locale.nav4||"Categories"}</h3>
                        </div>
                    </section>
                </div>


                <div className="row padLeftNRightMulti">

                    <section className="col p-0 customBgWhiteSection" id="categoriesLayoutWrapper">
                        <ul className="category__list mobile-hide">
                            {props.categories ? props.categories.map((category, index) =>
                                category.categoryName && category.categoryName.length > 0 ?
                                    <li key={"catList" + index} onClick={() => (Router.push(`/categories?name=${category.categoryName.replace('&', '%26')}&store=${props.selectedStore._id}`,
                                        `/category/${category.categoryName.replace(/%20/g, '-').replace(/,/g, '').replace(/& /g, '').replace(/ /g, '-')}`
                                    ).then(() => window.scrollTo(0, 0)), props.startTopLoader())} >
                                        <div className="col-12 mb-lg-3 mb-1 mx-sm-1 categoriesLayout">
                                            <div className="categories">
                                                <div className="row align-items-center">
                                                    <div className="col-3 col-lg-3 categoriesImgLayout">
                                                        <img src={category.imageUrl || DESK_LOGO} width="150" height="150" className="img-fluid" title={category.categoryName} alt={category.categoryName} />
                                                    </div>
                                                    <div className="col text-left textTransform categoriesTitleLayout">
                                                        <h6 className="mb-lg-2">{category.categoryName}</h6>
                                                        <p className="">{category.description}</p>
                                                    </div>
                                                    {/* <div className="col-1 mobileHidden  text-centercol-lg-2 col-sm-1 col-xs-2 align-self-center text-center categoriesArrowLayout"> */}
                                                    <div className="col-1 mobileHidden col-lg-2 col-sm-1 col-2 align-self-center text-center categoriesArrowLayout">
                                                        <i className="fa fa-angle-right"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    : ''
                            ) : ""}
                        </ul>

                        <ul className="category__list mobile-show">
                            <div className="accordion mobile-show" id="accordionCategory" role="tablist" aria-multiselectable="true">
                                {props.categories ? props.categories.map((category, index) =>
                                    category.categoryName && category.categoryName.length > 0 ?
                                        <div className="row mb-lg-3 mb-2" key={"catList" + index} >
                                            <div className="col-12  categoriesLayout" >
                                                <li data-toggle="collapse" href={"#moreCategoryCollpase" + index} aria-expanded="true" aria-controls="collapseOne">
                                                <div className="categories" onClick={category.subCategories && category.subCategories.length > 0 ?" ":()=>(Router.push(`/categories?name=${category.categoryName.replace('&', '%26')}&store=${props.selectedStore._id}`,
                                        `/category/${category.categoryName.replace(/%20/g, '-').replace(/,/g, '').replace(/& /g, '').replace(/ /g, '-')}`
                                    ).then(() => window.scrollTo(0, 0)), props.startTopLoader()) } style={{width:"100%"}}>
                                                        <div className="row px-3 align-items-center">
                                                            <div className="col-3 col-lg-3 categoriesImgLayout">
                                                                <img src={category.imageUrl || "/static/images/unknown.png"} width="150" height="150" className="img-fluid" title={category.categoryName} alt={category.categoryName} />
                                                            </div>
                                                            <div className="col text-left textTransform categoriesTitleLayout">
                                                                <h6 className="mb-lg-2">{category.categoryName}</h6>
                                                                <p className="">{category.description}</p>
                                                            </div>
                                                            {/* <div className="col-1 mobileHidden  text-centercol-lg-2 col-sm-1 col-xs-2 align-self-center text-center categoriesArrowLayout"> */}
                                                            <div className="col-1 mobileHidden col-lg-2 col-sm-1 col-2 align-self-center text-center categoriesArrowLayout">
                                                                <i className="fa fa-angle-right"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            </div>

                                            <div id={"moreCategoryCollpase" + index} className="col collapse border" role="tabpanel" aria-labelledby="headingOne" data-parent="#accordionCategory">
                                                <div className="col-12  categoriesLayout">
                                                    <div className="row">
                                                        {category.subCategories ? category.subCategories.map((subCategory, index) =>
                                                            <div className="col-4 p-0  text-center subCategoriesList" key={'mobStoreCat-' + index}>
                                                                <li onClick={(e) => setRouter(category, subCategory)} className="row m-0">
                                                                    <div className="col-12">
                                                                        <img src={subCategory.imageUrl || "/static/images/unknown.png"} width="75" height="150" className="img-fluid" title={category.categoryName} alt={category.categoryName} />
                                                                    </div>

                                                                    <div className="col-12">
                                                                        <p>   {subCategory.subCategoryName} </p>
                                                                    </div>
                                                                </li>
                                                            </div>


                                                        ) : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        </div> : ''
                                ) : ""}
                            </div>
                        </ul>

                    </section>
                </div>
            </div> : ''

    )
};

export default CategoryList;