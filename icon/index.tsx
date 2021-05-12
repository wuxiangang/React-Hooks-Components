import React, { FC, useRef, useState, MouseEvent } from 'react'
import { examine } from '@/utils/actions'
import { Popover } from 'antd'
import './font.less'
import './index.less'

const icons = [
  {
    cls: 'iconcompass-circle-fill',
    id: 1
  },
  {
    cls: 'icondecrease-circle-fill',
    id: 2
  },
  {
    cls: 'iconinactivate-circle-fill',
    id: 3
  }
]


const IconsComponent: FC<any> = ({ callback, data }) => {
  const ref = useRef(null)
  const [selector, setSelector] = useState([])
  const onClick = () => {
    callback && callback(data)
  }

  const onSelect = (e: any) => {
    e.stopPropagation()
    const id = ~~(e.target as any).dataset.id
    const newSelector = [...selector]
    const i = newSelector.indexOf(id)
    i < 0 ? newSelector.push(id) : newSelector.splice(i, 1)
    setSelector(newSelector)
  }

  const onExamine = (is_violation = 10, level = '1', tags = []) => {
    examine({
      ids: [data.id],
      is_violation,
      level,
      tags
    }, () => {
      ref.current.parentNode.className += ' hidden'
      callback && callback(data)
    })
  }

  const stopPropagation = (e: MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div className='u-icons-box' onClick={stopPropagation} ref={ref}>
      <section className="u-tip">
        <Popover
          placement="bottom"
          overlayClassName="u-icons-popver"
          content={() => <img src={ data.url }/>}
        >
          <span className="iconfont iconheart-Fill"></span>
        </Popover>
      </section>
      <span className="iconfont iconsafety-fill" onClick={onExamine.bind(null, 10, '2', [])}></span>
      <section className="u-tip">
        <span className="iconfont iconmessage-Fill"></span>
        <section className="u-tip-content">
          {
            icons.map(icon => {
              const { cls, id } = icon
              return <span 
                key={id}
                data-id = {id}
                onClick={onSelect}
                className={`iconfont ${cls} ${selector.includes(id) ? 'actived' : ''}`}
              ></span>
            })
          }
          <span className="iconfont iconsuccess-circle-fill" onClick={onClick}></span>
        </section>
      </section>
    </div>
  )
}

export default IconsComponent