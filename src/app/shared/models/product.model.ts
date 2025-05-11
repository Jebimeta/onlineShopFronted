export interface Product {
  append(arg0: string, arg1: string): unknown;
  name:        string;
  description: string;
  size:        string;
  type:        string;
  price:       number;
  image:       File;
}

export interface ProductResponse {
  id:          number;
  name:        string;
  description: string;
  size:        string;
  type:        string;
  price:       number;
  image:       File;
}
