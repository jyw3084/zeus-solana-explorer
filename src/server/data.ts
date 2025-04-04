import { SAMPLE_HISTORY_HOURS } from "@/data/constants";
import { Address, createSolanaRpc, Signature } from "@solana/web3.js";

export async function getEpochInfo() {
	try {
		const rpc = createSolanaRpcClient()
		if (!rpc) return

		const result = await rpc.getEpochInfo().send();

		return result;
	} catch (error) {
		console.error(error);
	}
}

export async function getEpochSchedule() {
	try {
		const rpc = createSolanaRpcClient()
		if (!rpc) return

		const result = await rpc.getEpochSchedule().send();

		return result;
	} catch (error) {
		console.error(error);
	}
}

export async function getRecentPerformanceSamples() {
	try {
		const rpc = createSolanaRpcClient();
		if (!rpc) return

		const result = await rpc.getRecentPerformanceSamples(60 * SAMPLE_HISTORY_HOURS).send();

		return result;
	} catch (error) {
		console.error(error);
	}
}

export async function getSingleBlockTime(slot: bigint) {
	try {
		const rpc = createSolanaRpcClient()
		if (!rpc) return

		const result = await rpc.getBlockTime(slot).send();

		return result;
	} catch (error) {
		console.error(error);
	}
}

export async function getBlocks(startSlot: bigint, endSlot?: bigint) {
	try {
		const rpc = createSolanaRpcClient()
		if (!rpc) return

		if (endSlot) {
			const result = await rpc.getBlocks(startSlot, endSlot).send();
			return result;
		} else {
			const result = await rpc.getBlocks(startSlot).send();
			return result;
		}
	} catch (error) {
		console.error(error);
	}
}

export async function getBlocksWithLimit(startSlot: bigint, limit: number) {
	try {
		const rpc = createSolanaRpcClient()
		if (!rpc) return

		const result = await rpc.getBlocksWithLimit(startSlot, limit).send();
		return result;
	} catch (error) {
		console.error(error);
	}
}

export async function getBlock(slot: bigint) {
	try {
		const rpc = createSolanaRpcClient()
		if (!rpc) return

		const result = await rpc.getBlock(slot, {
			maxSupportedTransactionVersion: 0
		}).send();

		return result;
	} catch (error) {
		console.error(error);
	}
}

export async function getBlockTime(slot: bigint) {
	try {
		const rpc = createSolanaRpcClient()
		if (!rpc) return

		const result = await rpc.getBlockTime(slot).send();

		return result;
	} catch (error) {
		console.error(error);
	}
}

export async function getTransaction(signature: Signature) {
	try {
		const rpc = createSolanaRpcClient()
		if (!rpc) return

		const result = await rpc.getTransaction(signature, {
			maxSupportedTransactionVersion: 0,
			encoding: 'jsonParsed',
		}).send();

		return result;
	} catch (error) {
		console.error(error);
	}
}

export async function getSignatureStatuses(array: Signature[]) {
	try {
		const rpc = createSolanaRpcClient()
		if (!rpc) return

		const result = await rpc.getSignatureStatuses(array).send();

		return result;
	} catch (error) {
		console.error(error);
	}
}

export async function getAccountInfo(pubkey: Address) {
	try {
		const rpc = createSolanaRpcClient()
		if (!rpc) return

		const result = await rpc.getAccountInfo(pubkey).send();

		return result;
	} catch (error) {
		console.error(error);
	}
}

export async function getSlotLeaders(startSlot: bigint, limit: number) {
	try {
		const rpc = createSolanaRpcClient()
		if (!rpc) return

		const result = await rpc.getSlotLeaders(startSlot, limit).send();

		return result;
	} catch (error) {
		console.error(error);
	}
}

export function createSolanaRpcClient() {
	const url = process.env.NEXT_PUBLIC_MAINNET_RPC_URL;
	if (!url) return;

	const rpcClient = createSolanaRpc(url);
	return rpcClient;
}