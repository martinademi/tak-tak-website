const cardLoader = () => {
    let table = []
    // Outer loop to create parent
    for (let i = 0; i < 3; i++) {
        table.push(
            <div key={"cardLoad-" + i} className="col-6 popularBrandItem col-md-4 col-xl-4">
                <div className="popularBrandItemInnerLayout">
                    <div className="shine" style={{ height: '160px', width: '100%' }}>
                    </div>
                    <h6 className="shine" style={{ height: '25px', width: '100%' }}></h6>
                    <p className="shine" style={{ height: '20px', width: '65%' }}></p>
                    <div className="row">
                        <div className="col-12">
                            <div className="popularBrandItemInnerSec">
                                <div className="row align-items-center">
                                    <div className="col-4">
                                        <p className="shine" style={{ height: '20px', width: '100%' }}></p>
                                    </div>

                                    <div className="col-4">
                                        <p className="shine" style={{ height: '20px', width: '100%' }}></p>
                                    </div>

                                    <div className="col-4">
                                        <p className="shine" style={{ height: '20px', width: '100%' }}></p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return table
}

export default cardLoader
