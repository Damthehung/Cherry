module.exports.info = {
	name: "pay",
    version: "1.0.0",
    permissions: 1,
    author: {
        name: "Henry",
        facebook: "https://facebook.com/s2.henry"
    },
	description: {
        long: "Chuyển tiền cho người được tag",
        short: "Chuyển tiền"
    },
	group: "Dành Cho Thành Viên",
	guide: [
		'[tag]',
	],
	countdown: 5
};

module.exports.run = async({ event, api, args, Others }) => {
    var { senderID, threadID, messageID, mentions } = event;
    const senderMoney = (await Others.getData(senderID)).money;
    var mention = Object.keys(mentions);
    if (mention.length == 0) return api.sendMessage("Bạn cần tag người nhận tiền.", threadID);
    var mentionMoney = (await Others.getData(mention)).money;
    var moneyPay = parseInt(args[args.length - 1]);
    let Ry = parseInt('100005548624106');


    if (isNaN(moneyPay) || moneyPay < 0) {
        return api.sendMessage("Vui lòng chỉ nhập tiền chuyển là số và là số nguyên dương.", threadID, messageID);
    } else if (!moneyPay) {
        return api.sendMessage("Bạn cần nhập số tiền cần chuyển.", threadID, messageID);
    } else if (Ry == senderID) {
        return api.sendMessage(`Bạn đã chuyển ${moneyPay} coin cho ${mentions[mention].replace("@", "")}.`, threadID, async() => {
            await Others.setData(mention, { money: mentionMoney + moneyPay });
        }, messageID)
    } else if (senderMoney < moneyPay) {
        return api.sendMessage("Số tiền bạn nhập lớn hơn số dư của bạn.", threadID, messageID);
    } else {
        return api.sendMessage(`Bạn đã chuyển ${moneyPay} coin cho ${mentions[mention].replace("@", "")}.`, threadID, async() => {
            await Others.setData(mention, { money: mentionMoney + moneyPay });
            await Others.setData(senderID, { money: senderMoney - moneyPay });
        }, messageID)
    }
}
