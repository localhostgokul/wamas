import React, { useRef, useEffect } from 'react'
import './dropdown.css'


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

const Dropdown = props => {

    const dropdown_toggle_el = useRef(null)
    const dropdown_content_el = useRef(null)

    useEffect(() => {
        if (!dropdown_content_el.current || !dropdown_toggle_el.current) return
        const cleanup = clickOutsideRef(dropdown_content_el, dropdown_toggle_el)
        return cleanup
    }, [])

    return (
        <div className='dropdown'>
            <button ref={dropdown_toggle_el} className="dropdown__toggle">
                {
                    props.icon ? <i className={props.icon}></i> : ''
                }
                {
                    props.badge ? <span className='dropdown__toggle-badge'>{props.badge}</span> : ''
                }
                {
                    props.customToggle ? props.customToggle() : ''
                }
            </button>
            <div ref={dropdown_content_el} className="dropdown__content">
                {
                    props.contentData && props.renderItems ? props.contentData.map((item, index) => props.renderItems(item, index)) : ''
                }
                {
                    props.renderFooter ? (
                        <div className="dropdown__footer">
                            {props.renderFooter()}
                        </div>
                    ) : ''
                }
            </div>
        </div>
    )
}

export default Dropdown
