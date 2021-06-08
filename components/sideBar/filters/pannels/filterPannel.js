import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import { getFilterParams } from '../../../../services/filterApis';
import { getCookie } from '../../../../lib/session';

const ExpansionPanel = withStyles({
    root: {
        // border: '1px solid rgba(0,0,0,.125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
    },
    expanded: {
        margin: 'auto',
    },
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
    root: {
        background: "transparent",
        // borderBottom: '1px solid rgba(0,0,0,.125)',
        marginBottom: -1,
        padding: 0,
        minHeight: 10,
        '&$expanded': {
            minHeight: 10,
        }
    },
    content: {
        '&$expanded': {
            margin: '3px 0',
        },
    },
    expanded: {},
})(props => <MuiExpansionPanelSummary {...props} />);

ExpansionPanelSummary.muiName = 'ExpansionPanelSummary';

const ExpansionPanelDetails = withStyles(theme => ({
    root: {
        padding: theme.spacing.unit * 2,
    },
}))(MuiExpansionPanelDetails);

class FilterPannels extends React.Component {
    state = {
        expanded: 'panel1',
    };

    handleChange = panel => (event, expanded) => {

        if (this.state.expanded == panel) {
         
            this.setState({ expanded: null }, () => {
                this.getSubCategory(panel);
                this.props.onPanelClick(panel);
            })
        } else {
            this.setState({
                expanded: panel,
            }, () => {
                this.getSubCategory(panel);
                this.props.onPanelClick(panel);
            });
        }
    };

    getSubCategory = async (CatName) => {

        let storeId = getCookie("storeId", "");
        let query = [{ "match_phrase_prefix": { 'catName.en': CatName } }];

        getFilterParams(0, 2, 0, 10, storeId, false, query).then(({ data }) => {
            this.setState({ subFilterArray: data.data });
        }, (error) => {
           

        }).catch((err) => {})

    }

    handleSubChange = panel => (event, expanded) => {
        if (this.state.expandedSub == panel) {
           
            this.setState({ expandedSub: null }, () => {
                // this.getSubCategory(panel);
                // this.props.onPanelClick(panel);
            })
        } else {
            this.setState({
                expandedSub: panel,
            }, () => {
                this.getSubSubCategory(panel, this.state.expanded);
                // this.props.onPanelClick(panel);
            });
        }
    }

    getSubSubCategory = async (CatName, subCatName) => {

        let storeId = getCookie("storeId", "");
        let query = [{ "match_phrase_prefix": { 'catName.en': CatName } }, { "match_phrase_prefix": { "subCatName.en": subCatName } }];

        getFilterParams(0, 3, 0, 10, storeId, false, query).then(({ data }) => {
            this.setState({ subSubFilterArray: data.data });
        }, (error) => {
            

        }).catch((err) => {})

    }

    render() {
        const { expanded, expandedSub, subFilterArray, subSubFilterArray } = this.state;
        const { pannelArray, selectedPanel } = this.props;


        const subSubFilters = (

            subSubFilterArray && subSubFilterArray.map((item, index) =>
                <ExpansionPanel
                    square
                    expanded={false}
                // onChange={this.handleSubChange(item)}
                >
                    <ExpansionPanelSummary>
                        <Typography>{item}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography>
                            {item}
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            )

        )

        const subFilters = (

            subFilterArray && subFilterArray.map((item, index) =>
                <ExpansionPanel
                    square
                    expanded={item === expandedSub}
                    onChange={this.handleSubChange(item)}
                >
                    <ExpansionPanelSummary>
                        <Typography>{item}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography>
                            {subSubFilters}
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            )

        )



        return (
            <div>
                {
                    pannelArray && pannelArray.map((item, index) =>
                        <ExpansionPanel
                            // square
                            expanded={item === expanded}
                            onChange={this.handleChange(item)}
                        >
                            <ExpansionPanelSummary expandIcon={<i className="fa fa-chevron-down" style={{ fontSize: "14px" }}></i>}>
                                <Typography>{item}</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Typography>
                                    {/* {item} */}
                                    {subFilters}
                                </Typography>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    )
                }

            </div>
        );
    }
}

export default FilterPannels;
