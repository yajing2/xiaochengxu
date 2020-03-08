import request from "../../utils/request.js"

// pages/category/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //  请求分类页数据
    request({
      url: '/categories',
    }).then(res => {
      const { message } = res.data;
      this.setData({
        list: message
      })
    })
  },
  onShow(){
    // 如需实现 tab 选中态，要在当前页面下，通过 getTabBar 接口获取组件实例，并调用 setData 更新选中态
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },
  // 点击切换左边菜单时触发的事件
  handleClick(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({
      current: index
    })
  }
})