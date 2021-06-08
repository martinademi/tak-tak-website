import { postWithToken, get, patchWithToken } from "../lib/request"
import { setCookie, getCookie, removeCookie } from '../lib/session'

const token = getCookie('token', '');


export const getCustomerOrders = async (type) => {
    try {
        const response = await get("/customer/order/" + type.pageIndex + "/" + type.type + "/" + "0", token);
        return response;
    } catch (error) {
        const err = {
            error: true,
            ...error.response
        }

        return err;
    }
};

export const getOrderDetail = async (orderId) => {
    try {
        const response = await get("/customer/order/detail/" + orderId, token);
        return response;
    } catch (error) {
        const err = {
            error: true,
            ...error.response
        }

        return err;
    }
};

export const getCustomerProfile = async () => {
    let myToken = await token;
    try {
        const response = await get("/customer/profile", myToken);
        return response;
    } catch (error) {
        const err = {
            error: true,
            ...error.response
        }

        return err;
    }
};

export const getSupportData = async (type) => {
    try {
        const response = await get("/customer/support");
        return response;
    } catch (error) {
        const err = {
            error: true,
            ...error.response
        }

        return err;
    }
};

export const reorderItem = async (data) => {
    try {
        const response = await patchWithToken("/customer/order", data);
        return response;
    } catch (error) {
        const err = {
            error: true,
            ...error.response
        }

        return err;
    }
};


export const updateCustomerDetail = async (data) => {
    try {
        const response = await patchWithToken("/customer/profile", data);
        return response;
    } catch (error) {
        const err = {
            error: true,
            ...error.response
        }

        return err;
    }
};

export const rechargeWallet = async (data) => {
    try {
        const response = await postWithToken("/customer/rechargeWallet", data);
        return response;
    } catch (error) {
        const err = {
            error: true,
            ...error.response
        }

        return err;
    }
};

export const getWalletDetail = async () => {
    try {
        const response = await get("/customer/walletDetail", token);
        return response;
    } catch (error) {
        const err = {
            error: true,
            ...error.response
        }

        return err;
    }
};

export const getWalletHistory = async (pageIndex) => {
    try {
        const response = await get("/customer/walletTransaction/" + pageIndex, token);
        return response;
    } catch (error) {
        const err = {
            error: true,
            ...error.response
        }

        return err;
    }
};

export const getRatingQuest = async (orderId) => {
    try {
        const response = await get("/customer/rating/" + orderId, token);
        return response;
    } catch (error) {
        const err = {
            error: true,
            ...error.response
        }

        return err;
    }
};
export const saveRatings = async (data) => {
    try {
        const response = await patchWithToken("/customer/rating", data);
        return response;
    } catch (error) {
        const err = {
            error: true,
            ...error.response
        }

        return err;
    }
};

export const createTicket = async (data) => {
    try {
        const response = await postWithToken("/zendesk/ticket", data);
        return response;
    } catch (error) {
        const err = {
            error: true,
            ...error.response
        }
      
        return err;
    }
};

export const getTicketDetail = async (email_id) => {
    try {
        const response = await get("/zendesk/user/ticket/" + email_id, token);
        return response;
    } catch (error) {
        const err = {
            error: true,
            ...error.response
        }
   
        return err;
    }
};

export const getTicketHistory = async (req_id) => {
    try {
        const response = await get("/zendesk/ticket/history" + req_id, token);
        return response;
    } catch (error) {
        const err = {
            error: true,
            ...error.response
        }
        return err;
    }
};