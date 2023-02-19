import { PersonAdd } from "@mui/icons-material"
import { Button, Typography } from "@mui/material"
import MaterialReactTable from "material-react-table"
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import deleteRowOnDatabase from "../../api_calls/deleteRowOnDatabase"
import updateRowOnDatabase from "../../api_calls/updateRowOnDatabase"
import { displayForm } from "../../store/form"
import { BasicEditActions } from "../table/BasicEditActions"
import { CustomModal } from "./CustomModal"
import { AddForm } from "../AddForm"
import { SPANISH_COLLECTIONS } from "../../constants/collections"
import { Box } from "@mui/system"

export const CustomGrid = ({ collection, columns, data }) => {

	const [tableData, setTableData] = useState([]);
	
	useEffect(() => { setTableData(data) }, [data]);

	const { isFormActivated } = useSelector((state) => state.isActivatedForm)

	const dispatch = useDispatch()
	const handleClick = () => {
		dispatch(displayForm(true))
	}

	const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
		const { id } = row.original

		const record = {
			id,
			values: { ...values }
		}

		await updateRowOnDatabase(collection, record)

		const data = tableData.map((data) =>
			data.id === id ? { id, ...values } : data
		)

		exitEditingMode()

		setTableData(data)
	}

	const handleDeleteRow = useCallback(
		async (row) => {
			const { firstname, lastname, id } = row.original

			if (!confirm(`Desea eliminar a ${firstname} ${lastname}?`)) return

			await deleteRowOnDatabase(collection, id)

			const newTableData = [...tableData]
			newTableData.splice(row.index, 1)
			setTableData(newTableData)
		},
		[tableData, collection]
	)

	return (
		<>
			<div style={{ 
				display: 'flex', 
				flexDirection: 'column', 
				gap: 35, 
				padding: 15
			}}
			>
				<Box sx={{
					display: 'flex',
					flexDirection: 'row-reverse',
				}}>
					<Button
						onClick={handleClick}
						variant="contained"
					>
						<PersonAdd sx={{ mr: "10px" }} />
						Agregar
					</Button>
				</Box>

				<MaterialReactTable
					style={{ boxShadow: "3px 4.5px 9.5px 3.5px #000000" }}
					columns={columns}
					data={tableData}
					initialState={{ columnVisibility: { id: false } }}
					enableColumnOrdering={false}
					enableGlobalFilter={false} //turn off a feature
					enableEditing
					editingMode="modal"
					positionActionsColumn="first"
					onEditingRowSave={handleSaveRowEdits}
					renderTopToolbarCustomActions={() => (
						<Typography sx={{ ml: 1 }} variant="h5">
							{SPANISH_COLLECTIONS[collection]}
						</Typography>
					)}
					renderRowActions={({ row, table }) => (
						<BasicEditActions
							row={row}
							table={table}
							handleDeleteRow={handleDeleteRow}
						/>
					)}
				/>
			</div>

			{isFormActivated && (
				<CustomModal headerText={`Agregar ${SPANISH_COLLECTIONS[collection]}`}>
					<AddForm
						collection={collection}
						data={tableData}
						setData={setTableData}
					/>
				</CustomModal>
			)}
		</>
	)
}
