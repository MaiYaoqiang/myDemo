function Router() {
    this.cache = {};
    //��url/callback ��key/value��ʽ������cache��
    this.on = function (key, value) {
        var cache = this.cache;
        cache[key] = value;
    };
    //ƥ��hash��Ӧ�Ļص�����,������
    this.trigger = function (hash) {
        var cache = this.cache;
        for (var r in cache) {
            var reg = this.initRegexps(r);
            if (reg.test(hash)) {
                var callback = cache[r] || function () {
                    };
                var params = this.getParams(reg, hash);
                callback.apply(this, params);
            }
        }

    };
    //��ʼ�� ��Ӽ��������hashchange �Լ�dom loaded����
    this.init = function () {
        window.addEventListener('hashchange', function () {
            var hash = location.hash.slice(1);
            router.trigger(hash);
        });
        window.addEventListener('load', function () {
            var hash = location.hash.slice(1) || 'default';
            router.trigger(hash);
        })
    };
    /**
     *��cache�ڵ�key ��������,������
     * ��һ������ ƥ������/,.+-?$#{}[]] �ؼ���  ���ڹؼ���ǰ���ת���ַ�\
     * �ڶ������� ƥ��() ��ʾ()�ڲ����ݿ��п���
     * ���������� ƥ��: ��/��������ɽ��������ַ�,ֱ��������һ��/
     * ���ĸ����� ƥ��* ��*��������ɽ��������ַ�
     */
    this.initRegexps = function (route) {
        route = route.replace(/[/,.+\-?$#{}\[\]]/g, '\\$&')
            .replace(/\((.*?)\)/g, '(?:$1)?')
            .replace(/(\/\w?:\w+)+/g, '\/([^/]+)')
            .replace(/\*\w*/g, '([^?]*?)');

        return new RegExp('^' + route + '$');
    };

    //��ƥ������򷵻�,Ϊ�ص������ṩ����
    this.getParams = function (reg, hash) {
        return reg.exec(hash).slice(1);
    }
}