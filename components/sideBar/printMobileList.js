import React from 'react';
import { getFilterParams, searchFilterParams, sortFilterParams } from '../../services/filterApis'
import { setCookie, getCookie, getCookiees } from '../../lib/session'

import { withStyles } from '@material-ui/core/styles';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import Done from '@material-ui/icons/Done';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PrintMobileSublist from './printMobileSubList';
import $ from 'jquery'
import { BASE_COLOR } from '../../lib/envariables';

const styles = theme => ({
    root: {
        width: '99%',
        backgroundColor: theme.palette.background.paper,
        paddingBottom: '100px'
    },

    rootCheck: {
        color: BASE_COLOR,
        '&$checked': {
            color: BASE_COLOR
        }, height: '25px',
        width: '40px',
        fontSize: '20px',
        float: 'left',
        left: '0px !important'
    },
    rootRadio: {
        color: BASE_COLOR,
        '&$checked': {
            color: BASE_COLOR
        }, height: '25px',
        width: '40px',
        fontSize: '20px',
        float: 'left',
        left: '0px !important'
    },
    label: {
        display: 'unset',
        margin: '10px 0px'
    },

    labelRadio: {
        padding: '10px 0px',
        margin: '0px',
        display: 'flex',
        fontSize: '16px',
    },

    checked: {},
    radio: {
        height: '25px',
        width: '40px',
        fontSize: '20px'
    },
    radioColor: {
        color: "#ff9800"
    },
    formGroup: {
        paddingLeft: '4px',
        paddingTop: '4px',
        paddingBottom: '4px',
        width: "100%",
    },
    radioForm: {
        paddingLeft: '4px',
        paddingTop: '4px',
        paddingBottom: '4px',
        width: "100%"
    },
    radioGroup: {
        flexWrap: 'unset'
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
    sizeIcon: {
        fontSize: 20,
    },
    listHeader: {
        background: '#f4f4f4',
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 'unset',
        padding: '10px'
    },
    listView: {
        fontSize: '9px',
        padding: '10px 25px'
    }
});


class PrintMobileList extends React.Component {

    state = {
        data: null
    }

    getSubCategory = async (CatName) => {


        let storeId = getCookie("storeId", "")
        let data;

        let query = [{ "match_phrase_prefix": { 'catName.en': CatName } }]

        getFilterParams(0, 2, 0, 10, storeId, false, query).then(({ data }) => {
            this.setState({ data: data.data })
        }, (error) => {
           

        }).catch((err) => {})

    }

    componentDidMount() {
        this.getSubCategory(this.props.category)
    }

    render() {
        const { classes } = this.props;

        return (
            this.state.data ?


                <FormControl component="fieldset" required error className={classes.formGroup}>
                    {this.state.data && this.state.data.map((category, index) =>

                        <div className="row" key={"subcategoryrow" + index}>
                            <div className="col-9 pr-0">
                                <p data-toggle="collapse" role="button" aria-expanded="false"
                                    href={"#" + category.replace(/%20/g, '-').replace(/,/g, '').replace(/& /g, '').replace(/ /g, '-') + index}
                                    aria-controls={category.replace(/%20/g, '-').replace(/,/g, '').replace(/& /g, '').replace(/ /g, '-') + index}
                                    style={{ padding: '10px', fontWeight: '400' }}>{category}</p>
                            </div>
                            <div className="col-3 p-0">
                                <div>
                                    <div class="catComDyna">
                                        <li class="nav-item">
                                            <a class="nav-link filtersCategoriesSubSelect_second"
                                                style={{ color: '#999', padding: '10px 15px' }} data-toggle="collapse"
                                                role="button" aria-expanded="false"
                                                href={"#" + category.replace(/%20/g, '-').replace(/,/g, '').replace(/& /g, '').replace(/ /g, '-') + index}
                                                aria-controls={category.replace(/%20/g, '-').replace(/,/g, '').replace(/& /g, '').replace(/ /g, '-') + index}>
                                                <ExpandMoreIcon />
                                            </a>
                                        </li>

                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div class="collapse indent" id={category.replace(/%20/g, '-').replace(/,/g, '').replace(/& /g, '').replace(/ /g, '-') + index}>   
                                    <div className="row">
                                        <div className="col-12" style={{ padding: '0px 25px' }}>
                                           
                                             

                                             <PrintMobileSublist category={this.props.category} subCategory={category} classes={classes} allSubcategory={this.state.data} selectCategories={this.props.selectCategories} />

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </FormControl>
                : ''
        )
    }
}


export default withStyles(styles)(PrintMobileList);