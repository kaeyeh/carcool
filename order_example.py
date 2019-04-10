'''
order api example,
1. get list of orders
curl localhost:5000/order
[  
   {  
      "buyerId":"ABCFid32",
      "carId":"ABCEid32"
      "orderId":"ABCDid32",
      "status":0
   },
   {  
      "buyerId":"BBCFid32",
      "carId":"BBCEid32"
      "sellerId":"BBCGid32",
      "orderId":"BBCDid32",
      "status":1
   }
]

2. update order
curl -H 'Content-Type: application/json' -X PUT -d '{"orderId":"AABBid32", }' \
    localhost:5000/order
'''
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

