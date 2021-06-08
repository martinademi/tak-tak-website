import { setCookie, getCookie, getCookiees, removeCookie } from '../lib/session'
import * as enVariables from '../lib/envariables'


const token = getCookie('token', '')

import axios from 'axios'

export const getFilterParams = async (popularStatus, filterType, from, size, storeId, ifOffer, query, zoneId) => {

    let data;

 

    query ?

        ifOffer ?

            data = {
                "from": from, "size": size,
                "query": {
                    "bool":
                    {
                        "must": [
                            { "match": { "status": 1 } },
                            // { "match": { "storeId": storeId } },
                            query,
                            { "match": { "offer.status": 1 } }]
                    }
                }
            } :

            data = {
                "from": from, "size": size,
                "query": {
                    "bool":
                    {
                        "must": [
                            { "match": { "status": 1 } },
                            query,
                            // { "match": { "storeId": storeId } },
                        ]
                    }
                }
            }

        :

        ifOffer ?

            data = {
                "from": from, "size": size,
                "query": {
                    "bool":
                    {
                        "must": [
                            { "match": { "status": 1 } },
                            // { "match": { "storeId": storeId } },
                            { "match": { "offer.status": 1 } }]
                    }
                }
            } :

            data = {
                "from": from, "size": size,
                "query": {
                    "bool":
                    {
                        "must": [
                            { "match": { "status": 1 } },
                            // { "match": { "storeId": storeId } },
                        ]
                    }
                }
            }

    storeId == 0 ? data.query.bool.must.push({ "match": { "zoneId": zoneId } }) : data.query.bool.must.push({ "match": { "storeId": storeId } })

    return axios.post(enVariables.FILTER_HOST + '/filterParameters/',
        data,
        {
            headers: {
                'Content-Type': 'application/json',
                'popularStatus': popularStatus,
                'filterType': filterType,
                'language': 'en',
                'authorization': token
            }
        }
    );
};

export const searchFilterParams = async (popularStatus, from, size, storeId, zoneId, ifOffer, query) => {

    let data;

    ifOffer ?

        data = {
            "from": from, "size": size,
            "query": {
                "bool":
                {
                    "must": [
                        { "match": { "status": 1 } },
                        query,
                        { "match": { "offer.status": 1 } }
                    ],
                }
            }
        } :

        data = {
            "from": from, "size": size,
            "query": {
                "bool":
                {
                    "must": [
                        { "match": { "status": 1 } },
                        query
                    ]
                }
            }
        }

    storeId == 0 ? data.query.bool.must.push({ "match": { "zoneId": zoneId } }) : data.query.bool.must.push({ "match": { "storeId": storeId } })


    return axios.post(enVariables.FILTER_HOST + '/searchFilter/',
        data,
        {
            headers: {
                'Content-Type': 'application/json',
                'popularStatus': popularStatus,
                'language': 'en',
                'authorization': token,
                'zoneId': zoneId,
                'storeId': storeId,
            }
        }
    );
};



export const sortFilterParams = async (popularStatus, from, size, storeId, zoneId, ifOffer, query, sort) => {

    let data;

    query ?
        sort ?

            data = {
                "from": from, "size": size,
                "sort": sort,
                "query": {
                    "bool":
                    {
                        "must": [
                            { "match": { "status": 1 } },
                            { "match": { "storeId": storeId } },
                            query,
                        ],
                    }
                }
            } :

            data = {
                "from": from, "size": size,
                "query": {
                    "bool":
                    {
                        "must": [
                            { "match": { "status": 1 } },
                            query,
                            { "match": { "storeId": storeId } },
                        ]
                    }
                }
            }

        : sort ?

            data = {
                "from": from, "size": size,
                "sort": sort,
                "query": {
                    "bool":
                    {
                        "must": [
                            { "match": { "status": 1 } },
                            { "match": { "storeId": storeId } },
                        ],
                    }
                }
            } :

            data = {
                "from": from, "size": size,
                "query": {
                    "bool":
                    {
                        "must": [
                            { "match": { "status": 1 } },
                            { "match": { "storeId": storeId } },
                        ]
                    }
                }
            }


    ifOffer ? data.query.bool.must.push({ "match": { "offer.status": 1 } }) : ''


    return axios.post(enVariables.FILTER_HOST + '/searchFilter/',
        data,
        {
            headers: {
                'Content-Type': 'application/json',
                'popularStatus': popularStatus,
                'language': 'en',
                'authorization': token,
                'zoneId': zoneId,
                'storeId': storeId,
            }
        }
    );
};


export const getSuggestions = async (strToSearch, storeId) => {

    let data = {
        "from": 0, "size": 10,
        "query": {
            "bool":
            {
                "must":
                    [
                        { "match": { "status": 1 } },
                        { "match_phrase_prefix": { "productname.en": strToSearch } },
                        { "match": { "storeId": storeId } }
                    ]
            }
        }
    }

    return axios.post(enVariables.FILTER_HOST + '/suggestions/',
        data,
        {
            headers: {
                'Content-Type': 'application/json',
                'language': 'en',
                'authorization': token
            }
        }
    );
};

