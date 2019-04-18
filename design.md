# general description
## option 1 (not considered for now)
  platform use token as escrow. initially platform post list of cars for buyer to choose. 
buyer pay token using ethereum wallet to platform created contract address.
once platform verified token balance in contract, it allows seller to lock the order/contract to ship the car. 
seller can also use the locked order as the proof of intended sale action to get a loan from special deisignated bank.
 once saler shipped car with platform verified shipping/custom/insurance paper. 
platform release the token to seller (with deducted commission fee) for using as loan payment.
buyer may withdraw the order if seller hasn't lock the order.
## option 2 (selected)
  platform as blockchain proxy. buyer post order for intention of buying a specific car.
seller locked the order, buyer send token to seller address using ethereum wallet.
seller use the received token (then send the token to platform?) to get a loan from platform designated bank. 
seller use the loan paper to buy car from dealer together with platform specified agent.
platform agent process the car shipping detail together with seller. 
seller receive commission fee from platform?


# data structure
## car (one to one map to contract)
  - vin, pics,
## account
  - buyer, token address
  - seller, token address
## contract
  - state: open, start, lock, intransit, done
  - buyer
  - seller
  - start date, expiration date
  - insurance
  - ship info
 
# api for option 1 (not considered)
##  buyer create account,
##  dealer create account,
##  get car/contract list  
##  create car contract,
  - contract state open
##  buyer order, buyer transfer token to Carcool after buyer order a car.
  - contract state order, with buyer, car, start date, expiration date 
##  dealer accept order,
  - contract lock (no other dealer can take over) 
##  dealer fulfil order, Transfer token (minus commission fee) from Carcool to Dealer 
  - contract update intransit
  - shipping info, insurance
##  contract expire, token transfer back to buyer
  - contract back to open
##  contract close, state to done.
  - custom clear
 

# api for option 2 (selected)
## given seller token address, platform as a proxy return the token balance. 

# implementation,
##  storage,
##  token transfer,
    
