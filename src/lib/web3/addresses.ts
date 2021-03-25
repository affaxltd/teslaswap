export const dev = <T, S extends T, U extends T>(a: S, b: U): S | U =>
  process.env.IS_PROD === "false" ? b : a;

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

export const teslaContract = dev("tbd", "0x200bCfCB140C97ae556c9eaef1DdA9e7Ecc9E3Ad");

export const network = dev("mainnet", "kovan");
export const etherscan = dev("etherscan.io", "kovan.etherscan.io");
export const usdcDecimals = dev(6, 18);
export const chainID = dev(1, 42);
