import { NextResponse } from "next/server";
import { getWalletBalanceOnChain } from "../../../Actions/functions"

export async function GET(request: Request, context: any) {
  const { params } = context;
  const address = params.bal;
  try {
    if (address) {
      console.log(address);
      const balance = await getWalletBalanceOnChain(address);
      console.log(balance);
      return NextResponse.json(balance);
    } else {
      return NextResponse.json({ error: "No address provided" });
    }
  } catch (error) {
    console.error(error);
  }
}
