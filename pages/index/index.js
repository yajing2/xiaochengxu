import request from "../../utils/request.js";

Page({
  data: {
    // 轮播图的数据
    banners: [],
    menus: [],
    floors: [],
    // 是否显示回到顶部
    isShowTop: false
  },
  onLoad() {
    // 请求轮播图接口
    request({
      url: "/home/swiperdata"
    }).then(res => {
      // console.log(res)
      const {
        message
      } = res.data;
      // 赋值给banners
      this.setData({
        banners: message
      })
    })
    // 请求中间导航菜单的接口
    request({
      url: '/home/catitems',
    }).then(res => {
      const {
        message
      } = res.data;
      // 循环添加跳转连接
      const newData = message.map((v, i) => {
        // 代表分类
        if (i === 0) {
          v.url = "/pages/category/index"
        }
        return v;
      })
      // 赋值给menus
      this.setData({
        menus: newData
      })
    })
    // 请求楼层数据
    request({
      url: "/home/floordata"
    }).then(res => {
      const {
        message
      } = res.data;
      this.setData({
        floors: message
      })
    })
  },

  onShow() {
    // 如需实现 tab 选中态，要在当前页面下，通过 getTabBar 接口获取组件实例，并调用 setData 更新选中态
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
  },
  // 小程序回到顶部
  handleToTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  // 监听页面滚动事件
  onPageScroll(e) {
    const {
      scrollTop
    } = e;
    let isShow = this.data.isShowTop;
    if (scrollTop > 100) {
      isShow = true
    } else {
      isShow = false
    }
    // 避免频繁的操作setData，所以如果下面两个值是相等的就不需要再赋值了
    if (isShow == this.data.isShowTop) return;
    this.setData({
      isShowTop: isShow
    })
  }
})