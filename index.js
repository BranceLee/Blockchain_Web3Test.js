var Web3 = require('web3');

//创建web3 实例对象
var web3 = new Web3();
//连接以太坊的节点
web3.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'));

//上两句等价于：
var web3 = new Web3('http://localhost:8545');

// 合约ABI,参数索引https://web3js.readthedocs.io/en/1.0/glossary.html
var abi = [
	{
		constant: false,
		inputs: [ { name: 'receiver', type: 'address' }, { name: 'amount', type: 'uint256' } ],
		name: 'sendCoin',
		outputs: [ { name: 'sufficient', type: 'bool' } ],
		payable: false,
		type: 'function'
	},
	{
		constant: false,
		inputs: [ { name: 'addr', type: 'address' } ],
		name: 'getBalance',
		outputs: [ { name: '', type: 'uint256' } ],
		payable: false,
		type: 'function'
	},
	{ inputs: [], payable: false, type: 'constructor' },
	{
		anonymous: false,
		inputs: [
			{ indexed: true, name: '_from', type: 'address' },
			{ indexed: true, name: '_to', type: 'address' },
			{ indexed: false, name: '_value', type: 'uint256' }
		],
		name: 'Transfer',
		type: 'event'
	}
];
// 合约地址
var address = '0xb2cdd356e58280906ce53e1665697b50f88aac56';
// 通过ABI和地址获取已部署的

//合约对象
var metacoin = web3.eth.contract(abi).at(address);

var account_one = web3.eth.accounts[0];

var account_one_balance = metacoin.getBalance.call(account_one);

console.log('account_one_balance', account_one_balance);

var account_two = web3.eth.accounts[1];

//account_one 发出指令， metacoin 的地址接受合约内容，内容是转账请求，函数会返回交易的hash 值表面交易已经提交上报，带旷工挖取
var txhash = metacoin.sendCoin.sendTransaction(account_two, 100, { from: account_one });
console.log('txhash', txhash);

// 要知道何时交易完成，通过监听合约事件来实现
var myEvent = metacoin.Transfer();
//监听事件，监听到时间后执行回调函数
myEvent.watch(function(err, result) {
	if (!err) {
		console.log(rerult);
	} else {
		console.log(err);
	}
	myEvent.stopWatching();
});
