function Observer(data, parent, parentKey) {
    this.data = data;
    this.watch = {};
    this.parent = parent;
    this.parentKey = parentKey;
    this.travle(data);
}

Observer.prototype.$watch = function(key, callback) {
    this.watch[key] = callback;
}

Observer.prototype.travle = function(obj) {
    let val;
    Object.keys(obj).forEach(key => {
        val = obj[key];
        if (typeof val === 'object') {
            new Observer(val, this, key);
        } else {
            this.convert(key, val);
        }
    });
};

Observer.prototype.convert = function(key, val) {
    this.$watch(key, function(newVal) {
        console.log(`你设置了 ${key}，旧的值为${val}，新的值为${newVal}`);
    });

    var that = this;

    Object.defineProperty(this.data, key, {
        enumerable: true,
        configurable: true,
        get: function() {
            console.log(`你访问了 ${key}`);
            return val;
        },
        set: function(newVal) {
            if (that.parent) {
                that.parent.watch[that.parentKey](newVal);
            }
            that.watch[key](newVal);
            if (newVal === val) return;
            val = newVal;
        }
    });

};

let app2 = new Observer({
    name: {
        firstName: 'shaofeng',
        lastName: 'liang'
    },
    age: 25
});

app2.$watch('name', function(newName) {
    console.log('我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。')
});
app2.$watch('age', function(age) {
    console.log(`我的年纪变了，现在已经是：${age}岁了`)
});

app2.data.name.firstName = 'hahaha';
// 输出：我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。
app2.data.name.lastName = {
    a: "hh",
    b: "gg"
};
// 输出：我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。
app2.data.age = 100;