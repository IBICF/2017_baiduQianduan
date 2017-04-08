function Observer(data) {
    this.data = data;
    this.walk(data);
}

Observer.prototype.walk = function(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] == 'object') {
                new Observer(obj[key]);
            }
            this.convert(key, obj[key]);
        }
    }
};

Observer.prototype.convert = function(key, val) {
    Object.defineProperty(this.data, key, {
        enumerable: true,
        configurable: true,
        get: function() {
            console.log("你访问了" + val);
            return val;
        },
        set: function(newVal) {
            console.log("你设置了" + key + ", 新的值是" + newVal);
            if (newVal === val) return;
            val = newVal;
        }
    })
};

let data = {
    user: {
        name: "liangshaofeng",
        age: "24"
    },
    address: {
        city: "beijing"
    }
};

let app = new Observer(data);

data.user.name = "lalala";
console.log(data.user.age);
console.log(data.user.name);