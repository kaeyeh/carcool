'''
order api example,
1. get list of orders
curl localhost:5000/order
[  
   {  
      "buyerId":"ABCFid32",
      "carId":"ABCEid32"
      "orderId":"ABCDid32",
      "status":"open"
      "contractTokenAddress": "0x931D387731bBbC988B312206c74F77D004D6B84b"
   },
   {  
      "buyerId":"BBCFid32",
      "carId":"BBCEid32"
      "sellerId":"BBCGid32",
      "orderId":"BBCDid32",
      "status":"lock"
      "contractTokenAddress": "0x931D387731bBbC988B312206c74F77D004D6B84b"
   }
]
1.1 get a paticular order
GET /order/{shordid32}
response: all the detail info 
   {  
     "buyerId":"BBCFid32",
      "carId":"BBCEid32"
      "sellerId":"BBCGid32",
      "orderId":"BBCDid32",
      "contractTokenAddress": "0x931D387731bBbC988B312206c74F77D004D6B84b"
      "status":"lock"
      "value":"{number}"
      "balance":"{number}"
      "expireData":{date}"
   }
token address is search via [ethscan](https://etherscan.io/address/0x931d387731bbbc988b312206c74f77d004d6b84b)
status could be: open lock expire intransit done

/order/{orderId} can carry x number of parameters, client need to provide necessary info
to get the order complete
2. create order, return payment escrew token_address
curl -H 'Content-Type: application/json' -X PUT -d '{"orderId":"AABBid32", ... }' \
    localhost:5000/order/{orderId}
    {
      "buyerId":"BBCFid32",
      "carId":"BBCEid32"
      "value":"120000"
    }
value is the payment needed from buyer in terms of token
response: all the current order info
   {  
      "buyerId":"BBCFid32",
      "carId":"BBCEid32"
      "orderId":"BBCDid32",
      "contractTokenAddress":"0x931D387731bBbC988B312206c74F77D004D6B84b"
      "status":"open"
      "value":"120000" 
   }

3. query order until contract contains needed `balance == value`, status changed to start
   so after 30 days if no seller accept, send back the payment, contract auto close

4. seller accept contract, so no other seller can take over
PUT /oder/{orderId}
    {
      "seller":"BBCFid32",
    }

   {  
      "buyerId":"BBCFid32",
      "carId":"BBCEid32"
      "orderId":"BBCDid32",
      "contractTokenAddress": "0x931D387731bBbC988B312206c74F77D004D6B84b"
      "status": "lock"
   }

5. seller lock contract with necessary shipment reference, buyer can't withdrew
payment to seller could usually start right now
PUT /oder/{orderId}
    {
      "shipmentRef":""
    }
response
   {  
      "status": "intransit"
   }

6. carcool authorize payment to seller, since the auto payment might not work, this give
the platform a chance to do it manually.
request:
    {
      "command":"payment"
      "credential":"some way to authorize as carcool user"
    }
response:
   {  
   }

7. carcool authorized sending back token to buyer, this give the platform a chance to
cancel the contract at certain stage.

request:
    {
      "command":"withdraw"
      "credential":"some way to authorize as carcool user"
    }
response:
   {  
   }   
'''


# python example.py for local testing
from flask import Flask
from flask import request
from flask import jsonify


app = Flask(__name__)

@app.route('/order', methods=['GET'])
def api_order_get():
    '''
    important is contract status, most of the info should be in backend
    TODO, need access to all the info especially the token_address
    seller also need to provide token_address 
    return: list of contracts
    '''
    contract1 = dict(
        orderId='ABCDid32', 
        carInfo=dict(car_id='ABCEid32'), 
        buyerId='ABCFid32',
        status=0)
    contract2 = dict(
        orderId='BBCDid32', 
        carInfo=dict(car_id='BBCEid32'),
        status=1,
        buyerId='BBCFid32',
        sellerId='BBCGid32')
    return jsonify([contract1, contract2])

@app.route('/order', methods=['PUT'])
def api_order_put():
    '''
    TODO, need to clarify how/who to access backend database
    how to access infos like car balance, insurance proof, shipping proof in
    order to validate the seller really shipped the car
    '''
    data = 'ok'
    return jsonify(data)

if __name__ == '__main__':
    app.run()

