## 无缝滚动
> 使用方法
```javascript
   <Scroller 
      // 点击切换展示
      showBtn = {true}
      // 切换速度
      animation = {5000}
      // 顶层自定义样式名
      overlayClassName = 'my-class'
      // 列表 Object | string
      items = {[
          {
              // 注入的dom
              node: <div style={{ color: 'white' }}>1111</div>,
              // 图片链接
              url: 'http://www.vanwei.com.cn/static/img/banner.f69e2ee.png',
          },
          // 图片链接
          'http://www.vanwei.com.cn/static/img/about.71e8817.png',
          'http://www.vanwei.com.cn/static/img/technology_banner.bb4d8cf.png'
      ]}
  />
```
> 展示效果

![image](https://user-images.githubusercontent.com/18589379/117951367-aeff9480-b346-11eb-8067-193a0460bcfe.png)

### issue 1
> hooks对内部申明的参数有缓存，比如清除interval需要通过useRef;

