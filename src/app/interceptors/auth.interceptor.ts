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
import { environment } from '../../environments/environment.development';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const oktaAuth = inject(OKTA_AUTH) as OktaAuth;
  var baseUrl = environment.baseUrl;
  console.log('qa env? ' + baseUrl);

  const handleAccess = async () => {
    const securedEndpoints = [baseUrl + 'orders'];

    if (securedEndpoints.some((url) => req.urlWithParams.includes(url))) {
      const accessToken = await oktaAuth.getAccessToken();

      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accessToken,
        },
      });
    }

    return await lastValueFrom(next(req));
  };

  return from(handleAccess());
};
