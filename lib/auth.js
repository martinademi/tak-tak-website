import redirect from "./redirect";
import { setCookie, getCookie, getCookiees, removeCookie } from "./session";
// import { authenticate } from "../services/authApi";
// import { createUser } from "../services/userApi";
import { authenticateGuest } from "../services/guestLogin";
// import { validateCredentials, validateNewUser } from "./validation";

import * as PackageJson from "../package.json";

export const guestLogin = async () => {
  const res = await authenticateGuest();
}

// export const signIn = async (email, password) => {
//   const error = validateCredentials(email, password);
//   if (error) {
//     return error;
//   }

//   const res = await authenticate(email, password);
//   if (!res.jwt) {
//     return res;
//   }

//   setCookie("jwt", res.jwt);
//   redirect("/user");
//   return null;
// };

// export const signUp = async (name, email, password, password_confirmation) => {
//   const error = validateNewUser(name, email, password, password_confirmation);
//   if (error) {
//     return error;
//   }

//   const res = await createUser(name, email, password, password_confirmation);

//   if (!res.data) {
//     return res;
//   }

//   setCookie("success", `${name}, your account was created.`);
//   redirect("/auth/login");
//   return null;
// };

// export const signOut = (ctx = {}) => {
//   if (process.browser) {
//     removeCookie("jwt");
//     redirect("/auth/login", ctx);
//   }
// };

export const getJwt = ctx => {
  return getCookiees("locAuthenticated", ctx.req);
};

export const getStoreName = ctx => {
  return getCookiees("storeName", ctx.req)
}

export const authorized = ctx => {
  return getCookiees("authorized", ctx.req);
};

export const isAuthorized = ctx => !!authorized(ctx);


export const isAuthenticated = ctx => !!getJwt(ctx);

export const redirectIfAuthenticated = ctx => {
  let StoreName = getCookiees("storeName", ctx.req);

  // if (isAuthenticated(ctx)) {
  //   redirect(`/stores/${StoreName.replace(/%20/g, '-').replace(/,/g, '').replace(/& /g, '').replace(/ /g, '-')}`, ctx);
  //   return true;
  // }
  if (isAuthenticated(ctx)) {
    let city = getCookiees("cityReg", ctx.req);
    // redirect("/restaurants", ctx)
    redirect(`/${city}/stores`, ctx);
    return true;
  }
  return false;
};

export const redirectIfNotAuthenticated = ctx => {

  if (PackageJson.version != getCookiees("version", ctx.req)) {
    setCookie("version", null);
    // redirect("/test", ctx);
  }

  if (!isAuthenticated(ctx)) {
    redirect("/", ctx);
    return true;
  }
  return false;
};

export const redirectIfNotAuthorized = ctx => {
  if (!isAuthorized(ctx)) {
    redirect("/", ctx);
    return true;
  }
  return false;
};

export const deleteAllCookies = async () => {
  await document.cookie.split(';').forEach((c) => {
    document.cookie = c.trim().split('=')[0] + '=;' + 'expires=Thu, 01 Jan 1970 00:00:00 UTC;';
  });
  browser.cookies.remove();
 
  // redirect('/')
}

export const getLocation = () => {

  const geolocation = navigator.geolocation;
  let latlongs;
  const location = new Promise((resolve, reject) => {
    if (!geolocation) {
      reject(new Error('Not Supported'));
    }
    geolocation.getCurrentPosition((position) => {
     
      resolve(position);
    }, () => {
      reject(new Error('Permission denied'));
    }, { enableHighAccuracy: true });
  });

  return location;

}
