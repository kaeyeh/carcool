data:
  car (one to one map to contract)
    vin, pics,
  account
    buyer, token address
    seller, token address
  contract
    state: open, start, lock, intransit, done
    buyer
    seller
    start date, expiration date
 
api:
  buyer create account,
  dealer create account,
  get car/contract list  
  create car contract,
    contract state open
  buyer order, buyer transfer token to Carcool after buyer order a car.
    contract state order, with buyer, car, start date, expiration date 
  dealer accept order,
    contract lock (no other dealer can take over) 
  dealer fulfil order, Transfer token (minus commission fee) from Carcool to Dealer 
    contract update intransit
  contract expire, token transfer back to buyer
    contract back to open
  contract close, state to done.
 

implementation,
  storage,
  token transfer,
    
