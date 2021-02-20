export const dev = <T>(a: T, b: T) => (process.env.IS_PROD === "false" ? b : a);

export const teslaTokenAddress = dev(
  ["0x918dA91Ccbc32B7a6A0cc4eCd5987bbab6E31e6D"],
  [
    "0xC811087cb1d3Ef5889C4A9DF4432494A309152Bb",
    "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51",
  ]
);
export const usdcTokenAddress = dev(
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  "0x4807eEa77e376a6a471aCA5279E831D9A0eC5d72"
);
export const delegateContract = dev(
  "0x15fd6e554874b9e70f832ed37f231ac5e142362f",
  "0xB8CFB40B4c66533cD8f760c1b15cc228452bB03E"
);
export const teslaContract = dev(
  "0x44f535154cDF6ef75fd1F41aD1a569549785154D",
  "0x0F66d3DAADB2c84D680A35BeEAEd63662476571e"
);
export const etherscan = dev("etherscan.io", "kovan.etherscan.io");
export const usdcDecimals = dev(6, 18);
export const chainID = dev(1, 42);
