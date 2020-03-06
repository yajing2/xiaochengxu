// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 收货地址
    address: {},
    // 本地商品列表
    goods: [],
    // 总价格
    allPrice: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //  获取本地收货地址
    this.setData({
      // 如果本地没有address就是一个空的对象
      address: wx.getStorageSync("address") || {}
    })
  },

  onShow() {
    this.setData({
      goods: wx.getStorageSync("goods") || []
    });
    // 计算总价格
    this.handleAllPrice();
  },

  // 获取收货地址
  handleGetAddress() {
    wx.chooseAddress({
      success: (res) => {
        // 把收货地址保存到data
        this.setData({
          address: {
            name: res.userName,
            tel: res.telNumber,
            detail: res.provinceName + res.cityName + res.countyName + res.detailInfo
          }
        })
        // 保存到本地
        wx.setStorageSync('address', this.data.address)
      },
    })
  },
  // 计算总价格
  handleAllPrice() {
    let price = 0;
    this.data.goods.forEach(v => {
      price += v.goods_price * v.number;
    })
    // 修改总价格
    this.setData({
      allPrice: price
    })
    // 修改本地数据
    wx.setStorageSync("goods", this.data.goods)
  },
  // 数量加1
  handleCalc(e) {
    // 点击的索引值
    const {
      index,
      number
    } = e.currentTarget.dataset;
    this.data.goods[index].number += number;

    // 判断如果数量为0时，用户是否删除
    if (this.data.goods[index].number === 0) {
      // 弹窗
      wx.showModal({
        title: '提示',
        content: '是否删除商品',
        success: (res) => {
          // 确认删除
          if (res.confirm) {
            this.data.goods.splice(index, 1)
          } else {
            this.data.goods[index].number += 1;
          }
          //  重新修改data的goods值
          this.setData({
            goods: this.data.goods
          })
        }
      })
    }
    this.setData({
      goods: this.data.goods
    })

    //  计算总价
    this.handleAllPrice()
  }
})