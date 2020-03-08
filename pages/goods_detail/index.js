import request from "../../utils/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //  商品的详情
    detail: {},
    // 记录tab栏当前的索引
    current: 0,
    picUrls: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 商品的详情
    request({
      url: "/goods/detail",
      data: {
        goods_id: options.id
      }
    }).then(res => {
      const {
        message
      } = res.data;
      // 获取图片的链接
      const picUrls = message.pics.map(v => {

        return v.pics_big
      });
      this.setData({
        detail: message,
        picUrls
      })
    })
  },
  // 商品详情的tab切换
  handleTab(e) {
    const {
      index
    } = e.currentTarget.dataset;
    this.setData({
      current: index
    })
  },
  // 预览图片
  handlePreview(e) {
    const {
      index
    } = e.currentTarget.dataset;
    wx.previewImage({
      current: this.data.picUrls[index],
      urls: this.data.picUrls,
    })
  },
  // 跳转到购物车页面
  handleToCart() {
    wx.switchTab({
      url: '/pages/cart/index',
    })
  },
  // 把商品加入到本地的购物车列表
  handleAddCart() {
    // 每次加入商品之前，判断本地有没有数组，如果没有等于一个空数组
    const goods = wx.getStorageSync("goods") || [];
    // 判断当前的商品是否已经在goods的数组中,存在就加一，不存在就unshift
    // some这个方法是循环数组，return的结果只有turn或者false
    const exit = goods.some(v => {
      const isExid = v.goods_id == this.data.detail.goods_id;
      if (isExid) {
        v.number += 1;

        // 提示
        wx.showToast({
          title: '商品已存在',
          icon: 'success',
        })
      }
      return isExid;
    })


    if (!exit) {
      goods.unshift({
        goods_id: this.data.detail.goods_id,
        goods_name: this.data.detail.goods_name,
        goods_price: this.data.detail.goods_price,
        goods_small_logo: this.data.detail.goods_small_logo,
        number: 1
      })
      // 提示
      wx.showToast({
        title: '加入成功',
        icon: 'success',
      })
    }
    // 保存到本地
    wx.setStorageSync("goods", goods);
  }
})