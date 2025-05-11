export interface Cart {
  userId:      number;
  cartDetails: CartDetail[];
}

export interface CartDetail {
  productId: number;
  quantity:  number;
}

export interface AddProductToCartRequest {
  productId: number;
  quantity:  number;
}

export interface CartResponse {
  userId:      number;
  date:        Date;
  cartDetails: CartDetail[];
}

export interface CartDetailResponse {
  productId: number;
  price:     number;
  quantity:  number;
}

