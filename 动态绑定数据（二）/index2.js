function Observer(data) {
    this.data = data;
    this.walk(data);
    this.eventBus = new Events();
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
    var _this = this;
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
            _this.eventBus.emit(key, newVal, val);
            val = newVal;
        }
    })
};

Observer.prototype.$watch = function(key, callback) {
    this.eventBus.on(key, callback);
}


function Events() {
    this.events = {};
}

Events.prototype = {
    constructor: Events,
    on: function(eventType, callback) {
        if (!this.events[eventType]) {
            this.events[eventType] = [];
        }
        this.events[eventType].push(callback);
        return this;
    },
    remove: function(eventType) {
        for (var key in this.events) {
            if (this.events.hasOwnProperty(key) && key == eventType) {
                delete this.events[eventType];
            }
        }
    },
    emit: function(eventType) {
        if (!this.events[eventType]) {
            return this;
        }
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0; i < this.events[eventType].length; i++) {
            this.events[eventType][i].apply(this, args);
        }
        return this;
    }
};

var data = {
    user: {
        name: "luxixi",
        age: "24"
    },
    address: {
        city: "beijing"
    },
    age: 23
};

var app = new Observer(data);
app.$watch('age', function(val, oldVal) {
    console.log('我的新值是：' + val);
    console.log('我的旧值是：' + oldVal);
});

app.data.user = { name: "Alex" };
app.data.age = 24;