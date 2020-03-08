import request from '../../utils/request.js'

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
    allPrice: 0,
    // 全选
    allSelect: true
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
      // 判断商品是否是选中状态
      if (v.select) {
        price += v.goods_price * v.number;
      }

    })
    // 修改总价格
    this.setData({
      allPrice: price
    })
    // 修改本地数据
    wx.setStorageSync("goods", this.data.goods)
  },

  // 立即支付事件
  handlePay() {
    // 先判断本地有没有token
    const token = wx.getStorageSync("token");
    // 如果没有token
    if (!token) {
      wx.navigateTo({
        url: '/pages/authorize/index',
      })
    } else {
      // 如果有token

      // 创建订单
      let {
        allPrice,
        address,
        goods
      } = this.data;
      goods = goods.map(v => {
        return {
          goods_id: v.goods_id,
          goods_number: v.number,
          goods_price: v.goods_price
        }
      })
      request({
        url: "/orders/create",
        method: "POST",
        header: {
          Authorization: token
        },
        data: {
          order_price: allPrice,
          consignee_addr: address.name + address.tel + address.detail,
          goods
        }
      }).then(res => {
        // 订单创建成功提示
        wx:showToast({
          title:'订单创建成功',
          type:"success"
        })
        // 发起支付，请求支付
        request({
          url:"/my/orders/req_unifiedorder",
          method:"POST",
          header:{
            Authorization: token
          },
          data:{
            // 订单编号
            order_number:res.data.message.order_number
          }
        }).then(res=>{
          // 支付需要的参数
          const {pay}=res.data.message;
          // 发起微信支付
          wx.requestPayment(pay)
        })
      })
    }
  }
})