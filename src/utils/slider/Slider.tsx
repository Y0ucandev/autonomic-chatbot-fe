import Style from './Slider.module.scss';
import React from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
function Carousel({ numberViews = 1, children }: { numberViews: number, children: React.ReactNode }) {
    const settings = {
        infinite: true,
        speed: 2000,
        slidesToShow: numberViews,
        centerMode: true,
        centerPadding: '25%',
        slidesToScroll: numberViews,
        autoplay: true,
        autoplaySpeed: 5000,
        responsive: [
            {
                breakpoint: 720,
                settings: {
                    centerPadding: '0%',
                }
            },
        ]
    };
    return (
        <div>
            <Slider {...settings} className={Style.wrapBtn}>
                {children}
            </Slider>
        </div>
    );
}
export default Carousel;
