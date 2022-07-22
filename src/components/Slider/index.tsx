// TYPES:
import { SliderItemType, TextItemType } from "../../types";

// STYLES:
import "./Slider.css";

// COMPONENTS:
import SliderItem from "../SliderItem";

// HOOKS
import useSlider from "./useSlider";

export type Props = {
  slides: Array<SliderItemType>;
  text: TextItemType;
  imageWidth?: number;
};

// slider needs to accept position prop
function Slider({ slides, text, imageWidth }: Props) {
  const { textHeading, textTitle, textSubtitle } = text;

  const {
    containerRef,
    indicatorOnClick,
    currentIdx,
    isSwiping,
    offsetX,
    onTouchStart,
    height,
    textBoxRef,
    desc,
  } = useSlider({ slides });

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
      <div>
        <div className="text-div" style={{ height: `${height}px` }}>
          <p className="text-box" ref={textBoxRef} key={`desc${currentIdx}`}>
            {desc}
          </p>
        </div>
      </div>
      <p className="counter">
        0{currentIdx + 1}/0{slides.length}
      </p>
    </div>
  );
}

export default Slider;
