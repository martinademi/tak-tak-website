import React from "react";
import { connect } from "react-redux";
import { FontIcon, IconButton } from "material-ui";
import Footer from "../components/footer/Footer";
import Header from "../components/header/innerPageHeader";
import Authmodals from "../components/authmodals/index";
import { getCookiees } from "../lib/session";
import { getSupportData } from "../services/profileApi";
import redirect from "../lib/redirect";
import CircularProgressLoader from "../components/ui/loaders/circularLoader";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import * as actions from "../actions";

const styles = theme => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
});

class Faq extends React.Component {
  lang = this.props.lang;
  static async getInitialProps({ ctx }) {
    const isAuthorized = await getCookiees("authorized", ctx.req);
    let StoreName = getCookiees("storeName", ctx.req);
    const queries = ctx.query;
    // let lang = (await (queries.lang || getCookiees("lang", ctx.req))) || "en";
    // ctx && ctx.store ? ctx.store.dispatch(actions.selectLocale(lang)) : "";
    return { isAuthorized, StoreName };
  }

  state = {
    isAuthorized: this.props.isAuthorized,
    supportData: null,
    loading: false
  };

  constructor(props) {
    super(props);

    this.state = {
      isAuthorized: props.isAuthorized
    };
  }

  showLoginHandler = () => {
    this.child.showLoginHandler();
  };
  showLocationHandler = () => {
    this.child.showLocationHandler();
  };
  showLocationMobileHandler = () => {
    this.child.showLocationMobileHandler();
  };
  showCart = () => {
    this.child.showCart();
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.reduxState.userName !== this.props.reduxState.userName) {
      this.setState({
        username: this.props.reduxState.userName,
        isAuthorized: this.props.reduxState.authorized
      });
    }
  }
  // quetion and answer
  handleAnswer = (parentIndex, index, answer) => {
    let answerTag = document.getElementById(parentIndex + "descTag" + index);
    answerTag.innerHTML = answer;
  };
  componentDidMount = () => {
    this.setState({ loading: true });
    getSupportData().then(({ data }) => {
      data.error
        ? this.setState({ loading: false })
        : this.setState({ supportData: data.data, loading: false });
    });
  };
  deleteAllCookies() {
    document.cookie.split(";").forEach(c => {
      document.cookie =
        c.trim().split("=")[0] +
        "=;" +
        "expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    });
    redirect("/");
  }
  render() {
    const { classes } = this.props;

    return (
      <div className="faqPage">
        <Header
          stickyHeader={true}
          showLoginHandler={this.showLoginHandler}
          isAuthorized={this.state.isAuthorized}
          staticPage={true}
          hideSearch={true}
          hideCategory={true}
          showCart={this.showCart}
          showLocationHandler={this.showLocationHandler}
          showLocationMobileHandler={this.showLocationMobileHandler}
          hideBottom={true}
          deleteAllCookies={this.deleteAllCookies}
          deleteAllCookies={this.deleteAllCookies}
        >
          <div className="col-12">
            <div className="row">
              <div className="col-2 pl-0">
                <IconButton
                  href={
                    this.props.StoreName
                      ? `/stores/${this.props.StoreName.replace(/%20/g, "-")
                          .replace(/,/g, "")
                          .replace(/& /g, "")
                          .replace(/ /g, "-")}`
                      : "/"
                  }
                  style={{ height: "35px", padding: "6px" }}
                >
                  <img
                    src="/static/icons/Common/BackIcon.imageset/back_btn@2x.png"
                    width="24"
                  />
                </IconButton>
              </div>
              <div className="col-8 text-center">
                <h6 className="innerPage-heading">
                  {this.lang.faqs || "Faqs"}
                </h6>
              </div>
            </div>
          </div>
        </Header>

        <div className="col-12 faqPageSection">
          <div className="row">
            <div className="col-12 faqBannerSec">
              {/* <h5 className="contactUsBannerH6Title">faq</h5> */}
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-10 col-xl-8">
              {/* <h1 className="faqTitleH1">
                                faq
                            </h1> */}
              <div className="faqLayout">
                {/* panel panel-info */}
                {/* <div class="panel panel-info">
                                    <div class="panel-heading collapsed" data-toggle="collapse" data-target="#bar1">
                                        <i class="fa fa-fw fa-chevron-down"></i>
                                        <i class="fa fa-fw fa-chevron-right"></i>
                                        <h6 className="faqH6Quora">How do I place an order?</h6>
                                    </div>
                                    <div class="panel-body">
                                        <div class="collapse" id="bar1">
                                            <p className="faqPCont">
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ... The first word, “Lorem,” isn't even a word; instead it's a piece of the word “dolorem,” meaning pain, suffering, or sorrow.
                                            </p>
                                        </div>
                                    </div>
                                </div> */}
                {/* panel panel-info */}
                {/* panel panel-info */}
                {this.state.supportData &&
                  this.state.supportData.map((supItem, index) => (
                    <div class="panel panel-info">
                      <div
                        class="panel-heading collapsed"
                        data-toggle="collapse"
                        data-target={"#par" + index}
                      >
                        <i class="fa fa-fw fa-chevron-down"></i>
                        <i class="fa fa-fw fa-chevron-right"></i>
                        <h6 className="faqH6Quora">{supItem.name}</h6>
                      </div>
                      <div class="panel-body">
                        <div class="collapse py-2 mt-2" id={"par" + index}>
                          {this.state.supportData[index]["subcat"].map(
                            (supSubItem, subIndex) => (
                              <ExpansionPanel
                                key={subIndex}
                                onClick={() =>
                                  this.handleAnswer(
                                    index,
                                    subIndex,
                                    supSubItem.desc
                                  )
                                }
                              >
                                <ExpansionPanelSummary
                                  expandIcon={<ExpandMoreIcon />}
                                >
                                  <Typography className={classes.heading}>
                                    {supSubItem.name}
                                  </Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                  <Typography>
                                    <span
                                      className="faqPCont_child"
                                      id={index + "descTag" + subIndex}
                                    >
                                      {supSubItem.desc}
                                    </span>
                                  </Typography>
                                </ExpansionPanelDetails>
                              </ExpansionPanel>
                            )
                            // <p className="faqPCont">
                            //     <div class="panel-heading collapsed" data-toggle="collapse" data-target={"#" + index + "par_child" + subIndex} onClick={() => this.handleAnswer(index, subIndex, supSubItem.desc)}>
                            //         <h6 className="faqH6Quora_child">{supSubItem.name}</h6>
                            //     </div>
                            //     <div class="panel-body">
                            //         <div class="collapse" id={index + "par_child" + subIndex}>
                            //             <p className="faqPCont_child" id={index + "descTag" + subIndex}>
                            //                 {supSubItem.desc}
                            //             </p>
                            //         </div>
                            //     </div>
                            // </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                {/* panel panel-info */}
              </div>
            </div>
            {/* <div className="col-12 py-5 subscribeUpdateSection border">
                            <div className="row">
                                <div className="col-4"></div>
                                <div className="col-4">
                                    <form>
                                        <div class="form-group">
                                            <label for="faqEmail">SUBSCRIBE FOR UPDATES:</label>
                                            <input type="email" class="form-control" id="faqEmail" placeholder="Email Address" name="email" />
                                        </div>
                                        <button type="submit" class="btn btn-default w-100 faqSubUpdBtn">Submit</button>
                                    </form>
                                    <h6 className="faqCopyRights">
                                        2023 by Gling Urban Bikes, Proudly created with Wix.com
                                    </h6>
                                </div>
                                <div className="col-4"></div>
                            </div>
                        </div> */}
          </div>
        </div>
        {this.state.loading ? <CircularProgressLoader /> : ""}
        <Authmodals
          onRef={ref => (this.child = ref)}
          editCart={this.editCart}
        />
        {/* Footer container */}
        <div className="container-fluid" id="footerContainer">
          <Footer lang={this.props.lang} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    reduxState: state,
    selectedLang: state.selectedLang,
    lang: state.locale
  };
};

export default connect(mapStateToProps)(withStyles(styles)(Faq));