export const getTopSearch = async (storeId) => {

    // let data = {
    //     "from": 0, "size": 10,
    //     "query": {
    //         "bool":
    //             {
    //                 "must":
    //                     [
    //                         { "match": { "status": 1 } },
    //                         { "match_phrase_prefix": { "productname.en": strToSearch } },
    //                         { "match": { "storeId": "5b572a26a553234128e56da7" } }
    //                     ]
    //             }
    //     }
    // }

    let data = {
        "sort":
            [{
                "count": { "order": "desc" }
            }],
        "query":
        {
            "bool":
                { "must": [{ "match": { "storeId": storeId } }] }
        }, "size": 10, "from": 0
    }


    return axios.post(enVariables.FILTER_HOST + '/popularSearchFilter/',
        data,
        {
            headers: {
                'Content-Type': 'application/json',
                'language': 'en',
                'authorization': token
            }
        }
    );
};

export const getOffers = async (storeId) => {
    // return axios.get(enVariables.OFFERS_HOST + '/offerslist/' + storeId,
    return axios.get(enVariables.FILTER_HOST + "/offerslist/" + storeId,
        {
            headers: {
                'Content-Type': 'application/json',
                'language': 'en',
                'authorization': token
            }
        }
    );
};

export const searchProductFromZone = async (from, size, zoneId, searchString) => {

    let data = {
        "from": from, "size": size,
        "query": {
            "bool":
            {
                "must": [
                    { "match": { "status": 1 } },
                    { "match_phrase_prefix": { "productname.en": searchString } },
                    { "match": { "zoneId": zoneId } },
                ]
            }
        }
    }

    return axios.post(enVariables.FILTER_HOST + '/searchFilter/',
        data,
        {
            headers: {
                'Content-Type': 'application/json',
                'popularStatus': 0,
                'language': 'en',
                'authorization': token,
                'zoneId': zoneId,
                'storeId': 0,
            }
        }
    );
};


export const storeWiseProductSuggestions = async (from, size, zoneId, searchString, storeCategoryId, storeType, latitude, longitude) => {

    let data = {
        "from": from, "size": size,
        "query": {
            "bool":
            {
                "must": [
                    { "match": { "status": 1 } },
                    { "match_phrase_prefix": { "productname.en": searchString } },
                    { "match": { "zoneId": zoneId } },
                ]
            }
        }
    }

    return axios.post(enVariables.FILTER_HOST + '/storeWiseProductSuggestions/',
        data,
        {
            headers: {
                'Content-Type': 'application/json',
                'language': 'en',
                'authorization': token,
                'zoneId': zoneId,
                "searchedItem": searchString,
                "storeCategoryId": storeCategoryId,
                "storeType": storeType,
                "latitude": latitude,
                "longitude": longitude,
            }
        }
    );
};



export const storeFilterParameters = async () => {

    let data = {
        "from": 0, "size": 10,
        "query": {
            "bool": {
                "must": [
                    { "match": { "status": 1 } },
                    { "match": { "serviceZones": "5b7bf3fbf801683f1b14b3f6" } },
                    { "match": { "storeCategory.categoryId": "5b7acea8f801686e31123ec9" } },
                    { "match": { "storeType": 1 } }
                ]
            }
        }
    }

    return axios.post(enVariables.FILTER_HOST + "/storeFilterParameters/",
        data,
        {
            headers: {
                'Content-Type': 'application/json',
                'language': 'en',
                'authorization': token,
                'filterType': 3
            }
        }
    );
};

export const storeSearchFilter = async (zoneId, storeCategoryId, storeType, query, lat, lng) => {

    let data = {
        "from": 0, "size": 10,
        "query": {
            "bool": {
                "must": [
                    { "match": { "status": 1 } },
                    { "match": { "serviceZones": zoneId } },
                    { "match": { "storeCategory.categoryId": storeCategoryId } },
                    { "match": { "storeType": parseInt(storeType) } },
                    { "match_phrase_prefix": { "sName.en": query } }
                ]
            }
        }
    }

    return axios.post(enVariables.FILTER_HOST + "/storeSearchFilter/",
        data,
        {
            headers: {
                'Content-Type': 'application/json',
                'language': 'en',
                'latitude': lat,
                'longitude': lng
                // 'authorization': token,
                // 'filterType': 3
            }
        }
    );
};


export const getOffersFilter = async (zoneId, categoryType) => {

    let data = {
        "from": 0, "size": 10,
        "query": {
            "bool": {
                "must": [
                    { "match": { "status": 1 } },
                    { "match": { "zones": zoneId } },
                    { "match": { "storeType": categoryType } }
                    // ,
                    // { "match": { "status": 1 } },
                    // { "match": { "serviceZones": zoneId } },
                    // { "match": { "storeCategory.categoryId": storeCategoryId } },
                    // { "match": { "storeType": parseInt(storeType) } },
                    // { "match_phrase_prefix": { "sName.en": query } }
                ]
            }
        }
    }

    return axios.post(enVariables.FILTER_HOST + "/offers/",
        data,
        {
            headers: {
                'Content-Type': 'application/json',
                'language': 'en'
            }
        }
    );
}; 
