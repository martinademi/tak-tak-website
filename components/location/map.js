import React from 'react'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import Wrapper from '../../hoc/wrapperHoc'



export default class LocationSearchInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = { address: '', showForm: false, isNewAdrChanged: false }
    }


    handleChange = (address) => {
        this.setState({ address: address, isNewAdrChanged: true })
    }

    handleSelect = (address) => {
        let latLong;
        this.handleChange(address);
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => this.updateData(latLng))
            .catch(error => {})
    }

    updateData(data) {
        data['address'] = this.state.address
        this.props.updateLocation(data)
    }

    componentWillReceiveProps = async () => {
        await !this.state.isNewAdrChanged ? this.clearAddress() : ''
        this.props.locErrMessage ? this.clearAddress() : '';
        await this.setState({ address: this.props.address && !this.state.isNewAdrChanged ? this.props.address : this.state.address, showForm: true })
    }

    clearAddress() {
        this.setState({ address: '' })
    }

    clearState = () => this.setState({ isNewAdrChanged: false })
    componentWillUnmount() {
        this.setState({ address: '' })
    }

    componentDidMount() {
        this.props.onRef ? this.props.onRef(this) : ''
    }

    render() {
        const { locale } = this.props;
        return (
            <Wrapper>
                <PlacesAutocomplete
                    value={this.state.address}
                    onChange={this.handleChange}
                    onSelect={this.handleSelect}
                >
                    {({ getInputProps, suggestions, getSuggestionItemProps }) => (
                        <div className="position-relative">

                            <input
                                {...getInputProps({
                                    placeholder: this.props.placeHolder || locale ? locale.locationSel.locPlaceholder : 'Enter Area, Street, City...',
                                    className: this.props.inputClassName,
                                    id: this.props.id
                                })}
                            />
                            {
                                suggestions && suggestions.length > 0 ?
                                <div className="autocomplete-dropdown-container">
                                    {/* {this.state.address && this.state.address.length > 0 ?
                                        <div className="bttn-top-right d-flex align-items-center justify-content-center">
                                            <a className="mobile-hide" onClick={() => this.clearAddress()}> Clear </a>
                                            <a className="mobile-show" onClick={() => this.clearAddress()}>
                                                <i className="fa fa-times-circle" aria-hidden="true"></i>
                                            </a>
                                        </div> : ''} */}

                                    {suggestions.map(suggestion => {
                                        const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
                                        // inline style for demonstration purpose
                                        const style = suggestion.active
                                            ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                            : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                        return (
                                            <div {...getSuggestionItemProps(suggestion, { className, style })}>
                                            {/* <i className="fal fa-location-arrow"></i> */}
                                                {/* <span class="fa fa-map-marker suggestionMarker"></span> */}
                                                <span className="sugText">{suggestion.description}</span>
                                            </div>
                                        )
                                    })
                                    }
                                </div> 
                                : ''
                            }
                        </div>
                    )}
                </PlacesAutocomplete>
            </Wrapper>
        );
    }
}
