const App = {
    data() {
      return {
        checkedOrder:{
          date: '',
          items: [],
          total: 0
        },
        tempProduct: {},
        orderList: [],
        orderTotal: 0,
        iceType: ['正常冰', '少冰', '微冰', '去冰', '熱'],
        sugarType: ['全糖', '七分', '半糖', '三分', '無糖'],
        toppingsType: ['珍珠', '粉條', '小粉圓', '椰果', '芋頭'],
        products: [
          {
            name: '珍珠鮮奶茶',
            engName: 'Pearl Milk Tea',
            price: 60,
            defaults: {
              toppings: ['珍珠'],
              sugar: '',
              ice: '',
            }
          },
          {
            name: '椰果鮮奶茶',
            engName: 'Coconut Milk Tea',
            price: 60,
            defaults: {
              toppings: ['椰果'],
              sugar: '',
              ice: '',
            }
          },
          {
            name: '鮮奶茶',
            engName: 'Milk Tea',
            price: 50,
            defaults: {
              toppings: [''],
              sugar: '',
              ice: '',
            }
          },
          {
            name: '古意冬瓜茶 (糖固定)',
            engName: 'Winter Melon Drink',
            price: 30,
            defaults: {
              toppings: [''],
              sugar: '全糖',
              ice: '',
            }
          },
          {
            name: '蜜香紅茶',
            engName: 'Black Tea',
            price: 30,
            defaults: {
              toppings: [''],
              sugar: '',
              ice: '',
            }
          },
          {
            name: '包種青茶',
            engName: 'Black Tea',
            price: 35,
            defaults: {
              toppings: [''],
              sugar: '',
              ice: '',
            }
          },
          {
            name: '檸檬烏龍 (冰塊固定)',
            engName: 'Lemon Oolong Tea',
            price: 55,
            defaults: {
              toppings: [''],
              sugar: '',
              ice: '少冰',
            }
          },
          {
            name: '薑母茶 (熱飲)',
            engName: 'Ginger Tea',
            price: 55,
            defaults: {
              toppings: [''],
              sugar: '',
              ice: '熱',
            }
          },
          {
            name: '青草茶',
            engName: 'Herbal Tea',
            price: 35,
            defaults: {
              toppings: [''],
              sugar: '',
              ice: '',
            }
          },
          {
            name: '金桔檸檬',
            engName: 'Kumquat Lemonade',
            price: 40,
            defaults: {
              toppings: [''],
              sugar: '',
              ice: '',
            }
          },
          {
            name: '柳澄青茶',
            engName: 'Orange Mountain Tea',
            price: 45,
            defaults: {
              toppings: [''],
              sugar: '',
              ice: '',
            }
          },
        ],
      }
    },
  
    methods: {
        reset() {
          this.tempProduct = {};
        },

        addToOrder(product) {
          let productString = this.stringifyProduct(product);
          let dupIndex = this.getDuplicateIndex(productString);

          if (dupIndex >= 0) {
            this.orderList[dupIndex].count += product.count;
            this.orderList[dupIndex].totalPrice
              = this.orderList[dupIndex].count * this.orderList[dupIndex].subtotal;
          } else {
            let subtotal = product.price + 10 * product.toppings.length;
            this.orderList.push(Object.assign({}, {
      // dupIndex: 例如，曾經加入過包種青茶，而現在又再加入包種青茶
      // 那就要找到包種青茶的 index，並把 subtotal 加到 total 內
              ...product,
              subtotal: subtotal,
              totalPrice: subtotal *  product.count,
              productString: productString
            }))
          }

          this.computeTotalPrice();
          this.reset();
        },
        
        stringifyProduct(product) {
          let clonedProduct = Object.assign({}, {...product});
          delete clonedProduct.count;
          clonedProduct.toppings.sort();
          
          return JSON.stringify(clonedProduct);
        },

        getDuplicateIndex(productString) {
          for (i = 0; i < this.orderList.length; i ++) {
            if (this.orderList[i].productString === productString) return i;
          }

          return -1;
        },

        computeTotalPrice() {
          this.orderTotal = this.orderList.reduce((accumulator, item) =>
            accumulator + item.totalPrice, 0);
        },

        generateOrder(items, total) {
          const date = new Date().toLocaleString();
          this.checkedOrder.date = date;
          this.checkedOrder.items = items;
          this.checkedOrder.total = total;
          this.orderTotal = 0;
          this.orderList = [];
          this.reset();
        },

        onProductSelected(product) {
            this.tempProduct = this.createProduct(product);
        },
  
        createProduct(product) {
            defaults = product.defaults;
  
            return {
                count: 1,
                ice: defaults.ice ? defaults.ice : this.iceType[0],
                sugar: defaults.sugar ? defaults.sugar : this.sugarType[0],
                toppings: [],
                remark: '',
                ... product
            };
        },

        isInSelectionMode() {
          return this.tempProduct.hasOwnProperty('name');
        },

        isValidIce(ice) {
          if (!this.tempProduct.hasOwnProperty('defaults')) return false;

          if (this.tempProduct.defaults.ice === '') return true;
          
          return this.tempProduct.defaults.ice === ice;
        },

        isValidSugar(sugar) {
          if (!this.tempProduct.hasOwnProperty('defaults')) return false;

          if (this.tempProduct.defaults.sugar === '') return true;
          
          return this.tempProduct.defaults.sugar === sugar;
        },
      // 例如：包種青茶預設冰度為空白字串 ''，那就要讓所有冰度都設為可選的
      // 例如：薑母茶有預設冰度為「熱」，所以要預設「熱」為可選的
      // 但其他冰度就要設為不可選的

        isValidTopping(topping) {
          if (!this.tempProduct.hasOwnProperty('defaults')) return false;

          if (this.tempProduct.defaults.toppings.includes(topping)) return false;
      // 例如：珍珠鮮奶茶本身就已經有加珍珠了，
      // 所以就不要再讓使用者可以勾選珍珠，要把珍珠設為 disabled

          return true;
        }
    }
  };
  
  Vue.createApp(App).mount('#app');
  