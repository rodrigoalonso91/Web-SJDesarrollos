import getMongoDBClient from "@server/infrastructure/GetMongoDBClient"
import { ObjectId } from "mongodb"

export async function deleteSalesman(id: string) {
	const client = await getMongoDBClient()
	const result = await client
		.collection("SALESMEN")
		.deleteOne({ _id: new ObjectId(id) })
	return result.deletedCount
}
