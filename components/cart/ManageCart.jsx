import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Select from "@material-ui/core/Select";
import InputBase from "@material-ui/core/InputBase";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";

import Router from "next/router";

const style = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row"
  },
  margin: {
    // margin: theme.spacing.unit,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  }
});

const labelStyle = {
  margin: 0,
  margin: "0px",
  fontSize: "10px",
  height: "20px",
  fontWeight: 400,
  color: "#fff"
};

const BootstrapInput = withStyles(theme => ({
  root: {
    label: {
      marginTop: 0
    },
    "label + &": {
      marginTop: theme.spacing.unit
    }
  },
  input: {
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #d9dfe4",
    fontSize: 12,
    fontWeight: 400,
    display: "flex",
    alignItems: "center",
    // width: "auto",
    height: "32px",
    padding: "5px 26px 6px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:focus": {
      //   borderColor: "#fff",
      backgroundColor: "#fff",
      fontWeight: 700
    }
  }
}))(InputBase);

function ManageCart(props) {
  const { classes, children } = props;
  return (
    <FormControl className={classes.margin}>
      {/* <p style={{ ...labelStyle }}>{props.controlName}</p> */}

      {props.value == "custom" ? (
        <input
          type="text"
          placeholder="Enter Cart Quantity"
          style={{ paddingLeft: 5 }}
          maxLength="2"
          onChange={props.onChangeCartInput}
        />
      ) : (
        <Select
          root={classes.root}
          value={props.value}
          selected={props.value}
          grid={classes.grid}
          style={{ width: props.width || "100%" }}
          input={
            <BootstrapInput name="ManageCart" id={props.value + "-select"} />
          }
          onChange={event => props.onChange(event)}
        >
          {children}
        </Select>
      )}
      {props.isQtyChanged ? (
        <button
          className="updateCartButton"
          onClick={() => props.setCart(props.selUnitId, props.value)}
        >
          Update Cart
        </button>
      ) : (
        ""
      )}
      {props.inCart && !props.isQtyChanged ? (
        <button
          className="updateCartButton mobile-show"
          onClick={() => Router.push("/cart")}
        >
          View Cart
        </button>
      ) : (
        ""
      )}
    </FormControl>
  );
}

export default withStyles(style)(ManageCart);
