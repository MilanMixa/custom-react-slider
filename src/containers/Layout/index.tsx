// COMPONENTS:
import Slider from "../../components/Slider";

// STYLES:
import "./Layout.css";

import {
  firstSliderData,
  secondSliderData,
  thirdSliderData,
  firstTitle,
  secondTitle,
  thirdTitle,
} from "../../data/sliderData";

const Layout = () => {
  return (
    // slider needs position prop

    <div className="mainContainer">
      <Slider slides={firstSliderData} text={firstTitle} imageWidth={750} />
      <Slider slides={secondSliderData} text={secondTitle} imageWidth={570} />
      <Slider slides={thirdSliderData} text={thirdTitle} imageWidth={570} />
    </div>
  );
};

export default Layout;
