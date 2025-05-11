export interface Customer {
  name:       string;
  password:   string;
  surname:    string;
  surname2:   string;
  address:    string;
  city:       string;
  province:   string;
  region:     string;
  postalCode: string;
  email:      string;
  phone:      string;
  status:     boolean;
}

export interface CustomerResponse {
  id:         number;
  email:      string;
  name:       string;
  surname:    string;
  surname2:   string;
  address:    string;
  city:       string;
  province:   string;
  region:     string;
  postalCode: string;
  phone:      string;
  status:     boolean;
}
