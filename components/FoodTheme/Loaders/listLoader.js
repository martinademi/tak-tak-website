const ListLoader = (totalList) => {
    let table = []
    // Outer loop to create parent
    for (let i = 0; i <  10; i++) {
        table.push(
            <div className="col-12 catListSecM">
                <div className="row">
                    <div className="col-12 catListItemFullLayout">
                        <div className="row">
                            <div className="col-auto">
                                <div className="shine" style={{ height: '100px', width: '100px' }}>

                                </div>
                            </div>
                            <div className="col">
                                <div className="row mt-1">
                                    <div className="col-11 px-0">
                                        <h6 className="shine" style={{ height: '25px', width: '100%' }}></h6>
                                        <p className="shine" style={{ height: '25px', width: '100%' }}></p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-11 px-0">
                                        <div className="row">
                                            <div className="col-4">
                                                <p className="shine" style={{ height: '20px', width: '100%' }}></p>
                                            </div>
                                            <div className="col-4 pl-0">
                                                <p className="shine" style={{ height: '20px', width: '100%' }}></p>
                                            </div>
                                            <div className="col-4 pl-0">
                                                <p className="shine" style={{ height: '20px', width: '100%' }}></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* fbLoad */}
            </div>
        )
    }
    return table
}

export default ListLoader
