const fetch = require("node-fetch");

var url = "https://contributions.cryptocompare.com";
var tradeUrl = url + "/v1/tu";
var orderbookUrl = url + "/v1/ob";

var apikey = "API_KEY";
var lastTradeId = 0;

async function postTradeUpdate(fromsymbol,tosymbol,price,volume,tradetime,tradetype,tradeid){
	if(!["buy","sell"].includes(tradetype)){
        return false;
    }
	if(tradeid  != lastTradeId + 1){
		return false;
    }
	var payload = {
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
    await fetch(tradeUrl,{
        method: "POST",
        headers: {"Content-Type": "application/json; charset=utf-8"},
        body: JSON.stringify(payload)
    }).then(async res => {
		r = {
			status:res.status,
			body:await res.text()
        }
        console.log(r.status);
        console.log(r.body);
        if(r.status == 200){
            lastTradeId = lastTradeId + 1;
            return true;
        }
        else if(r.status == 429){
            // wait for 30 seconds then retry message
            console.log("Rate limited! Try again..");
        }
        return false;
	});
}
async function postOrderbookUpdate(fromsymbol,tosymbol,bids,asks,updatetime){
	var payload = {
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
	await fetch(orderbookUrl,{
        method: "POST",
        headers: {"Content-Type": "application/json; charset=utf-8"},
        body: JSON.stringify(payload)
    }).then(async res => {
		r =  {
			status:res.status,
			body:await res.text()
        }
        console.log(r.status)
        console.log(r.body)
        if(r.status == 200){
            return true;
        }
        else if(r.status == 429){
            // wait for 30 seconds then retry message
            console.log("Rate limited! Try again..");
        }
        return false;
    });
}
(async () => {
    await postTradeUpdate("BTC","USD",6500,100,123456789000,"sell",1);
    await postTradeUpdate("BTC","USD",6501,101,123456789123,"sell",2);
    await postOrderbookUpdate("BTC","USD",[["100","10"],["101","10"]],[["120","30"],["130","31"]],123456789456);
    await postOrderbookUpdate("BTC","USD",[["101","11"],["102","11"]],[["121","31"],["131","32"]],123456789789);
})();