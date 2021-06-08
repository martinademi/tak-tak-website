import React from "react";
import LinearProgress from "material-ui/LinearProgress";
import Wrapper from "../../hoc/wrapperHoc";
import { BASE_COLOR } from "../../lib/envariables";

const LinearProgressBar = props => (
  <Wrapper>
    <div className="col-12 p-0 text-center">
      {props.success ? (
        <span className="text-success">{props.successMsg}</span>
      ) : (
        <span className="errormessage error-login">{props.error}</span>
      )}
    </div>
    {props.loading == true ? (
      <div className="col-12 p-0 text-center">
        {" "}
        <LinearProgress variant="buffer" color={BASE_COLOR} valuebuffer={30} />
      </div>
    ) : (
      ""
    )}
  </Wrapper>
);

export default LinearProgressBar;
