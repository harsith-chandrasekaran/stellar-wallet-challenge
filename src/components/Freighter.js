import {
  signTransaction,
  setAllowed,
  getAddress,
} from "@stellar/freighter-api";
import * as StellarSdk from "@stellar/stellar-sdk";

export const server = new StellarSdk.Horizon.Server(
  "https://horizon-testnet.stellar.org",
);

export const checkConnection = async () => {
  return await setAllowed();
};

export const retreievePublicKey = async () => {
  const { address } = await getAddress();
  return address;
};

export const getBalance = async () => {
  await setAllowed();
  const { address } = await getAddress();
  const account = await server.loadAccount(address);
  const xlm = account.balances.find((b) => b.asset_type === "native");
  return xlm?.balance || "0";
};

export const fetchHistory = async () => {
  const { address } = await getAddress();
  const payments = await server.payments().forAccount(address).limit(20).order("desc").call();
  return payments.records;
};

export const sendPayment = async (destination, amount) => {
  const { address: publicKey } = await getAddress();
  const sourceAccount = await server.loadAccount(publicKey);
  const fee = await server.fetchBaseFee();

  const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination,
        asset: StellarSdk.Asset.native(),
        amount: amount.toString(),
      })
    )
    .setTimeout(180)
    .build();

  const signResponse = await signTransaction(transaction.toXDR(), {
    networkPassphrase: StellarSdk.Networks.TESTNET,
  });

  let signedTxXdr;
  // Safely extract the signed XDR regardless of Freighter API version return types (String vs Object)
  if (typeof signResponse === "string") {
    signedTxXdr = signResponse;
  } else if (signResponse && typeof signResponse === "object") {
    if (signResponse.error) {
      throw new Error(signResponse.error);
    }
    signedTxXdr = signResponse.signedTxXdr || signResponse.signedTransaction || signResponse.xdr;
  }

  if (!signedTxXdr) {
    throw new Error("Unable to retrieve signed XDR from Freighter wallet");
  }

  const transactionToSubmit = StellarSdk.TransactionBuilder.fromXDR(
    signedTxXdr,
    StellarSdk.Networks.TESTNET
  );

  return await server.submitTransaction(transactionToSubmit);
};
