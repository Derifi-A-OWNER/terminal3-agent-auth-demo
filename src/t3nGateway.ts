import "dotenv/config";
import {
  T3nClient,
  createEthAuthInput,
  eth_get_address,
  loadWasmComponent,
  metamask_sign,
  setEnvironment
} from "@terminal3/t3n-sdk";
import type { SdkStatus } from "./types.js";

const SDK_VERSION = "3.9.0";

function maskMiddle(value: string, prefix = 8, suffix = 6): string {
  if (value.length <= prefix + suffix) return value;
  return `${value.slice(0, prefix)}...${value.slice(-suffix)}`;
}

function readApiKey(): string | undefined {
  return process.env.T3N_API_KEY || process.env.T3N_DEMO_KEY;
}

export function getSdkStatus(): SdkStatus {
  setEnvironment("testnet");
  const apiKey = readApiKey();

  if (!apiKey) {
    return {
      packageName: "@terminal3/t3n-sdk",
      packageVersion: SDK_VERSION,
      environment: "testnet",
      sdkImportOk: true,
      keyPresent: false,
      liveAuthAvailable: false,
      note: "Local review mode. Set T3N_API_KEY locally to enable live SDK handshake/auth."
    };
  }

  const address = eth_get_address(apiKey);
  const normalizedAddress = address.replace(/^0x/i, "").toLowerCase();

  return {
    packageName: "@terminal3/t3n-sdk",
    packageVersion: SDK_VERSION,
    environment: "testnet",
    sdkImportOk: true,
    keyPresent: true,
    addressPreview: maskMiddle(address),
    didPreview: maskMiddle(`did:t3n:${normalizedAddress}`, 14, 8),
    liveAuthAvailable: true,
    note: "Live key detected server-side. Key is not returned to the browser."
  };
}

export async function runLiveAuthCheck(): Promise<{
  didPreview: string;
  usageAvailable: boolean;
}> {
  setEnvironment("testnet");
  const apiKey = readApiKey();
  if (!apiKey) {
    throw new Error("T3N_API_KEY is not set.");
  }

  const address = eth_get_address(apiKey);
  const client = new T3nClient({
    wasmComponent: await loadWasmComponent(),
    handlers: {
      EthSign: metamask_sign(address, undefined, apiKey)
    }
  });

  await client.handshake();
  const did = await client.authenticate(createEthAuthInput(address));
  let usageAvailable = false;
  try {
    await client.getUsage();
    usageAvailable = true;
  } catch {
    usageAvailable = false;
  }

  return {
    didPreview: maskMiddle(String(did), 14, 8),
    usageAvailable
  };
}
