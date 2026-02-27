import React, { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ThemeAction from '../../redux/actions/ThemeAction';
import './thememenu.css';


const mode_settings = [
    {
        id: 'light',
        name: 'Light',
        background: 'light-background',
        class: 'theme-mode-light'
    },
    {
        id: 'dark',
        name: 'Dark',
        background: 'dark-background',
        class: 'theme-mode-dark'
    }
]


const clickOutsideRef = (content_ref, toggle_ref) => {
    const handleClick = (e) => {
        if (toggle_ref.current && toggle_ref.current.contains(e.target)) {
            content_ref.current.classList.toggle('active')
        } else if (content_ref.current && !content_ref.current.contains(e.target)) {
            content_ref.current.classList.remove('active')
        }
    }

    document.addEventListener('mousedown', handleClick)

    return () => {
        document.removeEventListener('mousedown', handleClick)
    }
}

const ThemeMenu = () => {

    const menu_ref = useRef(null)
    const menu_toggle_ref = useRef(null)

    useEffect(() => {
        if (!menu_ref.current || !menu_toggle_ref.current) return
        const cleanup = clickOutsideRef(menu_ref, menu_toggle_ref)
        return cleanup
    }, [])

    const setActiveMenu = () => menu_ref.current.classList.add('active')

    const closeMenu = () => menu_ref.current.classList.remove('active')

    const [currMode, setcurrMode] = useState(() => {
        const stored = localStorage.getItem('themeMode', 'theme-mode-light')
        const themeClass = mode_settings.find(e => e.class === stored)
        return themeClass ? themeClass.id : 'light'
    })

    const dispatch = useDispatch()

    const setMode = mode => {
        setcurrMode(mode.id)
        localStorage.setItem('themeMode', mode.class)
        dispatch(ThemeAction.setMode(mode.class))
    }

    return (
        <div>
            <button ref={menu_toggle_ref} className="dropdown__toggle" onClick={() => setActiveMenu()}>
                <i className='bx bxs-adjust-alt'></i>
            </button>
            <div ref={menu_ref} className="theme-menu">
                <h4>Theme settings</h4>
                <button className="theme-menu__close" onClick={() => closeMenu()}>
                    <i className='bx bx-x'></i>
                </button>
                <div className="theme-menu__select">
                    <span>Choose mode</span>
                    <ul className="mode-list">
                        {
                            mode_settings.map((item, index) => (
                                <li key={index} onClick={() => setMode(item)}>
                                    <div className={`mode-list__color ${item.background} ${item.id === currMode ? 'active' : ''}`}>
                                        <i className='bx bx-check'></i>
                                    </div>
                                    <span>{item.name}</span>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ThemeMenu
