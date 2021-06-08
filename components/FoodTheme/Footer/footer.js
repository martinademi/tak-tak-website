const Footer = (props) => (
    <div className="row">
        <div className="col-12 py-md-5 productDetailAddressSec">
            <div className="row justify-content-center">
                <div className="col-xl-10 col-lg-11 py-5">
                    <div className="row justify-content-center justify-content-sm-start">
                        <div className="col-sm-4 col-12 mb-3 mb-sm-0 productDetailAddressItemComm">
                            <h6 className="productDetailAddressH6Title">address</h6>
                            <p className="productDetailAddressPTitle">
                                {props.store.businessName}
                                <br />
                                {props.store.storeAddr}
                            </p>
                        </div>
                        <div style={{ marginBottom: '20px' }} className="col-sm-4 col-6 productDetailAddressItemComm">
                            <h6 className="productDetailAddressH6Title">CUISINES</h6>
                            {props.sortedProducts.length > 0 ? props.sortedProducts.map((category) =>
                                <p style={{ marginBottom: '5px' }} className="productDetailAddressPTitle">{category.name}</p>
                            ) : ''}
                        </div>
                        <div className="col-sm-4 col-6 productDetailAddressItemComm">
                            <h6 className="productDetailAddressH6Title">PHONE NUMBER</h6>
                            <p className="productDetailAddressPTitle">
                                080-67466725
                    </p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 text-center">
                            <h3 className="productDetailComSpl">fssai</h3>
                            <h5 className="productDetailLicense">License No. 23018008000023</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
)

export default Footer;