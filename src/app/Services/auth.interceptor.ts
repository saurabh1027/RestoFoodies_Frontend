/*
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export class AuthInterceptor implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let newReq = req;
        let token = sessionStorage.getItem('UserToken');
        if(token!=null){
            newReq = newReq.clone({setHeaders:{Authorization:'Bearer '+token}});
        }else{
            console.log("Unauthorized access:auth-interceptor@11")
        }
        return next.handle(newReq);
    }

}
*/