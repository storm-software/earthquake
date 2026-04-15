{ pkgs, inputs, ... }:
{
  name = "storm-software/earthquake";

  dotenv.enable = true;
  dotenv.filename = [
    ".env"
    ".env.local"
  ];
  dotenv.disableHint = true;

  languages.rust = {
    enable = true;
    mold.enable = false;
    toolchainFile = ./rust-toolchain.toml;
  };
}
