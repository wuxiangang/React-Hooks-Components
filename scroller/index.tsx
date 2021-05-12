import React, { FC, useRef, useEffect } from 'react'
import useScroller from './hooks/useScroller'
import { ScrollerOpt } from './types.d'
import './index.less'

const Scroller: FC<ScrollerOpt> = ({
    items,
    animation = 5000,
    showBtn,
    overlayClassName
}) => {
    const ref = useRef(null)
    const { index, nextTurn, scrollInit, scrollClick } = useScroller({ 
        elem: ref.current,
        time: animation,
        max: items.length
    })

    useEffect(scrollInit.bind(this, 0),[])

    return (
        <div 
            ref={ref}
            className={`m-g-scroller ${overlayClassName || ''}`}
        >
            <div 
                className={`m-scroller__in ${nextTurn ? 'n__transition' : ''}`}
                style={{
                    transform: `translateX(-${index * 100 / items.length}%)`,
                    width: `${items.length * 100}%`
                }}
            >
                {
                    items.map(item => {
                        const { url, node } = typeof item === 'object'
                            ? item : { url: item, node: null }
                        return <section 
                            className="m-scroller__block"
                            style={{ background: `url(${url}) 50% / 1920px 600px no-repeat` }}
                        >
                            { node && node }
                        </section>
                    })
                }
            </div>
            {
               items.length > 1 && showBtn && <ul className="m-scroller__nav">
                    {
                        items.map((item, i) => {
                            return <li 
                                className={(index === i || (index === items.length && i === 0)) ? 'active' : ''} 
                                onClick={scrollClick.bind(this, i)}
                            >
                                <div className="progress"></div>
                            </li>
                        })
                    }
                </ul>
            } 
        </div>
    )
}
export default Scroller