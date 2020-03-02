import request from "../../utils/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: "",
    goods: [],
    // 是否有更多
    hasMore: true,
    // 页面
    pagenum: 1,
    // 是否正在加载
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    const { keyword } = options;
    this.setData({
      keyword
    });
    // 请求商品列表数据
    this.getGoods();
  },
  getGoods() {
    // 如果没有更多，就不会再请求
    if(this.data.hasMore==false){
      return;
    }
    setTimeout(v => {
      // 请求商品列表
      request({
        url: "/goods/search",
        data: {
          query: this.data.keyword,
          pagenum: this.data.pagenum,
          pagesize: 10
        }
      }).then(res => {
        const { message } = res.data;
        // 遍历修改goods下面的价格
        const goods = message.goods.map(v => {
          v.goods_price = Number(v.goods_price).toFixed(2);
          return v
        })
        this.setData({
          goods: [...this.data.goods, ...goods],
          loading:false
        });
        // 判断是否是最后一页
        if(this.data.goods.length>=message.total){
          this.setData({
            hasMore:false
          })
        }
      })
    }, 3000)
  },
  // 页面上拉触底时候触发
  onReachBottom() {
    // 需要等到上一次的请求回来了再执行下一次的数据
    if(this.data.loading===false){
      this.setData({
        loading:true,
        pagenum:this.data.pagenum+1
      });
    this.getGoods()
    }
  }
})