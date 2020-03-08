import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  //  点击授权按钮触发的时间
  handleUserInfo(e) {
    // 通过按钮授权成功后获取成功的参数
    const {
      encryptedData,
      iv,
      rawData,
      signature
    } = e.detail;
    // 通过wx.login获取到code
    wx.login({
      success(res) {
        if (res.code) {
          // 获取token需要的5个参数
          const data = {
            encryptedData,
            iv,
            rawData,
            signature,
            code: res.code
          }
          // 请求接口获取token
          // 注意调用登录的接口必需要替换项目的appid
          request({
            url: "/users/wxlogin",
            data,
            method: "POST"
          }).then(res => {

            // 获取token
            const {
              token
            } = res.data.message;

            // 把token保存到本地
            wx.setStorageSync("token", token);

            // 返回是上一个页面
            wx.navigateBack();
          })

        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }
})