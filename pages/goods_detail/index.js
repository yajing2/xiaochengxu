import request from "../../utils/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //  商品的详情
    detail:{},
    // 记录tab栏当前的索引
    current: 0,
    picUrls: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
  }
})