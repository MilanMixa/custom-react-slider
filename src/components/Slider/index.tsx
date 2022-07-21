import React, { useState, useRef } from "react";
import { getRefValue, useStateRef } from "../../hooks/useStateRef";
import { getTouchEventData } from "../../hooks/useTouchEventData";
import { SliderItemType, TextItemType } from "../../types";

import "./Slider.css";
import SliderItem from "../SliderItem";

export type Props = {
  slides: Array<SliderItemType>;
  text: TextItemType;
  imageWidth: number;
};

const MIN_SWIPE_REQUIRED = 40;
// slider needs to accept position prop
function Slider({ slides, text, imageWidth }: Props) {
  const { textHeading, textTitle, textSubtitle } = text;

  const containerRef = useRef<HTMLUListElement>(null);
  const containerWidthRef = useRef(0);
  const minOffsetXRef = useRef(0);
  const currentOffsetXRef = useRef(0);
  const startXRef = useRef(0);
  const [offsetX, setOffsetX, offsetXRef] = useStateRef(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const desc = slides[currentIdx].description;
  // need this for the slider number beside the picture
  // console.log(currentIdx + 1);

  const onTouchMove = (e: TouchEvent | MouseEvent) => {
    const currentX = getTouchEventData(e).clientX;
    const diff = getRefValue(startXRef) - currentX;
    let newOffsetX = getRefValue(currentOffsetXRef) - diff;

    const maxOffsetX = 0;
    const minOffsetX = getRefValue(minOffsetXRef);

    if (newOffsetX > maxOffsetX) {
      newOffsetX = maxOffsetX;
    }

    if (newOffsetX < minOffsetX) {
      newOffsetX = minOffsetX;
    }

    setOffsetX(newOffsetX);
  };
  const onTouchEnd = () => {
    const currentOffsetX = getRefValue(currentOffsetXRef);
    const containerWidth = getRefValue(containerWidthRef);
    let newOffsetX = getRefValue(offsetXRef);

    const diff = currentOffsetX - newOffsetX;

    // we need to check difference in absolute/positive value (if diff is more than 40px)
    if (Math.abs(diff) > MIN_SWIPE_REQUIRED) {
      if (diff > 0) {
        // swipe to the right if diff is positive
        newOffsetX = Math.floor(newOffsetX / containerWidth) * containerWidth;
      } else {
        // swipe to the left if diff is negative
        newOffsetX = Math.ceil(newOffsetX / containerWidth) * containerWidth;
      }
    } else {
      // remain in the current image
      newOffsetX = Math.round(newOffsetX / containerWidth) * containerWidth;
    }

    setIsSwiping(false);
    setOffsetX(newOffsetX);
    setCurrentIdx(Math.abs(newOffsetX / containerWidth));

    window.removeEventListener("touchend", onTouchEnd);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("mouseup", onTouchEnd);
    window.removeEventListener("mousemove", onTouchMove);
  };
  const onTouchStart = (
    e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    setIsSwiping(true);

    currentOffsetXRef.current = getRefValue(offsetXRef);
    startXRef.current = getTouchEventData(e).clientX;

    const containerEl = getRefValue(containerRef);
    const containerWidth = containerEl.offsetWidth;

    containerWidthRef.current = containerWidth;
    minOffsetXRef.current = containerWidth - containerEl.scrollWidth;

    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("mousemove", onTouchMove);
    window.addEventListener("mouseup", onTouchEnd);
  };
  const indicatorOnClick = (idx: number) => {
    const containerEl = getRefValue(containerRef);
    const containerWidth = containerEl.offsetWidth;

    setCurrentIdx(idx);
    setOffsetX(-(containerWidth * idx));
  };

  return (
    // conditionally render classes for position
    <div className="sliderFont sliderCenter">
      <div>
        <p className="features">{textHeading}</p>
        <p className="mainTitle">{textTitle}</p>
        <p className="descriptionTitle">{textSubtitle}</p>
      </div>
      <div
        className="swiper-container"
        onTouchStart={onTouchStart}
        onMouseDown={onTouchStart}
        style={{ width: `${imageWidth}px` }}
      >
        <ul
          ref={containerRef}
          className={`swiper-list ${isSwiping ? "is-swiping" : ""}`}
          style={{ transform: `translate3d(${offsetX}px, 0, 0)` }}
        >
          {slides.map((item, idx) => (
            <SliderItem key={idx} {...item} />
          ))}
        </ul>
        <ul className="swiper-indicator">
          {slides.map((_item, idx) => (
            <li
              key={idx}
              className={`swiper-indicator-item ${
                currentIdx === idx ? "active" : ""
              }`}
              onClick={() => indicatorOnClick(idx)}
            />
          ))}
        </ul>
      </div>

      <p className="text-box">{desc}</p>
      <p className="counter">
        0{currentIdx + 1}/0{slides.length}
      </p>
    </div>
  );
}

export default Slider;
