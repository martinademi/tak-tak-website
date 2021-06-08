// import React from "react";
// import PropTypes from "prop-types";
// import { withStyles } from "@material-ui/core/styles";
// import AppBar from "@material-ui/core/AppBar";
// import Tabs from "@material-ui/core/Tabs";
// import Tab from "@material-ui/core/Tab";
// import Typography from "@material-ui/core/Typography";

// TabContainer.propTypes = {
//   children: PropTypes.node.isRequired
// };

// const styles = theme => ({
//   root: {
//     flexGrow: 1,
//     width: "100%",
//     backgroundColor: "#fff",
//     overflowY: "hidden"
//   },
//   scroller: {
//     background: "#444"
//   },
//   tabRoot: {
//     textTransform: "initial",
//     minWidth: 72,
//     fontWeight: theme.typography.fontWeightRegular,
//     marginRight: theme.spacing.unit * 4,
//     fontFamily: [
//       "-apple-system",
//       "BlinkMacSystemFont",
//       '"Segoe UI"',
//       "Roboto",
//       '"Helvetica Neue"',
//       "Arial",
//       "sans-serif",
//       '"Apple Color Emoji"',
//       '"Segoe UI Emoji"',
//       '"Segoe UI Symbol"'
//     ].join(","),
//     "&:hover": {
//       color: "#2874f0",
//       opacity: 1
//     },
//     "&$tabSelected": {
//       color: "#2874f0",
//       fontWeight: theme.typography.fontWeightMedium
//     },
//     "&:focus": {
//       color: "#2874f0"
//     }
//   }
// });

// class ScrollableTabsButtonAuto extends React.Component {
//   state = {
//     value: 1
//   };

//   handleChange = (event, value) => {
//     value != this.state.value
//       ? this.setState({ value }, () => {
//           this.props.triggerOnChange ? this.props.onTabChange(value) : ""; // if we want to trigger any function on tab change, need to pass true in "triggerOnChange" prop
//         })
//       : "";
//   };

//   render() {
//     const { classes, TabLabels, TabContent, TabTitle } = this.props;
//     const { value } = this.state;

//     return (
//       <div className={classes.root}>
//         <AppBar
//           position="static"
//           color="default"
//           style={{ width: "70%", boxShadow: "none" }}
//         >
//           <Tabs
//             value={value}
//             fullWidth={true}
//             onChange={this.handleChange}
//             centered
//             indicatorColor="primary"
//             className={{ scroller: classes.scroller, root: classes.tabRoot }}
//             textColor="primary"
//             style={{ background: "#fff", width: "100%" }}
//           >
//             {TabLabels &&
//               TabLabels.map(label => (
//                 <Tab
//                   label={label}
//                   classes={{ root: classes.tabRoot}}
//                   style={{
//                     color: label === TabTitle ? "#444" : "",
//                     fontWeight: label === TabTitle ? 500 : 700,
//                     padding: 0
//                   }}
//                   disabled={label === TabTitle}
//                 />
//               ))}
//           </Tabs>
//         </AppBar>
//         <TabContainer>
//           <div className="row" style={{ overflow: "hidden" }}>
//             {TabContent}
//           </div>
//         </TabContainer>
//       </div>
//     );
//   }
// }

// ScrollableTabsButtonAuto.propTypes = {
//   classes: PropTypes.object.isRequired
// };

// export default withStyles(styles)(ScrollableTabsButtonAuto);

import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.paper,
    overflow: "hidden",
    width: "100%",
    backgroundColor: "#fff"
  },
  tabsRoot: {
    borderBottom: "1px solid #e8e8e8",
    minHeight: 40
  },
  tabsIndicator: {
    backgroundColor: "#2874f0"
  },
  tabRoot: {
    textTransform: "initial",
    // minWidth: 100,
    fontWeight: theme.typography.fontWeightRegular,
    padding: 0,
    minHeight: 40,
    // marginRight: theme.spacing.unit * 4,
    textAlign: "left",
    // width: 110,
    marginRight: 10,
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(","),
    "&:hover": {
      color: "#2874f0",
      opacity: 1
    },
    "&$tabSelected": {
      color: "#2874f0",
      fontWeight: theme.typography.fontWeightMedium
    },
    "&:focus": {
      color: "#2874f0"
    }
  },
  tabSelected: {},
  typography: {
    padding: theme.spacing.unit * 3
  }
});

class CustomizedTabs extends React.Component {
  state = {
    value: 1
  };

  handleChange = (event, value) => {
    value != this.state.value
      ? this.setState({ value }, () => {
          this.props.triggerOnChange ? this.props.onTabChange(value) : ""; // if we want to trigger any function on tab change, need to pass true in "triggerOnChange" prop
        })
      : "";
  };

  render() {
    const { classes, TabLabels, TabContent, TabTitle } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root} style={{ overflow: "hidden" }}>
        <AppBar
          position="static"
          color="default"
          style={{ background: "#fff", boxShadow: "none" }}
        >
          <Tabs
            value={value}
            onChange={this.handleChange}
            style={{ height: 41 }}
            classes={{
              root: classes.tabsRoot,
              indicator: classes.tabsIndicator
            }}
          >
            {TabLabels &&
              TabLabels.map(label => (
                <Tab
                  label={label}
                  buttonStyle={{ height: 30 }}
                  classes={{ root: classes.tabRoot }}
                  style={{
                    color: label === TabTitle ? "#222" : "",
                    // fontWeight: label === TabTitle ? 500 : 700,
                    // padding: 0
                    height: "30px",
                    minWidth: label === TabTitle ? 50 : 70
                  }}
                  disabled={label === TabTitle}
                />
              ))}
          </Tabs>
        </AppBar>
        <TabContainer>
          <div className="row" style={{ overflow: "hidden" }}>
            {TabContent}
          </div>
        </TabContainer>
      </div>
    );
  }
}

CustomizedTabs.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CustomizedTabs);
