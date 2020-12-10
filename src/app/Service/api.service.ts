import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../Model/product';
import { User } from '../Model/user';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { Address } from '../Model/address';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private REG_API = "http://localhost:8080/user/signup";                 
  private LOGU_API = "http://localhost:8080/user/verify";
  private LOGA_API = "http://localhost:8080/admin/verify";
  private PRDLST_API = "http://localhost:8080/user/getProducts";
  private ADD_CART_API = "http://localhost:8080/user/addToCart?productId=";
  private VW_CART_API = "http://localhost:8080/user/viewCart";
  private UP_CART_API = "http://localhost:8080/user/updateCart";
  private DEL_CART_API = "http://localhost:8080/user/delCart";
  private PLC_ORD_API = "http://localhost:8080/user/placeOrder";
  private ADR_API = "http://localhost:8080/user/addAddress";
  private GT_ADR_API = "http://localhost:8080/user/getAddress";
  private ADD_PRD_API = "http://localhost:8080/admin/addProduct";
  private DEL_PRD_API = "http://localhost:8080/admin/delProduct";  
  private ORD_API = "http://localhost:8080/admin/viewOrders";
  private UPD_ORD_API = "http://localhost:8080/admin/updateOrder";


  constructor(@Inject(SESSION_STORAGE) private storage: StorageService, private http: HttpClient) {

  }                                                         /** npm install --save angular-webstorage-service */
  // Registering user
  register(user: User): Observable<any> {                                           
    return this.http.post(this.REG_API,
      JSON.stringify(user),
      {
        headers:
          { 'Content-Type': 'application/json' }
      });
  }
  // validating user 
  userLogin(user: User): Observable<any> {
    return this.http.post(this.LOGU_API,
      JSON.stringify(user),
      {
        headers:
          { 'Content-Type': 'application/json' }
      });
  }

  // validating admin 
  adminLogin(user: User): Observable<any> {
    return this.http.post(this.LOGA_API,
      JSON.stringify(user),
      {
        headers:
          { 'Content-Type': 'application/json' }
      });
  }
  // product dekhne ke liye
  getProducts(auth: string): Observable<any> {

    const myheader = new HttpHeaders().set('AUTH_TOKEN', auth);
    return this.http.post<any>(this.PRDLST_API, null, { headers: myheader });

  }


  // Add Products to  Cart
  addCartItems(product: Product, auth: string): Observable<any> {
    const myheader = new HttpHeaders().set('AUTH_TOKEN', auth);
    return this.http.get<any>(this.ADD_CART_API + product.productid, { headers: myheader });
  }



  



  // demand cart ka product dekhne ke liye

  getCartItems(auth: string): Observable<any> {
    const myheader = new HttpHeaders().set('AUTH_TOKEN', auth);
    return this.http.get<any>(this.VW_CART_API, { headers: myheader });
  }

  
  
  // update items to cart 
  updateCart(auth: string, prodid: number, quant: number): Observable<any> {
    const myheader = new HttpHeaders().set('AUTH_TOKEN', auth);
    return this.http.get<any>(this.UP_CART_API + "?bufcartid=" + prodid + "&quantity=" + quant, { headers: myheader });
  }

  // delete cart Item 
  delCart(auth: string, bufdid: number): Observable<any> {
    const myheader = new HttpHeaders().set('AUTH_TOKEN', auth);
    return this.http.get<any>(this.DEL_CART_API + "?bufcartid=" + bufdid, { headers: myheader });
  }






  
  // place the order of logged User
  place(auth: string): Observable<any> {
    const myheader = new HttpHeaders().set('AUTH_TOKEN', auth);
    return this.http.get<any>(this.PLC_ORD_API, { headers: myheader });
  }

  // update Address of logged User
  upAddress(auth: string, adr: Address): Observable<any> {
    const myheader = new HttpHeaders().set('AUTH_TOKEN', auth);
    return this.http.post<any>(this.ADR_API, adr, { headers: myheader });
  }

  // // fetch address of logged user
  getAddress(auth: string): Observable<any> {
    const myheader = new HttpHeaders().set('AUTH_TOKEN', auth);
    return this.http.post<any>(this.GT_ADR_API, null, { headers: myheader });
  }


  // Add product


  


  addProduct(auth: string, desc: string,
    quan: string, price: string, prodname: string, image: File): Observable<any> {

    const formData: FormData = new FormData();
    formData.append("description", desc);
    formData.append("price", price);
    formData.append("productname", prodname);
    formData.append("quantity", quan);
    formData.append("file", image);

    const myheader = new HttpHeaders().set('AUTH_TOKEN', auth);
    return this.http.post<any>(this.ADD_PRD_API, formData, { headers: myheader });

  }

 


  //delete Product 
  delProduct(auth:string,prodid:number): Observable<any>{
    const myheader=new HttpHeaders().set('AUTH_TOKEN',auth);
    return this.http.get<any>(this.DEL_PRD_API+"?productid="+prodid,{headers:myheader})
  }
  

  // get order
  getOrders(auth: string) {
    const myheader = new HttpHeaders().set('AUTH_TOKEN', auth);
    return this.http.get<any>(this.ORD_API, { headers: myheader })
  }
//update order status
  update(auth: string, order: any) {
    const myheader = new HttpHeaders().set('AUTH_TOKEN', auth);
    const formData: FormData = new FormData();
    formData.append("orderId", order.orderId);
    formData.append("orderStatus", order.orderStatus);
    return this.http.post<any>(this.UPD_ORD_API, formData, { headers: myheader })
  }

  

  // Authentication Methods 

  public isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  storeToken(token: string, auth_type: string) {
    this.storage.set("auth_token", token);
    this.storage.set("auth_type", auth_type);
  }

  getAuthType(): string {
    if (this.storage.get("auth_type") !== null) {
      return this.storage.get("auth_type");
    }
    return null;
  }


  getToken() {
    return this.storage.get("auth_token");
  }

  removeToken() {
    this.storage.remove("auth_type");
    return this.storage.remove("auth_token");
  }

}
