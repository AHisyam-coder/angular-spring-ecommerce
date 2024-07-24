// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { OKTA_AUTH } from '@okta/okta-angular';
// import OktaAuth from '@okta/okta-auth-js';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const oktaAuth = inject(OKTA_AUTH) as OktaAuth;
//   const securedEndpoints = ['http://localhost:8080/api/orders'];

//   if (securedEndpoints.some((url) => req.urlWithParams.includes(url))) {
//     const accessToken = oktaAuth.getAccessToken();
//     req = req.clone({
//       setHeaders: {
//         Authorization: 'Bearer ' + accessToken,
//       },
//     });
//   }

//   return next(req);
// };

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { from, lastValueFrom } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const oktaAuth = inject(OKTA_AUTH) as OktaAuth;

  const handleAccess = async () => {
    const securedEndpoints = ['http://localhost:8080/api/orders'];

    if (securedEndpoints.some(url => req.urlWithParams.includes(url))) {
      const accessToken = await oktaAuth.getAccessToken();

      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accessToken
        }
      });
    }

    return await lastValueFrom(next(req));
  };

  return from(handleAccess());
};

