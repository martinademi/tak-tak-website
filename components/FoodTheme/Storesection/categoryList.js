import Router from "next/router";

const CategoriesSection = (props) => (
   
        <section className="col p-0 customBgWhiteSection" id="categoriesLayoutWrapper">
           
            <ul className="category__list mobile-hide">
                {props.categories ? props.categories.map((category, index) =>
                    <li key={"catList" + index} onClick={() => Router.push(`/categories?name=${category.categoryName.replace('&', '%26')}&store=${props.selectedStore._id}`,
                        `/category/${category.categoryName.replace(/%20/g, '-').replace(/,/g, '').replace(/& /g, '').replace(/ /g, '-')}`
                    ).then(() => window.scrollTo(0, 0))} >
                        <div className="col-12 mb-lg-3 mb-1 categoriesLayout">
                            <div className="categories">
                                <div className="row align-items-center">
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
                        </div>
                    </li>
                ) : ""}
            </ul>

            <ul className="category__list mobile-show">
                <div className="accordion mobile-show" id="accordionCategory" role="tablist" aria-multiselectable="true">
                    {props.categories ? props.categories.map((category, index) =>
                        <div className="row mb-lg-3 mb-2" key={"catList" + index} >
                            <div className="col-12  categoriesLayout" >
                                <li data-toggle="collapse" href={"#moreCategoryCollpase" + index} aria-expanded="true" aria-controls="collapseOne">
                                    <div className="categories">
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


                                            <div className="col-4 p-0  text-center subCategoriesList">
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
                        </div>
                    ) : ""}
                </div>
            </ul>

        </section>
    
)

export default CategoriesSection;