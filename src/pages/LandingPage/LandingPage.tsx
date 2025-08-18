import React, { useRef } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import AppTheme from "../../shared/shared-theme/AppTheme";
import AppAppBar from "./components/AppAppBar";
import Hero from "./components/Hero";
import LogoCollection from "./components/LogoCollection";
import Highlights from "./components/Highlights";
import Pricing from "./components/Pricing";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import AddShop from "./components/AddShop";
import PlanCards from "./components/PlanCards";

const sectionKeys = [
  "features",
  "testimonials",
  "highlights",
  "pricing",
  "faq",
  "add-shop"
];

export default function LandingPage(props: { disableCustomTheme?: boolean }) {
  const sectionRefs = useRef<
    Record<string, React.RefObject<HTMLDivElement | null>>
  >({} as Record<string, React.RefObject<HTMLDivElement | null>>);

  sectionKeys.forEach((key) => {
    if (!sectionRefs.current[key]) {
      sectionRefs.current[key] = React.createRef<HTMLDivElement>();
    }
  });

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar scrollToRefs={sectionRefs.current} />
      <Hero />
      <div>
        <LogoCollection />
        <div ref={sectionRefs.current["features"]}>
          <Features />
        </div>
        <Divider />
        <div ref={sectionRefs.current["testimonials"]}>
          <Testimonials />
        </div>
        <Divider />
        <div ref={sectionRefs.current["highlights"]}>
          <Highlights />
        </div>
        <Divider />
        <div ref={sectionRefs.current["pricing"]}>
          {/* <Pricing /> */}
          <PlanCards />
        </div>
        <Divider />
        <div ref={sectionRefs.current["faq"]}>
          <FAQ />
        </div>
        <Divider />
        <div ref={sectionRefs.current["add-shop"]}>
          <AddShop />
        </div>
        <Divider />

        <Footer />
      </div>
    </AppTheme>
  );
}
