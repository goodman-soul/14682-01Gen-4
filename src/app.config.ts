export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/services/index',
    'pages/notices/index',
    'pages/mine/index',
    'pages/repair-detail/index',
    'pages/repair-submit/index',
    'pages/payment-detail/index',
    'pages/access-unlock/index',
    'pages/notice-detail/index',
    'pages/property-manage/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#1E9E8F',
    navigationBarTitleText: '智慧物业',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F5F7FA'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#1E9E8F',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/services/index',
        text: '服务'
      },
      {
        pagePath: 'pages/notices/index',
        text: '公告'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
