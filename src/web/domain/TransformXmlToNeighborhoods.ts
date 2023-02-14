import refineRawSegments from "@web/domain/cleanup/RefineRawSegments"
import transformBlockSidesToLots from "@web/domain/TransformBlockSidesToLots"
import transformSegmentsToLotSides from "@web/domain/TransformSegmentsToLotSides"
import transformXmlToLines from "@web/domain/TransformXmlToLines"
import { Coordinate } from "@web/domain/types/Coordinate"
import { Segment } from "@web/domain/types/Segment"

export default function transformXmlToNeighborhoods(xml: string) {
	const raw = transformXmlToLines(xml)
	const segments = refineRawSegments(raw)
	const results = segments.map(transformSegmentsToLotSides)
	const errors = results
		.filter((x) => x.error)
		.map(
			(x) =>
				({
					lines: [...x.segments!.internals, ...x.segments!.externals],
					error: x.error as string,
					faulty: x.faulty as Array<Segment>
				} as BlockError)
		)
	const blocks = results.filter((x) => x.error === null).map((x) => x.block!)
	const neighborhood: Neighborhood = {
		name: "",
		blocks: blocks.map(({ lots, coordinates }) => ({
			name: "mz00",
			coordinates,
			lots: transformBlockSidesToLots(lots).map((lot) => ({
				name: "lt00",
				coordinates: lot
			}))
		}))
	}

	return { neighborhood, errors }
}

export type Neighborhood = {
	name: string
	blocks: Array<Block>
}

export type Block = {
	name: string
	coordinates: Array<Coordinate>
	lots: Array<Lot>
}

export type Lot = {
	name: string
	coordinates: Array<Coordinate>
}

export type BlockError = {
	lines: Array<Segment>
	faulty: Array<Segment>
	error: string
}
