const colors = ["rgb(255, 144, 144)", "rgb(135, 193, 214)", "rgb(168, 170, 236)", "rgb(96, 207, 227)", "rgb(245, 207, 151)", "rgb(152, 203, 247)", "rgb(168, 170, 236)", "rgb(185, 137, 185)", "rgb(163, 224, 155)"]

const CategoryLoader = () => {

    let table = [];
    // Outer loop to create parent
    for (let i = 0; i < 5; i++) {
        table.push(
            <div className="col-12" key={"catLoader-" + i}>
                <div className="col mobLpSecCatSec shine d-flex align-items-center" style={{ backgroundColor: colors[parseInt(Math.random() * 9)], backgroundSize: 'cover', borderRadius: '4px', minHeight: "100px" }} >
                    <div className="row">
                        <div className="col-8 p-0" >
                            <div className="mobLpSecCatSecInner" style={{ padding: '25px 20px' }} >
                                <h5 className="mobLpSecCatTitle">Category</h5>
                                <div className="mobLpSecSubCatTitle">
                                    <span className=""></span>
                                </div>
                            </div>
                        </div>
                        <div className="col-4 p-0">
                            <div className="mobLpSecCatSecInner" style={{ padding: '26px 18px 10px' }} >
                                {/* <img style={{ background: 'transparent' }} src={category.bannerImage} width="80" height="80" className="img-fluid rounded-circle" alt="pop icon" /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return table
}

export default CategoryLoader
