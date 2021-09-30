import React, {useCallback, useState, useLayoutEffect} from "react"
import clsx from "clsx"

// interface Props {
//   defaultOpen?: boolean
//   isAlwaysOpen?: boolean
//   heading: ReactNode | string
//   hashId: string
//   directLink?: string
//   itemClassSet?: string
//   headingClassSet?: string
//   contentClassSet?: string
//   children?: ReactNode | string
// }

export default function AccordionItem({
  defaultOpen = true,
  isAlwaysOpen,
  heading,
  hashId,
  directLink,
  itemClassSet,
  headingClassSet,
  contentClassSet,
  children,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [maxHeight, setMaxHeight] = useState(window.innerHeight)
  const [node, setNode] = useState(null);

  const refContent = useCallback(node => {
    if (node !== null) {
      setNode(node)
    }
  }, [])

  useLayoutEffect(() => {
    if (node){
      const measure = () => {
        setMaxHeight(node.getBoundingClientRect().height);
      }

      window.addEventListener("resize", measure);

      return () => {
        window.removeEventListener("resize", measure);
      };
    }
  }, [node])

  const handleClick = () => {
    if (!isAlwaysOpen) {
      setIsOpen(prev => !prev)
    }
  }

  const headingContent = <>
    <strong>{heading}</strong>

    {!isAlwaysOpen && (
      <div className={clsx(
        "chevron",
        { "is-open": isOpen }
      )} />
    )}
  </>

  const headingClassName = clsx(
    "accordion-heading",
    headingClassSet,
    {
      [`${contentClassSet}-heading`]: contentClassSet,
      "is-open": isOpen
    }
  )

  return (
    <div className={clsx("accordion-item", itemClassSet)}>
      {directLink ? (
        <a
          id={hashId}
          href={directLink}
          className={headingClassName}
        >
          {headingContent}
        </a>
      ) : (
        <div // TODO: revert back to NavLink should there be a need
          id={hashId}
          // to={`#${hashId}`}
          // activeClassName="is-active"
          className={headingClassName}
          onClick={handleClick}
        >
          {headingContent}
        </div>
      )}

      <div
        className={clsx("accordion-content", contentClassSet, {
          "is-open": isOpen
        })}
        style={{...(isOpen ? {maxHeight: maxHeight ? `${maxHeight}px` : `100vh`}: {})}}
      >
        <div
          ref={refContent}
          className="accordion-content-inner"
        >
          <div className="content-padding" />
            {children}
          <div className="content-padding" />
        </div>
      </div>
    </div>
  )
}