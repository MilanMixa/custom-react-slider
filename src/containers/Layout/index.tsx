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
    <div className="mainContainer">
      <Slider
        slides={firstSliderData}
        text={firstTitle}
        imageWidth={750}
        layout={"center"}
      />
      <Slider
        slides={secondSliderData}
        text={secondTitle}
        imageWidth={570}
        layout={"right"}
      />
      <Slider
        slides={thirdSliderData}
        text={thirdTitle}
        imageWidth={570}
        layout={"left"}
      />
    </div>
  );
};

export default Layout;
