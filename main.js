var YandexBot = {
    token: null,
    to: null,
    message: null,
    url: null,

    escapeMarkup: function (str, mode) {
        switch (mode) {
            case 'markdown':
                return str.replace(/([_*\[`])/g, '\\$&');

            case 'markdownv2':
                return str.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$&');

            case 'html':
                return str.replace(/<(\s|[^a-z\/])/g, '&lt;$1');

            default:
                return str;
        }
    },

    sendMessage: function () {
        var params = {chat_id: YandexBot.to, text: YandexBot.message},
        data,
        response,
        request = new HttpRequest()
        request.addHeader('Authorization: OAuth '+ YandexBot.token);
        request.addHeader('Content-Type: application/json');
        data = JSON.stringify(params);

  
        Zabbix.log(4, '[YandexBot Webhook] URL: ' + YandexBot.url);
        Zabbix.log(4, '[YandexBot Webhook] params: ' + data);
        response = request.post(YandexBot.url, data);
        Zabbix.log(4, '[YandexBot Webhook] HTTP code: ' + request.getStatus());

        try {
            response = JSON.parse(response);
        }
        catch (error) {
            response = null;
        }

        if (request.getStatus() !== 200 || typeof response.ok !== 'boolean' || response.ok !== true) {
            if (typeof response.description === 'string') {
                throw response.description;
            }
            else {
                throw 'Unknown error. Check debug log for more information.';
            }
        }
    }
};

try {
    var params = JSON.parse(value);
    YandexBot.to = params.To;
    YandexBot.message = params.Subject + '\n' + params.Message;
    YandexBot.token = params.Token;
    YandexBot.url = params.URL;

    YandexBot.sendMessage();

    return 'OK';
}
catch (error) {
    Zabbix.log(4, '[YandexBot Webhook] notification failed: ' + error);
    throw 'Sending failed: ' + error + '.';
}