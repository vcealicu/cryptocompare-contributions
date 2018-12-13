import requests

url = "https://contributions.cryptocompare.com"
tradeUrl = url + "/v1/tu"
orderbookUrl = url + "/v1/ob"

apikey = "API_KEY"
lastTradeId = 0

def postTradeUpdate(fromsymbol,tosymbol,price,volume,tradetime,tradetype,tradeid):
	global lastTradeId
	if tradetype not in ["buy","sell"]:
		return False
	if tradeid  != lastTradeId + 1:
		return False
	
	payload = {
		"apikey": apikey,
		"tu": [
			{
				"fsym": fromsymbol,
				"tsym": tosymbol,
				"price": price,
				"volume": volume,
				"type": tradetype,
				"timestamp": tradetime,
				"tradeid": tradeid
			}
		]
	}
	r = requests.post(tradeUrl,json=payload)
	print(r.status_code)
	print(r.text)
	if r.status_code == 200:
		lastTradeId = lastTradeId + 1
		return True
	elif r.status_code == 429:
		# wait for 30 seconds then retry message
		print("Rate limited! Try again..")

	return False

def postOrderbookUpdate(fromsymbol,tosymbol,bids,asks,updatetime):
	
	payload = {
		"apikey": apikey,
		"ob": [
			{
				"fsym": fromsymbol,
				"tsym": tosymbol,
				"bids": bids,
				"asks": asks,
				"timestamp": updatetime
			}
		]
	}
	r = requests.post(orderbookUrl,json=payload)
	print(r.status_code)
	print(r.text)
	if r.status_code == 200:
		return True
	elif r.status_code == 429:
		# wait for 30 seconds then retry message
		print("Rate limited! Try again..")

	return False
	
postTradeUpdate("BTC","USD",6500,100,123456789000,"sell",1)
postTradeUpdate("BTC","USD",6501,101,123456789123,"sell",2)
postOrderbookUpdate("BTC","USD",[["100","10"],["101","10"]],[["120","30"],["130","31"]],123456789456)
postOrderbookUpdate("BTC","USD",[["101","11"],["102","11"]],[["121","31"],["131","32"]],123456789789)