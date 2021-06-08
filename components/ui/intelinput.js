import React from 'react'
import IntlTelInput from 'react-intl-tel-input'

const loadJSONP = (url, callback) => {
    const ref = window.document.getElementsByTagName('script')[0];
    const script = window.document.createElement('script');
    script.src = `${url + (url.indexOf('?') + 1 ? '&' : '?')}callback=${callback}`;
    ref.parentNode.insertBefore(script, ref);
    script.onload = () => {
        script.remove();
    };
};

const lookup = (callback) => {
    loadJSONP('http://ipinfo.io', 'sendBack');
    window.sendBack = (resp) => {
        const countryCode = (resp && resp.country) ? resp.country : '';
        callback(countryCode);
    }
};

const Intelinput = (props) => (
    <IntlTelInput   
        id = {props.id}
        defaultCountry={'in'}
        geoIpLookup={lookup}
        separateDialCode={true}
        useMobileFullscreenDropdown={true}
        css={['intl-tel-input intl-clear', 'input-hider']}
    />
)

export default Intelinput 