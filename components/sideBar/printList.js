import React from 'react';
import { getFilterParams, searchFilterParams, sortFilterParams } from '../../services/filterApis'
import { setCookie, getCookie, getCookiees } from '../../lib/session'
import PrintSubList from './printSubList'

class PrintList extends React.Component {

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
        return (
            this.state.data ?
                this.state.data.map((category, index) =>
                    <div>
                        <div class="catComDyna">
                            <li class="nav-item">
                                <a onClick={() => this.props.categorySelection(this.props.category , category)}  class="nav-link filtersCategoriesSubSelect_second" data-toggle="collapse" href={"#"+category+index} role="button" aria-expanded="false" aria-controls={category+index}>
                                    {category}
                                </a>
                            </li>
                            <div class="collapse" id={category+index}>
                                <div class="card card-body">
                                    <div class="col-12 p-0 filtersCategoriesSubSelectULLayout">
                                        <ul class="nav flex-column filtersCategoriesSubSelectItemsUL_SubSub">
                                            <PrintSubList category={this.props.category} subCategory={category} categorySelection={this.props.categorySelection} />
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : ''
        )
    }
}

export default PrintList;