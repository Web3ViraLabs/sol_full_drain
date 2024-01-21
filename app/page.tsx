import React from "react";
import { Hero } from "./components/hero";
import { Feature } from "./components/features";
import Header from "./components/header";

export default function page() {
  return (
    <div>
      <Header />
      <Hero />
      <Feature />
    </div>
  );
}
