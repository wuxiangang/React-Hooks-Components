import { useState, useRef, useEffect } from 'react'
import { ScrollerHookOpt, AllowNullType, ScrollerHookReturnValue } from '../types.d'

const useScroller = ({ time, max, elem }: ScrollerHookOpt): ScrollerHookReturnValue => {

    const [index, setIndex] = useState(0)
    const [nextTurn, setNextTurn] = useState(false)

    let scrollTimer = useRef(null)
    let firstChild: AllowNullType<HTMLElement> = null

    const scrollInit = (j: AllowNullType<number> = 0) => {
        let i = j
        if (max < 2) return
        clearInterval(scrollTimer.current)
        scrollTimer.current = setInterval(() => {
            const next = i + 1
            i = next > max ? 1 : next
            setIndex(i)
        }, time || 5000)
    }

    useEffect(() => {
        if (nextTurn) setTimeout(setNextTurn, 300, false)
    }, [nextTurn])

    useEffect(() => {
        if (!elem) return
        if (!firstChild) 
            firstChild = elem.querySelector('.m-scroller__block')
        if (max > 1 && index >= max - 1) {
            const __t = fn => setTimeout(fn, 500)
            if (index === max - 1) __t(() => firstChild.style.left = `100%`)
            index === max && __t(() => {
                scrollClick(0),setNextTurn(true)
            })
        } else {
            firstChild.style.left = '0'
        }
    }, [index])

    const scrollClick = (i: number) => {
        if (i === index) return
        setNextTurn(false),setIndex(i),scrollInit(i)
    }

    return {
        index, 
        nextTurn,
        scrollInit,
        scrollClick
    }
}

export default useScroller