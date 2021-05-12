import React, { FC, useState, useRef, useEffect, useCallback, memo } from 'react'
import { WaterFallOptions, ListItemOpt, TFiberLoadingFn, DataItemOpt } from './types.d'
import initWaterFaller from './waterfaller'
import './index.less'
const IMAGE = 'image'
const VIDEO = 'video'

const WaterFaller = initWaterFaller()

// 分片加载器
const useFiberLoading:TFiberLoadingFn = async (list, start, per, type=IMAGE) => {
  const isImage = type === IMAGE
  const map = list.slice(start, start + per)
  const ps = map.map((item: DataItemOpt, i) => {
    if (Number(item.width)) return
    return new Promise(resolve =>  {
      const elem: any = isImage ? new Image : document.createElement(VIDEO)
      elem.src = item.thumb_url || item.url
      // 图片加载
      elem.onload = () => {
        const {naturalWidth, naturalHeight} = elem
        map[i] = {...item, loaded: item.thumb_url ? false : true, width: naturalWidth, height: naturalHeight}
        resolve(null)
      }
      // 视频加载
      elem.onloadeddata = () => {
        const {videoWidth, videoHeight} = elem
        console.log(videoWidth, videoHeight)
        map[i] = {...item, loaded: true, width: videoWidth, height: videoHeight}
        resolve(null)
      }
      elem.onerror = () => {
        resolve(null)
      }
    })
  })
  await Promise.all(ps)
  return map
}

const useUlTransfer = (data: DataItemOpt[]) => {
  const { columns } = WaterFaller
  const listers = {}
  data.forEach(item => {
    const {left} = item
    const list = listers[left] || []
    listers[left] = [...list, item]
  })
  const keys = Object.keys(listers)
  return [
    ...keys.map(key => listers[key]),
    ...new Array(columns - keys.length).fill([])
  ]
}

// 防抖触发器
const antishake = () => {
  let timer = null
  return (fn: Function, time: number = 500) => {
    clearTimeout(timer)
    timer = setTimeout(fn, time)
  }
}

const _isObject = (o: unknown) => o instanceof Object

const WaterFall: FC<WaterFallOptions> = memo(({ dataSource, children, ...props }) => {
  const scroller = useRef(null)
  const rendered = useRef(0)
  const renderlist = useRef([])
  const queueTimer = useRef(null)
  const [data, setData] = useState([])
  
  const { 
    type,
    className,
    itemOpt = {},
    fiber = dataSource.length,
    fiberDuration = 500,
    selectors = [],
    infinite,
    onScrollHandle,
    onMounted,
    ...style
  } = props

  const queueLoaded = rendered.current >= dataSource.length

  // 对列加载，目前一行为单位
  const queue = async () => {
    const { setPos } = WaterFaller
    const map = await useFiberLoading(dataSource, rendered.current, fiber, type)
    const list = map.map((item: any) => ({...item, ...setPos(item)}))
    renderlist.current = [...renderlist.current,  ...list]
    const left = dataSource.length - rendered.current
    rendered.current += left > fiber ? fiber : left
    setData(renderlist.current)
    if (rendered.current < dataSource.length) return queueTimer.current = setTimeout(queue, fiberDuration)
    else onMounted && onMounted(renderlist.current)
  }

  // 当需要刷新列表时重置
  const initScroller = () => {
    setData([])
    rendered.current = 0
    renderlist.current = []
    clearTimeout(queueTimer.current)
  }

  // 无限滚动模式下触发
  const _antishake = antishake()
  const onScroll = (e: any) => {
    const isInfinite = _isObject(infinite)
    if (isInfinite && rendered.current === dataSource.length) {
      const { fetch, fetchBottom = 0, noMore } = infinite
      if (fetch && !noMore) {
        const target = e.target
        _antishake(() => {
          const { scrollTop, offsetHeight, scrollHeight} = target
          scrollTop + offsetHeight >= scrollHeight - fetchBottom && fetch()
        })
      }
    }
    return onScrollHandle(e, data)
  }

  useEffect(() => {
    const init = () => {
      initScroller()
      WaterFaller.init({ 
        scroller: scroller.current,
        ...(itemOpt || {})
      })
    }
    // 当参数设置的数据少于当前数量 认为是分页模式 直接刷新列表
    if (!infinite || (infinite && data.length >= dataSource.length)) {
      init()
    } else if (data.length) {
        WaterFaller.resetCacheByCurrentHeight()
    }
    queue()
  }, [dataSource])

  return (
    <div 
      ref={scroller}
      style={style}
      className={`u-scroller-box ${className || ''}`}
      onScroll={onScroll}
    >
      <div className="u-scroller-content">
        {
          useUlTransfer(data).map((item, i) => {
            const { w } = WaterFaller
            return (
              <ul className="u-ul-item" style={{ width: w }} key={i}>
                { item.map((item: DataItemOpt) => {
                  return <ListItem 
                    key = {item.id} 
                    data = {item} 
                    type = {type}
                    itemOpt = {itemOpt}
                    selectors={selectors}
                  />
                })
                }
              </ul>
            )
          })
        }
      </div>
      { _isObject(infinite) && !infinite.noMore && infinite.loadNode && infinite.loadNode() }
      { children && queueLoaded && children }
    </div>
  )
})

const ListItem: FC<ListItemOpt> = memo(({ data, itemOpt, selectors, type = IMAGE }) => {

  const { 
    render,
    onSelect,
    onEnter,
    onLeave,
    selectorKey = 'id',
    selectedClassName = 'actived'
  } = itemOpt

  const { gap } = WaterFaller

  const isSelectedFn = () => selectors.includes(data[selectorKey])

  const [item, setItem] = useState({
    ...data,
    isRemoved: !!data.isRemoved,
    isSelected: isSelectedFn()
  })
  const { height, url, thumb_url, isSelected } = item as any
 
  const onClick = useCallback(() => {
    const id = (item as DataItemOpt)[selectorKey]
    setItem({
      ...item, 
      isSelected: !isSelected
    })
    isSelected
      ? selectors.splice(selectors.indexOf(id),1)
      : selectors.push(id)
      onSelect && onSelect(id, selectors, item)
  }, [item])

  useEffect(() => {
    const isSelected = isSelectedFn()
    if (item.isSelected === isSelected) return
    setItem({
      ...item, 
      isSelected
    })
  }, [selectors])

  return <li
    onClick={onClick}
    onMouseEnter={onEnter}
    onMouseLeave={onLeave}
    className={`u-image ${isSelected ? selectedClassName : ''}`}
    style={{ marginBottom: gap + 'px', height: height + 'px' }}
  >
    {
      render && render({ data, WaterFaller })
    }
    { type === IMAGE && <img className="u-image-content" style={{height: height + 'px'}} src={ thumb_url || url } /> }
    { type === VIDEO && <video 
      className="u-image-content"
      style={{height: height + 'px'}}
      src={ url }
      loop /> }
  </li>
})

export default WaterFall