import { WaterFallerOpt } from './types'

const initWaterFaller = () => {
  const WaterFaller: WaterFallerOpt = {
    // 宽度
    w: 0,
    // 边距
    gap: 10,
    // 当前scroller box
    scroller: null,
    // 列数
    columns: 4,
    // 计算存储
    cache: null,
    // 重置计算
    initColumner() {
      const _this = WaterFaller
      _this.cache = []
      for(let i = 0; i < _this.columns; i++) {
        _this.cache.push({
          index: i, value: 0
        })
      }
    },
    // 获取当前最小列
    min() {
      return [...this.cache].sort((a, b) => a.value - b.value)[0]
    },
    resetCacheByCurrentHeight() {
      const _this = WaterFaller;
      Array.from((_this.scroller as any).querySelectorAll('ul')).forEach((ul: HTMLUListElement, i: number) => {
        const { offsetHeight } = ul 
        _this.cache[i].value = offsetHeight
      })
    },
    init({ scroller, columns, gap }) {
      const _this = WaterFaller
      _this.scroller = scroller
      const offsetWidth = (_this.scroller as any).offsetWidth;
      _this.gap = gap || 10
      _this.columns = columns || ~~(offsetWidth / 250)
      _this.w = (offsetWidth - (_this.columns - 1) * _this.gap) / _this.columns 
      _this.initColumner()
    },
    // 组件退出销毁
    destroy() {
      const _this = WaterFaller
      _this.cache = null
      _this.scroller = null
    },
    // 获取对应列参
    setPos({ width, height }) {
      const _this = WaterFaller
      const min = _this.min()
      width = ~~width || _this.w
      height = ~~height || _this.w
      const top = min.value
      const scaleHeight = ~~Math.round(_this.w * height / width)
      min.value += scaleHeight + _this.gap
      return {
        left: (_this.w + _this.gap) * min.index,
        width: _this.w,
        height: scaleHeight,
        top,
        index: min.index
      }
    }
  }
  return WaterFaller
}


export default initWaterFaller