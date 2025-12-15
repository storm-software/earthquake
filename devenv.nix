{ pkgs, inputs, ... }:
{
  name = "storm-software/earthquake";

  # https://devenv.sh/languages/
  languages.rust = {
    enable = true;
    mold.enable = false;
    toolchainFile = ./rust-toolchain.toml;
  };
}
