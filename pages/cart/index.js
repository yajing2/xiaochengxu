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
    allPrice: 0,
    // 全选
    allSelect:true
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
      // 如需实现 tab 选中态，要在当前页面下，通过 getTabBar 接口获取组件实例，并调用 setData 更新选中态
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 2,
          cartCount: (wx.getStorageSync('goods') || []).length
        })
      }
    this.setData({
      goods: wx.getStorageSync("goods") || []
    });
    // 计算总价格
    this.handleAllPrice();

    // 判断全选的状态
    this.handleAllSelect();

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
      if(v.select){
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
          });
          // 修改购物车的数量
          if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
              cartCount: (wx.getStorageSync('goods') || []).length
            })
          }
          //  计算总价
          this.handleAllPrice()
        }
      })
    }
    this.setData({
      goods: this.data.goods
    })

    //  计算总价
    this.handleAllPrice()
  },
  // 通过输入框编辑商品的数量
  handleBlur(e){
    // index当前点击的商品
    const {index}=e.currentTarget.dataset;
    // value是当前输入框的值
    let {value}=e.detail;
    // 需要转换数量
    value=Math.floor(Number(value))

    if(value<1){
      value=1;
    }

    // 修改商品的数量
    this.data.goods[index].number=value;
    
    this.setData({
      goods:this.data.goods
    })

    //  计算总价
    this.handleAllPrice()
  },
  // 点击选中的图标
  handleSelect(e){
    // index当前点击的商品
    const { index } = e.currentTarget.dataset;
    // 当前商品的选中状态
    const { select } = this.data.goods[index];
    // 取反修改当前商品的选中状态
    this.data.goods[index].select=!select;
    
    this.setData({
      goods: this.data.goods
    })

    //  计算总价
    this.handleAllPrice()
    // 判断全选的状态
    this.handleAllSelect()
    // 
  },
  // 判断全选的状态
  handleAllSelect(){
    // 先假设所有的商品都是选中的状态
    let currentSelect=true;

    // 循环商品，只要有一个商品状态是false，select就等于false
    this.data.goods.forEach(v=>{
      if (currentSelect === false){
        return;
      }
      if(v.select===false){
        currentSelect=false;
      }
    });
    // 保存全选的状态
    this.setData({
      allSelect:currentSelect
    })
  },
  //点击全选按钮触发的方法
  handleTabAllSelect(){
    const {allSelect}=this.data;

    // 循环每个商品修改他们的状态
    this.data.goods.forEach(v=>{
      v.select=!allSelect
    });
    
    this.setData({
      //  重新修改data的goods值
      goods: this.data.goods,
      // 保存全选的状态
      allSelect: !allSelect
    });
    //  计算总价
    this.handleAllPrice();
  }
})