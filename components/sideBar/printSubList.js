import React from 'react';
import { getFilterParams, searchFilterParams, sortFilterParams } from '../../services/filterApis'
import { setCookie, getCookie, getCookiees } from '../../lib/session'


class PrintSubList extends React.Component {

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
           

        }).catch((err) =>{
        
        })

    }

    componentDidMount() {
        this.getSubCategory(this.props.category, this.props.subCategory)
    }

    render() {
        return (
            this.state.data ?
                this.state.data.map((category, index) =>
                    <li class="nav-item">
                        <a onClick={() => this.props.categorySelection(this.props.category, this.props.subCategory, category)} title={category} class="nav-link active filtersCategoriesSubSelect_third">{category}</a>
                    </li>
                ) : ''
        )
    }
}

export default PrintSubList;