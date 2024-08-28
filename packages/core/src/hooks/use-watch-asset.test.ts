import { describe, expect, it } from "vitest";
import { act, renderHook, waitFor } from "../../test/react";
import { useWatchAsset, UseWatchAssetArgs } from "./use-watch-asset";
import { useConnect } from "./use-connect";
import { useDisconnect } from "./use-disconnect";
import { defaultConnector } from "../../test/devnet";


const addrxASTR =
  "0x005EF67D8c38B82ba699F206Bf0dB59f1828087A710Bad48Cc4d51A2B0dA4C29";
const myAsset: UseWatchAssetArgs = {
  type: "ERC20",
  options: {
    address: addrxASTR,
    decimals: 10,
    name: "xAstraly",
    symbol: "xASTR",
  },
};

function useWatchAssetWithConnect() {
  return {
    watchAsset: useWatchAsset({ params: myAsset }),
    connect: useConnect(),
    disconnect: useDisconnect(),
  };
}


describe("useWatchAsset", () => {
  it("add a token to the connected wallet", async () => {
    const { result } = renderHook(() => useWatchAssetWithConnect());


    await act(async () => {
      result.current.connect.connect({
        connector: defaultConnector,
      });
    });
    await act(async () => {
      result.current.watchAsset.watchAsset();
    });


    await waitFor(() => {
      expect(result.current.watchAsset.isSuccess).toBeTruthy();
    });
  });


  it("throws error if user cancels the watch asset request", async () => {
    const { result } = renderHook(() => useWatchAssetWithConnect(), {
      connectorOptions: { rejectRequest: true },
    });


    await act(async () => {
      result.current.connect.connect({
        connector: defaultConnector,
      });
    });


    await act(async () => {
      result.current.watchAsset.watchAsset();
    });


    await waitFor(() => {
      expect(result.current.watchAsset.isError).toBeTruthy();
    });
  });
});
