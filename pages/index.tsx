import {withPageAuthRequired} from "@auth0/nextjs-auth0"
import Head from "next/head"
import {getNeighborhoods} from "../src/server"
import useUserData from "../src/hooks/UseUserData"
import styles from "../styles/Home.module.css"
import { Navbar } from "../src/web/components";

export default function Home({neighborhoods}: { neighborhoods: ReadonlyArray<any> }) {

	const user = useUserData()

	return (
		<>
			<Navbar nickname={user.nickname}/>
			<div className={styles.container}>
				<Head>
					<title>Create Next App</title>
					<meta name="description" content="Generated by create next app"/>
					<link rel="icon" href="/favicon.ico"/>
				</Head>

				<main className={styles.main}>
					<span>{"email: " + user.email}</span>
					<span>{"is admin? " + user.isAdmin}</span>
					<span>{"is auditor? " + user.isAuditor}</span>
					<span>{"is proprietor? " + user.isProprietor}</span>

					<button onClick={createNeighborhood}>CREATE NEW NEIGHBORHOOD</button>

					{neighborhoods.map(({id, name}) =>
						<button key={id} onClick={() => deleteNeighborhoodOfId(id)}>{	name}</button>
					)}
				</main>
			</div>
		</>
	)
}

export const getServerSideProps = withPageAuthRequired({
	getServerSideProps: async () => {
		const neighborhoods = await getNeighborhoods()
		return {props: {neighborhoods}}
	}
})

async function createNeighborhood() {
	await fetch(`/api/barrios`, { method: "POST" })
}

async function deleteNeighborhoodOfId(id: string) {
	await fetch(`/api/barrios/${id}`, { method: "DELETE" })
}