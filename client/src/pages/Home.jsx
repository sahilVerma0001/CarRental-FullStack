import Banner from "../components/Banner";
import FeaturedSection from "../components/FeaturedSection";
import Hero from "../components/Hero";
import Testimonial from "../components/Testimonial";
import Newsletter from "../components/Newsletter";
import About from "../components/About";

export default function Home(){
    return (
        <div>
            <Hero/>
            <FeaturedSection />
            <Banner/>
            <About />
            <Testimonial />
            <Newsletter />
        </div>    
    )
}