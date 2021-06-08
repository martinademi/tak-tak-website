const BreadCrumbs = props => {

  return (
    <div className="row">
      <div className="col-12 breadCrumbsSec">
        <div className="row justify-content-center">
          {/* <div className="col-xl-10 col-lg-12">  */}
          <div className="col cusWidthImpClsComm">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/">Home</a>
                </li>
                <li className="breadcrumb-item">
                  <a href="/">
                    {props.store &&
                      props.store.addressCompo &&
                      props.store.addressCompo.locality || "Bangaluru"}
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <a href="/">
                    {props.store && props.store.areaName && props.store.areaName.length > 20 ?
                      props.store.areaName.split(",")[0] + " " + props.store.areaName.split(",")[1] : props.store.areaName}
                  </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  <a>{props.store ? props.store.businessName : ""}</a>
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BreadCrumbs;
