import React from "react";
import ButtonPrimary from "../Buttons/ButtonPrimary";
import ButtonSecondary from "../Buttons/ButtonSecondary";

function HeroButtons({ onConnect }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <ButtonPrimary onClick={onConnect}>
        Connect Wallet
      </ButtonPrimary>
      <ButtonSecondary onClick={() => window.open("https://solana.com/docs", "_blank")}>
        Learn More
      </ButtonSecondary>
    </div>
  );
}

export default HeroButtons;
