import { Component } from 'react'
import { connect } from 'react-redux'
import Checkbox from 'material-ui/Checkbox';

import Wrapper from '../../hoc/wrapperHoc';

import Authmodals from '../authmodals/index'
import { createWishList, getWishlist } from '../../services/cart';
import { getCookie } from '../../lib/session';

// import * as actions from '../actions/index'

const styles = {
    block: {
        maxWidth: 250,
    },
    checkbox: {
        marginBottom: 16,
        fontSize: "13px",
        fontWeight: 300,
        borderBottom: "1px solid #999",
        padding: "0px 10px"
    },
};

class WishListModalContent extends Component {

    state = {
        isAuthorized: this.props.isAuthorized,
        showListAddForm: false,
        listArray: null,
        listName: null
    };

    constructor(props) {
        super(props);
    }

    showForm = () => {
        this.setState({ showListAddForm: true })
    }
    hideForm = () => {

    }
    setListname = (event) => this.setState({ listName: event.target.value })
    createWishList = () => {
        let listData = {
            name: this.state.listName,
            storeId: getCookie("storeId", ""),
            zoneId :getCookie("zoneid")
        }
        createWishList(listData).then((data) => {
            data.error ? '' : (this.setState({ showListAddForm: false }), this.fetchAllWishList())
        })
    }

    fetchAllWishList = () => {
        getWishlist(0, getCookie("storeId")||0).then((data) => {
            data.error ? '' : this.setState({ listArray: data.data.data })
        })
    }
    componentDidMount() {
        this.fetchAllWishList();
        
    }



    render() {
        return (

            <Wrapper>

                <div className="">
                    <p className="listCaption px-3">Your Lists</p>
                    <div>
                        {this.state.showListAddForm ?
                            <div className="col-12 my-3">
                                <div className="row">
                                    <div className="col">
                                        <input type="text" placeholder="Enter a name for your list" onChange={(event) => this.setListname(event)} className="addWishListInput"></input>
                                    </div>
                                    <div className="col-3">
                                        <button disabled={!this.state.listName} className="addWishListBtn" onClick={() => this.createWishList()}>Add</button>
                                    </div>
                                </div>
                            </div>
                            :
                            <p className="px-3 py-3"><a onClick={() => this.showForm()} className="newListText"> <span><i className="fa fa-plus mr-2" style={{ fontStyle: "normal" }}></i></span>Create a New List</a></p>
                        }
                    </div>
                    <div className="scroller" style={{ maxHeight: "200px", overflowY: "scroll" }}>
                        {
                            this.state.listArray && this.state.listArray.length > 0 ?
                                this.state.listArray.map((item, index) =>
                                    <div className="col-12 my-3" key={"listData" + index}>
                                        <Checkbox
                                            label={item.listName}
                                            labelPosition="left"
                                            value={item.listId}
                                            style={styles.checkbox}
                                            onClick={(event) => this.props.updateCheck(event)}
                                        />
                                    </div>
                                ) : ''
                        }
                    </div>
                </div>

                {/* <Authmodals onRef={ref => (this.child = ref)} /> */}

            </Wrapper>
        )
    }

}

const mapStateToProps = state => {
    return {
        reduxState: state,
        myCart: state.cartList,
        cartProducts: state.cartProducts,
        userProfileDetail: state.userProfile,
    };
};

export default connect(mapStateToProps)(WishListModalContent);