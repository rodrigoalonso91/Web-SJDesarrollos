import { Coordinate } from "@web/domain/types/Coordinate"
import { Segment } from "@web/domain/types/Segment"
import {
	areRoughlyEqual,
	linesTouchAtTheirEnds
} from "@web/domain/utils/LineUtils"

export default function splitSegmentOnIntersections(
	segment: Segment,
	splitters: Array<Segment>
): Array<Segment> {
	return splitters.reduce(
		(results, splitter) =>
			results.flatMap((segment) => {
				const segmentSlope = getSlope(segment)
				const splitterSlope = getSlope(splitter)

				if (areRoughlyEqual(segmentSlope, splitterSlope)) {
					const inners = splitter
						.filter(
							(coordinate) => !isCoordinateAnEndOfSegment(segment, coordinate)
						)
						.filter((coordinate) =>
							isCoordinateContainedInSegment(segment, coordinate)
						)

					if (inners.length === 1)
						return [
							[segment[0], inners[0]],
							[segment[1], inners[0]]
						]
					if (inners.length === 2)
						return [
							[segment[0], closerTo(segment[0], inners)],
							[inners[0], inners[1]],
							[segment[1], closerTo(segment[1], inners)]
						]
				} else {
					const coordinate = getIntersection(segment, splitter)
					if (linesTouchAtTheirEnds(segment, splitter)) return [segment]
					if (
						isCoordinateContainedInSegment(segment, coordinate) &&
						isCoordinateContainedInSegment(splitter, coordinate)
					) {
						return [
							[segment[0], coordinate],
							[coordinate, segment[1]]
						]
					}
				}
				return [segment]
			}),
		[segment]
	)
}

const getSlope = (segment: Segment) =>
	(segment[0].y - segment[1].y) / (segment[0].x - segment[1].x)
const getOffset = ({ x, y }: Coordinate, slope: number) => y - slope * x
const getSegmentProperties = (segment: Segment) => {
	const slope = getSlope(segment)
	const offset = getOffset(segment[0], slope)
	return { slope, offset }
}

const ERROR_MARGIN = 0.1
const isCoordinateContainedInSegment = (
	segment: Segment,
	{ x, y }: Coordinate
) => {
	const [minX, maxX] = segment.map((coordinate) => coordinate.x).sort()
	const [minY, maxY] = segment.map((coordinate) => coordinate.y).sort()
	return (
		minX - ERROR_MARGIN <= x &&
		x <= maxX + ERROR_MARGIN &&
		minY - ERROR_MARGIN <= y &&
		y <= maxY + ERROR_MARGIN
	)
}

const closerTo = (coordinate: Coordinate, coordinates: Array<Coordinate>) => {
	const distanceA = distance(coordinate, coordinates[0])
	const distanceB = distance(coordinate, coordinates[1])
	return distanceA < distanceB ? coordinates[0] : coordinates[1]
}

const distance = (coordinateA: Coordinate, coordinateB: Coordinate) =>
	Math.sqrt(
		Math.pow(coordinateA.y - coordinateB.y, 2) +
			Math.pow(coordinateA.x - coordinateB.x, 2)
	)

const coordinatesAreEqual = (
	coordinateA: Coordinate,
	coordinateB: Coordinate
) => coordinateA.x === coordinateB.x && coordinateA.y === coordinateB.y

const isCoordinateAnEndOfSegment = (segment: Segment, coordinate: Coordinate) =>
	segment.some((end) => coordinatesAreEqual(end, coordinate))

function getIntersection(segmentA: Segment, segmentB: Segment): Coordinate {
	const { slope: slopeA, offset: OffsetA } = getSegmentProperties(segmentA)
	const { slope: slopeB, offset: OffsetB } = getSegmentProperties(segmentB)

	if (Math.abs(slopeA) === Infinity) {
		const x = segmentA[0].x
		const y = slopeB * x + OffsetB
		return { x, y }
	}

	if (Math.abs(slopeB) === Infinity) {
		const x = segmentB[0].x
		const y = slopeA * x + OffsetA
		return { x, y }
	}

	const x = (OffsetB - OffsetA) / (slopeA - slopeB)
	const y = slopeA * x + OffsetA
	return { x, y }
}
