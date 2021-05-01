import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AesCryptoService {
  security_key:string='RestoFoodies';

  constructor() { }

  encryptData(data:string):string{
    return CryptoJS.AES.encrypt(data,this.security_key).toString();
  }

  decryptData(data):string{
    return CryptoJS.AES.decrypt(data,this.security_key).toString(CryptoJS.enc.Utf8);
  }
}
