import { get } from "../lib/request";

// under rev
export const getCategoriesApi = async (zoneid, storeid, lat, long, mytoken) => {
    try {
        const response = await get('/business/categories/' + zoneid + '/' + storeid + '/' + parseFloat(lat) + '/' + parseFloat(long), mytoken);
        return response;
    } catch (error) {
        const err = {
            error: true,
            ...error.response
        }

        return err;
    }
};

export const getCategoriesApiNew = async (zoneID, storeType, stroeCategoryId, storeId, lat, lng, mytoken) => {
    try {
        // const response = await get('/business/categories/' + zoneID + '/' + storeType + "/" + stroeCategoryId + '/' + storeId + "/" + parseFloat(lat) + '/' + parseFloat(lng), mytoken);
        const response = await get('/productAndCategories/' + zoneID + '/' + storeType + "/" + stroeCategoryId + '/' + storeId + "/" + parseFloat(lat) + '/' + parseFloat(lng), mytoken);
        return response;
    } catch (error) {
        const err = {
            error: true,
            ...error.response
        }

        return err;
    }
};

// "/business/stores/{zoneId}/{categoryId}/{latitude}/{longitude}")
// under rev
export const getStores = async (zoneid, catId, lat, long, mytoken) => {

    try {
        const response = await get('/business/stores/' + zoneid + '/0/' + parseFloat(lat) + '/' + parseFloat(long), mytoken);
        return response;
    } catch (error) {
        const err = {
            error: true,
            ...error.response
        }

        return err;
    }
};


// /business/home/{zoneId}/{storeId}/{index}/{type}/{offerId}
// under rev
export const getProducts = async (zoneid, storeId, index, type) => {
    try {
        const response = await get('/business/home/' + zoneid + '/' + storeId + '/' + index + '/' + type + '/0', mytoken);
        return response;
    } catch (error) {
        const err = {
            error: true,
            ...error.response
        }

        return err;
    }
};
// /business/productDetails/{productId}/{latitude}/{longitude}

export const getProductDetails = async (productId, lat, lng, mytoken) => {
    try {
        const response = await get('/business/productDetails/' + productId + '/' + lat + '/' + lng, mytoken);
        return response;
    } catch (error) {
        const err = {
            error: true,
            ...error.response
        }

        return err;
    }
};

// /business/subProducts/{zoneId}/{storeId}/{index}/{type}
// under rev
export const getBrandOffersList = async (zoneId, storeId, index, type) => {
    try {
        const response = await get('/business/subProducts/' + zoneId + '/' + storeId + '/' + index + '/' + type, mytoken);
        return response;
    } catch (error) {
        const err = {
            error: true,
            ...error.response
        }

        return err;
    }
};



// Food APIS

export const getRestaurants = async (data) => {
    try {
        const response = await get(`/store/${data.type}/${data.categoryId}/${data.subcategoryId}/${data.lat}/${data.long}/${data.zoneId}/${data.offset}/${data.limit}`, data.token);
        return response;
    } catch (error) {
        const err = {
            error: true,
            ...error.response
        }

        return err;
    }
}

export const getAllStoreList = async (data) => {
    
    try {
        const response = await get(`/store/${data.type}/${data.categoryId}/${data.lat}/${data.long}/${data.zoneId}/${data.offset}/${data.limit}`, data.token);
        return response;
    } catch (error) {
        const err = {
            error: true,
            ...error.response
        }

        return err;
    }
};

export const getAllOffers = async (data) => {
    try {
        const response = await get(`/store/${data.type}/${data.categoryId}/${data.lat}/${data.long}/${data.zoneId}/${data.offset}/${data.limit}`, data.token);
        return response;
    } catch (error) {
        const err = {
            error: true,
            ...error.response
        }

        return err;
    }
};


export const getStoreCategoriesApi = async (cityId, token) => {
    try {
        const response = await get(`/store/categories/${cityId}`, token);
        return response;
    } catch (error) {
        const err = {
            error: true,
            ...error.response
        }

        return err;
    }
};

// under rev
export const getCategoryProducts = async (data) => {
    try {
        const response = await get(`/business/products/${data.zoneId}/${data.categoryId}/${data.subCategoryId}/${data.storeId}/${data.latitude}/${data.longitude}/${data.skip}/${data.limit}`, data.token);
        return response;
    } catch (error) {
        const err = {
            error: true,
            ...error.response
        }

        return err;
    }
};  