import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { BillService } from 'src/app/services/bill.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(private cartService: CartService, private billService: BillService, private toastr: ToastrService) { }
  cartItems: any = [];
  totalCart: number = 0;
  bill: any = {
    email: localStorage.getItem('email'),
    products: [],
    date:{
      create_date: new Date().toLocaleDateString(),
      paied_date: '',
    }
  }
  ngOnInit(): void {
    this.getCart();
    this.calculateTotal();
  }
  calculateTotal() {
  
  }
  getCart(){
    this.cartService.getCart().subscribe(
      data => {
        console.log(data);
        this.cartItems = data['cart'];
        if (this.cartItems == null) {
          this.totalCart = 0;
        }else{
          console.log(this.cartItems);
          this.cartItems.forEach((element: { product_price: any ; product_quantity: any; }) => {
            console.log(element.product_price);
            this.totalCart += parseInt(element.product_price)  * parseInt(element.product_quantity);  // parseInt(element.product.price) * element.quantity;
          });
        }
        
      },
      err => {
        if (err.status === 401) {
          if(localStorage.getItem('role') == "0"){

          }else{
            localStorage.clear();
          }
          
        }
        console.log(err);
      }
    );
  }
  deleteToCart(id: any) {
    this.cartService.deleteFromCart(id).subscribe(
      data => {
        console.log(data);
        window.location.reload();
      },
      err => {
        console.log(err);
      }
    );
  }
  updateCart(id: any, quantity: any) {
    console.log(id, quantity);
    this.cartItems.forEach((element: { product_price: any ; product_quantity: any; product_name: any ; product_id: any }) => {
      
      if (element.product_id == id) {
        element.product_quantity = quantity;
      }
    })
    /*
    this.cartService.updateCart(id, quantity).subscribe(
      data => {
        console.log(data);
      },
      err => {
        console.log(err);
      }
    )
    */

  }
  checkout() {
    this.cartItems.forEach((element: { product_price: any ; product_quantity: any; product_name: any ; product_id: any }) => {
      this.bill.products.push({
        product_name: element.product_name,
        product_quantity: element.product_quantity,
        total: element.product_price * element.product_quantity,
        product_id: element.product_id
      })
    })
    this.billService.createBill(this.bill).subscribe(
      data => {
        console.log(data.message);
        window.location.reload();
      },
      err => {
        console.log(err);
      }
    )
  }
  addQuantity(id: any) {
    this.cartItems.forEach((element: { product_price: any ; product_quantity: any; product_name: any ; product_id: any }) => {
      if (element.product_id == id) {
        var quantity = parseInt(element.product_quantity) + 1;
        this.cartService.updateCart(id, quantity.toString()).subscribe(
          data => {
            console.log(data);
            if (data['status'] == 200) {
              element.product_quantity = parseInt(element.product_quantity) + 1;
              this.totalCart += parseInt(element.product_price);
            }
            if (data['status'] == 400) {
              this.toastr.warning(data['message'], 'Thông báo');
            }

          },
          err => {
            console.log(err);            
          }
        )
      }
    })
  }
  subQuantity(id: any) {
    this.cartItems.forEach((element: { product_price: any ; product_quantity: any; product_name: any ; product_id: any }) => {
      if (element.product_id == id) {
        if (parseInt(element.product_quantity) > 1) {
          var quantity = parseInt(element.product_quantity) - 1;
        this.cartService.updateCart(id, quantity.toString()).subscribe(
          data => {
            console.log(data);
            if (data['status'] == 200) {
              element.product_quantity = parseInt(element.product_quantity) - 1;
            }
            this.totalCart -= parseInt(element.product_price);
            
          },
          err => {
            console.log(err);
            
          }
        )
        }
        else {
          this.toastr.warning("Số lượng sản phẩm phải lớn hơn 1", "Thông báo");
        }
      }
    })
  }
}
