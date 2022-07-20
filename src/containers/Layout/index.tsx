import Slider from "../../components/Slider";

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

    <div>
      <Slider slides={firstSliderData} text={firstTitle} />
      <Slider slides={secondSliderData} text={secondTitle} />
      <Slider slides={thirdSliderData} text={thirdTitle} />
    </div>
  );
};

export default Layout;
