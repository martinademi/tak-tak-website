import React from 'react';
import { getFilterParams, searchFilterParams, sortFilterParams } from '../../services/filterApis'
import { setCookie, getCookie, getCookiees } from '../../lib/session'

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import Done from '@material-ui/icons/Done';

class PrintMobileSublist extends React.Component {

    state = {
        data: null
    }

    getSubCategory = async (CatName, subCatName) => {



        let storeId = getCookie("storeId", "")
        let data;

        let query = [{ "match_phrase_prefix": { 'catName.en': CatName } }, { "match_phrase_prefix": { "subCatName.en": subCatName } }]

        getFilterParams(0, 3, 0, 10, storeId, false, query).then(({ data }) => {
            this.setState({ data: data.data })
        }, (error) => {
           

        }).catch((err) => {})

    }

    componentDidMount() {
        this.getSubCategory(this.props.category, this.props.subCategory)
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <FormControlLabel
                    label="All"
                    control={
                        <Checkbox
                            value={this.props.subCategory}
                            classes={{
                                root: classes.rootCheck,
                                checked: classes.checked,
                            }}
                            onChange={(e) => this.props.selectCategories(this.props.category, this.props.subCategory, this.state.data , e , this.state.data , this.props.allSubcategory)}
                            checkedIcon={<Done className={classes.sizeIcon} />}
                        />
                    }
                    classes={{
                        root: classes.labelRadio
                    }}
                />

                {this.state.data ?
                    (

                        this.state.data.map((category, index) =>
                            // <li class="nav-item">
                            //     <a onClick={() => this.props.categorySelection(this.props.category, this.props.subCategory, category)} title={category} class="nav-link active filtersCategoriesSubSelect_third">{category}</a>
                            // </li>
                            <FormControlLabel
                                label={category}
                                control={
                                    <Checkbox 
                                        value={category}
                                        classes={{
                                            root: classes.rootCheck,
                                            checked: classes.checked,
                                        }}
                                        onChange={(e) => this.props.selectCategories(this.props.category, this.props.subCategory, category, e , this.state.data , this.props.allSubcategory )}
                                        checkedIcon={<Done className={classes.sizeIcon} />} 
                                    />
                                }
                                classes={{
                                    root: classes.labelRadio
                                }}
                            />
                        )

                    ) : ''
                }

            </div>
        )
    }
}

export default PrintMobileSublist;