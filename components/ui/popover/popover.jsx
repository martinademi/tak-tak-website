import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Popover from "@material-ui/core/Popover";

const styles = theme => ({
  typography: {
    margin: theme.spacing.unit * 2
  },
  root: {
    '&:focus':{
        outline: "none",
        boxShadow: "none"
    }
  }
});

class SimplePopover extends React.Component {
  state = {
    anchorEl: null
  };

  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null
    });
  };

  componentDidMount() {
    // this.props.onRef(this);
  }
  render() {
    const { label, children, classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div>
        <Button
          aria-owns={open ? "simple-popper" : undefined}
          //   aria-haspopup="true"
          variant="contained"
          onClick={this.handleClick}
          //   onMouseOver={this.handleClick}
          //   onMouseLeave={this.handleClose}
          classes={{ root: classes.root }}
          style={{
            float: "right",
            padding: "7px 0px",
            background: "transparent"
          }}
        >
          {label}
        </Button>
        <Popover
          id="simple-popper"
          open={open}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
        >
          {children}
        </Popover>
      </div>
    );
  }
}

SimplePopover.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimplePopover);
